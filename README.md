# Copics - AI-Powered Copic Marker Color Analyzer

An AI-powered web application that analyzes artwork images and recommends specific Copic Sketch marker colors for coloring or recreating the artwork. Built as a portfolio project demonstrating full-stack development with modern web technologies.

## What It Does

1. **Upload artwork** - Users upload an image (line art, reference photo, etc.)
2. **AI analysis** - Claude AI analyzes the image and identifies color regions
3. **Color recommendations** - Returns specific Copic Sketch marker codes with hex previews
4. **Coloring game plan** - Generates step-by-step instructions optimized for left-handed users, following proper dark-to-light blending technique

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI primitives |
| Backend | Next.js API Routes (serverless) |
| Database | Convex (real-time backend) |
| Auth | Better Auth + Convex integration |
| AI | Anthropic Claude via Vercel AI SDK |
| Storage | AWS S3 (presigned URL uploads) |
| Notifications | Sonner (toast notifications) |

---

## Project Structure

```
copics/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   └── lib/                    # Utilities, types, AI logic
├── convex/                     # Convex backend (database + auth)
└── public/                     # Static assets
```

---

## Directory Reference

### `/src/app/` - Pages (App Router)

| Path | File | Purpose |
|------|------|---------|
| `/` | `page.tsx` | Landing page |
| `/new` | `page.tsx` | **Main feature** - Upload image, run analysis, view results |
| `/analyze/[id]` | `page.tsx` | View saved analysis, edit title, re-run, delete |
| `/history` | `page.tsx` | List all past analyses for the user |
| `/sign-in` | `page.tsx` | Authentication page |
| `/sign-up` | `page.tsx` | Registration page |

### `/src/app/api/` - API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Generate S3 presigned URL, create pending analysis record |
| `/api/analyze` | POST | Trigger AI analysis on an uploaded image |
| `/api/analyses` | GET | List analyses for authenticated user |
| `/api/analyses/[id]` | GET | Get single analysis |
| `/api/analyses/[id]` | PATCH | Update analysis name |
| `/api/analyses/[id]` | DELETE | **Cascade delete** - S3 image first, then DB record |
| `/api/auth/[...all]` | * | Better Auth catch-all handler |

### `/src/components/` - React Components

| File | Purpose |
|------|---------|
| `header.tsx` | App header with nav and user menu |
| `analysis-results.tsx` | Displays complete analysis (regions, tips, coloring plan) |
| `analysis-card.tsx` | Card preview for history list |
| `copic-color-card.tsx` | Renders color swatches with hex preview |
| `blending-tips.tsx` | Displays blending tips and overall tips |
| `upload-dropzone.tsx` | Drag-and-drop file upload component |
| `convex-provider.tsx` | Convex client provider wrapper |
| `ui/*.tsx` | Shadcn/ui primitives (Button, Card, Dialog, etc.) |

### `/src/lib/` - Core Logic

| File | Purpose |
|------|---------|
| `ai.ts` | **AI prompts and types** - System prompt, user prompt builder, result types, validation |
| `copic-data.ts` | **358 Copic Sketch colors** - Complete color database with codes, names, hex values, families |
| `s3.ts` | S3 utilities - presigned upload URLs, delete objects, extract keys from URLs |
| `auth-client.ts` | Better Auth client hooks (`useSession`, etc.) |
| `auth-server.ts` | Server-side auth utilities (`fetchAuthQuery`, `fetchAuthMutation`) |
| `types.ts` | Shared TypeScript types for analysis results |
| `utils.ts` | General utilities (`cn` for classnames) |

### `/convex/` - Backend (Convex)

| File | Purpose |
|------|---------|
| `schema.ts` | **Database schema** - `analyses` table definition |
| `analyses.ts` | **CRUD mutations/queries** - create, get, list, update, delete analyses |
| `auth.ts` | Auth configuration and `getCurrentUser` query |
| `auth.config.ts` | Better Auth provider config |
| `http.ts` | HTTP routes for auth callbacks |

---

## Data Flow

### Creating an Analysis

```
1. User selects image in /new
   │
2. POST /api/upload
   ├── Generate S3 presigned URL
   ├── Create analysis record (status: "pending")
   └── Return { uploadUrl, analysisId }
   │
3. Client uploads directly to S3
   │
4. POST /api/analyze { analysisId, options }
   ├── Update status → "analyzing"
   ├── Call Claude AI with image + prompt
   ├── Parse JSON response
   ├── Validate/correct Copic codes
   ├── Update status → "completed" + save result
   └── Return analysis result
   │
5. Client displays results with color swatches
```

### Deleting an Analysis (Cascade)

```
1. DELETE /api/analyses/[id]
   │
2. Fetch analysis record
   │
3. Extract S3 key from imageUrl
   │
4. Delete S3 object FIRST
   ├── If fails → return error (no orphaned images)
   └── If succeeds → continue
   │
5. Delete Convex database record
   │
6. Return success
```

---

## Key Features

### AI Analysis Options

Users can customize analysis with:
- **Ignore background** - Focus only on foreground subjects
- **Simplified analysis** - Fewer regions (3-4 max)
- **Skill level** - Beginner/Intermediate/Advanced (affects tip complexity)
- **Custom instructions** - Free-form text to guide AI

### Coloring Game Plan

The AI generates a step-by-step coloring plan that:
- Follows **dark-to-light blending** (proper Copic technique)
- Orders steps **right-to-left** (optimized for left-handed users)
- Includes drying times between adjacent regions
- Lists all materials needed with color swatches

### Color Validation

All AI-recommended colors are validated against the official Copic Sketch database (`copic-data.ts`). Invalid codes are auto-corrected to the nearest valid color.

---

## Database Schema

```typescript
// convex/schema.ts
analyses: {
  userId: string,              // Owner (from auth)
  imageName: string,           // Original filename
  name?: string,               // User-editable title
  imageStorageId?: Id<"_storage">,  // Legacy Convex storage
  imageUrl?: string,           // S3 URL (current)
  status: "pending" | "analyzing" | "completed" | "failed",
  options?: {                  // Analysis options used
    ignoreBackground?: boolean,
    simplifiedAnalysis?: boolean,
    skillLevel?: "beginner" | "intermediate" | "advanced" | "auto",
    customInstructions?: string,
  },
  result?: {                   // AI analysis output
    regions: [{
      name: string,
      description: string,
      primaryColor: { code, name, hexPreview, family },
      secondaryColors: [...],
      blendingTips: string[],
    }],
    overallTips: string[],
    difficultyLevel: "beginner" | "intermediate" | "advanced",
    coloringPlan?: {
      steps: [{ stepNumber, action, region, colors, waitAfter?, notes }],
      estimatedTime: string,
      materialsList: string[],
    },
  },
}
```

---

## AI Prompt Architecture

Located in `src/lib/ai.ts`:

1. **System Prompt** - Establishes Claude as a Copic marker expert, includes:
   - All 358 valid Copic Sketch codes by family
   - Dark-to-light blending technique explanation
   - Output formatting rules

2. **User Prompt Builder** - `buildUserPrompt(options)` dynamically constructs the prompt based on user options

3. **Response Validation** - `validateAndCorrectAnalysis()` checks all color codes against `copic-data.ts` and auto-corrects invalid ones

---

## Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# AI (Vercel AI Gateway)
AI_GATEWAY_API_KEY=

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start Convex backend (separate terminal)
npx convex dev

# Start Next.js dev server
npm run dev
```

---

## Design Decisions

1. **S3 over Convex Storage** - Presigned URLs allow direct client uploads, reducing server load
2. **Cascade delete order** - S3 first, then DB, to prevent orphaned images
3. **Color validation** - AI can hallucinate invalid codes; validation ensures all recommendations are purchasable
4. **Options persistence** - Saved with each analysis to re-contextualize results later
5. **Left-handed optimization** - Coloring plan orders steps right-to-left to prevent smudging

---

## File Quick Reference (for LLMs)

When working on this codebase:

| Task | Primary Files |
|------|---------------|
| Change AI behavior | `src/lib/ai.ts` |
| Modify analysis flow | `src/app/api/analyze/route.ts` |
| Update results UI | `src/components/analysis-results.tsx`, `src/app/new/page.tsx` |
| Change database schema | `convex/schema.ts`, `convex/analyses.ts` |
| Modify upload flow | `src/app/api/upload/route.ts`, `src/lib/s3.ts` |
| Update auth | `convex/auth.ts`, `src/lib/auth-client.ts`, `src/lib/auth-server.ts` |
| Add Copic colors | `src/lib/copic-data.ts` |
| Modify delete behavior | `src/app/api/analyses/[id]/route.ts` |
