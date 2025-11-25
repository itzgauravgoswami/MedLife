# 🏥 MedLife - Healthcare Platform

A comprehensive MERN stack healthcare platform with role-based authentication for Patients, Doctors, Admins, and Delivery Partners.

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/itzgauravgoswami/MedLife.git
cd MedLife
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install --legacy-peer-deps
```

4. **Environment Variables**
Backend `.env` is already configured with credentials. No changes needed for testing.

5. **Seed Test Accounts (Required for first run)**
```bash
cd backend
node seed.js
```
This creates pre-verified test accounts for all roles.

6. **Start the Application**

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173 (or 5174 if 5173 is in use)
- Backend API: http://localhost:5000

> **Note:** If frontend shows port 5174, use that URL throughout the guide.

---

## 🔐 Test Credentials

### Admin (Pre-configured)
- Email: `goswamigaurav2005@gmail.com`
- Password: `admin@2005`
- Dashboard: http://localhost:5174/admin-login

### Doctor, Patient, Delivery Partner
**IMPORTANT**: These accounts need to be created through registration first.

1. **Register a Doctor:**
   - Go to http://localhost:5174/doctor-register
   - Fill in details and register
   - Login as Admin and verify the doctor from "Doctors" tab
   - Then doctor can login at http://localhost:5174/doctor-login

2. **Register a Patient:**
   - Go to http://localhost:5174/user-register
   - Fill in details and register
   - Login immediately at http://localhost:5174/user-login

3. **Register a Delivery Partner:**
   - Go to http://localhost:5174/delivery-register
   - Fill in details and register
   - Login as Admin and verify from "Delivery Partners" tab
   - Then partner can login at http://localhost:5174/delivery-login

**Note:** If you get 401 Unauthorized error, the account either:
- Doesn't exist (register first)
- Is not verified by admin (doctors/delivery partners only)

---

## 📱 Features

### Patient Features
- ✅ Book appointments with doctors
- ✅ Upload and manage medical reports
- ✅ View prescriptions and buy medicines
- ✅ Video consultations (telemedicine)
- ✅ AI health coach with diet/exercise plans
- ✅ AI-powered second opinion
- ✅ Emergency SOS with emergency contacts
- ✅ Order tracking

### Doctor Features
- ✅ Manage appointments
- ✅ Create prescriptions with medicines
- ✅ View patient medical reports
- ✅ Video consultations
- ✅ Post health blogs
- ✅ Patient management

### Admin Features
- ✅ Verify doctors
- ✅ Manage delivery partners
- ✅ Add medicines to inventory
- ✅ View all appointments and orders
- ✅ Assign delivery partners to orders
- ✅ Platform analytics

### Delivery Partner Features
- ✅ Accept delivery orders
- ✅ Real-time location tracking
- ✅ Update delivery status
- ✅ View delivery history
- ✅ Live map integration

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4
- React Router DOM 7
- Socket.io-client
- Leaflet (maps)
- Simple-peer (WebRTC)

### Backend
- Node.js 22
- Express.js 5
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Razorpay (payments)
- Cloudinary (file uploads)
- Google Gemini AI

---

## 📂 Project Structure

```
MedLife/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── config/      # API configuration
│   └── package.json
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/user/register` - Patient registration
- `POST /api/user/login` - Patient login
- `POST /api/doctor/register` - Doctor registration
- `POST /api/doctor/login` - Doctor login
- `POST /api/admin/login` - Admin login
- `POST /api/delivery/register` - Delivery partner registration
- `POST /api/delivery/login` - Delivery partner login

### Appointments
- `GET /api/doctor/appointments` - Get doctor appointments
- `POST /api/user/appointments` - Book appointment
- `PUT /api/doctor/appointments/:id` - Update appointment status

### Prescriptions
- `POST /api/prescription/create` - Create prescription (doctor)
- `GET /api/prescription/user` - Get patient prescriptions
- `POST /api/prescription/:id/add-to-cart` - Add to cart

### Delivery
- `GET /api/delivery/orders/assigned` - Get assigned orders
- `PUT /api/delivery/location` - Update location
- `PUT /api/delivery/orders/:id/status` - Update delivery status

---

## 🎨 Color Theme

- Primary: Cyan (#06b6d4)
- Secondary: Blue (#3b82f6)
- Gradients: `from-blue-500 to-cyan-400`
- Background: `from-blue-50 to-cyan-50`

---

## 🐛 Troubleshooting

### 401 Unauthorized Error on Login
**This is normal!** It means:
1. **For Doctor/Delivery Partner**: Account not verified by admin yet
   - Solution: Login as admin → Verify the account → Try logging in again
2. **For any role**: Account doesn't exist
   - Solution: Register first, then login

### Port Already in Use
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /F /PID <process_id>

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Check internet connection
- Verify MongoDB Atlas credentials in `.env`
- Ensure IP is whitelisted in MongoDB Atlas

### Simple-peer/Events/Util Errors
Already fixed with Vite polyfills. If issues persist:
```bash
cd frontend
npm install events util buffer stream-browserify --legacy-peer-deps
npm run dev
```

### Frontend Not Loading
1. Check if backend is running (http://localhost:5000)
2. Check if frontend is running (check terminal output for port)
3. Clear browser cache and refresh

---

## 📝 Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**

3. **Commit and push**
```bash
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

4. **Create a pull request**

---

## 🔒 Security Notes

- JWT tokens stored in localStorage
- Passwords hashed with bcrypt
- CORS configured
- Protected routes with role-based access
- File uploads validated

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Contributors

- **Gaurav Goswami** - [@itzgauravgoswami](https://github.com/itzgauravgoswami)

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: goswamigaurav2005@gmail.com

---

## 🎉 Acknowledgments

- Socket.io for real-time features
- Leaflet for maps
- Tailwind CSS for styling
- MongoDB Atlas for database
- Razorpay for payments
- Cloudinary for file storage
- Google Gemini AI for chatbot

---

**Made with ❤️ using MERN Stack**
