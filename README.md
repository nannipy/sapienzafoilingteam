# Sapienza Foiling Team Website

<p align="center">
  <a href="https://www.sapienzafoilingteam.com/" target="_blank">
    <img src="public/logosft.png" alt="Sapienza Foiling Team Logo" width="200"/>
  </a>
</p>

<p align="center">
  The official website for the Sapienza Foiling Team, a university sailing team dedicated to designing and building sustainable foiling boats to compete in the SuMoth Challenge.
</p>

## 🌐 Live Website

You can visit the live website at: **[sapienzafoilingteam.com](https://www.sapienzafoilingteam.com/)**

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
-   **Admin Dashboard**: Secure area for team members to manage blog posts, events, and job positions, now powered by React Server Actions.
-   **Advanced Analytics**: Real-time performance and user engagement tracking with PostHog and Vercel Analytics.
-   **Security First**: Implemented robust sanitization and security policies to protect the platform.

## 🛠 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) 16 (with App Router and Turbopack)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Library:** [React](https://react.dev/) 19
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) 3.4 (with PostCSS)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend & DB:** [Supabase](https://supabase.io/) (Auth, PostgreSQL, Storage)
-   **Analytics:** [PostHog](https://posthog.com/), [Vercel Analytics](https://vercel.com/analytics)
-   **Deployment:** [Vercel](https://vercel.com/) (with Speed Insights)
-   **Testing:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/react/)
-   **Code Quality:** [ESLint](https://eslint.org/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🏗️ Project Structure

The repository is organized as a standard Next.js 16 application:

```bash
sapienza-foiling-team/
├── app/                          # Next.js App Router root
│   ├── admin/                    # Admin dashboard for managing content
│   ├── api/                      # API routes (Legacy and specific integrations)
│   ├── auth/                     # Authentication pages
│   ├── blog/                     # Blog list and single article pages
│   ├── boat/                     # Boat details page
│   ├── career/                   # Career opportunities page
│   ├── contact/                  # Contact page
│   ├── sponsor/                  # Sponsorship page
│   ├── team/                     # Team showcase page
│   ├── components/               # Reusable React components (PageHero, HeroSection, etc.)
│   ├── context/                  # React Context providers (Language, PHProvider)
│   ├── lib/                      # Shared modules, Supabase clients, and Server Actions
│   ├── translations/             # i18n translation files
│   ├── __tests__/                # Unit and integration tests
│   ├── layout.tsx                # Root application layout with PHProvider and Analytics
│   └── page.tsx                  # Home page
├── public/                       # Static assets (images, logos, etc.)
├── supabase/                     # Supabase migrations and configuration
├── .github/                      # CI/CD workflows
├── SECURITY.md                   # Security policy and reporting
├── privacy.md                    # Privacy policy
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher, recommended v20+)
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
    Create a `.env.local` file in the root and add:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
    NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Creates an optimized production build.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint for code quality.
-   `npm run test`: Runs the test suite with Jest.

## 🧪 Testing & Quality

We use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react/) for comprehensive testing.
-   **Run tests**: `npm run test`
-   **Coverage**: `npm run test:coverage`

## 🛡️ Security & Privacy

We take data protection and security seriously.
-   Check our [Security Policy](SECURITY.md) for vulnerability reporting.
-   Read our [Privacy Policy](privacy.md) for data handling details.

## 🤝 Contributing

1.  **Fork the repository.**
2.  **Create a branch**: `git checkout -b feature/amazing-feature`
3.  **Commit**: Use [Conventional Commits](https://www.conventionalcommits.org/).
4.  **PR**: Open a Pull Request to `main`.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

-   **Email:** [sapienzafoilingteam@gmail.com](mailto:sapienzafoilingteam@gmail.com)
-   **Instagram:** [@sapienzafoilingteam](https://www.instagram.com/sapienzafoilingteam)
-   **LinkedIn:** [Sapienza Foiling Team](https://www.linkedin.com/company/sapienza-foiling-team)

---
Made with ⛵️ by the Sapienza Foiling Team.