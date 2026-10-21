# Catnip Kanban

Catnip Kanban is a responsive task management application built with React, TypeScript and Express. Authenticated users collaborate on a shared Kanban board, while role-based permissions control administrative actions.


## Live demo

[Open Catnip Kanban](https://catnip-kanban.netlify.app)

The demo requires a test account. Login details should be shared separately and are intentionally not stored in this repository.


## Features

- Create, view, edit and move tasks between Kanban columns.
- Store shared tasks and board settings in Supabase.
- Add a title, comment, assignee, due date, status and priority to each task.
- Automatically assign high priority to urgent tasks.
- Limit the number of tasks allowed in the In progress column.
- Log in with admin or user accounts.
- Restrict task deletion and changes to the task limit to admins.
- Display a daily cat and its breed using The Cat API.
- Switch between light and dark themes.
- Preserve theme and open-column preferences in local storage.
- Use the application on both desktop and mobile screens.


## User roles

All authenticated users can:

- view the shared board;
- create and edit tasks;
- move tasks between columns;
- view the cat of the day;
- change their local theme and column preferences.

Admins can additionally:

- delete tasks;
- change the maximum number of tasks allowed in the In progress column.

The frontend hides admin-only controls from regular users. The Express backend also verifies the user's login token and role before allowing protected actions.


## Tech stack

- **React and TypeScript** – build the user interface with typed components.
- **Vite** – run the frontend during development and create production builds.
- **Node.js and Express** – provide the backend REST API.
- **Supabase** – handle authentication and persistent database storage.
- **The Cat API** – provide the daily cat image and breed information.
- **Jest** – test backend validation and task mapping.
- **Netlify** – host the frontend.
- **Render** – host the Express backend.


## Architecture

The frontend signs users in through Supabase Auth. Authenticated API requests include the user's access token. The Express backend verifies that token before reading or changing data in Supabase.

```text
React frontend
├── Supabase Auth for login and sessions
└── Express API with a Bearer token
    ├── Supabase database for tasks, roles and board settings
    └── The Cat API for the cat of the day
```

Secrets such as the Supabase server key and The Cat API key are stored only in backend environment variables. They are never included in the frontend or committed to Git.


## Run locally

### Prerequisites

- Node.js
- npm
- a Supabase project
- a key for The Cat API


### Install dependencies

Clone the repository and install the frontend dependencies:

```bash
git clone https://github.com/MartinaLindskog/kanban.git
cd kanban
npm install
```

Install the backend dependencies:

```bash
cd backend
npm install
```


### Environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Create `.env` inside the `backend` directory:

```env
CAT_API_KEY=your-cat-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_SECRET_KEY=your-supabase-secret-key
```

These files are ignored by Git and must not be committed.


### Start the application

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:5001` during local development.

Start the frontend from the project root in a second terminal:

```bash
npm run dev
```

Open `http://localhost:5173` in a browser.


## Available scripts

Run these commands from the project root:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Run the backend tests from the `backend` directory:

```bash
npm test
```

The Jest suite covers task validation and conversion between API and database task formats.


## Deployment

The production application uses:

- **Netlify** for the Vite frontend;
- **Render** for the Express backend;
- **Supabase** for authentication and database storage.

Netlify uses the following environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_API_BASE_URL
```

Render uses the following environment variables:

```text
CAT_API_KEY
SUPABASE_URL
SUPABASE_SECRET_KEY
```

The backend reads the hosting platform's `PORT` variable in production and falls back to port `5001` locally.


## Current limitations

- The application currently contains one shared Kanban board.
- Changes made by another user appear after reloading the page; real-time synchronization is not implemented.
- User roles apply to the whole application rather than to individual boards.


## Future development

A future version could support several separate Kanban boards and collaboration between users. A user could be an admin on one board and a regular user on another. The role would belong to the user's membership in a specific board rather than to the user account itself.

In that version:

- tasks would belong to a specific Kanban board;
- memberships would connect users to boards with an `admin` or `user` role;
- admins could invite other users to their boards;
- users without a membership could not see a board or its tasks;
- Supabase Realtime could update the board without a page reload;
- the in-progress limit could prevent an admin from lowering the limit below the current number of tasks;
- automatically calculated priorities could always be synchronized with the database.

This larger authorization and collaboration model is intentionally outside the scope of the current course project.
