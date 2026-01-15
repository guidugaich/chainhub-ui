# ChainHub

A crypto-native link-in-bio platform built with Next.js (App Router) and Go.

## Features

-   **Public Profiles**: Clean, fast profiles for users (e.g., `/gui`).
-   **Link Management**: Add, edit, and reorder links.
-   **Dark Mode**: Default "dim" dark theme.
-   **Smart Icons**: Automatically detects services like Twitter/GitHub and displays the correct icon.

## Getting Started

### Frontend (Next.js)

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

### Backend (Go API)

The frontend expects a Go API running at `http://localhost:8080`.

**API Reference:**

-   `GET /tree/{username}`: Fetch public profile.
-   `POST /signup`: Create account.
-   `POST /login`: Get JWT token.
-   `GET /links`: List links (Authenticated).
-   `POST /links`: Create link (Authenticated).

## Project Structure

-   `app/`: Next.js App Router.
    -   `[username]/`: Dynamic profile page.
    -   `services/`: API client functions.
    -   `components/`: Reusable UI components.
    -   `utils/`: Helper functions (e.g., icon detector).
-   `public/`: Static assets.

## Deployment

Push to GitHub and import into [Vercel](https://vercel.com) for instant deployment.
