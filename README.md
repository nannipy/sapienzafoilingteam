# Sapienza Foiling Team Website

<p align="center">
  <img src="public/logosft.png" alt="Sapienza Foiling Team Logo" width="200"/>
</p>

## Overview

The Sapienza Foiling Team website serves as the digital hub for our university sailing team. We are dedicated to designing and constructing sustainable foiling boats, with a focus on innovation and environmental responsibility. Our team participates in the SuMoth Challenge, an international competition that promotes sustainable sailing technology.

## 🚀 Features

### For Visitors
- **Responsive Design**: Optimized viewing experience across all devices.
- **Team Showcase**: Detailed information about our four main divisions.
- **Boat Details**: Technical specifications and information about our boats.
- **Sponsorship Portal**: Opportunities and benefits for potential partners.
- **Contact System**: Direct communication channel with our team.
- **Event Calendar**: Upcoming competitions and team events.
- **Social Integration**: Connect with us across multiple platforms.
- **Blog**: Stay updated with the latest news and articles.
- **Authentication**: Secure user authentication for administrative tasks.

### For Developers
- Modern React components with TypeScript.
- Framer Motion animations for enhanced UX.
- Tailwind CSS for responsive styling.
- Performance optimization with Vercel.
- SEO-friendly structure.
- Supabase integration for backend services.

## 🛠 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS, @tailwindcss/typography
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend/Database:** Supabase (Authentication, PostgreSQL Database, Storage)
- **Deployment/Analytics:** Vercel Analytics, Vercel Speed Insights
- **Testing:** Jest, React Testing Library, TS-Jest
- **Code Quality:** ESLint
- **Fonts:** Local fonts with `next/font`

## 🏗 Project Structure

```bash
sapienza-foiling-team/
├── app/                          # Next.js App Router root
│   ├── api/                      # API routes (Next.js API)
│   │   ├── articles/             # API for blog articles
│   │   ├── auth/                 # API for authentication (login, logout, signup)
│   ├── auth/                     # Authentication related pages
│   ├── blog/                     # Blog pages and admin interface
│   │   ├── admin/                # Admin panel for blog management
│   ├── components/               # Reusable UI components
│   │   ├── AdminHeader.tsx
│   │   ├── CallToActionSection.tsx
│   │   ├── CookieBanner.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── SocialMediaSection.tsx
│   │   └── UpcomingEventsSection.tsx
│   ├── contact/                  # Contact page
│   ├── context/                  # React Context providers (e.g., AdminContext, LanguageContext)
│   ├── fleet/                    # Fleet page
│   ├── fonts/                    # Custom fonts
│   ├── lib/                      # Utility functions and Supabase client initialization
│   │   └── supabase.ts           # Supabase client setup
│   ├── privacy-policy/           # Privacy Policy page
│   ├── sponsor/                  # Sponsorship page
│   ├── team/                     # Team page
│   ├── translations/             # Internationalization (i18n) content
│   ├── __tests__/                # Unit and integration tests for components and pages
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global CSS styles
│   ├── layout.tsx                # Root layout for the application
│   └── page.tsx                  # Home page
├── public/                       # Static assets (images, logos, flags, sponsors)
├── supabase/                     # Supabase local development setup and migrations
│   ├── migrations/               # Database migration files
│   └── config.toml               # Supabase CLI configuration
├── __mocks__/                    # Mock files for testing
├── .github/                      # GitHub Actions workflows and issue templates
├── .next/                        # Next.js build output (ignored by Git)
├── node_modules/                 # Project dependencies (ignored by Git)
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Specifies intentionally untracked files to ignore
├── jest.config.ts                # Jest test runner configuration
├── jest.setup.ts                 # Jest setup file
├── LICENSE                       # Project license
├── next.config.ts                # Next.js configuration
├── package-lock.json             # npm dependency lock file
├── package.json                  # Project metadata and dependencies
├── postcss.config.js             # PostCSS configuration
├── README.md                     # This README file
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

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
    *Note: You will need to populate `.env.local` with your Supabase project credentials. Refer to the Supabase documentation for details on setting up your project and obtaining these keys.*

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

6.  **Open in browser:**
    Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Available Scripts

-   `npm run dev`: Starts the development server with Turbopack for faster compilation.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the Next.js production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run test`: Runs all Jest tests.
-   `npm run test:watch`: Runs Jest tests in watch mode.
-   `npm run test:coverage`: Runs Jest tests and generates a coverage report.

## ☁️ Infrastructure

This project leverages the following infrastructure components:

-   **Supabase:**
    -   **Authentication:** Handles user sign-up, sign-in, and session management.
    -   **PostgreSQL Database:** Provides the relational database for storing application data (e.g., blog posts, user profiles).
    -   **Storage:** Used for managing and serving static assets like images (e.g., `public/hero.png`, `public/logosft.png`).
    -   **Edge Functions:** (If used) Serverless functions for custom backend logic.
    -   **Realtime:** (If used) For real-time data synchronization.
    -   **Local Development:** Configured via `supabase/config.toml` for local database and authentication emulation.

-   **Vercel:**
    -   **Deployment:** The primary platform for deploying the Next.js application to production.
    -   **Analytics:** Provides insights into website traffic and user behavior.
    -   **Speed Insights:** Helps monitor and improve website performance.

## 💻 Development Guide

### Component Structure
-   Use functional components with TypeScript.
-   Implement proper type definitions for props and state.
-   Follow the established folder structure within `app/components/`.
-   Utilize Tailwind CSS for styling.

### Styling Guidelines
-   Prefer Tailwind CSS utility classes for styling.
-   Adhere to the color scheme defined in `tailwind.config.js`.
-   Ensure responsive design principles are applied for various screen sizes.
-   Use custom color variables defined in `tailwind.config.js` for consistency.

### Adding New Features
1.  Create a new branch for your feature (`git checkout -b feature/your-feature-name`).
2.  Implement the feature following our coding standards and best practices.
3.  Add necessary unit and integration tests for new functionality.
4.  Update relevant documentation (e.g., this README, inline comments).
5.  Submit a pull request to the `main` branch.

## 🧪 Testing

The project uses [Jest](https://jestjs.io/) as the test runner and [React Testing Library](https://testing-library.com/react/) for testing React components.

-   **Configuration:** `jest.config.ts` and `jest.setup.ts` define the testing environment and setup.
-   **Test Files:** Tests are located in `app/__tests__/` and can also be placed alongside components (e.g., `ComponentName.test.tsx`).
-   **Running Tests:**
    -   `npm run test`: Executes all tests.
    -   `npm run test:watch`: Runs tests in interactive watch mode, re-running tests on file changes.
    -   `npm run test:coverage`: Generates a test coverage report, showing which parts of the code are covered by tests.

## 🤝 Contributing

We welcome contributions to the Sapienza Foiling Team Website! Please follow these guidelines:

1.  **Fork the repository.**
2.  **Create your feature branch:**
    ```bash
    git checkout -b feature/YourFeature
    ```
3.  **Commit your changes:**
    ```bash
    git commit -m 'feat: Add YourFeature'
    ```
    *Note: Please use conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `chore:`).*
4.  **Push to the branch:**
    ```bash
    git push origin feature/YourFeature
    ```
5.  **Open a Pull Request:**
    Submit a pull request to the `main` branch, describing your changes and their purpose.

### Contribution Guidelines
-   Follow the existing code style and conventions.
-   Write clear, concise, and meaningful commit messages.
-   Update documentation as needed.
-   Ensure your changes are thoroughly tested.
-   Create an issue for major changes or new features before starting work.
-   Review existing issues to avoid duplicate efforts.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

### General Inquiries
-   **Email:** sapienzafoilingteam@gmail.com
-   **Website:** [sapienzafoilingteam.vercel.app](https://www.sapienzafoilingteam.vercel.app)

### Social Media
-   **Instagram:** [@sapienzafoilingteam](https://www.instagram.com/sapienzafoilingteam)
-   **LinkedIn:** [Sapienza Foiling Team](https://www.linkedin.com/company/sapienza-foiling-team)
-   **Facebook:** [Sapienza Foiling Team](https://www.facebook.com/sapienzafoilingteam)

### Location
Via Eudossiana 18, 00184 Roma, Italy

## 🙏 Acknowledgments

-   Sapienza University of Rome for their continuous support.
-   Our generous sponsors and partners.
-   The SuMoth Challenge organization for promoting sustainable sailing.
-   All dedicated team members and contributors.
-   The open-source community for invaluable tools and resources.

## 📈 Project Status

**Current Version:** 1.0.0
**Status:** Active Development

Made with ⛵️ by Sapienza Foiling Team