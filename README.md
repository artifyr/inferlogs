# Inferlogs

A modern, full-stack blogging platform built with a focus on performance, developer experience, and clean design. This application serves as a demonstration of building a content-focused web app using a modern tech stack.

## ✨ Features

- **Full-stack Architecture**: Leverages React for the frontend and Supabase for the backend, providing a seamless and integrated experience.
- **User Authentication**: Secure user sign-up and login functionality managed by Supabase Auth.
- **Content Management**:
  - A rich **Post Editor** for creating and updating blog entries.
  - An **Admin Dashboard** for a centralized view and management of all posts.
- **Dynamic Frontend**:
  - Built with **Vite** for lightning-fast development and builds.
  - **TypeScript** for robust, type-safe code.
- **Modern UI/UX**:
  - Styled with **Tailwind CSS** for a utility-first workflow.
  - Features a collection of reusable and accessible UI components from **shadcn/ui**.
  - Includes a **Search Modal** for easy content discovery.
- **Database Migrations**: Simple schema management with Drizzle ORM, executed via a TypeScript script.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & DB**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Linting**: [ESLint](https://eslint.org/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or higher)
- [Bun](https://bun.sh/) (optional, for package management)
- A [Supabase](https://supabase.com/) account

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd inferlogs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Set up environment variables:**
    - Create a `.env` file in the root of the project.
    - Add your Supabase project URL and anon key:
      ```
      VITE_SUPABASE_URL=your-supabase-project-url
      VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
      ```

4.  **Run database migrations:**
    - Ensure your Supabase database is running.
    - Execute the migration script to set up the required tables:
      ```bash
      npx tsx migrate.ts
      ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📂 Folder Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components (UI, layout, etc.)
│   ├── contexts/    # React contexts (e.g., AuthContext)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Core libraries and utilities (e.g., Supabase client)
│   ├── pages/       # Page components corresponding to routes
│   ├── types/       # TypeScript type definitions
│   ├── App.tsx      # Main app component with routing
│   └── main.tsx     # Application entry point
├── migrate.ts       # Database migration script
├── vite.config.ts   # Vite configuration
└── tailwind.config.ts # Tailwind CSS configuration
```