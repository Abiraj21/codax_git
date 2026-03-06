# Signal Dashboard

A full-stack application designed to manage business accounts and their marketing signals. This project features a robust Laravel backend and a dynamic React frontend.

## 🚀 How to Run Locally

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- SQLite (default)

### Backend Setup (Laravel)
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```
3.  **Set up the environment file:**
    ```bash
    cp .env.example .env
    ```
4.  **Generate application key:**
    ```bash
    php artisan key:generate
    ```
5.  **Run migrations and seeders:**
    ```bash
    php artisan migrate
    ```
6.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```

### Frontend Setup (React)
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```
3.  **Start the React development server:**
    ```bash
    npm start
    ```
    The application will be accessible at `http://localhost:3000`.

---

## 🔐 Environment Variables

The backend requires a `.env` file. Key variables include:
- `DB_CONNECTION`: Default is `sqlite`.
- `DB_DATABASE`: Path to your database file (e.g., `database/database.sqlite`).
- `APP_URL`: Set to `http://localhost:8000` (or your backend port).

---

## 🛠 Stack Choices & Rationale

-   **Backend: Laravel 12 (PHP)**
    -   *Why:* Offers a rich ecosystem, built-in security features, and Eloquent ORM for seamless database interactions. It's excellent for building structured APIs.
-   **Frontend: React 19 (JavaScript)**
    -   *Why:* A component-based architecture that enables a highly responsive and interactive user interface. React 19 brings performance improvements and modern hooks.
-   **Styling: Tailwind CSS**
    -   *Why:* Allows for rapid UI development with utility-first classes, ensuring a consistent and modern look without writing excessive custom CSS.
-   **Database: SQLite**
    -   *Why:* Perfect for local development and assessment as it requires zero configuration and stores the database in a simple file.

---

## ⚖️ Tradeoffs & Shortcuts

1.  **SQLite over PostgreSQL/MySQL**: Chose SQLite for simplicity during development and easier portability. In a larger production environment, a more robust relational database like PostgreSQL would be preferred for concurrency and scalability.
2.  **Modular Frontend/Backend**: Kept the frontend and backend in separate directories. While this increases initial setup complexity, it provides better separation of concerns and allows for independent scaling or technology swaps in the future.
3.  **Local Storage for Session/Cache**: Used database-driven sessions for ease of setup. In production, Redis would be used for significantly better performance.

---

## 🔮 Future Improvements (Production Ready)

If this were a production feature, I would add:
1.  **Authentication & Authorization**: Implement Laravel Sanctum or Passport for secure API access and role-based permissions (e.g., Admin vs. User).
2.  **Advanced Analytics**: Integrated charts and graphs to visualize signal trends over time.
3.  **Real-time Notifications**: Using Laravel Reverb or Pusher for live updates when signals are created or updated.
4.  **CI/CD Pipeline**: Automated testing and deployment workflows using GitHub Actions.
5.  **Enhanced Search/Filtering**: Implement Laravel Scout for full-text search capabilities across signals and accounts.
