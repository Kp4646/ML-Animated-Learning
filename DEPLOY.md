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

## Important Note regarding Backend
Your frontend is currently configured to talk to a backend at `http://localhost:5000`.
- **The deployed frontend will NOT be able to communicate with your local backend.**
- You must deploy your Python backend to a service like **Render**, **Heroku**, or **Railway**.
- Once the backend is deployed, you will get a public URL (e.g., `https://my-api.onrender.com`).
- You must then update your frontend configuration:
  1. Go to `frontend/.env` (or create it).
  2. Add: `REACT_APP_API_URL=https://my-api.onrender.com/api`
  3. Push the changes to GitHub.
  4. Netlify will automatically redeploy.

## Troubleshooting
- If the build fails, check the "Deploy log" in Netlify.
- Common issue: CI=true treating warnings as errors. Setup Environment Variable `CI=false` in Netlify Site Settings > Build & deploy > Environment if needed.
