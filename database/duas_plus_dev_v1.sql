-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-11-2026 a las 02:09:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `duas_plus_dev_v1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id_actividad` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_sesion_clase` int(10) UNSIGNED DEFAULT NULL,
  `id_creado_por` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `instrucciones` text NOT NULL,
  `tipo_actividad` enum('taller','evidencia','evaluacion','proyecto','otra') NOT NULL DEFAULT 'evidencia',
  `fecha_apertura` datetime DEFAULT NULL,
  `fecha_limite` datetime DEFAULT NULL,
  `permite_multiples_intentos` tinyint(1) NOT NULL DEFAULT 1,
  `estado` enum('borrador','publicada','cerrada') NOT NULL DEFAULT 'publicada',
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos`
--

CREATE TABLE `archivos` (
  `id_archivo` int(10) UNSIGNED NOT NULL,
  `id_subido_por` int(10) UNSIGNED NOT NULL,
  `proveedor_almacenamiento` varchar(50) DEFAULT NULL,
  `referencia_archivo` varchar(500) NOT NULL,
  `enlace_referencia` varchar(500) DEFAULT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `tipo_mime` varchar(120) DEFAULT NULL,
  `tamano_bytes` bigint(20) UNSIGNED DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avance_lecciones`
--

CREATE TABLE `avance_lecciones` (
  `id_avance_leccion` int(10) UNSIGNED NOT NULL,
  `id_leccion` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_usuario_instructor` int(10) UNSIGNED NOT NULL,
  `completada` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_completado` datetime DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendario_eventos`
--

CREATE TABLE `calendario_eventos` (
  `id_evento` int(10) UNSIGNED NOT NULL,
  `id_ficha` int(10) UNSIGNED DEFAULT NULL,
  `id_ficha_curso` int(10) UNSIGNED DEFAULT NULL,
  `id_usuario_propietario` int(10) UNSIGNED DEFAULT NULL,
  `id_creado_por` int(10) UNSIGNED NOT NULL,
  `alcance` enum('grupal','personal') NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo_evento` enum('clase','entrega','recordatorio','reunion','otro') NOT NULL DEFAULT 'clase',
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `todo_el_dia` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones_instructor`
--

CREATE TABLE `calificaciones_instructor` (
  `id_calificacion_instructor` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_ficha_instructor` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED DEFAULT NULL,
  `valoracion` varchar(50) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` int(10) UNSIGNED NOT NULL,
  `id_creado_por` int(10) UNSIGNED DEFAULT NULL,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_intento`
--

CREATE TABLE `evaluaciones_intento` (
  `id_evaluacion_intento` int(10) UNSIGNED NOT NULL,
  `id_intento_entrega` int(10) UNSIGNED NOT NULL,
  `id_usuario_instructor` int(10) UNSIGNED NOT NULL,
  `resultado` enum('aprobado','desaprobado') NOT NULL,
  `retroalimentacion` text DEFAULT NULL,
  `fecha_evaluacion` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichas`
--

CREATE TABLE `fichas` (
  `id_ficha` int(10) UNSIGNED NOT NULL,
  `id_programa` int(10) UNSIGNED NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `jornada` enum('diurna','nocturna','mixta','fines_de_semana','virtual') NOT NULL DEFAULT 'diurna',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('en_formacion','finalizada','inactiva') NOT NULL DEFAULT 'en_formacion',
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha_cursos`
--

CREATE TABLE `ficha_cursos` (
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_ficha` int(10) UNSIGNED NOT NULL,
  `id_curso` int(10) UNSIGNED NOT NULL,
  `nombre_visible` varchar(150) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('activo','finalizado','inactivo') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha_curso_instructores`
--

CREATE TABLE `ficha_curso_instructores` (
  `id_ficha_curso_instructor` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_ficha_instructor` int(10) UNSIGNED NOT NULL,
  `id_asignado_por` int(10) UNSIGNED NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha_instructores`
--

CREATE TABLE `ficha_instructores` (
  `id_ficha_instructor` int(10) UNSIGNED NOT NULL,
  `id_ficha` int(10) UNSIGNED NOT NULL,
  `id_usuario_instructor` int(10) UNSIGNED NOT NULL,
  `id_asignado_por` int(10) UNSIGNED NOT NULL,
  `rol_en_ficha` enum('titular','apoyo') NOT NULL DEFAULT 'titular',
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_retiro` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id_inscripcion` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_ficha` int(10) UNSIGNED NOT NULL,
  `id_registrado_por` int(10) UNSIGNED NOT NULL,
  `estado` enum('activa','finalizada','retiro') NOT NULL DEFAULT 'activa',
  `fecha_inscripcion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` datetime DEFAULT NULL,
  `motivo_cambio` varchar(255) DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intentos_entrega`
--

CREATE TABLE `intentos_entrega` (
  `id_intento_entrega` int(10) UNSIGNED NOT NULL,
  `id_actividad` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_archivo` int(10) UNSIGNED DEFAULT NULL,
  `numero_intento` smallint(5) UNSIGNED NOT NULL,
  `comentario_aprendiz` text DEFAULT NULL,
  `enlace_entrega` varchar(500) DEFAULT NULL,
  `fecha_entrega` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('enviado','en_revision','evaluado') NOT NULL DEFAULT 'enviado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lecciones`
--

CREATE TABLE `lecciones` (
  `id_leccion` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_creado_por` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `contenido` text DEFAULT NULL,
  `orden` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `duracion_minutos` smallint(5) UNSIGNED DEFAULT NULL,
  `publicada` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales_guias`
--

CREATE TABLE `materiales_guias` (
  `id_material` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_sesion_clase` int(10) UNSIGNED DEFAULT NULL,
  `id_archivo` int(10) UNSIGNED DEFAULT NULL,
  `id_creado_por` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo_material` enum('guia','lectura','video','recurso','enlace') NOT NULL DEFAULT 'guia',
  `enlace_referencia` varchar(500) DEFAULT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `observaciones_condicion_especial`
--

CREATE TABLE `observaciones_condicion_especial` (
  `id_observacion` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_usuario_administrador` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `observacion` text NOT NULL,
  `recomendacion_pedagogica` text DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias_accesibilidad`
--

CREATE TABLE `preferencias_accesibilidad` (
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `preset_visual_dua` enum('estandar','lectura_focalizada','alto_contraste','texto_ampliado','apoyo_visual','apoyo_auditivo') NOT NULL DEFAULT 'estandar',
  `modo_daltonismo` enum('ninguno','protanopia','deuteranopia','tritanopia','acromatopsia') NOT NULL DEFAULT 'ninguno',
  `tamano_fuente_px` tinyint(3) UNSIGNED NOT NULL DEFAULT 16,
  `zoom_porcentaje` smallint(5) UNSIGNED NOT NULL DEFAULT 100,
  `alto_contraste` tinyint(1) NOT NULL DEFAULT 0,
  `lupa_activa` tinyint(1) NOT NULL DEFAULT 0,
  `lector_voz_activo` tinyint(1) NOT NULL DEFAULT 0,
  `lectura_continua` tinyint(1) NOT NULL DEFAULT 0,
  `subtitulos_activos` tinyint(1) NOT NULL DEFAULT 0,
  `avatar_senas_activo` tinyint(1) NOT NULL DEFAULT 0,
  `modo_calma_activo` tinyint(1) NOT NULL DEFAULT 0,
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias_interfaz_usuario`
--

CREATE TABLE `preferencias_interfaz_usuario` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tema` enum('claro','oscuro','sistema') NOT NULL DEFAULT 'claro',
  `idioma` varchar(10) NOT NULL DEFAULT 'es',
  `notificaciones_correo` tinyint(1) NOT NULL DEFAULT 1,
  `notificaciones_calendario` tinyint(1) NOT NULL DEFAULT 1,
  `notificaciones_actividades` tinyint(1) NOT NULL DEFAULT 1,
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id_programa` int(10) UNSIGNED NOT NULL,
  `id_regional` smallint(5) UNSIGNED NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `tipo_oferta` enum('tecnico','tecnologia','curso_corto') NOT NULL,
  `modalidad` enum('presencial','virtual','mixta') NOT NULL DEFAULT 'presencial',
  `duracion_horas` smallint(5) UNSIGNED DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso_curso_aprendiz`
--

CREATE TABLE `progreso_curso_aprendiz` (
  `id_progreso_curso` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_usuario_aprendiz` int(10) UNSIGNED NOT NULL,
  `id_actualizado_por` int(10) UNSIGNED DEFAULT NULL,
  `porcentaje_avance` decimal(5,2) NOT NULL DEFAULT 0.00,
  `lecciones_completadas` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `lecciones_totales` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `estado` enum('no_iniciado','en_progreso','completado') NOT NULL DEFAULT 'no_iniciado',
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `regionales`
--

CREATE TABLE `regionales` (
  `id_regional` smallint(5) UNSIGNED NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `departamento` varchar(80) NOT NULL,
  `municipio` varchar(80) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` tinyint(3) UNSIGNED NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `codigo`, `nombre`, `creado_en`) VALUES
(1, 'administrador', 'Administrador', '2026-11-20 14:23:38'),
(2, 'instructor', 'Instructor', '2026-11-20 14:23:38'),
(3, 'aprendiz', 'Aprendiz', '2026-11-20 14:23:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_clase`
--

CREATE TABLE `sesiones_clase` (
  `id_sesion_clase` int(10) UNSIGNED NOT NULL,
  `id_ficha_curso` int(10) UNSIGNED NOT NULL,
  `id_creado_por` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `orden` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `fecha_programada` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('programada','publicada','archivada') NOT NULL DEFAULT 'programada',
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_rol` tinyint(3) UNSIGNED NOT NULL,
  `id_creado_por` int(10) UNSIGNED DEFAULT NULL,
  `tipo_documento` varchar(20) NOT NULL,
  `numero_documento` varchar(30) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `estado` enum('activo','inactivo','suspendido') NOT NULL DEFAULT 'activo',
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `idx_actividades_ficha_curso_estado` (`id_ficha_curso`,`estado`),
  ADD KEY `idx_actividades_sesion_clase` (`id_sesion_clase`),
  ADD KEY `idx_actividades_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `archivos`
--
ALTER TABLE `archivos`
  ADD PRIMARY KEY (`id_archivo`),
  ADD KEY `idx_archivos_subido_por` (`id_subido_por`);

--
-- Indices de la tabla `avance_lecciones`
--
ALTER TABLE `avance_lecciones`
  ADD PRIMARY KEY (`id_avance_leccion`),
  ADD UNIQUE KEY `uq_avance_lecciones_par` (`id_leccion`,`id_usuario_aprendiz`),
  ADD KEY `idx_avance_lecciones_aprendiz` (`id_usuario_aprendiz`,`completada`),
  ADD KEY `idx_avance_lecciones_instructor` (`id_usuario_instructor`);

--
-- Indices de la tabla `calendario_eventos`
--
ALTER TABLE `calendario_eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `idx_calendario_ficha_fecha` (`id_ficha`,`fecha_inicio`),
  ADD KEY `idx_calendario_ficha_curso_fecha` (`id_ficha_curso`,`fecha_inicio`),
  ADD KEY `idx_calendario_propietario_fecha` (`id_usuario_propietario`,`fecha_inicio`),
  ADD KEY `idx_calendario_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `calificaciones_instructor`
--
ALTER TABLE `calificaciones_instructor`
  ADD PRIMARY KEY (`id_calificacion_instructor`),
  ADD KEY `idx_calif_aprendiz` (`id_usuario_aprendiz`),
  ADD KEY `idx_calif_ficha_instructor` (`id_ficha_instructor`),
  ADD KEY `idx_calif_ficha_curso` (`id_ficha_curso`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`),
  ADD UNIQUE KEY `uq_cursos_codigo` (`codigo`),
  ADD KEY `idx_cursos_activo` (`activo`),
  ADD KEY `idx_cursos_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `evaluaciones_intento`
--
ALTER TABLE `evaluaciones_intento`
  ADD PRIMARY KEY (`id_evaluacion_intento`),
  ADD UNIQUE KEY `uq_evaluaciones_intento_unico` (`id_intento_entrega`),
  ADD KEY `idx_evaluaciones_instructor_resultado` (`id_usuario_instructor`,`resultado`);

--
-- Indices de la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`id_ficha`),
  ADD UNIQUE KEY `uq_fichas_codigo` (`codigo`),
  ADD KEY `idx_fichas_programa_estado` (`id_programa`,`estado`);

--
-- Indices de la tabla `ficha_cursos`
--
ALTER TABLE `ficha_cursos`
  ADD PRIMARY KEY (`id_ficha_curso`),
  ADD UNIQUE KEY `uq_ficha_cursos_par` (`id_ficha`,`id_curso`),
  ADD KEY `idx_ficha_cursos_curso` (`id_curso`),
  ADD KEY `idx_ficha_cursos_estado` (`estado`);

--
-- Indices de la tabla `ficha_curso_instructores`
--
ALTER TABLE `ficha_curso_instructores`
  ADD PRIMARY KEY (`id_ficha_curso_instructor`),
  ADD UNIQUE KEY `uq_ficha_curso_instructores_par` (`id_ficha_curso`,`id_ficha_instructor`),
  ADD KEY `idx_fci_ficha_instructor` (`id_ficha_instructor`,`activo`),
  ADD KEY `idx_fci_asignado_por` (`id_asignado_por`);

--
-- Indices de la tabla `ficha_instructores`
--
ALTER TABLE `ficha_instructores`
  ADD PRIMARY KEY (`id_ficha_instructor`),
  ADD UNIQUE KEY `uq_ficha_instructores_par` (`id_ficha`,`id_usuario_instructor`),
  ADD KEY `idx_ficha_instructores_instructor` (`id_usuario_instructor`,`activo`),
  ADD KEY `idx_ficha_instructores_asignado_por` (`id_asignado_por`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD KEY `idx_inscripciones_aprendiz_estado` (`id_usuario_aprendiz`,`estado`),
  ADD KEY `idx_inscripciones_ficha_estado` (`id_ficha`,`estado`),
  ADD KEY `idx_inscripciones_registrado_por` (`id_registrado_por`);

--
-- Indices de la tabla `intentos_entrega`
--
ALTER TABLE `intentos_entrega`
  ADD PRIMARY KEY (`id_intento_entrega`),
  ADD UNIQUE KEY `uq_intentos_entrega_numero` (`id_actividad`,`id_usuario_aprendiz`,`numero_intento`),
  ADD KEY `idx_intentos_aprendiz_estado` (`id_usuario_aprendiz`,`estado`),
  ADD KEY `idx_intentos_archivo` (`id_archivo`);

--
-- Indices de la tabla `lecciones`
--
ALTER TABLE `lecciones`
  ADD PRIMARY KEY (`id_leccion`),
  ADD KEY `idx_lecciones_ficha_curso_orden` (`id_ficha_curso`,`orden`),
  ADD KEY `idx_lecciones_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `materiales_guias`
--
ALTER TABLE `materiales_guias`
  ADD PRIMARY KEY (`id_material`),
  ADD KEY `idx_materiales_ficha_curso_publicado` (`id_ficha_curso`,`publicado`),
  ADD KEY `idx_materiales_sesion_clase` (`id_sesion_clase`),
  ADD KEY `idx_materiales_archivo` (`id_archivo`),
  ADD KEY `idx_materiales_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `observaciones_condicion_especial`
--
ALTER TABLE `observaciones_condicion_especial`
  ADD PRIMARY KEY (`id_observacion`),
  ADD KEY `idx_obs_aprendiz_activa` (`id_usuario_aprendiz`,`activa`),
  ADD KEY `idx_obs_administrador` (`id_usuario_administrador`);

--
-- Indices de la tabla `preferencias_accesibilidad`
--
ALTER TABLE `preferencias_accesibilidad`
  ADD PRIMARY KEY (`id_usuario_aprendiz`);

--
-- Indices de la tabla `preferencias_interfaz_usuario`
--
ALTER TABLE `preferencias_interfaz_usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id_programa`),
  ADD UNIQUE KEY `uq_programas_codigo` (`codigo`),
  ADD KEY `idx_programas_regional_oferta` (`id_regional`,`tipo_oferta`,`activo`);

--
-- Indices de la tabla `progreso_curso_aprendiz`
--
ALTER TABLE `progreso_curso_aprendiz`
  ADD PRIMARY KEY (`id_progreso_curso`),
  ADD UNIQUE KEY `uq_progreso_curso_par` (`id_ficha_curso`,`id_usuario_aprendiz`),
  ADD KEY `idx_progreso_aprendiz_estado` (`id_usuario_aprendiz`,`estado`),
  ADD KEY `idx_progreso_actualizado_por` (`id_actualizado_por`);

--
-- Indices de la tabla `regionales`
--
ALTER TABLE `regionales`
  ADD PRIMARY KEY (`id_regional`),
  ADD UNIQUE KEY `uq_regionales_codigo` (`codigo`),
  ADD KEY `idx_regionales_activa` (`activa`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uq_roles_codigo` (`codigo`);

--
-- Indices de la tabla `sesiones_clase`
--
ALTER TABLE `sesiones_clase`
  ADD PRIMARY KEY (`id_sesion_clase`),
  ADD KEY `idx_sesiones_ficha_curso_fecha` (`id_ficha_curso`,`fecha_programada`),
  ADD KEY `idx_sesiones_ficha_curso_orden` (`id_ficha_curso`,`orden`),
  ADD KEY `idx_sesiones_creado_por` (`id_creado_por`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuarios_documento` (`tipo_documento`,`numero_documento`),
  ADD UNIQUE KEY `uq_usuarios_correo` (`correo`),
  ADD KEY `idx_usuarios_rol_estado` (`id_rol`,`estado`),
  ADD KEY `idx_usuarios_creado_por` (`id_creado_por`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_actividad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `archivos`
--
ALTER TABLE `archivos`
  MODIFY `id_archivo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `avance_lecciones`
--
ALTER TABLE `avance_lecciones`
  MODIFY `id_avance_leccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calendario_eventos`
--
ALTER TABLE `calendario_eventos`
  MODIFY `id_evento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calificaciones_instructor`
--
ALTER TABLE `calificaciones_instructor`
  MODIFY `id_calificacion_instructor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_intento`
--
ALTER TABLE `evaluaciones_intento`
  MODIFY `id_evaluacion_intento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fichas`
--
ALTER TABLE `fichas`
  MODIFY `id_ficha` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ficha_cursos`
--
ALTER TABLE `ficha_cursos`
  MODIFY `id_ficha_curso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ficha_curso_instructores`
--
ALTER TABLE `ficha_curso_instructores`
  MODIFY `id_ficha_curso_instructor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ficha_instructores`
--
ALTER TABLE `ficha_instructores`
  MODIFY `id_ficha_instructor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id_inscripcion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `intentos_entrega`
--
ALTER TABLE `intentos_entrega`
  MODIFY `id_intento_entrega` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lecciones`
--
ALTER TABLE `lecciones`
  MODIFY `id_leccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materiales_guias`
--
ALTER TABLE `materiales_guias`
  MODIFY `id_material` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `observaciones_condicion_especial`
--
ALTER TABLE `observaciones_condicion_especial`
  MODIFY `id_observacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id_programa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `progreso_curso_aprendiz`
--
ALTER TABLE `progreso_curso_aprendiz`
  MODIFY `id_progreso_curso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `regionales`
--
ALTER TABLE `regionales`
  MODIFY `id_regional` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sesiones_clase`
--
ALTER TABLE `sesiones_clase`
  MODIFY `id_sesion_clase` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `fk_actividades_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actividades_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actividades_sesion_clase` FOREIGN KEY (`id_sesion_clase`) REFERENCES `sesiones_clase` (`id_sesion_clase`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `archivos`
--
ALTER TABLE `archivos`
  ADD CONSTRAINT `fk_archivos_subido_por` FOREIGN KEY (`id_subido_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `avance_lecciones`
--
ALTER TABLE `avance_lecciones`
  ADD CONSTRAINT `fk_avance_lecciones_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_avance_lecciones_instructor` FOREIGN KEY (`id_usuario_instructor`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_avance_lecciones_leccion` FOREIGN KEY (`id_leccion`) REFERENCES `lecciones` (`id_leccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `calendario_eventos`
--
ALTER TABLE `calendario_eventos`
  ADD CONSTRAINT `fk_calendario_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendario_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendario_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calendario_propietario` FOREIGN KEY (`id_usuario_propietario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `calificaciones_instructor`
--
ALTER TABLE `calificaciones_instructor`
  ADD CONSTRAINT `fk_calif_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calif_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calif_ficha_instructor` FOREIGN KEY (`id_ficha_instructor`) REFERENCES `ficha_instructores` (`id_ficha_instructor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_cursos_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluaciones_intento`
--
ALTER TABLE `evaluaciones_intento`
  ADD CONSTRAINT `fk_evaluaciones_instructor` FOREIGN KEY (`id_usuario_instructor`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evaluaciones_intento_entrega` FOREIGN KEY (`id_intento_entrega`) REFERENCES `intentos_entrega` (`id_intento_entrega`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD CONSTRAINT `fk_fichas_programa` FOREIGN KEY (`id_programa`) REFERENCES `programas` (`id_programa`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ficha_cursos`
--
ALTER TABLE `ficha_cursos`
  ADD CONSTRAINT `fk_ficha_cursos_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ficha_cursos_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ficha_curso_instructores`
--
ALTER TABLE `ficha_curso_instructores`
  ADD CONSTRAINT `fk_fci_asignado_por` FOREIGN KEY (`id_asignado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fci_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fci_ficha_instructor` FOREIGN KEY (`id_ficha_instructor`) REFERENCES `ficha_instructores` (`id_ficha_instructor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ficha_instructores`
--
ALTER TABLE `ficha_instructores`
  ADD CONSTRAINT `fk_ficha_instructores_asignado_por` FOREIGN KEY (`id_asignado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ficha_instructores_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ficha_instructores_instructor` FOREIGN KEY (`id_usuario_instructor`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripciones_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_registrado_por` FOREIGN KEY (`id_registrado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `intentos_entrega`
--
ALTER TABLE `intentos_entrega`
  ADD CONSTRAINT `fk_intentos_actividad` FOREIGN KEY (`id_actividad`) REFERENCES `actividades` (`id_actividad`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_intentos_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_intentos_archivo` FOREIGN KEY (`id_archivo`) REFERENCES `archivos` (`id_archivo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `lecciones`
--
ALTER TABLE `lecciones`
  ADD CONSTRAINT `fk_lecciones_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lecciones_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `materiales_guias`
--
ALTER TABLE `materiales_guias`
  ADD CONSTRAINT `fk_materiales_archivo` FOREIGN KEY (`id_archivo`) REFERENCES `archivos` (`id_archivo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materiales_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materiales_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materiales_sesion_clase` FOREIGN KEY (`id_sesion_clase`) REFERENCES `sesiones_clase` (`id_sesion_clase`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `observaciones_condicion_especial`
--
ALTER TABLE `observaciones_condicion_especial`
  ADD CONSTRAINT `fk_obs_administrador` FOREIGN KEY (`id_usuario_administrador`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_obs_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferencias_accesibilidad`
--
ALTER TABLE `preferencias_accesibilidad`
  ADD CONSTRAINT `fk_pref_accesibilidad_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `preferencias_interfaz_usuario`
--
ALTER TABLE `preferencias_interfaz_usuario`
  ADD CONSTRAINT `fk_pref_interfaz_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `programas`
--
ALTER TABLE `programas`
  ADD CONSTRAINT `fk_programas_regional` FOREIGN KEY (`id_regional`) REFERENCES `regionales` (`id_regional`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `progreso_curso_aprendiz`
--
ALTER TABLE `progreso_curso_aprendiz`
  ADD CONSTRAINT `fk_progreso_actualizado_por` FOREIGN KEY (`id_actualizado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_progreso_aprendiz` FOREIGN KEY (`id_usuario_aprendiz`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_progreso_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `sesiones_clase`
--
ALTER TABLE `sesiones_clase`
  ADD CONSTRAINT `fk_sesiones_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sesiones_ficha_curso` FOREIGN KEY (`id_ficha_curso`) REFERENCES `ficha_cursos` (`id_ficha_curso`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_creado_por` FOREIGN KEY (`id_creado_por`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Cuenta ficticia para demostracion local. Cambia esta clave antes de cualquier uso real.
INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `id_creado_por`, `tipo_documento`, `numero_documento`, `nombres`, `apellidos`, `correo`, `contrasena_hash`, `telefono`, `estado`)
VALUES (1, 1, NULL, 'DEMO', 'DEMO-ADMIN-001', 'Admin', 'Demostracion', 'admin@duas.local', '$2b$10$7G.ZLN3veH4KK4sX9ZOePe.mptKJ9AKEWWPIG6TrDODuPsmQLbwx2', NULL, 'activo');
