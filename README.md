# DUAS+

Plataforma DUAS+ para administrar programas, fichas, instructores, aprendices, clases y progreso.

## Requisitos

- Node.js instalado.
- XAMPP con Apache y MySQL iniciados.

## Preparar la base de datos

1. Abre `http://localhost/phpmyadmin`.
2. Crea una base de datos llamada `duas_plus_dev_v1` con cotejamiento `utf8mb4_unicode_ci`.
3. Selecciona esa base, entra en **Importar**, elige `database/duas_plus_dev_v1.sql` y pulsa **Importar**.
4. En phpMyAdmin, confirma que aparezcan las tablas y el usuario de demostración.

La copia incluida tiene la estructura de las tablas y un único usuario ficticio para probar el acceso. No contiene los datos personales de tu base local.

## Iniciar la plataforma en Windows

Abre dos terminales en Visual Studio Code, dentro de la carpeta del proyecto.

**Terminal 1 — servidor y conexión con MySQL:**

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
node index.js
```

Si ya existe `backend/.env`, no hace falta copiarlo otra vez. Para XAMPP normalmente puedes dejar los valores del ejemplo. Si configuraste una contraseña para MySQL, escribe esa contraseña en `backend/.env` en `DB_PASSWORD`.

**Terminal 2 — plataforma web:**

```powershell
npm.cmd install
npm.cmd run dev
```

Abre la dirección local que muestra Vite, normalmente `http://127.0.0.1:5173`.

## Acceso de demostración

- Correo: `admin@duas.local`
- Contraseña: `DuasDemo2026!`

Esta cuenta es solo para la demostración local. Cámbiala y configura credenciales privadas antes de publicar el sistema para uso real. Nunca subas archivos `.env` ni una exportación con datos personales.
