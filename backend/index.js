require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173';
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'duas_plus_dev_v1',
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'utf8mb4',
});

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(session({
  name: 'duas.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 8 * 60 * 60 * 1000,
  },
}));

app.get('/api/estado', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ mensaje: 'Servidor y base de datos conectados.', estado: 'ok', base_datos: true });
  } catch (error) {
    console.error('No fue posible conectar con MariaDB:', error.code || error.message);
    res.status(503).json({ mensaje: 'El servidor está activo, pero no logra conectar con la base de datos.', estado: 'error', base_datos: false });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const correo = typeof req.body?.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';
  const contrasena = typeof req.body?.contrasena === 'string' ? req.body.contrasena : '';

  if (!correo || !contrasena || contrasena.length > 200) {
    return res.status(400).json({ mensaje: 'Escribe tu correo y contraseña.' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.correo, u.contrasena_hash, u.estado, r.codigo AS rol
       FROM usuarios AS u
       INNER JOIN roles AS r ON r.id_rol = u.id_rol
       WHERE u.correo = ?
       LIMIT 1`,
      [correo]
    );

    const usuario = rows[0];
    const contrasenaValida = usuario && await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida || usuario.estado !== 'activo') {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos, o cuenta inactiva.' });
    }

    const rutasPorRol = {
      administrador: '/administrador',
      instructor: '/instructor',
      aprendiz: '/aprendiz',
    };
    const ruta = rutasPorRol[usuario.rol];
    if (!ruta) return res.status(403).json({ mensaje: 'El rol de esta cuenta no tiene acceso a la plataforma.' });

    req.session.regenerate((error) => {
      if (error) {
        console.error('No fue posible iniciar sesión:', error.message);
        return res.status(500).json({ mensaje: 'No fue posible iniciar sesión. Inténtalo de nuevo.' });
      }

      req.session.usuario = {
        id_usuario: usuario.id_usuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol,
      };
      req.session.save((saveError) => {
        if (saveError) {
          console.error('No fue posible guardar la sesión:', saveError.message);
          return res.status(500).json({ mensaje: 'No fue posible iniciar sesión. Inténtalo de nuevo.' });
        }
        return res.json({ mensaje: 'Inicio de sesión correcto.', usuario: req.session.usuario, ruta });
      });
    });
  } catch (error) {
    console.error('Error al consultar el inicio de sesión:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo consultar la base de datos. Revisa que XAMPP esté activo.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.usuario) return res.status(401).json({ mensaje: 'No hay una sesión iniciada.' });
  res.json({ usuario: req.session.usuario });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ mensaje: 'No se pudo cerrar la sesión.' });
    res.clearCookie('duas.sid', { httpOnly: true, sameSite: 'lax', secure: false });
    return res.json({ mensaje: 'Sesión cerrada.' });
  });
});

function requireAdmin(req, res, next) {
  if (req.session.usuario?.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Necesitas una sesión de administrador.' });
  }
  return next();
}

function requireRole(rol) {
  return (req, res, next) => {
    if (req.session.usuario?.rol !== rol) return res.status(403).json({ mensaje: 'Tu cuenta no tiene permiso para esta acción.' });
    return next();
  };
}
const requireInstructor = requireRole('instructor');
const requireAprendiz = requireRole('aprendiz');

async function asegurarTablaObservaciones() {
  await pool.query(`CREATE TABLE IF NOT EXISTS observaciones_usuarios (
    id_observacion BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_administrador INT UNSIGNED NOT NULL,
    observacion TEXT NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_observaciones_usuario (id_usuario, creado_en)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

app.get('/api/perfil', async (req, res) => {
  const usuario = req.session.usuario;
  if (!usuario) return res.status(401).json({ mensaje: 'Inicia sesión para ver tu perfil.' });
  try {
    const [[perfil]] = await pool.execute(
      `SELECT u.id_usuario, u.tipo_documento, u.numero_documento, u.nombres, u.apellidos,
              u.correo, u.telefono, u.estado, r.codigo AS rol,
              GROUP_CONCAT(DISTINCT f.codigo ORDER BY f.codigo SEPARATOR ', ') AS fichas,
              GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.nombre SEPARATOR ', ') AS programas,
              pa.preset_visual_dua
       FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
       LEFT JOIN inscripciones i ON i.id_usuario_aprendiz = u.id_usuario AND i.estado = 'activa'
       LEFT JOIN fichas f ON f.id_ficha = i.id_ficha
       LEFT JOIN programas p ON p.id_programa = f.id_programa
       LEFT JOIN preferencias_accesibilidad pa ON pa.id_usuario_aprendiz = u.id_usuario
       WHERE u.id_usuario = ?
       GROUP BY u.id_usuario, u.tipo_documento, u.numero_documento, u.nombres, u.apellidos,
                u.correo, u.telefono, u.estado, r.codigo, pa.preset_visual_dua`,
      [usuario.id_usuario]
    );
    if (!perfil) return res.status(404).json({ mensaje: 'No se encontró tu perfil.' });
    return res.json({ perfil });
  } catch (error) {
    console.error('Error al consultar perfil:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo cargar tu perfil.' });
  }
});

app.get('/api/regionales', requireAdmin, async (_req, res) => {
  try {
    const [regionales] = await pool.query(
      `SELECT id_regional, codigo, nombre, departamento, municipio, activa
       FROM regionales
       ORDER BY activa DESC, nombre ASC`
    );
    return res.json({ regionales });
  } catch (error) {
    console.error('Error al consultar regionales:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las regionales.' });
  }
});

app.post('/api/regionales', requireAdmin, async (req, res) => {
  const codigo = typeof req.body?.codigo === 'string' ? req.body.codigo.trim() : '';
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
  const departamento = typeof req.body?.departamento === 'string' ? req.body.departamento.trim() : '';
  const municipio = typeof req.body?.municipio === 'string' ? req.body.municipio.trim() : '';

  if (!codigo || !nombre || !departamento || codigo.length > 20 || nombre.length > 120 || departamento.length > 80 || municipio.length > 80) {
    return res.status(400).json({ mensaje: 'Completa código, nombre y departamento con una longitud válida.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO regionales (codigo, nombre, departamento, municipio)
       VALUES (?, ?, ?, ?)`,
      [codigo, nombre, departamento, municipio || null]
    );
    return res.status(201).json({
      regional: { id_regional: result.insertId, codigo, nombre, departamento, municipio: municipio || null, activa: 1 },
      mensaje: 'Regional creada.',
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una regional con ese código.' });
    console.error('Error al crear regional:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la regional.' });
  }
});

app.get('/api/programas', requireAdmin, async (_req, res) => {
  try {
    const [programas] = await pool.query(
      `SELECT p.id_programa, p.id_regional, p.codigo, p.nombre, p.tipo_oferta,
              p.modalidad, p.duracion_horas, p.descripcion, p.activo,
              p.creado_en, r.nombre AS regional,
              COUNT(DISTINCT CASE WHEN i.estado = 'activa' THEN i.id_usuario_aprendiz END) AS aprendices
       FROM programas AS p
       INNER JOIN regionales AS r ON r.id_regional = p.id_regional
       LEFT JOIN fichas AS f ON f.id_programa = p.id_programa
       LEFT JOIN inscripciones AS i ON i.id_ficha = f.id_ficha
       GROUP BY p.id_programa, p.id_regional, p.codigo, p.nombre, p.tipo_oferta,
                p.modalidad, p.duracion_horas, p.descripcion, p.activo, p.creado_en, r.nombre
       ORDER BY p.creado_en DESC, p.id_programa DESC`
    );
    return res.json({ programas });
  } catch (error) {
    console.error('Error al consultar programas:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar los programas.' });
  }
});

app.post('/api/programas', requireAdmin, async (req, res) => {
  const codigo = typeof req.body?.codigo === 'string' ? req.body.codigo.trim() : '';
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
  const idRegional = Number(req.body?.id_regional);
  const tipoOferta = req.body?.tipo_oferta;
  const modalidad = req.body?.modalidad;
  const duracionHoras = req.body?.duracion_horas === '' || req.body?.duracion_horas == null
    ? null
    : Number(req.body.duracion_horas);
  const descripcion = typeof req.body?.descripcion === 'string' ? req.body.descripcion.trim() : '';
  const activo = req.body?.activo === false || req.body?.activo === 0 ? 0 : 1;
  const tiposPermitidos = ['tecnico', 'tecnologia', 'curso_corto'];
  const modalidadesPermitidas = ['presencial', 'virtual', 'mixta'];

  if (!codigo || codigo.length > 30 || !nombre || nombre.length > 150 || !Number.isInteger(idRegional) || idRegional < 1 ||
      !tiposPermitidos.includes(tipoOferta) || !modalidadesPermitidas.includes(modalidad) ||
      (duracionHoras !== null && (!Number.isInteger(duracionHoras) || duracionHoras < 1 || duracionHoras > 65535))) {
    return res.status(400).json({ mensaje: 'Revisa código, nombre, regional, tipo, modalidad y duración del programa.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO programas (id_regional, codigo, nombre, tipo_oferta, modalidad, duracion_horas, descripcion, activo)
       SELECT id_regional, ?, ?, ?, ?, ?, ?, ?
       FROM regionales
       WHERE id_regional = ? AND activa = 1`,
      [codigo, nombre, tipoOferta, modalidad, duracionHoras, descripcion || null, activo, idRegional]
    );
    if (result.affectedRows === 0) return res.status(400).json({ mensaje: 'Selecciona una regional activa.' });
    return res.status(201).json({ mensaje: 'Programa creado.', id_programa: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe un programa con ese código.' });
    console.error('Error al crear programa:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar el programa.' });
  }
});

app.patch('/api/programas/:id/estado', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const activo = req.body?.activo === true || req.body?.activo === 1 ? 1 : 0;
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: 'Identificador de programa inválido.' });

  try {
    const [result] = await pool.execute(
      'UPDATE programas SET activo = ? WHERE id_programa = ?',
      [activo, id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'No se encontró el programa.' });
    return res.json({ mensaje: activo ? 'Programa activado.' : 'Programa desactivado.' });
  } catch (error) {
    console.error('Error al actualizar estado del programa:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo actualizar el programa.' });
  }
});

app.get('/api/fichas', requireAdmin, async (_req, res) => {
  try {
    const [[fichas], [programas], [columnasEnum], [instructores]] = await Promise.all([
      pool.query(
        `SELECT f.id_ficha, f.id_programa, f.codigo, f.jornada, f.fecha_inicio,
                f.fecha_fin, f.estado, p.nombre AS programa,
                COUNT(DISTINCT CASE WHEN i.estado = 'activa' THEN i.id_inscripcion END) AS aprendices,
                GROUP_CONCAT(DISTINCT CASE WHEN fi.activo = 1 THEN CONCAT(ui.nombres, ' ', ui.apellidos) END ORDER BY ui.apellidos SEPARATOR ', ') AS instructores_asignados,
                GROUP_CONCAT(DISTINCT CASE WHEN fi.activo = 1 THEN ui.id_usuario END) AS id_instructores
         FROM fichas AS f
         INNER JOIN programas AS p ON p.id_programa = f.id_programa
         LEFT JOIN inscripciones AS i ON i.id_ficha = f.id_ficha
         LEFT JOIN ficha_instructores AS fi ON fi.id_ficha = f.id_ficha
         LEFT JOIN usuarios AS ui ON ui.id_usuario = fi.id_usuario_instructor
         GROUP BY f.id_ficha, f.id_programa, f.codigo, f.jornada,
                  f.fecha_inicio, f.fecha_fin, f.estado, p.nombre
         ORDER BY f.fecha_inicio DESC, f.id_ficha DESC`
      ),
      pool.query('SELECT id_programa, codigo, nombre FROM programas WHERE activo = 1 ORDER BY nombre'),
      pool.execute(
        `SELECT COLUMN_NAME, COLUMN_TYPE FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fichas'
           AND COLUMN_NAME IN ('jornada', 'estado') AND DATA_TYPE = 'enum'`
      ),
      pool.query(
        `SELECT u.id_usuario, u.nombres, u.apellidos
         FROM usuarios AS u INNER JOIN roles AS r ON r.id_rol = u.id_rol
         WHERE r.codigo = 'instructor' AND u.estado = 'activo'
         ORDER BY u.apellidos, u.nombres`
      ),
    ]);
    const enumOpciones = {};
    for (const columna of columnasEnum) {
      const valores = columna.COLUMN_TYPE.match(/'(?:[^'\\]|\\.)*'/g) || [];
      enumOpciones[columna.COLUMN_NAME] = valores.map((valor) => valor.slice(1, -1).replace(/\\'/g, "'"));
    }
    return res.json({ fichas, programas, opciones: enumOpciones, instructores });
  } catch (error) {
    console.error('Error al consultar fichas:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las fichas. Revisa que la tabla fichas exista.' });
  }
});

app.post('/api/fichas', requireAdmin, async (req, res) => {
  const idPrograma = Number(req.body?.id_programa);
  const codigo = typeof req.body?.codigo === 'string' ? req.body.codigo.trim() : '';
  const jornada = typeof req.body?.jornada === 'string' ? req.body.jornada : '';
  const fechaInicio = typeof req.body?.fecha_inicio === 'string' ? req.body.fecha_inicio : '';
  const fechaFin = typeof req.body?.fecha_fin === 'string' && req.body.fecha_fin ? req.body.fecha_fin : null;
  const estado = typeof req.body?.estado === 'string' ? req.body.estado : '';
  const fechaValida = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(Date.parse(`${fecha}T00:00:00`));

  if (!Number.isInteger(idPrograma) || idPrograma < 1 || !codigo || codigo.length > 30 ||
      !jornada || !estado || !fechaValida(fechaInicio) || (fechaFin && !fechaValida(fechaFin)) ||
      (fechaFin && fechaFin < fechaInicio)) {
    return res.status(400).json({ mensaje: 'Completa programa, código, jornada, estado y fechas válidas. La fecha final debe ser igual o posterior a la inicial.' });
  }

  try {
    const [columnas] = await pool.execute(
      `SELECT COLUMN_NAME, COLUMN_TYPE FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fichas'
         AND COLUMN_NAME IN ('jornada', 'estado') AND DATA_TYPE = 'enum'`
    );
    const enumOpciones = Object.fromEntries(columnas.map((columna) => [
      columna.COLUMN_NAME,
      (columna.COLUMN_TYPE.match(/'(?:[^'\\]|\\.)*'/g) || []).map((valor) => valor.slice(1, -1).replace(/\\'/g, "'")),
    ]));
    if (!enumOpciones.jornada?.includes(jornada) || !enumOpciones.estado?.includes(estado)) {
      return res.status(400).json({ mensaje: 'La jornada o el estado seleccionado no corresponde a las opciones de la base de datos.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO fichas (id_programa, codigo, jornada, fecha_inicio, fecha_fin, estado)
       SELECT id_programa, ?, ?, ?, ?, ? FROM programas WHERE id_programa = ? AND activo = 1`,
      [codigo, jornada, fechaInicio, fechaFin, estado, idPrograma]
    );
    if (!result.affectedRows) return res.status(400).json({ mensaje: 'Selecciona un programa activo.' });
    return res.status(201).json({ mensaje: 'Ficha creada y guardada en la base de datos.', id_ficha: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una ficha con ese código.' });
    console.error('Error al crear ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la ficha.' });
  }
});

app.post('/api/fichas/:id/instructores', requireAdmin, async (req, res) => {
  const idFicha = Number(req.params.id);
  const idInstructor = Number(req.body?.id_usuario_instructor);
  const rolEnFicha = req.body?.rol_en_ficha;
  if (!Number.isInteger(idFicha) || idFicha < 1 || !Number.isInteger(idInstructor) || idInstructor < 1 ||
      !['titular', 'apoyo'].includes(rolEnFicha)) {
    return res.status(400).json({ mensaje: 'Selecciona una ficha, un instructor activo y su rol.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO ficha_instructores (id_ficha, id_usuario_instructor, id_asignado_por, rol_en_ficha)
       SELECT f.id_ficha, u.id_usuario, ?, ?
       FROM fichas AS f
       INNER JOIN usuarios AS u ON u.id_usuario = ?
       INNER JOIN roles AS r ON r.id_rol = u.id_rol AND r.codigo = 'instructor'
       WHERE f.id_ficha = ? AND u.estado = 'activo'
       ON DUPLICATE KEY UPDATE rol_en_ficha = VALUES(rol_en_ficha), fecha_retiro = NULL, activo = 1`,
      [req.session.usuario.id_usuario, rolEnFicha, idInstructor, idFicha]
    );
    if (!result.affectedRows) return res.status(400).json({ mensaje: 'No se encontró la ficha o el instructor activo.' });
    return res.json({ mensaje: 'Instructor asignado a la ficha.' });
  } catch (error) {
    console.error('Error al asignar instructor a ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo asignar el instructor a la ficha.' });
  }
});

app.get('/api/instructores', requireAdmin, async (_req, res) => {
  try {
    const [instructores] = await pool.query(
      `SELECT u.id_usuario, u.tipo_documento, u.numero_documento, u.nombres,
              u.apellidos, u.correo, u.telefono, u.estado, u.creado_en
       FROM usuarios AS u
       INNER JOIN roles AS r ON r.id_rol = u.id_rol
       WHERE r.codigo = 'instructor'
       ORDER BY u.nombres, u.apellidos`
    );
    return res.json({ instructores });
  } catch (error) {
    console.error('Error al consultar instructores:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar los instructores.' });
  }
});

app.post('/api/instructores', requireAdmin, async (req, res) => {
  const tipoDocumento = typeof req.body?.tipo_documento === 'string' ? req.body.tipo_documento.trim() : '';
  const numeroDocumento = typeof req.body?.numero_documento === 'string' ? req.body.numero_documento.trim() : '';
  const nombres = typeof req.body?.nombres === 'string' ? req.body.nombres.trim() : '';
  const apellidos = typeof req.body?.apellidos === 'string' ? req.body.apellidos.trim() : '';
  const correo = typeof req.body?.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';
  const contrasena = typeof req.body?.contrasena === 'string' ? req.body.contrasena : '';
  const telefono = typeof req.body?.telefono === 'string' ? req.body.telefono.trim() : '';

  if (!tipoDocumento || tipoDocumento.length > 20 || !numeroDocumento || numeroDocumento.length > 30 ||
      !nombres || nombres.length > 100 || !apellidos || apellidos.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 150 ||
      contrasena.length < 8 || contrasena.length > 200 || telefono.length > 30) {
    return res.status(400).json({ mensaje: 'Completa los datos requeridos; la contraseña debe tener al menos 8 caracteres.' });
  }

  try {
    const [[roles]] = await pool.execute("SELECT id_rol FROM roles WHERE codigo = 'instructor' LIMIT 1");
    if (!roles) return res.status(503).json({ mensaje: 'No se encontró el rol instructor en la tabla roles.' });
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.execute(
      `INSERT INTO usuarios
       (id_rol, id_creado_por, tipo_documento, numero_documento, nombres, apellidos, correo, contrasena_hash, telefono, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [roles.id_rol, req.session.usuario.id_usuario, tipoDocumento, numeroDocumento, nombres, apellidos, correo, contrasenaHash, telefono || null]
    );
    return res.status(201).json({ mensaje: 'Instructor registrado en la base de datos.', id_usuario: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo o documento.' });
    console.error('Error al crear instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo registrar el instructor.' });
  }
});

app.get('/api/admin/resumen', requireAdmin, async (_req, res) => {
  try {
    const [[resumen]] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol WHERE r.codigo = 'instructor' AND u.estado = 'activo') AS instructores,
        (SELECT COUNT(*) FROM programas WHERE activo = 1) AS programas,
        (SELECT COUNT(*) FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol WHERE r.codigo = 'aprendiz' AND u.estado = 'activo') AS aprendices,
        (SELECT COUNT(*) FROM ficha_cursos WHERE estado = 'activo') AS clases`
    );
    return res.json({ resumen });
  } catch (error) {
    console.error('Error al consultar resumen administrador:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las cifras del panel.' });
  }
});

app.get('/api/aprendices', requireAdmin, async (_req, res) => {
  try {
    const [aprendices] = await pool.query(
      `SELECT u.id_usuario, u.tipo_documento, u.numero_documento, u.nombres, u.apellidos,
              u.correo, u.telefono, u.estado, GROUP_CONCAT(DISTINCT f.codigo ORDER BY f.codigo SEPARATOR ', ') AS fichas
       FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol AND r.codigo = 'aprendiz'
       LEFT JOIN inscripciones i ON i.id_usuario_aprendiz = u.id_usuario AND i.estado = 'activa'
       LEFT JOIN fichas f ON f.id_ficha = i.id_ficha
       GROUP BY u.id_usuario, u.tipo_documento, u.numero_documento, u.nombres, u.apellidos,
                u.correo, u.telefono, u.estado
       ORDER BY u.apellidos, u.nombres`
    );
    const [fichas] = await pool.query("SELECT id_ficha, codigo FROM fichas WHERE estado = 'en_formacion' ORDER BY codigo");
    return res.json({ aprendices, fichas });
  } catch (error) {
    console.error('Error al consultar aprendices:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar los aprendices.' });
  }
});

app.post('/api/aprendices', requireAdmin, async (req, res) => {
  const tipoDocumento = typeof req.body?.tipo_documento === 'string' ? req.body.tipo_documento.trim() : '';
  const numeroDocumento = typeof req.body?.numero_documento === 'string' ? req.body.numero_documento.trim() : '';
  const nombres = typeof req.body?.nombres === 'string' ? req.body.nombres.trim() : '';
  const apellidos = typeof req.body?.apellidos === 'string' ? req.body.apellidos.trim() : '';
  const correo = typeof req.body?.correo === 'string' ? req.body.correo.trim().toLowerCase() : '';
  const contrasena = typeof req.body?.contrasena === 'string' ? req.body.contrasena : '';
  const telefono = typeof req.body?.telefono === 'string' ? req.body.telefono.trim() : '';
  const idFicha = Number(req.body?.id_ficha);
  if (!tipoDocumento || tipoDocumento.length > 20 || !numeroDocumento || numeroDocumento.length > 30 ||
      !nombres || nombres.length > 100 || !apellidos || apellidos.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 150 ||
      contrasena.length < 8 || contrasena.length > 200 || telefono.length > 30 || !Number.isInteger(idFicha) || idFicha < 1) {
    return res.status(400).json({ mensaje: 'Completa los datos, elige una ficha y usa una contraseña de al menos 8 caracteres.' });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[ficha]] = await connection.execute("SELECT id_ficha FROM fichas WHERE id_ficha = ? AND estado = 'en_formacion'", [idFicha]);
    const [[rol]] = await connection.execute("SELECT id_rol FROM roles WHERE codigo = 'aprendiz' LIMIT 1");
    if (!ficha || !rol) {
      await connection.rollback();
      return res.status(400).json({ mensaje: 'La ficha no está disponible o falta el rol de aprendiz.' });
    }
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const [usuario] = await connection.execute(
      `INSERT INTO usuarios (id_rol, id_creado_por, tipo_documento, numero_documento, nombres, apellidos, correo, contrasena_hash, telefono, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [rol.id_rol, req.session.usuario.id_usuario, tipoDocumento, numeroDocumento, nombres, apellidos, correo, contrasenaHash, telefono || null]
    );
    await connection.execute(
      "INSERT INTO inscripciones (id_usuario_aprendiz, id_ficha, id_registrado_por, estado) VALUES (?, ?, ?, 'activa')",
      [usuario.insertId, idFicha, req.session.usuario.id_usuario]
    );
    await connection.commit();
    return res.status(201).json({ mensaje: 'Aprendiz registrado e inscrito en la ficha.', id_usuario: usuario.insertId });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo o documento.' });
    console.error('Error al registrar aprendiz:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo registrar e inscribir al aprendiz.' });
  } finally {
    connection.release();
  }
});

app.get('/api/instructor/fichas', requireInstructor, async (req, res) => {
  try {
    const [filas] = await pool.execute(
      `SELECT f.id_ficha, f.codigo AS ficha, f.estado AS estado_ficha, p.nombre AS programa,
              fc.id_ficha_curso, c.codigo AS codigo_curso, c.nombre AS curso, fc.estado AS estado_curso
       FROM ficha_instructores fi
       INNER JOIN fichas f ON f.id_ficha = fi.id_ficha
       INNER JOIN programas p ON p.id_programa = f.id_programa
       LEFT JOIN ficha_cursos fc ON fc.id_ficha = f.id_ficha AND fc.estado = 'activo'
       LEFT JOIN cursos c ON c.id_curso = fc.id_curso
       WHERE fi.id_usuario_instructor = ? AND fi.activo = 1
       ORDER BY f.codigo, c.nombre`,
      [req.session.usuario.id_usuario]
    );
    return res.json({ fichas: filas });
  } catch (error) {
    console.error('Error al consultar fichas del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar tus fichas.' });
  }
});

app.get('/api/instructor/resumen', requireInstructor, async (req, res) => {
  try {
    const [[resumen]] = await pool.execute(
      `SELECT
        (SELECT COUNT(DISTINCT fi.id_ficha) FROM ficha_instructores fi WHERE fi.id_usuario_instructor = ? AND fi.activo = 1) AS fichas,
        (SELECT COUNT(DISTINCT i.id_usuario_aprendiz) FROM ficha_instructores fi INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa' WHERE fi.id_usuario_instructor = ? AND fi.activo = 1) AS aprendices,
        (SELECT COUNT(DISTINCT fc.id_ficha_curso) FROM ficha_cursos fc INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha WHERE fi.id_usuario_instructor = ? AND fi.activo = 1 AND fc.estado = 'activo') AS clases,
        (SELECT COALESCE(ROUND(100 * SUM(CASE WHEN al.completada = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT CONCAT(l.id_leccion, '-', i.id_usuario_aprendiz)), 0)), 0)
         FROM ficha_instructores fi INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa'
         INNER JOIN ficha_cursos fc ON fc.id_ficha = fi.id_ficha AND fc.estado = 'activo'
         INNER JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
         LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz AND al.id_usuario_instructor = fi.id_usuario_instructor
         WHERE fi.id_usuario_instructor = ? AND fi.activo = 1) AS progreso`,
      [req.session.usuario.id_usuario, req.session.usuario.id_usuario, req.session.usuario.id_usuario, req.session.usuario.id_usuario]
    );
    return res.json({ resumen });
  } catch (error) {
    console.error('Error al consultar resumen instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las cifras del panel.' });
  }
});

app.get('/api/instructor/aprendices', requireInstructor, async (req, res) => {
  try {
    const [aprendices] = await pool.execute(
      `SELECT u.id_usuario, u.nombres, u.apellidos, u.correo, u.telefono,
              GROUP_CONCAT(DISTINCT f.codigo ORDER BY f.codigo SEPARATOR ', ') AS fichas,
              COUNT(DISTINCT l.id_leccion) AS lecciones_totales,
              COUNT(DISTINCT CASE WHEN al.completada = 1 THEN l.id_leccion END) AS lecciones_completadas
       FROM ficha_instructores fi
       INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa'
       INNER JOIN fichas f ON f.id_ficha = i.id_ficha
       INNER JOIN usuarios u ON u.id_usuario = i.id_usuario_aprendiz
       LEFT JOIN ficha_cursos fc ON fc.id_ficha = f.id_ficha AND fc.estado = 'activo'
       LEFT JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
       LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = u.id_usuario
       WHERE fi.id_usuario_instructor = ? AND fi.activo = 1
       GROUP BY u.id_usuario, u.nombres, u.apellidos, u.correo, u.telefono
       ORDER BY u.apellidos, u.nombres`,
      [req.session.usuario.id_usuario]
    );
    return res.json({ aprendices });
  } catch (error) {
    console.error('Error al consultar aprendices del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar tus aprendices.' });
  }
});

app.post('/api/instructor/fichas/:id/cursos', requireInstructor, async (req, res) => {
  const idFicha = Number(req.params.id);
  const codigo = typeof req.body?.codigo === 'string' ? req.body.codigo.trim() : '';
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : '';
  const descripcion = typeof req.body?.descripcion === 'string' ? req.body.descripcion.trim() : '';
  if (!Number.isInteger(idFicha) || idFicha < 1 || !codigo || codigo.length > 30 || !nombre || nombre.length > 150) {
    return res.status(400).json({ mensaje: 'Escribe un código y nombre válidos para el curso.' });
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[asignacion]] = await connection.execute(
      'SELECT id_ficha FROM ficha_instructores WHERE id_ficha = ? AND id_usuario_instructor = ? AND activo = 1',
      [idFicha, req.session.usuario.id_usuario]
    );
    if (!asignacion) {
      await connection.rollback();
      return res.status(403).json({ mensaje: 'Solo puedes crear cursos en una ficha que tienes asignada.' });
    }
    const [curso] = await connection.execute(
      'INSERT INTO cursos (id_creado_por, codigo, nombre, descripcion, activo) VALUES (?, ?, ?, ?, 1)',
      [req.session.usuario.id_usuario, codigo, nombre, descripcion || null]
    );
    const [fichaCurso] = await connection.execute("INSERT INTO ficha_cursos (id_ficha, id_curso, nombre_visible, estado) VALUES (?, ?, ?, 'activo')", [idFicha, curso.insertId, nombre]);
    await connection.commit();
    return res.status(201).json({ mensaje: 'Curso creado y asociado a la ficha.', id_ficha_curso: fichaCurso.insertId });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ese código de curso ya está en uso.' });
    console.error('Error al crear curso de ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar el curso.' });
  } finally { connection.release(); }
});

app.get('/api/instructor/cursos/:id/lecciones', requireInstructor, async (req, res) => {
  const idCurso = Number(req.params.id);
  try {
    const [lecciones] = await pool.execute(
      `SELECT l.id_leccion, l.titulo, l.contenido, l.orden, l.duracion_minutos, l.publicada
       FROM lecciones l INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = l.id_ficha_curso
       INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha AND fi.activo = 1
       WHERE l.id_ficha_curso = ? AND fi.id_usuario_instructor = ? AND l.publicada = 1 ORDER BY l.orden, l.id_leccion`,
      [idCurso, req.session.usuario.id_usuario]
    );
    return res.json({ lecciones });
  } catch (error) {
    console.error('Error al consultar lecciones del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las lecciones.' });
  }
});

app.post('/api/instructor/cursos/:id/lecciones', requireInstructor, async (req, res) => {
  const idCurso = Number(req.params.id);
  const titulo = typeof req.body?.titulo === 'string' ? req.body.titulo.trim() : '';
  const contenido = typeof req.body?.contenido === 'string' ? req.body.contenido.trim() : '';
  const minutos = req.body?.duracion_minutos === '' || req.body?.duracion_minutos == null ? null : Number(req.body.duracion_minutos);
  if (!Number.isInteger(idCurso) || idCurso < 1 || !titulo || titulo.length > 150 || contenido.length > 10000 ||
      (minutos !== null && (!Number.isInteger(minutos) || minutos < 1 || minutos > 65535))) return res.status(400).json({ mensaje: 'Revisa el título, contenido y duración de la lección.' });
  try {
    const [result] = await pool.execute(
      `INSERT INTO lecciones (id_ficha_curso, id_creado_por, titulo, contenido, orden, duracion_minutos, publicada)
       SELECT fc.id_ficha_curso, ?, ?, ?, COALESCE((SELECT MAX(l2.orden) + 1 FROM lecciones l2 WHERE l2.id_ficha_curso = fc.id_ficha_curso), 1), ?, 1
       FROM ficha_cursos fc INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha AND fi.activo = 1
       WHERE fc.id_ficha_curso = ? AND fc.estado = 'activo' AND fi.id_usuario_instructor = ?`,
      [req.session.usuario.id_usuario, titulo, contenido || null, minutos, idCurso, req.session.usuario.id_usuario]
    );
    if (!result.affectedRows) return res.status(403).json({ mensaje: 'Solo puedes crear lecciones en un curso activo de tus fichas.' });
    return res.status(201).json({ mensaje: 'Lección publicada.' });
  } catch (error) {
    console.error('Error al crear lección:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la lección.' });
  }
});

app.delete('/api/instructor/lecciones/:id', requireInstructor, async (req, res) => {
  const idLeccion = Number(req.params.id);
  if (!Number.isInteger(idLeccion) || idLeccion < 1) return res.status(400).json({ mensaje: 'Lección inválida.' });
  try {
    const [result] = await pool.execute(
      `UPDATE lecciones l
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = l.id_ficha_curso
       INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha AND fi.activo = 1
       SET l.publicada = 0
       WHERE l.id_leccion = ? AND fi.id_usuario_instructor = ? AND fc.estado = 'activo'`,
      [idLeccion, req.session.usuario.id_usuario]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'No se encontró una lección activa de tus fichas.' });
    return res.json({ mensaje: 'Lección retirada. El avance y el historial de los aprendices se conservaron.' });
  } catch (error) {
    console.error('Error al retirar lección:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo retirar la lección.' });
  }
});

app.get('/api/instructor/cursos/:id/actividades', requireInstructor, async (req, res) => {
  const idFichaCurso = Number(req.params.id);
  try {
    const [actividades] = await pool.execute(
      `SELECT a.id_actividad, a.titulo, a.instrucciones, a.tipo_actividad, a.fecha_limite, a.estado,
              COUNT(DISTINCT ie.id_intento_entrega) AS entregas
       FROM actividades a
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
       INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha
       LEFT JOIN intentos_entrega ie ON ie.id_actividad = a.id_actividad
       WHERE a.id_ficha_curso = ? AND fi.id_usuario_instructor = ? AND fi.activo = 1
       GROUP BY a.id_actividad, a.titulo, a.instrucciones, a.tipo_actividad, a.fecha_limite, a.estado
       ORDER BY a.creado_en DESC`,
      [idFichaCurso, req.session.usuario.id_usuario]
    );
    return res.json({ actividades });
  } catch (error) {
    console.error('Error al consultar actividades:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las actividades.' });
  }
});

app.post('/api/instructor/cursos/:id/actividades', requireInstructor, async (req, res) => {
  const idFichaCurso = Number(req.params.id);
  const titulo = typeof req.body?.titulo === 'string' ? req.body.titulo.trim() : '';
  const instrucciones = typeof req.body?.instrucciones === 'string' ? req.body.instrucciones.trim() : '';
  const tipo = req.body?.tipo_actividad;
  const fechaLimite = typeof req.body?.fecha_limite === 'string' && req.body.fecha_limite ? req.body.fecha_limite.replace('T', ' ') : null;
  const tipos = ['taller', 'evidencia', 'evaluacion', 'proyecto', 'otra'];
  if (!Number.isInteger(idFichaCurso) || idFichaCurso < 1 || !titulo || titulo.length > 150 || !instrucciones || !tipos.includes(tipo)) {
    return res.status(400).json({ mensaje: 'Completa título, instrucciones y tipo de actividad.' });
  }
  try {
    const [[persona]] = await pool.execute(
      `SELECT u.id_usuario FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = ? AND r.codigo IN ('instructor','aprendiz')`, [id]
    );
    if (!persona) return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
    const [result] = await pool.execute(
      `INSERT INTO actividades (id_ficha_curso, id_creado_por, titulo, instrucciones, tipo_actividad, fecha_limite, estado)
       SELECT fc.id_ficha_curso, ?, ?, ?, ?, ?, 'publicada'
       FROM ficha_cursos fc INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha
       WHERE fc.id_ficha_curso = ? AND fc.estado = 'activo' AND fi.id_usuario_instructor = ? AND fi.activo = 1`,
      [req.session.usuario.id_usuario, titulo, instrucciones, tipo, fechaLimite, idFichaCurso, req.session.usuario.id_usuario]
    );
    if (!result.affectedRows) return res.status(403).json({ mensaje: 'El curso no pertenece a una ficha que tengas asignada.' });
    return res.status(201).json({ mensaje: 'Actividad publicada.' });
  } catch (error) {
    console.error('Error al crear actividad:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la actividad.' });
  }
});

app.get('/api/instructor/entregas', requireInstructor, async (req, res) => {
  try {
    const [entregas] = await pool.execute(
      `SELECT ie.id_intento_entrega, ie.numero_intento, ie.comentario_aprendiz,
              ie.enlace_entrega, ie.fecha_entrega, a.titulo AS actividad,
              c.nombre AS curso, f.codigo AS ficha, u.nombres, u.apellidos,
              ei.resultado, ei.retroalimentacion
       FROM intentos_entrega ie
       INNER JOIN actividades a ON a.id_actividad = ie.id_actividad
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       INNER JOIN fichas f ON f.id_ficha = fc.id_ficha
       INNER JOIN ficha_instructores fi ON fi.id_ficha = f.id_ficha AND fi.id_usuario_instructor = ? AND fi.activo = 1
       INNER JOIN usuarios u ON u.id_usuario = ie.id_usuario_aprendiz
       LEFT JOIN evaluaciones_intento ei ON ei.id_intento_entrega = ie.id_intento_entrega
       ORDER BY (ei.id_evaluacion_intento IS NULL) DESC, ie.fecha_entrega DESC`,
      [req.session.usuario.id_usuario]
    );
    return res.json({ entregas });
  } catch (error) {
    console.error('Error al consultar entregas del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las entregas.' });
  }
});

app.post('/api/instructor/entregas/:id/evaluacion', requireInstructor, async (req, res) => {
  const idIntento = Number(req.params.id);
  const resultado = req.body?.resultado;
  const retroalimentacion = typeof req.body?.retroalimentacion === 'string' ? req.body.retroalimentacion.trim() : '';
  if (!Number.isInteger(idIntento) || idIntento < 1 || !['aprobado', 'desaprobado'].includes(resultado) || retroalimentacion.length > 10000) {
    return res.status(400).json({ mensaje: 'Selecciona aprobado o desaprobado y escribe una retroalimentación válida.' });
  }
  try {
    const [actualizacion] = await pool.execute(
      `INSERT INTO evaluaciones_intento (id_intento_entrega, id_usuario_instructor, resultado, retroalimentacion)
       SELECT ie.id_intento_entrega, ?, ?, ?
       FROM intentos_entrega ie
       INNER JOIN actividades a ON a.id_actividad = ie.id_actividad
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
       INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha
       WHERE ie.id_intento_entrega = ? AND fi.id_usuario_instructor = ? AND fi.activo = 1
       ON DUPLICATE KEY UPDATE id_usuario_instructor = VALUES(id_usuario_instructor),
         resultado = VALUES(resultado), retroalimentacion = VALUES(retroalimentacion)`,
      [req.session.usuario.id_usuario, resultado, retroalimentacion || null, idIntento, req.session.usuario.id_usuario]
    );
    if (!actualizacion.affectedRows) return res.status(403).json({ mensaje: 'Esa entrega no pertenece a una ficha que tengas asignada.' });
    await pool.execute("UPDATE intentos_entrega SET estado = 'evaluado' WHERE id_intento_entrega = ?", [idIntento]);
    return res.json({ mensaje: 'Evaluación guardada.' });
  } catch (error) {
    console.error('Error al evaluar entrega:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la evaluación.' });
  }
});

app.get('/api/aprendiz/cursos', requireAprendiz, async (req, res) => {
  try {
    const [cursos] = await pool.execute(
      `SELECT fc.id_ficha_curso, COALESCE(fc.nombre_visible, c.nombre) AS nombre,
              c.descripcion, f.codigo AS ficha, p.nombre AS programa,
              GROUP_CONCAT(DISTINCT CONCAT(ui.nombres, ' ', ui.apellidos) ORDER BY ui.apellidos SEPARATOR ', ') AS instructores,
              COUNT(DISTINCT l.id_leccion) AS lecciones_totales,
              COUNT(DISTINCT CASE WHEN al.completada = 1 THEN l.id_leccion END) AS lecciones_completadas
       FROM inscripciones i
       INNER JOIN fichas f ON f.id_ficha = i.id_ficha
       INNER JOIN programas p ON p.id_programa = f.id_programa
       INNER JOIN ficha_cursos fc ON fc.id_ficha = f.id_ficha AND fc.estado = 'activo'
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       LEFT JOIN ficha_instructores fi ON fi.id_ficha = f.id_ficha AND fi.activo = 1
       LEFT JOIN usuarios ui ON ui.id_usuario = fi.id_usuario_instructor
       LEFT JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
       LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz
       WHERE i.id_usuario_aprendiz = ? AND i.estado = 'activa'
       GROUP BY fc.id_ficha_curso, fc.nombre_visible, c.nombre, c.descripcion, f.codigo, p.nombre
       ORDER BY c.nombre`,
      [req.session.usuario.id_usuario]
    );
    const [actividades] = await pool.execute(
      `SELECT a.id_actividad, a.id_ficha_curso, a.titulo, a.instrucciones, a.tipo_actividad,
              a.permite_multiples_intentos,
              a.fecha_limite, a.estado AS estado_actividad, ie.id_intento_entrega,
              ie.numero_intento, ie.fecha_entrega, ei.resultado, ei.retroalimentacion,
              COALESCE(fc.nombre_visible, c.nombre) AS curso
       FROM actividades a
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       INNER JOIN inscripciones i ON i.id_ficha = fc.id_ficha AND i.id_usuario_aprendiz = ? AND i.estado = 'activa'
       LEFT JOIN intentos_entrega ie ON ie.id_intento_entrega = (
         SELECT ie2.id_intento_entrega FROM intentos_entrega ie2
         WHERE ie2.id_actividad = a.id_actividad AND ie2.id_usuario_aprendiz = i.id_usuario_aprendiz
         ORDER BY ie2.numero_intento DESC LIMIT 1
       )
       LEFT JOIN evaluaciones_intento ei ON ei.id_intento_entrega = ie.id_intento_entrega
       WHERE fc.estado = 'activo' AND a.estado = 'publicada' AND (a.fecha_apertura IS NULL OR a.fecha_apertura <= NOW())
       ORDER BY a.fecha_limite, a.id_actividad`,
      [req.session.usuario.id_usuario]
    );
    const [lecciones] = await pool.execute(
      `SELECT l.id_leccion, l.id_ficha_curso, l.titulo, l.contenido, l.orden,
              l.duracion_minutos, COALESCE(al.completada, 0) AS completada,
              COALESCE(fc.nombre_visible, c.nombre) AS curso
       FROM inscripciones i INNER JOIN ficha_cursos fc ON fc.id_ficha = i.id_ficha AND fc.estado = 'activo'
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       INNER JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
       LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz
       WHERE i.id_usuario_aprendiz = ? AND i.estado = 'activa' ORDER BY c.nombre, l.orden`,
      [req.session.usuario.id_usuario]
    );
    return res.json({ cursos, actividades, lecciones });
  } catch (error) {
    console.error('Error al consultar cursos del aprendiz:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar tus clases.' });
  }
});

app.post('/api/aprendiz/lecciones/:id/completar', requireAprendiz, async (req, res) => {
  const idLeccion = Number(req.params.id);
  if (!Number.isInteger(idLeccion) || idLeccion < 1) return res.status(400).json({ mensaje: 'Lección inválida.' });
  try {
    const [[leccion]] = await pool.execute(
      `SELECT l.id_leccion, fi.id_usuario_instructor
       FROM lecciones l
       INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = l.id_ficha_curso AND fc.estado = 'activo'
       INNER JOIN inscripciones i ON i.id_ficha = fc.id_ficha AND i.id_usuario_aprendiz = ? AND i.estado = 'activa'
       INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha AND fi.activo = 1
       WHERE l.id_leccion = ? AND l.publicada = 1
       ORDER BY (fi.rol_en_ficha = 'titular') DESC, fi.id_ficha_instructor LIMIT 1`,
      [req.session.usuario.id_usuario, idLeccion]
    );
    if (!leccion) return res.status(404).json({ mensaje: 'La lección no está disponible para tu ficha o no tiene instructor asignado.' });
    await pool.execute(
      `INSERT INTO avance_lecciones (id_leccion, id_usuario_aprendiz, id_usuario_instructor, completada, fecha_completado)
       VALUES (?, ?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE completada = 1, fecha_completado = NOW()`,
      [leccion.id_leccion, req.session.usuario.id_usuario, leccion.id_usuario_instructor]
    );
    return res.json({ mensaje: 'Lección marcada como completada.' });
  } catch (error) {
    console.error('Error al guardar avance de lección:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar el avance.' });
  }
});

app.post('/api/aprendiz/actividades/:id/entregas', requireAprendiz, async (req, res) => {
  const idActividad = Number(req.params.id);
  const comentario = typeof req.body?.comentario === 'string' ? req.body.comentario.trim() : '';
  const enlace = typeof req.body?.enlace === 'string' ? req.body.enlace.trim() : '';
  if (!Number.isInteger(idActividad) || idActividad < 1 || (!comentario && !enlace) || comentario.length > 10000 || enlace.length > 500) {
    return res.status(400).json({ mensaje: 'Escribe una respuesta o agrega un enlace válido.' });
  }
  try {
    const [[actividad]] = await pool.execute(
      `SELECT a.id_actividad, a.permite_multiples_intentos, a.fecha_limite
       FROM actividades a INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
       INNER JOIN inscripciones i ON i.id_ficha = fc.id_ficha
       WHERE a.id_actividad = ? AND i.id_usuario_aprendiz = ? AND i.estado = 'activa'
         AND a.estado = 'publicada' AND (a.fecha_apertura IS NULL OR a.fecha_apertura <= NOW())
         AND (a.fecha_limite IS NULL OR a.fecha_limite >= NOW())`,
      [idActividad, req.session.usuario.id_usuario]
    );
    if (!actividad) return res.status(404).json({ mensaje: 'La actividad no está disponible para tu ficha o ya cerró.' });
    const [[conteo]] = await pool.execute('SELECT COUNT(*) AS total FROM intentos_entrega WHERE id_actividad = ? AND id_usuario_aprendiz = ?', [idActividad, req.session.usuario.id_usuario]);
    if (!actividad.permite_multiples_intentos && Number(conteo.total) > 0) return res.status(409).json({ mensaje: 'Esta actividad solo permite un intento.' });
    const numeroIntento = Number(conteo.total) + 1;
    await pool.execute(
      `INSERT INTO intentos_entrega (id_actividad, id_usuario_aprendiz, numero_intento, comentario_aprendiz, enlace_entrega, estado)
       VALUES (?, ?, ?, ?, ?, 'enviado')`,
      [idActividad, req.session.usuario.id_usuario, numeroIntento, comentario || null, enlace || null]
    );
    return res.status(201).json({ mensaje: 'Tu entrega se guardó.', numero_intento: numeroIntento });
  } catch (error) {
    console.error('Error al guardar entrega:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la entrega.' });
  }
});

app.get('/api/aprendiz/progreso', requireAprendiz, async (req, res) => {
  try {
    const [cursos] = await pool.execute(
      `SELECT fc.id_ficha_curso, COALESCE(fc.nombre_visible, c.nombre) AS nombre,
              COUNT(DISTINCT l.id_leccion) AS lecciones_totales,
              COUNT(DISTINCT CASE WHEN al.completada = 1 THEN l.id_leccion END) AS lecciones_completadas
       FROM inscripciones i
       INNER JOIN ficha_cursos fc ON fc.id_ficha = i.id_ficha AND fc.estado = 'activo'
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       LEFT JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
       LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz
       WHERE i.id_usuario_aprendiz = ? AND i.estado = 'activa'
       GROUP BY fc.id_ficha_curso, fc.nombre_visible, c.nombre ORDER BY c.nombre`,
      [req.session.usuario.id_usuario]
    );
    const [[actividades]] = await pool.execute(
      `SELECT COUNT(DISTINCT a.id_actividad) AS total,
              COUNT(DISTINCT CASE WHEN ie.id_intento_entrega IS NOT NULL THEN a.id_actividad END) AS entregadas,
              COUNT(DISTINCT CASE WHEN ie.estado = 'evaluado' THEN a.id_actividad END) AS evaluadas
       FROM inscripciones i INNER JOIN ficha_cursos fc ON fc.id_ficha = i.id_ficha AND fc.estado = 'activo'
       INNER JOIN actividades a ON a.id_ficha_curso = fc.id_ficha_curso AND a.estado = 'publicada'
       LEFT JOIN intentos_entrega ie ON ie.id_actividad = a.id_actividad AND ie.id_usuario_aprendiz = i.id_usuario_aprendiz
       WHERE i.id_usuario_aprendiz = ? AND i.estado = 'activa'`,
      [req.session.usuario.id_usuario]
    );
    const cursosConProgreso = cursos.map((curso) => ({
      ...curso,
      porcentaje: Number(curso.lecciones_totales) ? Math.round(100 * Number(curso.lecciones_completadas) / Number(curso.lecciones_totales)) : 0,
    }));
    const leccionesTotales = cursosConProgreso.reduce((n, curso) => n + Number(curso.lecciones_totales), 0);
    const leccionesCompletadas = cursosConProgreso.reduce((n, curso) => n + Number(curso.lecciones_completadas), 0);
    return res.json({
      cursos: cursosConProgreso,
      resumen: {
        cursos: cursosConProgreso.length,
        lecciones_totales: leccionesTotales,
        lecciones_completadas: leccionesCompletadas,
        progreso: leccionesTotales ? Math.round(100 * leccionesCompletadas / leccionesTotales) : 0,
        actividades: Number(actividades.total),
        entregadas: Number(actividades.entregadas),
        evaluadas: Number(actividades.evaluadas),
      },
    });
  } catch (error) {
    console.error('Error al consultar progreso del aprendiz:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo cargar tu progreso.' });
  }
});

app.get('/api/instructor/actividad-reciente', requireInstructor, async (req, res) => {
  try {
    const [actividades] = await pool.execute(
      `SELECT * FROM (
        SELECT 'actividad' AS tipo, a.titulo, a.estado, a.creado_en AS fecha,
               CONCAT('Ficha ', f.codigo, ' · ', c.nombre) AS detalle
        FROM actividades a
        INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
        INNER JOIN fichas f ON f.id_ficha = fc.id_ficha
        INNER JOIN cursos c ON c.id_curso = fc.id_curso
        INNER JOIN ficha_instructores fi ON fi.id_ficha = f.id_ficha AND fi.activo = 1
        WHERE fi.id_usuario_instructor = ?
        UNION ALL
        SELECT 'entrega' AS tipo, a.titulo, ie.estado, ie.fecha_entrega AS fecha,
               CONCAT('Entrega de ', u.nombres, ' ', u.apellidos, ' · Ficha ', f.codigo) AS detalle
        FROM intentos_entrega ie
        INNER JOIN actividades a ON a.id_actividad = ie.id_actividad
        INNER JOIN ficha_cursos fc ON fc.id_ficha_curso = a.id_ficha_curso
        INNER JOIN fichas f ON f.id_ficha = fc.id_ficha
        INNER JOIN usuarios u ON u.id_usuario = ie.id_usuario_aprendiz
        INNER JOIN ficha_instructores fi ON fi.id_ficha = f.id_ficha AND fi.activo = 1
        WHERE fi.id_usuario_instructor = ?
      ) actividad ORDER BY fecha DESC LIMIT 8`,
      [req.session.usuario.id_usuario, req.session.usuario.id_usuario]
    );
    return res.json({ actividades });
  } catch (error) {
    console.error('Error al consultar actividad reciente del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo cargar la actividad reciente.' });
  }
});

app.get('/api/admin/estadisticas', requireAdmin, async (_req, res) => {
  try {
    const [[resumen]] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol WHERE r.codigo = 'aprendiz' AND u.estado = 'activo') AS aprendices,
        (SELECT COUNT(*) FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol WHERE r.codigo = 'instructor' AND u.estado = 'activo') AS instructores,
        (SELECT COUNT(*) FROM programas WHERE activo = 1) AS programas,
        (SELECT COUNT(*) FROM ficha_cursos WHERE estado = 'activo') AS clases,
        (SELECT COUNT(*) FROM fichas WHERE estado = 'en_formacion') AS fichas`
    );
    const [distribucion] = await pool.query(
      `SELECT p.nombre AS label, COUNT(DISTINCT i.id_usuario_aprendiz) AS value
       FROM programas p LEFT JOIN fichas f ON f.id_programa = p.id_programa
       LEFT JOIN inscripciones i ON i.id_ficha = f.id_ficha AND i.estado = 'activa'
       WHERE p.activo = 1 GROUP BY p.id_programa, p.nombre ORDER BY value DESC, p.nombre LIMIT 8`
    );
    const [mensual] = await pool.query(
      `SELECT DATE_FORMAT(fecha_inscripcion, '%Y-%m') AS periodo,
              DATE_FORMAT(fecha_inscripcion, '%b') AS mes, COUNT(*) AS valor
       FROM inscripciones WHERE fecha_inscripcion >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
       GROUP BY DATE_FORMAT(fecha_inscripcion, '%Y-%m'), DATE_FORMAT(fecha_inscripcion, '%b')
       ORDER BY periodo`
    );
    return res.json({ resumen, distribucion, mensual });
  } catch (error) {
    console.error('Error al consultar estadísticas globales:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las estadísticas.' });
  }
});

app.get('/api/admin/actividad-reciente', requireAdmin, async (_req, res) => {
  try {
    const [actividades] = await pool.query(
      `SELECT * FROM (
        SELECT CONCAT('Cuenta registrada: ', u.nombres, ' ', u.apellidos) AS titulo,
               u.creado_en AS fecha, r.nombre AS tipo, u.estado AS estado
        FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
        WHERE r.codigo IN ('instructor','aprendiz')
        UNION ALL
        SELECT CONCAT('Programa creado: ', p.nombre) AS titulo, p.creado_en AS fecha,
               'Programa' AS tipo, IF(p.activo = 1, 'activo', 'inactivo') AS estado
        FROM programas p
        UNION ALL
        SELECT CONCAT('Ficha creada: ', f.codigo) AS titulo, f.creado_en AS fecha,
               CONCAT('Ficha · ', p.nombre) AS tipo, f.estado AS estado
        FROM fichas f INNER JOIN programas p ON p.id_programa = f.id_programa
      ) recientes ORDER BY fecha DESC LIMIT 8`
    );
    return res.json({ actividades });
  } catch (error) {
    console.error('Error al consultar actividad administrativa:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo cargar la actividad reciente.' });
  }
});

app.get('/api/instructor/estadisticas', requireInstructor, async (req, res) => {
  try {
    const [[resumen]] = await pool.execute(
      `SELECT
        (SELECT COUNT(DISTINCT i.id_usuario_aprendiz) FROM ficha_instructores fi INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa' WHERE fi.id_usuario_instructor = ? AND fi.activo = 1) AS aprendices,
        (SELECT COUNT(DISTINCT fc.id_ficha_curso) FROM ficha_cursos fc INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha WHERE fi.id_usuario_instructor = ? AND fi.activo = 1 AND fc.estado = 'activo') AS clases,
        (SELECT COALESCE(ROUND(100 * SUM(CASE WHEN al.completada = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT CONCAT(l.id_leccion, '-', i.id_usuario_aprendiz)), 0)), 0)
         FROM ficha_instructores fi INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa'
         INNER JOIN ficha_cursos fc ON fc.id_ficha = fi.id_ficha AND fc.estado = 'activo'
         INNER JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
         LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz AND al.id_usuario_instructor = fi.id_usuario_instructor
         WHERE fi.id_usuario_instructor = ? AND fi.activo = 1) AS progreso`,
      [req.session.usuario.id_usuario, req.session.usuario.id_usuario, req.session.usuario.id_usuario]
    );
    const [progresoClases] = await pool.execute(
      `SELECT COALESCE(fc.nombre_visible, c.nombre) AS nombre,
              COALESCE(ROUND(100 * SUM(CASE WHEN al.completada = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT CONCAT(l.id_leccion, '-', i.id_usuario_aprendiz)), 0)), 0) AS progreso
       FROM ficha_instructores fi INNER JOIN inscripciones i ON i.id_ficha = fi.id_ficha AND i.estado = 'activa'
       INNER JOIN ficha_cursos fc ON fc.id_ficha = fi.id_ficha AND fc.estado = 'activo'
       INNER JOIN cursos c ON c.id_curso = fc.id_curso
       LEFT JOIN lecciones l ON l.id_ficha_curso = fc.id_ficha_curso AND l.publicada = 1
       LEFT JOIN avance_lecciones al ON al.id_leccion = l.id_leccion AND al.id_usuario_aprendiz = i.id_usuario_aprendiz
       WHERE fi.id_usuario_instructor = ? AND fi.activo = 1
       GROUP BY fc.id_ficha_curso, fc.nombre_visible, c.nombre ORDER BY c.nombre`,
      [req.session.usuario.id_usuario]
    );
    return res.json({ resumen, progresoClases });
  } catch (error) {
    console.error('Error al consultar estadísticas del instructor:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar tus estadísticas.' });
  }
});

app.patch('/api/admin/usuarios/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { tipo_documento, numero_documento, nombres, apellidos, correo, telefono, estado } = req.body || {};
  const correoNormalizado = typeof correo === 'string' ? correo.trim().toLowerCase() : '';
  if (!Number.isInteger(id) || id < 1 || !tipo_documento || String(tipo_documento).length > 20 ||
      !numero_documento || String(numero_documento).length > 30 || !nombres || String(nombres).length > 100 ||
      !apellidos || String(apellidos).length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado) ||
      correoNormalizado.length > 150 || (telefono && String(telefono).length > 30) || !['activo', 'inactivo', 'suspendido'].includes(estado)) {
    return res.status(400).json({ mensaje: 'Revisa los datos del usuario.' });
  }
  try {
    const [[persona]] = await pool.execute(
      `SELECT u.id_usuario FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = ? AND r.codigo IN ('instructor','aprendiz')`, [id]
    );
    if (!persona) return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
    await pool.execute(
      `UPDATE usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
       SET u.tipo_documento = ?, u.numero_documento = ?, u.nombres = ?, u.apellidos = ?, u.correo = ?, u.telefono = ?, u.estado = ?
       WHERE u.id_usuario = ? AND r.codigo IN ('instructor','aprendiz')`,
      [tipo_documento.trim(), numero_documento.trim(), nombres.trim(), apellidos.trim(), correoNormalizado, telefono?.trim() || null, estado, id]
    );
    return res.json({ mensaje: 'Datos actualizados.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ese correo o documento ya está registrado.' });
    console.error('Error al editar usuario:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron actualizar los datos.' });
  }
});

app.delete('/api/admin/usuarios/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id === req.session.usuario.id_usuario) return res.status(400).json({ mensaje: 'No se puede desactivar esa cuenta.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[persona]] = await connection.execute(
      `SELECT u.id_usuario, r.codigo AS rol FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol
       WHERE u.id_usuario = ? AND r.codigo IN ('instructor','aprendiz') FOR UPDATE`, [id]
    );
    if (!persona) { await connection.rollback(); return res.status(404).json({ mensaje: 'No se encontró el usuario.' }); }
    await connection.execute("UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = ?", [id]);
    if (persona.rol === 'aprendiz') {
      await connection.execute("UPDATE inscripciones SET estado = 'retiro', fecha_fin = CURDATE(), motivo_cambio = 'Cuenta desactivada por administración' WHERE id_usuario_aprendiz = ? AND estado = 'activa'", [id]);
    } else {
      await connection.execute('UPDATE ficha_instructores SET activo = 0, fecha_retiro = NOW() WHERE id_usuario_instructor = ? AND activo = 1', [id]);
    }
    await connection.commit();
    return res.json({ mensaje: 'Cuenta desactivada. El historial académico se conservó.' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al desactivar usuario:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo desactivar la cuenta.' });
  } finally { connection.release(); }
});

app.get('/api/admin/usuarios/:id/observaciones', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ mensaje: 'Usuario inválido.' });
  try {
    await asegurarTablaObservaciones();
    const [observaciones] = await pool.execute(
      `SELECT o.id_observacion, o.observacion, o.creado_en, CONCAT(a.nombres, ' ', a.apellidos) AS autor
       FROM observaciones_usuarios o LEFT JOIN usuarios a ON a.id_usuario = o.id_administrador
       WHERE o.id_usuario = ? ORDER BY o.creado_en DESC`, [id]
    );
    return res.json({ observaciones });
  } catch (error) {
    console.error('Error al consultar observaciones:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudieron cargar las observaciones.' });
  }
});

app.post('/api/admin/usuarios/:id/observaciones', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const observacion = typeof req.body?.observacion === 'string' ? req.body.observacion.trim() : '';
  if (!Number.isInteger(id) || id < 1 || !observacion || observacion.length > 5000) return res.status(400).json({ mensaje: 'Escribe una observación de hasta 5000 caracteres.' });
  try {
    await asegurarTablaObservaciones();
    const [[usuario]] = await pool.execute("SELECT u.id_usuario FROM usuarios u INNER JOIN roles r ON r.id_rol = u.id_rol WHERE u.id_usuario = ? AND r.codigo IN ('instructor','aprendiz')", [id]);
    if (!usuario) return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
    await pool.execute('INSERT INTO observaciones_usuarios (id_usuario, id_administrador, observacion) VALUES (?, ?, ?)', [id, req.session.usuario.id_usuario, observacion]);
    return res.status(201).json({ mensaje: 'Observación guardada.' });
  } catch (error) {
    console.error('Error al guardar observación:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo guardar la observación.' });
  }
});

app.patch('/api/fichas/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const idPrograma = Number(req.body?.id_programa);
  const codigo = typeof req.body?.codigo === 'string' ? req.body.codigo.trim() : '';
  const { jornada, fecha_inicio, fecha_fin, estado } = req.body || {};
  if (!Number.isInteger(id) || id < 1 || !Number.isInteger(idPrograma) || idPrograma < 1 || !codigo || codigo.length > 30 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha_inicio || '') || (fecha_fin && !/^\d{4}-\d{2}-\d{2}$/.test(fecha_fin)) ||
      (fecha_fin && fecha_fin < fecha_inicio) || !['diurna','nocturna','mixta','fines_de_semana','virtual'].includes(jornada) ||
      !['en_formacion','finalizada','inactiva'].includes(estado)) return res.status(400).json({ mensaje: 'Revisa los datos de la ficha.' });
  try {
    const [[fichaExistente]] = await pool.execute('SELECT id_ficha FROM fichas WHERE id_ficha = ?', [id]);
    if (!fichaExistente) return res.status(404).json({ mensaje: 'No se encontró la ficha.' });
    await pool.execute(
      `UPDATE fichas SET id_programa = ?, codigo = ?, jornada = ?, fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id_ficha = ?`,
      [idPrograma, codigo, jornada, fecha_inicio, fecha_fin || null, estado, id]
    );
    return res.json({ mensaje: 'Ficha actualizada.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una ficha con ese código.' });
    console.error('Error al editar ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo editar la ficha.' });
  }
});

app.delete('/api/fichas/:id/instructores/:idInstructor', requireAdmin, async (req, res) => {
  const idFicha = Number(req.params.id);
  const idInstructor = Number(req.params.idInstructor);
  if (!Number.isInteger(idFicha) || idFicha < 1 || !Number.isInteger(idInstructor) || idInstructor < 1) return res.status(400).json({ mensaje: 'Ficha o instructor inválido.' });
  try {
    const [result] = await pool.execute(
      'UPDATE ficha_instructores SET activo = 0, fecha_retiro = NOW() WHERE id_ficha = ? AND id_usuario_instructor = ? AND activo = 1',
      [idFicha, idInstructor]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'No se encontró una asignación activa.' });
    return res.json({ mensaje: 'Instructor retirado de la ficha. El historial se conservó.' });
  } catch (error) {
    console.error('Error al retirar instructor de ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo retirar al instructor de la ficha.' });
  }
});

app.delete('/api/instructor/cursos/:id', requireInstructor, async (req, res) => {
  const idCursoFicha = Number(req.params.id);
  if (!Number.isInteger(idCursoFicha) || idCursoFicha < 1) return res.status(400).json({ mensaje: 'Curso inválido.' });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[relacion]] = await connection.execute(
      `SELECT fc.id_ficha_curso FROM ficha_cursos fc INNER JOIN ficha_instructores fi ON fi.id_ficha = fc.id_ficha
       WHERE fc.id_ficha_curso = ? AND fi.id_usuario_instructor = ? AND fi.activo = 1 FOR UPDATE`,
      [idCursoFicha, req.session.usuario.id_usuario]
    );
    if (!relacion) { await connection.rollback(); return res.status(404).json({ mensaje: 'No encontré ese curso en tus fichas.' }); }
    await connection.execute("UPDATE ficha_cursos SET estado = 'inactivo' WHERE id_ficha_curso = ?", [idCursoFicha]);
    await connection.execute("UPDATE actividades SET estado = 'cerrada' WHERE id_ficha_curso = ? AND estado IN ('borrador','publicada')", [idCursoFicha]);
    await connection.commit();
    return res.json({ mensaje: 'Curso retirado de la ficha; sus actividades y entregas se conservaron.' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al retirar curso de ficha:', error.code || error.message);
    return res.status(503).json({ mensaje: 'No se pudo retirar el curso.' });
  } finally { connection.release(); }
});

app.listen(PORT, () => {
  console.log(`Servidor de DUAS+ escuchando en http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
