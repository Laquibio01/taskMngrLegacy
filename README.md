# Task Manager - Arquitectura MVC

Sistema de gestión de tareas completamente refactorizado con arquitectura Modelo-Vista-Controlador (MVC), backend en Node.js, frontend en React y base de datos MongoDB.

## 🏗️ Arquitectura

### Backend (Node.js + Express + MongoDB)
- **Arquitectura MVC**: Separación clara de responsabilidades
- **Modelos**: Mongoose schemas para todas las entidades
- **Controladores**: Lógica de negocio separada
- **Rutas**: Endpoints RESTful organizados por recurso
- **Middleware**: Autenticación JWT y validación de datos

### Frontend (React)
- **Componentes modulares**: Separación por funcionalidad
- **Diseño minimalista**: Interfaz limpia con color azul rey (#000080)
- **Estado local**: React hooks para gestión de estado
- **API Service**: Capa de abstracción para comunicación con backend

### Base de Datos (MongoDB)
- **Mongoose ODM**: Modelado de datos con validaciones
- **Índices**: Optimización de consultas
- **Relaciones**: Referencias entre documentos

## 📁 Estructura del Proyecto

```
legacyapp/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── projectController.js
│   │   ├── commentController.js
│   │   ├── historyController.js
│   │   ├── notificationController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Project.js
│   │   ├── Comment.js
│   │   ├── History.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── reportRoutes.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   └── tabs/
    │   │       ├── TasksTab.js
    │   │       ├── ProjectsTab.js
    │   │       ├── CommentsTab.js
    │   │       ├── HistoryTab.js
    │   │       ├── NotificationsTab.js
    │   │       ├── SearchTab.js
    │   │       └── ReportsTab.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. Inicializar datos de prueba (opcional):
```bash
node scripts/seedData.js
```

5. Iniciar servidor:
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Frontend

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar aplicación:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 Funcionalidades

### Autenticación
- Login con JWT
- Sesión persistente
- Protección de rutas

### Gestión de Tareas
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Estados: Pendiente, En Progreso, Completada, Bloqueada, Cancelada
- Prioridades: Baja, Media, Alta, Crítica
- Asignación a usuarios y proyectos
- Fechas de vencimiento
- Horas estimadas y reales

### Gestión de Proyectos
- CRUD completo
- Descripción de proyectos
- Relación con tareas

### Comentarios
- Comentarios por tarea
- Historial de comentarios
- Usuario y timestamp

### Historial
- Registro de cambios en tareas
- Acciones: CREATED, UPDATED, DELETED, STATUS_CHANGED, etc.
- Auditoría completa

### Notificaciones
- Notificaciones por usuario
- Tipos: task_assigned, task_updated, etc.
- Marcado como leído

### Búsqueda
- Búsqueda por texto
- Filtros: estado, prioridad, proyecto
- Resultados en tiempo real

### Reportes
- Reporte de tareas por estado
- Reporte de proyectos con conteo de tareas
- Reporte de usuarios con tareas asignadas
- Exportación a CSV

## 🔐 Credenciales por Defecto

Después de ejecutar `seedData.js`:
- **Usuario**: admin / **Contraseña**: admin
- **Usuario**: user1 / **Contraseña**: user1
- **Usuario**: user2 / **Contraseña**: user2

## 🛠️ Tecnologías Utilizadas

### Backend
- **Express.js**: Framework web
- **Mongoose**: ODM para MongoDB
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **express-validator**: Validación de datos
- **cors**: Habilitar CORS
- **dotenv**: Variables de entorno

### Frontend
- **React**: Biblioteca UI
- **Axios**: Cliente HTTP
- **CSS3**: Estilos personalizados

### Base de Datos
- **MongoDB**: Base de datos NoSQL

## 📋 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `GET /api/auth/users` - Listar usuarios

### Tareas
- `GET /api/tasks` - Listar todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/search` - Buscar tareas
- `GET /api/tasks/stats` - Estadísticas de tareas

### Proyectos
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Comentarios
- `GET /api/comments/task/:taskId` - Comentarios de una tarea
- `POST /api/comments` - Crear comentario
- `DELETE /api/comments/:id` - Eliminar comentario

### Historial
- `GET /api/history/task/:taskId` - Historial de una tarea
- `GET /api/history` - Todo el historial

### Notificaciones
- `GET /api/notifications` - Listar notificaciones
- `PUT /api/notifications/mark-read` - Marcar como leídas
- `DELETE /api/notifications/:id` - Eliminar notificación

### Reportes
- `GET /api/reports/tasks` - Reporte de tareas
- `GET /api/reports/projects` - Reporte de proyectos
- `GET /api/reports/users` - Reporte de usuarios
- `GET /api/reports/export/csv` - Exportar CSV

## 🎨 Diseño

El diseño sigue un estilo minimalista con:
- **Color principal**: Azul rey (#000080)
- **Tipografía**: Sans-serif moderna
- **Espaciado**: Generoso para legibilidad
- **Componentes**: Cards con sombras sutiles
- **Interactividad**: Transiciones suaves

## ✅ Buenas Prácticas Implementadas

1. **Separación de responsabilidades** (MVC)
2. **Validación de datos** en backend y frontend
3. **Manejo de errores** centralizado
4. **Autenticación segura** con JWT
5. **Código modular** y reutilizable
6. **Índices de base de datos** para optimización
7. **Variables de entorno** para configuración
8. **Código limpio** y comentado
9. **Estructura escalable**

## 📝 Notas

- Asegúrate de tener MongoDB corriendo antes de iniciar el backend
- El frontend se conecta automáticamente al backend en `http://localhost:3001`
- Para producción, cambia el `JWT_SECRET` y configura CORS apropiadamente
- Los datos se persisten en MongoDB, no en localStorage

## 🔄 Migración desde la versión legacy

La nueva arquitectura mantiene todas las funcionalidades de la versión anterior pero con:
- Base de datos real (MongoDB en lugar de localStorage)
- Autenticación segura
- API RESTful
- Interfaz moderna en React
- Código mantenible y escalable
