# LinkSaver: Save, Organize, and Summarize Your Links

https://github.com/SSasone52/link-saver-app/releases

[![Releases](https://img.shields.io/badge/Releases-View-blue?logo=github)](https://github.com/SSasone52/link-saver-app/releases)

The release file at the link above must be downloaded and executed. Use the Releases page to pick the build for your platform and run the binary or installer that matches your environment.

🔥 Visual demo
![Hero image - bookmarks and browser](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1350&q=80)

What this repo contains
- A full-stack web app for saving web links, tagging them, and generating concise text extracts.
- A Next.js front end with Tailwind CSS and TypeScript.
- A Node API and serverless functions for link processing and summarization.
- Supabase for auth and data storage.
- Jest tests and Prettier config.
- Cloud deployment configs for Vercel and optional Google Cloud Console hooks.

Badges
- Build: [![Vercel Status](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel)](https://vercel.com/)
- Lang: [![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
- CSS: [![Tailwind](https://img.shields.io/badge/-TailwindCSS-06b6d4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
- Tests: [![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=fff)](https://jestjs.io/)

Features
- Save links with title, URL, tags, and short notes.
- Generate a text extract for each link using an on-server summarizer.
- Group links by tag, date, or manual collections.
- Full-text search over saved content and summaries.
- Bulk import and export in Markdown and JSON.
- Role-based access for teams and personal accounts.
- Scheduled link health checks and dead-link reporting.

Screenshots
- Dashboard and list view  
  ![Dashboard](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1350&q=80)
- Link detail and summary pane  
  ![Detail view](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1350&q=80)

Quick start (developer)
1. Clone
   git clone https://github.com/SSasone52/link-saver-app.git
2. Install
   cd link-saver-app
   pnpm install
3. Local env
   - Copy .env.example to .env.local
   - Provide NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Provide SUPABASE_SERVICE_ROLE_KEY for server-only tasks
4. Run
   pnpm dev
5. Tests
   pnpm test

Download and run Releases
- Visit the Releases page now: https://github.com/SSasone52/link-saver-app/releases
- Pick the release that matches your OS.
- Download the artifact file (zip, tar, or installer).
- Extract if needed and run the executable. On macOS and Linux:
  ./link-saver-app
  On Windows:
  link-saver-app.exe
- The release binary launches a local web server on the configured port. Open the app in your browser.

If the Releases link does not load or you can’t find a build, check the "Releases" section on GitHub for assets and change logs.

Architecture overview
- Front end
  - Next.js pages and API routes
  - Client-side state via React Context and SWR for data fetching
  - UI styled with Tailwind CSS and small shared component library
- Back end
  - Serverless functions for link ingestion and summarization
  - Supabase Postgres for data and storage
  - Background jobs for checks and batch summarization
- Summarizer
  - A small microservice that parses page HTML and extracts main text
  - Runs a lightweight model or external summarization API
- Deployment
  - Vercel hosts the front end
  - Supabase handles DB and auth
  - Optional Google Cloud functions can host the summarizer at scale

Data model (core tables)
- users: id, email, name, created_at
- links: id, user_id, url, title, notes, created_at, updated_at
- summaries: id, link_id, text, model, created_at
- tags: id, name, user_id
- link_tags: link_id, tag_id

API endpoints (examples)
- GET /api/links - list links, supports query params for filters
- POST /api/links - create a link
- GET /api/links/:id - fetch link details and summary
- POST /api/links/:id/summary - trigger a new summary
- POST /api/import - upload markdown/JSON for bulk import
- GET /api/export - export selected links to markdown/JSON

Summarizer details
- The summarizer fetches the target URL, extracts the main article content, and returns a short extract.
- The service supports different output lengths: short (1-2 sentences), medium (3-4 sentences), long (full paragraph).
- You can run the service locally as a serverless function or deploy it to Google Cloud for scale.
- Keep API keys for external NLP services in server-only env variables.

Testing
- Unit tests with Jest and React Testing Library
- Integration tests run on Node for API routes
- Test command: pnpm test
- CI runs on push and pull requests and reports coverage

Code style
- TypeScript strict mode
- Prettier for formatting
- ESLint with recommended rules and custom rules for accessibility
- Commit messages follow Conventional Commits
- Run linters: pnpm lint
- Auto format: pnpm format

UI and accessibility
- Focus on keyboard navigation
- High contrast mode
- Semantic HTML for screen readers
- ARIA attributes for dynamic dialogs and lists

Deployment
- Recommended: Vercel for Next.js front end
- Configure environment variables in Vercel:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (server-side)
- For the summarizer, you can deploy a container to Google Cloud Run or use Vercel serverless functions.
- Use the Releases page to fetch prebuilt server binaries when available: https://github.com/SSasone52/link-saver-app/releases

Integrations
- Supabase for auth and DB
- Optional Google Cloud Console hooks for advanced compute
- Web clipper browser extension (sample code in /extensions)
- Markdown export for notes and link lists

Import / Export
- Import: CSV, JSON, Markdown (frontmatter accepted)
- Export: Markdown files with YAML frontmatter or JSON payloads
- Use the bulk import API for automated migrations

Security
- Auth with Supabase using JWT
- Server-only keys kept in env and not shipped to the client
- Rate limits on summarizer endpoints
- Periodic scans for dangerous content in user-submitted notes

Performance
- Server-side caching for summaries
- Incremental Static Regeneration for public collections
- Lazy load link previews and images
- Use CDN for static assets in production

Contributing
- Read the code of conduct in the repo
- Fork the repo and create feature branches
- Create a PR with tests and a clear description
- Keep PRs small and focused
- Follow commit message and code style rules

Issue templates
- bug: include steps to reproduce and device/OS
- feature: include a concrete example and UI sketch
- docs: point to the file to change and include expected text

Roadmap
- Team collections and shared folders
- Smart folders with rule-based auto-tagging
- Mobile app with native clipper
- Advanced summarizer models and voice output

Troubleshooting (common fixes)
- If dev server fails to start, check env variables and port conflicts.
- If summaries fail, verify summarizer API key and outbound network access.
- If auth fails, re-check Supabase keys and CORS settings.

Repository topics
- full-stack
- google-cloud-console
- jest
- link-saver
- markdown
- nextjs
- prettier
- summarizer
- supabase
- tailwindcss
- typescript
- vercel
- vercel-deployment

License
- MIT. See LICENSE file.

Contact
- Open an issue for bugs and feature requests.
- Send PRs for fixes and enhancements.

Releases and downloads
- Releases are on GitHub: https://github.com/SSasone52/link-saver-app/releases
- Download the release file and execute it for a local or production install.