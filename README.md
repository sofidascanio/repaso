# Repaso

Repaso es una plataforma de estudio con flashcards inspirada en Anki y Quizlet, con soporte para repetición espaciada (algoritmo SM-2), estadísticas de progreso, búsqueda global, import/export y PWA.

---

### Estructura del proyecto

```
repaso/
├── api     # Backend (NestJS + Prisma + PostgreSQL)
└── web/    # Frontend (Next.js)
```

Los dos proyectos son independientes y se comunican via HTTP/REST.

---

### Arquitectura

```
┌────────────────────────────────────────┐
│        Browser                         │
│                                        │
│   Next.js App                          │
│   ├── App Router                       │
│   ├── AuthContext (JWT en memoria)     │
│   └── Service Worker (PWA)             │
│        │                               │
│        │ HTTP/REST                     │
│        ▼                               │
│   NestJS API                           │
│   ├── Guards (JWT)                     │
│   ├── Controllers                      │
│   ├── Services                         │
│   └── Prisma ORM                       │
│        │                               │
│        ▼                               │
│    PostgreSQL                          │
└────────────────────────────────────────┘
```

---

### Dominio

```
User
└── Workspace                # Materias (Ej: Matematica, Historia)
    └── Project              # Temas (Ej: Algebra, Guerra Fria)
        └── Collection       # Examenes (Ej: 'Tema 1', 'Practica 3')
            └── Flashcard    # Tarjetas (Pregunta + Respuesta)
                └── ReviewLog (historial SM-2)
```

---

### Funcionalidades

- **Autenticación** — registro, login, logout, refresh tokens, JWT
- **CRUD completo** — materias (workspaces), temas (projects), examenes (collections), flashcards
- **Repetición espaciada** — algoritmo SM-2 con historial de repasos
- **Modo estudio** — clásico y pendientes del día
- **Estadísticas** — racha, precisión, actividad, desglose por resultado
- **Búsqueda global** — materias, temas, examenes y flashcards
- **Import / Export** — JSON y CSV
- **Perfil** — editar nombre, cambiar password, eliminar cuenta
- **PWA** — instalable, offline básico
- **Íconos SVG** — registry central con Phosphor Icons

---

### Desarrollo local

Requisitos previos:

- Node.js 22 LTS
- pnpm 10.x
- PostgreSQL 16 instalado localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/sofidascanio/repaso

# 2. Levantar el backend
cd api
pnpm install
cp .env.example .env   # completar variables
pnpm prisma migrate dev
pnpm start:dev         # http://localhost:3000

# 3. Levantar el frontend (en otra terminal)
cd web
pnpm install
cp .env.example .env.local   # completar variables
pnpm dev --port 3001         # http://localhost:3001
```

---

### Documentación adicional

- [Backend: README](./api/README.md)
- [Frontend: README](./web/README.md)
- [Swagger UI](http://localhost:3000/docs) (solo en desarrollo)
