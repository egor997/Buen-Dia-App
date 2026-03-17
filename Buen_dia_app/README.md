# Buen Dia App

A hybrid application featuring a modern React frontend and a Python backend.

## Architecture

This project is structured as a mono-repo containing both the frontend user interface and the backend business logic. This separation of concerns allows the app to be run as a local desktop program (via Tauri) or to be deployed as a web application (e.g., Vercel + Heroku).

### `/frontend`
Contains the React + Vite application. This handles all UI components, state management for the views, and CSS styling. It is configured to run as a Tauri desktop app if desired.

**To run the frontend for web development:**
```bash
cd frontend
npm install
npm run dev
```

**To run the frontend as a Native Desktop App (Requires Rust):**
```bash
cd frontend
npm install
npm run tauri dev
```

### `/backend`
Contains the Python logic and data processing scripts.
Currently, this contains the old PyQt5 UI (`visual_part`) and application logic (`app_logic`).

**Next Steps for Integration:**
To connect the Python backend variables/data to the React UI, you will need to expose the Python functions as a local API.
1. Install a fast web framework like `FastAPI` or `Flask` in your Python environment.
2. Create endpoints (e.g., `GET /habits`) that return JSON data from your `app_logic`.
3. In the React `frontend`, use Javascript's `fetch('http://localhost:5000/habits')` to retrieve and display the data!
