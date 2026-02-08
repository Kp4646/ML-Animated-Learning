# How to Deploy to Netlify

Since your project has a separate `frontend` folder, we have configured `netlify.toml` to handle the build process automatically.

## Prerequisites
1. **GitHub Account**: Ensure your project is pushed to GitHub (which we have done).
2. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com/).

## Steps to Deploy

1. **Log in to Netlify**.
2. Click **"Add new site"** > **"Import from existing project"**.
3. Select **GitHub**.
4. Authorize Netlify to access your GitHub repositories.
5. Search for and select your repository: `ML-Animated-Learning`.
6. **Verify Build Settings**:
   - Because we added `netlify.toml`, Netlify should automatically detect the settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - If these are not pre-filled, enter them manually.
7. Click **"Deploy site"**.

## Backend Deployment (Render)

Since your frontend needs a backend to function, you must deploy the Python backend.

1. **Sign up/Log in to [Render](https://render.com/)**.
2. Click **"New"** > **"Blueprint"**.
3. Connect your GitHub repository (`ML-Animated-Learning`).
4. Render will detect the `render.yaml` file and automatically configure the service:
   - **Name**: `ml-animated-learning-backend`
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi:app`
5. Click **"Apply"** to deploy.
6. Once deployed, copy the **Service URL** (e.g., `https://ml-animated-learning-backend.onrender.com`).

## Connecting Frontend to Backend

1. In your local project, open `frontend/src/api.jsx`.
2. Locate the `API_URL` constant.
   - It likely defaults to `http://localhost:5000/api`.
3. You should use an environment variable. Create or edit `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://your-render-url.onrender.com/api
   ```
   *(Make sure to append `/api` if your backend expects it, or just the base URL depending on your code).*
4. Commit and push this change to GitHub.
5. Netlify will automatically rebuild your frontend with the new API URL.

## Troubleshooting
- **Netlify**: Check "Deploy log". Ensure `CI=false` environment variable is set if warnings cause failure.
- **Render**: Check "Logs" tab. If imports fail, ensure `backend` is treated as a module or paths are correct.

