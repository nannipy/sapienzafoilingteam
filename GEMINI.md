# Sapienza Foiling Team Website - Project Context for Gemini

This document provides a comprehensive overview of the Sapienza Foiling Team Website project, intended to serve as instructional context for the Gemini AI agent.

## Project Overview

The Sapienza Foiling Team website is the digital hub for a university sailing team focused on designing and constructing sustainable foiling boats. The project emphasizes innovation and environmental responsibility, with the team participating in the SuMoth Challenge.

It is a modern web application built with:
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, PostCSS, @tailwindcss/typography
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Backend/Database:** Supabase (Authentication, PostgreSQL Database, Storage)
*   **Deployment/Analytics:** Vercel Analytics, Vercel Speed Insights
*   **Testing:** Jest, React Testing Library, TS-Jest
*   **Code Quality:** ESLint

The architecture follows a typical Next.js application structure, with API routes, dedicated pages for different sections (blog, contact, fleet, etc.), reusable components, and Supabase integration for backend services.

## Building and Running

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nannipy/sapienza-foiling-team.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd sapienza-foiling-team
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a local environment file:**
    ```bash
    cp .env.example .env.local
    ```
    *Note: Populate `.env.local` with your Supabase project credentials.*

### Available Scripts

*   `npm run dev`: Starts the development server with Turbopack.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs ESLint for code quality checks.
*   `npm run test`: Runs all Jest tests.
*   `npm run test:watch`: Runs Jest tests in watch mode.
*   `npm run test:coverage`: Runs Jest tests and generates a coverage report.

## Development Conventions

### Component Structure

*   Use functional components with TypeScript.
*   Implement proper type definitions for props and state.
*   Follow the established folder structure within `app/components/`.
*   Utilize Tailwind CSS for styling.

### Styling Guidelines

*   Prefer Tailwind CSS utility classes for styling.
*   Adhere to the color scheme defined in `tailwind.config.js`.
*   Ensure responsive design principles are applied for various screen sizes.
*   Use custom color variables defined in `tailwind.config.js` for consistency.

### Testing

*   The project uses Jest as the test runner and React Testing Library for testing React components.
*   Configuration files: `jest.config.ts` and `jest.setup.ts`.
*   Test files are located in `app/__tests__/` and can also be placed alongside components (e.g., `ComponentName.test.tsx`).

### Contributing

*   Fork the repository.
*   Create a feature branch (`git checkout -b feature/YourFeature`).
*   Commit changes using conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
*   Push to the branch and open a Pull Request to the `main` branch.
*   Follow existing code style, write clear commit messages, update documentation, and ensure thorough testing.
*   Create an issue for major changes or new features before starting work.
