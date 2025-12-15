# Sapienza Foiling Team Website

<p align="center">
  <a href="https://www.sapienzafoilingteam.vercel.app/" target="_blank">
    <img src="public/logosft.png" alt="Sapienza Foiling Team Logo" width="200"/>
  </a>
</p>

<p align="center">
  The official website for the Sapienza Foiling Team, a university sailing team dedicated to designing and building sustainable foiling boats to compete in the SuMoth Challenge.
</p>

## 🌐 Live Website

You can visit the live website at: **[sapienzafoilingteam.vercel.app](https://www.sapienzafoilingteam.vercel.app/)**

## ✨ Key Features

-   **Responsive Design**: Fully optimized for a seamless experience on desktops, tablets, and mobile devices.
-   **Team Showcase**: Introduces the team's structure and its four main divisions.
-   **Boat Details**: Provides technical specifications and imagery of our innovative foiling boat.
-   **Blog**: Features articles and news to keep followers updated on our latest progress and events.
-   **Sponsorship Portal**: Outlines opportunities and benefits for potential sponsors and partners.
-   **Career Opportunities**: Lists open positions for students to join the team.
-   **Event Calendar**: Showcases upcoming competitions and team events.
-   **Contact System**: A direct communication channel for inquiries.
-   **Multilingual Support**: Content available in both English and Italian.
-   **Admin Dashboard**: Secure area for team members to manage blog posts, events, and job positions.

## 🛠 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) 14 (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend & DB:** [Supabase](https://supabase.io/) (Auth, PostgreSQL, Storage)
-   **Deployment:** [Vercel](https://vercel.com/) (with Analytics and Speed Insights)
-   **Testing:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/react/)
-   **Code Quality:** [ESLint](https://eslint.org/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🏗️ Project Structure

The repository is organized as a standard Next.js 14 application:

```bash
sapienza-foiling-team/
├── app/                          # Next.js App Router root
│   ├── admin/                    # Admin dashboard for managing content
│   ├── api/                      # API routes for backend functionality
│   │   ├── articles/             # Handles blog articles
│   │   ├── auth/                 # Handles authentication
│   │   ├── events/               # Handles team events
│   │   └── positions/            # Handles job positions
│   ├── auth/                     # Authentication page (login)
│   ├── blog/                     # Blog list and single article pages
│   ├── boat/                     # Boat details page
│   ├── career/                   # Career opportunities page
│   ├── contact/                  # Contact page
│   ├── privacy-policy/           # Privacy Policy page
│   ├── sponsor/                  # Sponsorship page
│   ├── team/                     # Team showcase page
│   ├── components/               # Reusable React components
│   ├── context/                  # React Context providers (Admin, Language)
│   ├── fonts/                    # Local font files
│   ├── lib/                      # Shared libraries, helpers, and Supabase clients
│   │   ├── supabase.ts           # Public Supabase client
│   │   ├── supabase-admin.ts     # Admin Supabase client (for backend use)
│   │   └── types.ts              # TypeScript type definitions
│   ├── translations/             # i18n translation files
│   ├── __tests__/                # Unit and integration tests
│   ├── layout.tsx                # Root application layout
│   └── page.tsx                  # Home page
├── public/                       # Static assets (images, logos, etc.)
├── supabase/                     # Supabase local development setup and migrations
├── .github/                      # GitHub Actions workflows
├── .eslintrc.json                # ESLint configuration
├── jest.config.ts                # Jest configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm (or yarn/pnpm)
-   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nannipy/sapienza-foiling-team.git
    cd sapienza-foiling-team
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of the project and add the following content:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-project-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-project-service-role-key
    ```
    You can find these keys in your Supabase project's dashboard under `Project Settings` > `API`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the code using ESLint to find and fix issues.
-   `npm run test`: Runs all tests using Jest.
-   `npm run test:watch`: Runs tests in interactive watch mode.
-   `npm run test:coverage`: Generates a test coverage report.

## ☁️ Infrastructure

-   **Supabase**: Used as the primary backend service.
    -   **Authentication**: Manages user sign-up, login, and sessions for the admin panel.
    -   **PostgreSQL Database**: Stores all dynamic data, including blog posts, events, and job applications.
    -   **Storage**: Hosts images and other media files.
-   **Vercel**: The platform for deploying and hosting the live website.
    -   **Vercel Analytics**: Provides insights into website traffic.
    -   **Vercel Speed Insights**: Monitors and helps optimize website performance.

## 🧪 Testing

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react/) for component and integration testing.

-   **Configuration files**: `jest.config.ts` and `jest.setup.ts`.
-   **Test files**: Located in `app/__tests__/`.
-   **Run tests**: Use the `npm run test` command to execute the test suite.

## 🤝 Contributing

We welcome contributions! Please read our contribution guidelines to get started.

1.  **Fork the repository.**
2.  **Create a feature branch:** `git checkout -b feature/your-amazing-feature`
3.  **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `git commit -m 'feat: Add some amazing feature'`
4.  **Push to the branch:** `git push origin feature/your-amazing-feature`
5.  **Open a Pull Request** to the `main` branch.

Please ensure your code follows the existing style, includes tests for new features, and updates documentation where necessary.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

-   **Email:** [sapienzafoilingteam@gmail.com](mailto:sapienzafoilingteam@gmail.com)
-   **Instagram:** [@sapienzafoilingteam](https://www.instagram.com/sapienzafoilingteam)
-   **LinkedIn:** [Sapienza Foiling Team](https://www.linkedin.com/company/sapienza-foiling-team)

---
Made with ⛵️ by the Sapienza Foiling Team.