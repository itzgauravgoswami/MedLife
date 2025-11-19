# MedLife Backend - Vercel Deployment Guide

## Quick Start for Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with MedLife project
- Environment variables configured

### Environment Variables on Vercel

Set these environment variables in your Vercel project settings:

```
PORT=5000
MONGODB_URI=mongodb+srv://[username]:[password]@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=goswamigaurav2005@gmail.com
ADMIN_PASSWORD=admin@2005
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key_here
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select root directory: `.` (root)
   - Build command: Leave empty or `npm install`
   - Start command: `node backend/server.js`

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all the variables listed above
   - Redeploy

4. **Update Frontend API URL**
   - Change all `http://localhost:5000` to `https://medlife-backend-sable.vercel.app` in frontend code
   - Or use environment variable in `vite.config.js`:
   
   ```javascript
   const API_URL = process.env.VITE_API_URL || 'http://localhost:5000'
   ```

### Verify Deployment

Test the backend:
```bash
curl https://medlife-backend-sable.vercel.app/health
```

Should return success status.

### Troubleshooting

- **Timeout errors**: Increase Vercel timeout in Settings
- **MongoDB connection fails**: Check MONGODB_URI is correct and IP whitelist allows Vercel IPs
- **CORS issues**: Update CORS origin in `server.js` to include frontend URL
- **Environment variables not loading**: Redeploy after adding variables (Vercel may need restart)

### Current Status
✅ Backend deployed at: https://medlife-backend-sable.vercel.app/
