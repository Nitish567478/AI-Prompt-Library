# AI Prompt Library

AI Prompt Library is a full-stack prompt management application built with:

- `Angular 21` on the frontend
- `Django` on the backend
- `SQLite` as the current local database

The app allows users to browse all prompts, sign up, log in, create their own prompts, copy prompt content, and delete only the prompts they personally own.

## Features

- Browse all prompts from the home page
- User authentication with signup, login, logout, and session-based current-user check
- Owner-based prompt creation and deletion
- Prompt complexity labels:
  `easy` = green, `medium` = yellow, `hard` = red
- Prompt detail page with `Copy prompt` action
- Shared styled layout with sidebar navigation
- Angular frontend connected to Django API through `/api`

## Current Behavior

- Everyone can see all prompts on the home page
- Only logged-in users can add a prompt
- Only the owner of a prompt can delete it
- Detail page shows prompt metadata, owner name, views, and copy button
- Anonymous old dummy records can be removed from the database if needed

## Tech Stack

### Frontend

- Angular `21.2.x`
- TypeScript
- Angular Router
- Angular Reactive Forms
- RxJS

### Backend

- Django `4.2+`
- Django auth system
- `django-cors-headers`
- SQLite

## Project Structure

The application is split into sibling folders:

```text
ai-prompt-library/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── prompts/
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   ├── 0002_prompt_created_at_prompt_views.py
│   │   │   └── 0003_prompt_owner.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── add-prompt/
│   │   │   │   ├── login/
│   │   │   │   ├── prompt-detail/
│   │   │   │   ├── prompt-list/
│   │   │   │   ├── sidebar/
│   │   │   │   └── signup/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── prompt.service.ts
│   │   │   ├── app.component.html
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── proxy.conf.json
│   │   ├── styles.css
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── README.md
└── venv/
```

## Important Frontend Files

### `src/app/app.ts`

Root Angular component bootstrap entry. It:

- loads the current logged-in user
- exposes auth state to the layout
- handles logout

### `src/app/app.component.html`

Main shared application shell with:

- sidebar
- navigation links
- auth state panel
- router outlet

### `src/app/app.routes.ts`

Defines client-side routes:

- `/` = prompt list
- `/add` = add prompt
- `/prompt/:id` = prompt detail
- `/login` = login page
- `/signup` = signup page

### `src/app/services/auth.service.ts`

Handles frontend authentication state and API calls for:

- signup
- login
- logout
- current logged-in user

### `src/app/services/prompt.service.ts`

Handles prompt API calls:

- fetch prompt list
- fetch prompt detail
- create prompt
- delete prompt

### `src/styles.css`

Global visual system for:

- layout
- sidebar
- prompt cards
- forms
- badges
- delete/copy buttons
- auth panels
- responsive behavior

## Important Backend Files

### `backend/settings.py`

Main Django configuration:

- installed apps
- middleware
- SQLite database config
- static settings

### `backend/urls.py`

Registers the API base path:

- `/api/`

### `prompts/models.py`

Defines the `Prompt` model.

Current important fields:

- `owner`
- `title`
- `content`
- `complexity`
- `views`
- `created_at`

### `prompts/views.py`

Contains all backend API logic for:

- listing prompts
- creating prompts
- deleting prompts
- prompt detail fetching
- signup
- login
- logout
- current user session check

### `prompts/urls.py`

Maps all backend endpoints under `/api/`.

## API Endpoints

### Prompt APIs

- `GET /api/prompts/`
  Returns all prompts

- `POST /api/prompts/create/`
  Creates a new prompt
  Requires authentication

- `GET /api/prompts/<id>/`
  Returns a single prompt
  Also increments views

- `DELETE /api/prompts/<id>/`
  Deletes a prompt
  Allowed only for the prompt owner

### Auth APIs

- `POST /api/auth/signup/`
  Creates a new user and logs them in

- `POST /api/auth/login/`
  Logs in an existing user

- `POST /api/auth/logout/`
  Logs out the current user

- `GET /api/auth/me/`
  Returns the current logged-in user or `null`

## Authentication Flow

The app currently uses Django session authentication.

### Signup flow

1. User enters username and password
2. Frontend sends request to `/api/auth/signup/`
3. Django creates user
4. Django logs in the user in the same session
5. Frontend updates auth state

### Login flow

1. User submits login form
2. Frontend sends request to `/api/auth/login/`
3. Django authenticates credentials
4. Session becomes active
5. Frontend stores current user in reactive auth state

### Ownership rules

- Prompt owner is set to the authenticated user during creation
- `is_owner` is returned from backend for each prompt
- Delete button is shown only when `is_owner === true`

## Prompt Complexity Rules

Prompt complexity is based on the numeric `complexity` field:

- `1-3` = `easy`
- `4-7` = `medium`
- `8-10` = `hard`

The frontend displays the level using color-coded badges:

- green for easy
- yellow for medium
- red for hard

## Local Development Setup

## 1. Backend setup

Move into the backend folder:

```bash
cd ../backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

Backend default URL:

```text
http://127.0.0.1:8000
```

## 2. Frontend setup

Move into the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start Angular dev server:

```bash
npm start
```

Frontend default URL:

```text
http://localhost:4200
```

## Proxy Configuration

Frontend uses `src/proxy.conf.json` to forward API requests to Django:

```json
{
  "/api": {
    "target": "http://127.0.0.1:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

This allows frontend code to call `/api/...` without hardcoding the backend URL in service files.

## Available Frontend Scripts

From the `frontend` directory:

```bash
npm start
npm run build
npm run watch
npm test
```

### Meaning

- `npm start` = run Angular dev server
- `npm run build` = production build
- `npm run watch` = rebuild in watch mode
- `npm test` = run tests

## Database Notes

- Current database is SQLite
- Default file is `backend/db.sqlite3`
- Prompt records are stored in the `Prompt` model
- Auth users are stored with Django's built-in `User` model

## Validation Already Used

The project has already been validated with:

- `python manage.py migrate`
- `python manage.py check`
- `npm run build`

## Known Limitations

- No route guard yet for protected frontend pages
- No edit prompt feature yet
- No search, filter, or category system yet
- No token-based auth yet
- No production deployment config yet
- No backend test coverage for auth/prompt ownership yet

## Suggested Next Improvements

- Add route guards for `/add`
- Add edit/update prompt feature
- Add a user-specific dashboard like "My Prompts."
- Add search and prompt tagging
- Add toast notifications instead of only form error text
- Add better environment-based configuration
- Add API serializers and class-based views if the backend grows

## Author Notes

This project currently behaves like a clean learning + portfolio full-stack app with:

- custom UI styling
- real authentication flow
- owner-based authorization
- prompt CRUD foundation

It is a strong base for extending into:

- prompt marketplace
- team prompt workspace
- AI workflow catalog
- personal prompt vault
