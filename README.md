# LinkSaver - Your Smart Bookmark Manager

## Overview

LinkSaver is a modern web application designed to help you effortlessly save, organize, and summarize your favorite URLs. In today's information-rich world, it's easy to get overwhelmed by countless links. LinkSaver provides a clean and intuitive solution to manage your web content, automatically generating concise summaries and allowing you to filter by tags for quick retrieval.

This project was developed as a solution to the "Link Saver + Auto-Summary" mini-challenge, focusing on robust authentication, efficient bookmark management, and a user-friendly interface.

## Features

### Core Functionality

*   **User Authentication:**
    *   **Email/Password Signup & Login:** Secure user registration and login system.
    *   **Supabase Authentication:** Leverages Supabase's powerful and secure authentication service for user management.
    *   **Google OAuth Integration:** Provides a convenient single sign-on option using your Google account.

*   **Bookmark Management:**
    *   **URL Saving:** Easily save any web URL.
    *   **Automatic Metadata Fetching:** Upon saving, the application intelligently fetches the page's title and favicon for better visual identification.
    *   **Jina AI Auto-Summarization:** Integrates with the Jina AI endpoint to generate a concise summary of the saved webpage content, helping you quickly grasp the essence of a link without visiting it.
    *   **Comprehensive Listing:** View all your saved bookmarks in a well-organized and responsive list.
    *   **Detailed View:** Click on any bookmark to see its full details, including the complete summary.
    *   **Deletion:** Easily remove unwanted bookmarks from your collection.

### Enhancements

*   **Tagging & Filtering:** Assign custom tags to your bookmarks and filter your list by these tags for enhanced organization and searchability.
*   **Dark Mode:** A toggleable dark mode theme for a comfortable viewing experience in different lighting conditions, reducing eye strain.
*   **Responsive UI:** The application is designed to be fully responsive, providing an optimal viewing and interaction experience across various devices (desktops, tablets, and mobile phones).
*   **Clean & Modern Design:** Implements a minimalist and aesthetically pleasing user interface with a carefully selected color palette and typography.

## Tech Stack

This project is built using a robust and modern technology stack:

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (React) - Chosen for its excellent developer experience, server-side rendering (SSR) capabilities, and integrated API routes.
*   **Backend (API):** Next.js API Routes - For handling server-side logic like bookmark saving, summarization, and database interactions.
*   **Database & Authentication:** [Supabase](https://supabase.io/) - An open-source Firebase alternative providing a PostgreSQL database, authentication, and real-time capabilities.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **Markdown Rendering:**
    *   [`react-markdown`](https://github.com/remarkjs/react-markdown) - A React component to render Markdown.
    *   [`remark-gfm`](https://github.com/remarkjs/remark-gfm) - A remark plugin for GitHub Flavored Markdown (GFM) support, enabling tables, task lists, and strikethrough in summaries.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/thefznkhan/link-saver-auto-summary.git
    cd link-saver-auto-summary
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project directory. You will need to populate it with your Supabase and Google OAuth credentials.

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXTAUTH_URL=http://localhost:3000 # Or your deployment URL
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

*   **`NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Find these in your Supabase project settings under `API`.
*   **`NEXTAUTH_URL`**: Set this to your application's URL (e.g., `http://localhost:3000` for local development).
*   **`NEXTAUTH_SECRET`**: A long, random string used to encrypt NextAuth.js cookies. You can generate one using `openssl rand -base64 32` in your terminal. **Keep this secret secure!**
*   **`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`**: Obtain these by setting up a new OAuth 2.0 Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Ensure you add `http://localhost:3000/api/auth/callback/google` (or your deployed URL) as an authorized redirect URI.

### Database Setup (Supabase)

You need to set up your `users` and `bookmarks` tables in your Supabase project. You can run these SQL commands directly in the Supabase SQL Editor.

1.  **Create `users` table:**

    ```sql
    CREATE TABLE public.users (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      email text NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT users_pkey PRIMARY KEY (id),
      CONSTRAINT users_email_key UNIQUE (email)
    );
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    ```

2.  **Create `bookmarks` table:**

    ```sql
    CREATE TABLE public.bookmarks (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      user_id uuid NOT NULL,
      url text NOT NULL,
      title text,
      favicon text,
      summary text,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      tags text[], -- Array of text for tags
      CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
      CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
    );
    ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
    ```

3.  **Enable Row Level Security (RLS) Policies for `bookmarks`:**

    After enabling RLS for the `bookmarks` table, create policies to allow users to `SELECT`, `INSERT`, `UPDATE`, and `DELETE` only their own data.

    *   **Policy for SELECT:**
        ```sql
        CREATE POLICY "Users can view their own bookmarks." ON public.bookmarks
        FOR SELECT USING (auth.uid() = user_id);
        ```

    *   **Policy for INSERT:**
        ```sql
        CREATE POLICY "Users can insert their own bookmarks." ON public.bookmarks
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        ```

    *   **Policy for UPDATE:**
        ```sql
        CREATE POLICY "Users can update their own bookmarks." ON public.bookmarks
        FOR UPDATE USING (auth.uid() = user_id);
        ```

    *   **Policy for DELETE:**
        ```sql
        CREATE POLICY "Users can delete their own bookmarks." ON public.bookmarks
        FOR DELETE USING (auth.uid() = user_id);
        ```

### Running the Development Server

Once all environment variables are set and the database is configured:

```bash
npm run dev
# or
yarn dev
```

The application will now be running at `http://localhost:3000`.

## Usage

1.  **Sign Up / Log In:** Create a new account or log in using your email/password or Google.
2.  **Add Bookmarks:** On the dashboard, paste a URL into the input field and optionally add comma-separated tags. Click "Add Bookmark."
3.  **View & Manage:** Your saved bookmarks will appear. You can click "View Details" to see the full summary and "Delete" to remove them.
4.  **Filter by Tags:** Use the dropdown menu to filter bookmarks by their assigned tags.
5.  **Toggle Dark Mode:** Use the moon/sun icon in the navigation bar to switch between light and dark themes.

## Project Structure

*   `pages/`: Next.js pages and API routes.
    *   `api/`: Backend API endpoints (e.g., `bookmarks.ts`, `auth/[...nextauth].ts`).
*   `components/`: Reusable React components (e.g., `Navbar`, `BookmarkCard`, `AuthForm`).
    *   `bookmarks/`: Components specific to bookmark functionality.
    *   `common/`: Common UI components.
    *   `ui/`: Generic UI elements like `Button` and `Input`.
*   `lib/`: Utility functions, Supabase client, and type definitions.
*   `styles/`: Global CSS and Tailwind CSS configuration.
*   `public/`: Static assets like images.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please open an issue or submit a pull request.
