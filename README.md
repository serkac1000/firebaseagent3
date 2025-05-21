# Firebase Studio - CodePilot

This is a NextJS starter, named CodePilot, in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Getting Started with CodePilot on Windows

These steps will guide you through setting up and running the CodePilot application on your Windows machine after you have cloned the repository.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Make sure you have Node.js installed, which includes npm (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/).
*   **Git**: You'll need Git to clone the repository and manage versions. You can download it from [git-scm.com](https://git-scm.com/).

### Installation and Setup Steps

1.  **Clone the repository:**
    If you haven't already, clone the repository to your local machine using Git. Open your command prompt (cmd) or PowerShell and run:
    ```bash
    git clone <repository_url>
    ```
    (Replace `<repository_url>` with the actual URL of the repository).

2.  **Navigate to the project directory:**
    Change your current directory to the newly cloned project folder:
    ```bash
    cd <project_directory_name>
    ```
    (Replace `<project_directory_name>` with the name of the folder created by `git clone`, usually the repository name).

3.  **Install dependencies:**
    Install the necessary project dependencies using npm:
    ```bash
    npm install
    ```
    This command will download all the packages listed in the `package.json` file.

4.  **Set up Environment Variables (Important for AI Features):**
    The application uses an API key for Gemini AI services.
    *   Create a new file named `.env.local` in the root of your project directory (the same level as `package.json`).
    *   Add your Google Gemini API key to this file:
        ```env
        GOOGLE_API_KEY=your_actual_gemini_api_key_here
        # You might also want to set NEXT_PUBLIC_GOOGLE_API_KEY if any client-side Genkit usage is planned
        # NEXT_PUBLIC_GOOGLE_API_KEY=your_actual_gemini_api_key_here
        ```
    *   Replace `your_actual_gemini_api_key_here` with your valid API key.
    *   **Note:** The `ApiKeyModal` in the app mentions that the `GOOGLE_API_KEY` environment variable is crucial for server-side AI operations.

5.  **Run the development server:**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002` (as configured in your `package.json`). Open this URL in your web browser to see CodePilot running.

### Other Useful Commands

*   **Run Genkit development server (for AI flows):**
    ```bash
    npm run genkit:dev
    ```
*   **Build for production:**
    ```bash
    npm run build
    ```
*   **Start production server:**
    ```bash
    npm run start
    ```
*   **Lint code:**
    ```bash
    npm run lint
    ```
*   **Type check:**
    ```bash
    npm run typecheck
    ```

# firebaseagent3
