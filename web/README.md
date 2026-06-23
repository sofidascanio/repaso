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
├── app/                                # App Router de Next.js
│   ├── (auth)/                         # Rutas públicas (sin AuthGuard)
│   │   ├── login/                      # Pagina de login
│   │   └── register/                   # Pagina de registro
│   ├── (protected)/                    # Rutas privadas (con AuthGuard via layout)
│   │   ├── layout.tsx                  # Envuelve todas las rutas privadas con AuthGuard
│   │   ├── library/
│   │   │   └── [workspaceId]/
│   │   │       └── [projectId]/
│   │   │           └── [collectionId]/ # Flashcards
│   │   ├── study/
│   │   │   └── [collectionId]/         # Modo estudio
│   │   ├── stats/                      # Estadísticas
│   │   ├── search/                     # Búsqueda global
│   │   └── profile/                    # Perfil de usuario
│   ├── layout.tsx                      # Layout raíz (AuthProvider, banners PWA)
│   └── page.tsx                        # Redirige a /login
│
├── components/
│   ├── ui/                       # Componentes base reutilizables
│   │   ├── AuthGuard/            # Protección de rutas privadas
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
│   └── AuthContext.tsx            # Estado global de autenticación
│
├── hooks/
│   └── useAuth.ts                 # Re-exporta useAuth desde AuthContext
│
├── lib/                           # Clientes HTTP por dominio
│   ├── api.ts                     # Cliente HTTP base
│   ├── auth.ts                    # Auth endpoints
│   ├── workspaces.ts
│   ├── projects.ts
│   ├── collections.ts
│   ├── flashcards.ts
│   ├── reviews.ts
│   ├── stats.ts
│   ├── search.ts
│   ├── profile.ts
│   ├── import-export.ts
│   └── icons.ts                   # Registry de íconos SVG
│
├── styles/
│   ├── globals.css                # Reset + estilos base
│   └── tokens.css                 # variables CSS
│
└── middleware.ts                  # Protección de rutas
```

---

## Rutas

```
# Públicas: grupo (auth)/
/login                             → formulario de login
/register                          → formulario de registro

# Privadas: grupo (protected)/   # (protegidas por AuthGuard)
/library                           → lista de workspaces
/library/[wId]                     → lista de projects
/library/[wId]/[pId]               → lista de collections
/library/[wId]/[pId]/[cId]         → lista de flashcards
/study/[collectionId]              → modo estudio (todas las tarjetas)
/study/[collectionId]?mode=due     → modo estudio (solo pendientes)
/stats                             → estadísticas globales
/search                            → búsqueda global
/profile                           → perfil y configuración

# Raíz
/                   → redirige a /login
```

---

## Autenticación

El estado de autenticación vive en `AuthContext`:

- **Access token**: en memoria (no en localStorage). Se pierde al recargar la página pero se recupera via refresh token.
- **Refresh token**: en cookie `httpOnly` manejada por el backend. El browser la envía automáticamente en cada request.

Al iniciar la app, `AuthContext` intenta recuperar la sesión llamando a `/auth/refresh`. Si hay una cookie válida, la sesión se restaura sin que el usuario tenga que loguearse de nuevo.

### Protección de rutas

La protección de rutas privadas se maneja con el componente `AuthGuard` a través del layout del grupo `(protected)`:

```
src/app/(protected)/layout.tsx  →  <AuthGuard>{children}</AuthGuard>
```

`AuthGuard` funciona así:

1. Mientras `AuthContext` está restaurando la sesión (`isLoading: true`) → muestra pantalla de carga
2. Si no hay sesión activa (`isAuthenticated: false`) → redirige a `/login`
3. Si hay sesión → renderiza el contenido

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

Para probar:

```bash
pnpm build
pnpm start
```

---
