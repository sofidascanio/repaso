# Repaso API

## Backend

API REST construida con NestJS, Prisma y PostgreSQL.

### Requisitos

- Node.js 22 LTS
- pnpm 10.x
- PostgreSQL 16

---

### Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env

# Crear la base de datos
psql -U postgres -c "CREATE DATABASE repaso_db;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE repaso_db TO tu_usuario;"

# Generar cliente Prisma
pnpm prisma generate

# Aplicar migraciones
pnpm prisma migrate dev --name init

# Levantar en modo desarrollo
pnpm start:dev
```

La API queda disponible en `http://localhost:3000/api`.
La documentación Swagger en `http://localhost:3000/docs`.

---

### Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```env
# Base de datos
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/repaso_db"

# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=                    # mínimo 32 caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=            # mínimo 32 caracteres, diferente al anterior
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3001
```

Para generar secrets seguros:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Estructura de carpetas

```
src/
├── auth/                    # Registro, login, refresh, logout
│   ├── dto/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/                    # Operaciones sobre usuarios
├── profile/                 # Perfil y configuración de cuenta
├── workspace/               # CRUD de workspaces
├── project/                 # CRUD de projects
├── collection/              # CRUD de collections
├── flashcard/               # CRUD de flashcards
├── review/                  # Spaced repetition (SM-2)
├── stats/                   # Estadísticas y progreso
├── search/                  # Búsqueda global
├── import-export/           # Import/Export JSON y CSV
├── prisma/                  # PrismaService (singleton global)
├── config/                  # Validación de variables de entorno
└── common/
    ├── filters/             # HttpExceptionFilter, AllExceptionsFilter
    ├── guards/              # JwtAuthGuard
    ├── decorators/          # @CurrentUser()
    ├── interceptors/        # LoggingInterceptor
    └── pipes/               # ParseCuidPipe
```

---

## Endpoints

### Auth

```
POST /api/auth/register     Registrar nuevo usuario
POST /api/auth/login        Iniciar sesión
POST /api/auth/refresh      Renovar access token
POST /api/auth/logout       Cerrar sesión
GET  /api/auth/me           Usuario autenticado
```

### Profile

```
GET    /api/profile              Obtener perfil
PATCH  /api/profile              Actualizar nombre/avatar
PATCH  /api/profile/password     Cambiar contraseña
DELETE /api/profile              Eliminar cuenta
```

### Workspaces

```
GET    /api/workspaces           Listar workspaces
POST   /api/workspaces           Crear workspace
GET    /api/workspaces/:id       Obtener workspace
PATCH  /api/workspaces/:id       Actualizar workspace
DELETE /api/workspaces/:id       Eliminar workspace
```

### Projects

```
GET    /api/workspaces/:id/projects    Listar projects
POST   /api/workspaces/:id/projects    Crear project
GET    /api/projects/:id               Obtener project
PATCH  /api/projects/:id               Actualizar project
DELETE /api/projects/:id               Eliminar project
```

### Collections

```
GET    /api/projects/:id/collections   Listar collections
POST   /api/projects/:id/collections   Crear collection
GET    /api/collections/:id            Obtener collection
PATCH  /api/collections/:id            Actualizar collection
DELETE /api/collections/:id            Eliminar collection
```

### Flashcards

```
GET    /api/collections/:id/flashcards          Listar flashcards
GET    /api/collections/:id/flashcards/study    Para modo estudio
POST   /api/collections/:id/flashcards          Crear flashcard
GET    /api/flashcards/:id                      Obtener flashcard
PATCH  /api/flashcards/:id                      Actualizar flashcard
DELETE /api/flashcards/:id                      Eliminar flashcard
```

### Reviews (SM-2)

```
POST /api/flashcards/:id/review        Registrar resultado de repaso
GET  /api/collections/:id/due          Flashcards pendientes hoy
```

### Stats

```
GET /api/stats/overview              Resumen general
GET /api/stats/collection/:id        Stats de una collection
```

### Search

```
GET /api/search?q=término            Búsqueda global
```

### Import / Export

```
GET  /api/collections/:id/export/json   Exportar como JSON
GET  /api/collections/:id/export/csv    Exportar como CSV
POST /api/collections/:id/import/json   Importar desde JSON
POST /api/collections/:id/import/csv    Importar desde CSV
```

---

## Autenticación

La API usa JWT con dos tokens:

- **Access token** — vida corta (15 min), se envía en el header `Authorization: Bearer <token>`
- **Refresh token** — vida larga (7 días), se guarda hasheado en base de datos y se envía como cookie httpOnly

#### Flujo de autenticación

```
1. POST /api/auth/register o /api/auth/login
   → Respuesta: { user, accessToken }
   → Cookie: refresh_token (httpOnly)

2. Cada request autenticado:
   → Header: Authorization: Bearer <accessToken>

3. Cuando el accessToken expira:
   → POST /api/auth/refresh (con la cookie automáticamente)
   → Respuesta: { accessToken } nuevo

4. POST /api/auth/logout
   → Limpia el refreshToken en DB y borra la cookie
```

---

## Algoritmo SM-2

El módulo de repetición espaciada implementa el algoritmo SM-2 de Anki.

#### Resultados posibles

| Resultado | Calidad | Efecto                                               |
| --------- | ------- | ---------------------------------------------------- |
| AGAIN     | 0       | Reinicia repeticiones, intervalo = 1 día             |
| HARD      | 2       | Reinicia repeticiones, reduce easeFactor             |
| GOOD      | 4       | Incrementa repeticiones e intervalo normalmente      |
| EASY      | 5       | Incrementa repeticiones e intervalo, sube easeFactor |

#### Fórmula

```
nuevo_intervalo = intervalo_anterior × easeFactor
easeFactor mínimo: 1.3
```

## Base de datos

### Diagrama de entidades

```
User ────────── Workspace
                    │
                 Project
                    │
                Collection
                    │
                Flashcard ──── ReviewLog
                                   │
                                  User
```

Las entidades principales (`Workspace`, `Project`, `Collection`, `Flashcard`, `User`) usan soft delete, al eliminar se setea `deletedAt` en lugar de borrar el registro. Todas las queries filtran por `deletedAt: null`.

### Migraciones

```bash
# Crear nueva migración
pnpm prisma migrate dev --name nombre_de_la_migracion

# Ver estado de migraciones
pnpm prisma migrate status

# Abrir Prisma Studio
pnpm prisma studio
```

---
