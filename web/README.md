# Repaso Web

## Frontend

Frontend construido con Next.js 16, App Router, TypeScript y CSS.

### Requisitos

- Node.js 22 LTS
- pnpm 10.x
- Backend de Repaso corriendo (`repaso/api`)

---

### Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env.local

# Levantar en modo desarrollo
pnpm dev --port 3001
```

La app queda disponible en `http://localhost:3001`.

---

### Variables de entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Estructura de carpetas

```
src/
├── app/                               # App Router de Next.js
│   ├── (auth)/
│   │   ├── login/                     # Pagina de login
│   │   └── register/                  # Pagina de registro
│   ├── library/
│   │   └── [workspaceId]/
│   │       └── [projectId]/
│   │           └── [collectionId]/    # Flashcards
│   ├── study/
│   │   └── [collectionId]/            # Modo estudio
│   ├── stats/                         # Estadísticas
│   ├── search/                        # Búsqueda global
│   ├── profile/                       # Perfil de usuario
│   ├── layout.tsx                     # Layout raíz
│   └── page.tsx                       # Redirige a /login
│
├── components/
│   ├── ui/                            # Componentes base reutilizables
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── EmptyState/
│   │   ├── SearchBar/
│   │   ├── AppIconImg/
│   │   ├── IconPicker/
│   │   ├── InstallPrompt/
│   │   └── OfflineBanner/
│   ├── workspace/
│   │   ├── WorkspaceCard/
│   │   └── WorkspaceModal/
│   ├── project/
│   │   ├── ProjectCard/
│   │   └── ProjectModal/
│   ├── collection/
│   │   ├── CollectionCard/
│   │   └── CollectionModal/
│   ├── flashcard/
│   │   ├── FlashcardItem/
│   │   ├── FlashcardModal/
│   │   ├── ImportExportMenu/
│   │   └── ImportResultModal/
│   └── stats/
│       ├── StatCard/
│       ├── ActivityChart/
│       └── ResultsBreakdown/
│
├── contexts/
│   └── AuthContext.tsx               # Estado global de autenticación
│
├── hooks/
│   └── useAuth.ts                    # Re-exporta useAuth desde AuthContext
│
├── lib/                              # Clientes HTTP por dominio
│   ├── api.ts                        # Cliente HTTP base
│   ├── auth.ts                       # Auth endpoints
│   ├── workspaces.ts
│   ├── projects.ts
│   ├── collections.ts
│   ├── flashcards.ts
│   ├── reviews.ts
│   ├── stats.ts
│   ├── search.ts
│   ├── profile.ts
│   ├── import-export.ts
│   └── icons.ts                     # Registry de iconos SVG
│
├── styles/
│   ├── globals.css                  # Reset + estilos base
│   └── tokens.css                   # Design tokens (variables CSS)
│
└── middleware.ts                    # Protección de rutas
```

---

## Rutas

```
/                               → redirige a /login o /library
/login                          → formulario de login (pública)
/register                       → formulario de registro (pública)
/library                        → lista de workspaces (protegida)
/library/[wId]                  → lista de projects
/library/[wId]/[pId]            → lista de collections
/library/[wId]/[pId]/[cId]      → lista de flashcards
/study/[collectionId]           → modo estudio
/study/[collectionId]?mode=due  → solo pendientes
/stats                          → estadísticas globales
/search                         → búsqueda global
/profile                        → perfil y configuración
```

---

## Autenticación

El estado de autenticación vive en `AuthContext`:

- **Access token** — en memoria. Se pierde al recargar la página pero se recupera automáticamente via refresh token.
- **Refresh token** — en cookie httpOnly manejada por el backend. El browser la envía automáticamente.

Cuando inicia la app, `AuthContext` intenta recuperar la sesión llamando a `/auth/refresh`. Si hay una cookie válida, la sesión se restaura.

Las rutas protegidas se manejan en `src/middleware.ts`, si no hay cookie `refresh_token`, redirige a `/login`.

---

## Modo estudio

El modo estudio soporta dos variantes via query param:

```
/study/[collectionId]?mode=classic   → todas las flashcards
/study/[collectionId]?mode=due       → solo las pendientes hoy (SM-2)
```

#### Controles

- **Clic en la tarjeta** o **Espacio** → voltear
- **Otra vez** → AGAIN (vuelve al final del mazo)
- **Difícil** → HARD
- **Bien** → GOOD
- **Fácil** → EASY

---

## Import / Export

### Formato JSON

```json
{
  "collection": {
    "name": "Mi colección",
    "exportedAt": "2026-01-01T00:00:00.000Z",
    "totalCards": 2
  },
  "flashcards": [
    {
      "question": "¿Cuál es la capital de Francia?",
      "answer": "París",
      "tags": ["geografía"],
      "isFavorite": false,
      "isDifficult": false
    }
  ]
}
```

### Formato CSV

```
question,answer,tags,isFavorite,isDifficult
¿Capital de Francia?,París,geografía,0,0
¿Capital de Alemania?,Berlín,geografía,0,1
```

Los tags en CSV se separan con `|`. Ejemplo: `geografía|europa`.

---

## PWA

La app es instalable como PWA. El service worker se genera automáticamente en build de producción con `@ducanh2912/next-pwa`.

En desarrollo, el service worker está deshabilitado para no interferir con el hot reload.

Para probar la PWA:

```bash
pnpm build
pnpm start
```

---
