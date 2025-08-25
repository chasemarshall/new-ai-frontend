# AI Workbench

A contemporary minimalist AI workbench for chat, artifacts, and collaboration. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core UX
- **Fast, clean chat/workbench** with keyboard shortcuts (⌘K omni, ⇧D diff, ⌘S save)
- **Model switcher** with pinned parameters, token/cost estimator, run history
- **Artifact drawer** (right side): context without leaving the conversation
- **Zero-state helpers**, recent projects, quick actions, undo/redo

### Projects & Organizations
- **Organizations, projects, invites, roles** (owner, admin, editor, commenter, viewer)
- **Project home**: recent chats, artifacts, playbooks, KB sources
- **Audit log** (who/what/when), usage dashboard per org/project

### Artifacts & Versioning
- **Artifact types**: markdown, code, JSON, binary (file blob + sidecar)
- **Versions**: parent pointer, branches ("main" + ephemeral), tags
- **Structured diffs** (text + JSON patch), intraline highlight
- **Notes on each version** (user notes) + auto "what changed" summary
- **"Tap back in"**: rerun version with pinned model/params; compare outputs
- **Actions**: promote to main, revert to version, create branch from version
- **Link runs ↔ versions** (provenance), pin versions to messages

### Collaboration
- **Real-time presence** (avatars, cursors), comments & threads on versions
- **Review requests**, required approvals to merge to main (optional)
- **Notifications** (in-app + email/push), mention teammates

### Knowledge Base (RAG)
- **Add sources** (URLs, PDFs) — e.g., Xano docs, API refs
- **Ingestion** (fetch, clean, chunk), source status & retry
- **Search**: lexical → semantic (embeddings) with citations [1], [2]
- **"Attach context"** to a run (frozen snapshot of KB refs used)
- **KB collections per project**; allow private vs shared sources

### Playbooks (Proven Solutions)
- **Searchable, taggable markdown playbooks** (e.g., "Xano auth + retries")
- **Insert blocks/snippets** into chat or artifact
- **Tie playbooks to version templates** (pre-filled params, guardrails)

### Safety & Governance
- **BYOK to providers** (per-org keys), model allow/deny lists
- **PII redaction** in logs, retention policies, export/delete on demand
- **Rate-limits per user/org**, cost caps & alerts, abuse detection

### Integrations & API
- **Provider proxy** (OpenRouter first), webhooks (run.started/run.completed)
- **Import/export**: JSONL for chats, tarball for artifacts, ndjson for logs
- **CLI for CI hooks** (e.g., update artifact from repo, validate playbooks)

## Design Philosophy

**Contemporary Minimalist Interface Design (2020s-era)**

- **Reductive aesthetics** - Remove all non-essential visual elements
- **Functional primacy** - Every element serves a clear purpose
- **Spatial breathing** - Generous whitespace creates visual hierarchy
- **Progressive disclosure** - Complexity reveals itself only when needed

**Visual Language Parameters:**
- Color Palette: Pure binary (000000/FFFFFF) with opacity overlays
- Typography: Inter font family, weights 400-800, tracking-tight
- Border Radius: 16-24px (rounded-2xl/3xl) for primary elements
- Spacing Scale: 4px base unit, powers of 2 (4, 8, 16, 24, 32...)
- Opacity Values: 5%, 10%, 20% for layered transparency effects

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Code Highlighting**: React Syntax Highlighter
- **Diff Viewing**: React Diff Viewer
- **Real-time**: Socket.io
- **AI Integration**: OpenAI, Anthropic, LangChain

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_workbench"
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   OPENROUTER_API_KEY="your-openrouter-api-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development

- **Database Studio**: `npm run db:studio`
- **Build**: `npm run build`
- **Start Production**: `npm start`

## Project Structure

```
ai-frontend/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   │   ├── workbench/     # Main workbench interface
│   │   └── layout.tsx     # App layout
│   ├── api/               # API routes
│   │   ├── chat/          # Chat API
│   │   ├── artifacts/     # Artifact management
│   │   ├── kb/            # Knowledge base
│   │   └── playbooks/     # Playbook management
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── Button.tsx         # Button component
│   ├── Input.tsx          # Input component
│   ├── Card.tsx           # Card component
│   └── ...                # Other components
├── lib/                   # Utility functions
│   ├── utils.ts           # General utilities
│   ├── db.ts              # Database utilities
│   └── ...                # Other utilities
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── public/                # Static assets
```

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Organizations**: Multi-tenant organizations
- **Users**: User accounts with role-based access
- **Projects**: Projects within organizations
- **Artifacts**: Versioned content (markdown, code, JSON, etc.)
- **ArtifactVersions**: Version history with diffs
- **Runs**: AI model execution history
- **Playbooks**: Reusable solution templates
- **KbSources**: Knowledge base sources
- **KbChunks**: Chunked content for RAG
- **Conversations**: Chat conversations
- **StylePresets**: UI style presets

## API Endpoints

### Chat
- `POST /api/chat` - Send message to AI model
- `GET /api/chat` - Get chat history

### Artifacts
- `GET /api/artifacts` - List artifacts
- `POST /api/artifacts` - Create artifact
- `GET /api/artifacts/[id]` - Get artifact details
- `PUT /api/artifacts/[id]` - Update artifact
- `POST /api/artifacts/[id]/versions` - Create new version

### Knowledge Base
- `POST /api/kb/ingest` - Ingest new source
- `GET /api/kb/sources` - List sources
- `POST /api/kb/search` - Search knowledge base

### Playbooks
- `GET /api/playbooks` - List playbooks
- `POST /api/playbooks` - Create playbook

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Phase 1 (Current)
- [x] Basic chat interface
- [x] Model switcher
- [x] Artifact drawer
- [x] Contemporary minimalist design
- [ ] Database integration
- [ ] Basic artifact versioning

### Phase 2
- [ ] Real-time collaboration
- [ ] Knowledge base integration
- [ ] Playbook system
- [ ] Advanced diff viewing

### Phase 3
- [ ] Mobile app
- [ ] CLI tools
- [ ] Advanced governance features
- [ ] Enterprise integrations

## Support

For support, email support@aiworkbench.com or join our Discord community.
