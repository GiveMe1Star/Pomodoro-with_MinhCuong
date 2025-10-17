Of course\! I've rewritten the `README.md` file for your project, removing all references to "Lovable" and incorporating the detailed description we worked on earlier.

Here is the updated content for your `README.md`:

-----

# Study with Minh Cuong - Pomodoro Focus Timer

A beautifully designed web application to help you work and study more effectively using the Pomodoro Technique. This app is more than just a simple timer; it's a companion that helps you track your progress, stay motivated, and create an ideal workspace.

## ✨ Key Features

  * **Flexible Pomodoro Timer:** Easily customize the duration of focus and break sessions to fit your personal workflow.
  * **Analytics Dashboard:** Track your progress with detailed statistics, including total sessions, total focus time, and a visual chart of your daily streak.
  * **User Authentication:** Securely sign up and log in with your email or Google account, with all user data managed by Supabase.
  * **Integrated Music Player:** Choose from built-in ambient tracks like Lo-Fi or rain sounds, or add a custom audio URL to create the perfect focus environment.
  * **Theme Customization:** Personalize your experience with multiple color themes, including Pastel, Dark, Ocean, and Forest.
  * **Motivational Quotes:** Get a daily dose of inspiration with randomly displayed motivational quotes.

## 🚀 Tech Stack

This project is built with:

  * **Frontend:** React, TypeScript, Vite
  * **Styling:** Tailwind CSS, shadcn/ui
  * **Backend & Database:** Supabase (Authentication, Postgres Database)
  * **Routing:** React Router
  * **Animation:** Framer Motion

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

  * [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended for managing Node.js versions.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/your_project_name.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your_project_name
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
      * Create a file named `.env.local` in the root of the project.
      * Add the necessary environment variables for Supabase. You can use `.env.example` as a template.
    <!-- end list -->
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
5.  **Start the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:8080`.
