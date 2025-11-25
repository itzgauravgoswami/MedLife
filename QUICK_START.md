# MedLife - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies  
cd ../frontend
npm install --legacy-peer-deps
```

### Step 2: Setup Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medlife
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 👥 User Roles & Login Paths

### Patient Login
- URL: http://localhost:5173/user-login
- Register: http://localhost:5173/user-register
- Dashboard: `/patient-dashboard`

### Doctor Login
- URL: http://localhost:5173/doctor-login
- Register: http://localhost:5173/doctor-register
- Dashboard: `/doctor-admin`

### Admin Login
- URL: http://localhost:5173/admin-login
- Dashboard: `/admin-dashboard`

### Delivery Partner Login
- URL: http://localhost:5173/delivery-login
- Register: http://localhost:5173/delivery-register
- Dashboard: `/delivery-dashboard`

---

## 🧪 Test Data Setup

### Create Test Admin
```javascript
// Run in MongoDB or create via API
db.admins.insertOne({
  email: "admin@medlife.com",
  password: "$2a$10$hash_here", // bcrypt hash of "admin123"
  name: "Admin User"
})
```

### Create Test Doctor
1. Go to http://localhost:5173/doctor-register
2. Fill in:
   - Name: Dr. John Smith
   - Email: doctor@medlife.com
   - Password: doctor123
   - Specialization: Cardiology
   - Qualification: MBBS, MD

### Create Test Patient
1. Go to http://localhost:5173/user-register
2. Fill in:
   - Name: Jane Doe
   - Email: patient@medlife.com
   - Password: patient123
   - Phone: 9876543210
   - Age: 30
   - Gender: Female

### Create Test Delivery Partner
1. Go to http://localhost:5173/delivery-register
2. Fill in:
   - Name: Mike Wilson
   - Email: delivery@medlife.com
   - Password: delivery123
   - Vehicle Type: Bike
   - License Number: DL1234567890

---

## 🔑 API Testing with Postman

### Patient Registration
```http
POST http://localhost:5000/api/user/register
Content-Type: application/json

{
  "name": "Test Patient",
  "email": "test@patient.com",
  "password": "password123",
  "phone": "9876543210",
  "age": 25,
  "gender": "male"
}
```

### Patient Login
```http
POST http://localhost:5000/api/user/login
Content-Type: application/json

{
  "email": "test@patient.com",
  "password": "password123"
}
```

### Get Profile (Authenticated)
```http
GET http://localhost:5000/api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎯 Feature Testing Workflow

### 1. Test Patient Flow
1. Register as patient
2. Login and access dashboard
3. Book appointment with doctor
4. Upload medical report
5. View prescriptions
6. Buy medicines
7. Test AI Health Coach
8. Test Emergency SOS

### 2. Test Doctor Flow
1. Register as doctor
2. Wait for admin approval (or manually update DB)
3. Login and access dashboard
4. View appointments
5. Create prescription
6. Start video consultation
7. View patient reports

### 3. Test Delivery Flow
1. Register as delivery partner
2. Wait for admin verification
3. Login and access dashboard
4. View assigned orders
5. Update location
6. Update delivery status
7. Test map functionality

### 4. Test Admin Flow
1. Login as admin
2. Approve doctors
3. Verify delivery partners
4. View analytics
5. Manage blogs

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
```bash
# Start MongoDB service
mongod --dbpath C:\data\db

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medlife
```

### Issue: Frontend Not Connecting to Backend
**Solution:**
- Check `frontend/src/config/api.js` has correct API_URL
- Verify backend is running on port 5000
- Check browser console for CORS errors

### Issue: Socket.io Not Working
**Solution:**
- Ensure both servers are running
- Check SocketContext is wrapping App in App.jsx
- Open browser console and check for connection logs

### Issue: Map Not Showing
**Solution:**
```javascript
// Ensure Leaflet CSS is imported in main.jsx
import 'leaflet/dist/leaflet.css'

// Fix marker icon issue
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
```

### Issue: Video Call Not Working
**Solution:**
- Allow browser camera/microphone permissions
- Use HTTPS in production (SimplePeer requires secure context)
- Check WebRTC compatibility in browser

---

## 📦 Production Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
# Add to package.json
"engines": {
  "node": "22.x"
},
"scripts": {
  "start": "node server.js"
}

# Set environment variables in platform dashboard
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist

# Environment variables
VITE_API_URL=https://your-backend-url.com
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting to API endpoints
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Add request size limits
- [ ] Implement API key rotation
- [ ] Enable MongoDB authentication

---

## 📊 Database Indexes (Performance)

```javascript
// Run in MongoDB shell for better performance
db.users.createIndex({ email: 1 })
db.doctors.createIndex({ email: 1, specialization: 1 })
db.appointments.createIndex({ userId: 1, doctorId: 1, date: 1 })
db.orders.createIndex({ userId: 1, deliveryPartnerId: 1 })
db.medicalreports.createIndex({ userId: 1, uploadedAt: -1 })
```

---

## 🎨 Customize Theme

Edit colors in Tailwind config or component styles:

```javascript
// Primary color: Cyan to Purple
from-blue-500 to-cyan-400  →  from-purple-500 to-pink-400

// Background gradient
from-blue-50 to-cyan-50  →  from-purple-50 to-pink-50
```

---

## 📞 Need Help?

1. **Check Logs:**
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser Console (F12)

2. **Common Endpoints:**
   - Health Check: `GET http://localhost:5000/`
   - API Docs: Check routes files

3. **Debug Mode:**
   ```javascript
   // Add to backend server.js
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.path}`, req.body)
     next()
   })
   ```

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] MongoDB connected and indexed
- [ ] Frontend can reach backend API
- [ ] Socket.io connection working
- [ ] File upload configured (Cloudinary)
- [ ] Payment gateway tested (Razorpay)
- [ ] All user roles can login
- [ ] Protected routes working
- [ ] Video calls functional
- [ ] Maps loading correctly

---

**🎉 You're Ready to Go!**

Start with patient registration → book appointment → test full flow.
