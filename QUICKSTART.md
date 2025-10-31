
# MEDAi Prototype - QUICK START GUIDE ⚡

## Get Running in 30 Seconds

### 1️⃣ Open Terminal/Command Prompt

### 2️⃣ Navigate to Folder
```bash
cd MEDAi_Prototype
```

### 3️⃣ Start Server
```bash
node server.js
```

### 4️⃣ Open Browser
Go to: **http://localhost:3000**

### 5️⃣ That's It! 🎉

---

## ✅ Test Features

### Create Account
- Email: `anything@example.com`
- Password: `anything`
- Click: "Sign Up"

### Check Symptoms
1. Click: "Symptoms"
2. Enter: "fever, cough"
3. Click: "Analyze Symptoms"
4. See: Diagnosis + Doctors

### Find Doctors
1. Click: "Doctors"
2. Click: Any specialty (❤️ Cardiology, 🧠 Neurology, etc.)
3. Click: "Book Now"

### Compare Medicines
1. Click: "Medicines"
2. Enter: "Paracetamol"
3. Enter: "500mg"
4. Click: "Compare Prices"
5. See: Prices from different platforms

### Book Appointment
1. Click: "Appointments"
2. Select: Doctor
3. Select: Date (tomorrow or later)
4. Select: Time
5. Click: "Book Appointment"

---

## 📱 URLs to Try

| Feature | URL |
|---------|-----|
| **Main App** | http://localhost:3000 |
| **Health Check** | http://localhost:3000/api/health |
| **Get Doctors** | http://localhost:3000/api/doctors |

---

## 💡 What You'll See

✨ Beautiful health app interface
✨ Login/Register screen
✨ Dashboard with stats
✨ Symptom analyzer
✨ Doctor finder
✨ Medicine price comparison
✨ Appointment booking
✨ Fully responsive (works on phone too!)

---

## 🆘 If Something Goes Wrong

### Server won't start?
```bash
# Port 3000 already in use?
# Try different port - edit server.js, change line 3:
const PORT = 3001;  // Instead of 3000
```

### Page won't load?
- Refresh browser (Ctrl+R or Cmd+R)
- Check if server is running
- Try different browser
- Clear browser cache

### Login not working?
- Use any email
- Use any password
- It's demo data

---

## 📂 What's in the Folder?

```
server.js      ← Start this with: node server.js
public/        ← Browser files (don't touch)
├── index.html ← UI
├── css/style.css ← Styling  
└── js/app.js  ← Interactions
README.md      ← Full documentation
```

---

## 🎯 What Can You Do?

✅ Register & Login
✅ Analyze Symptoms with AI
✅ Find Doctors by Specialty
✅ Compare Medicine Prices
✅ Book Doctor Appointments
✅ View Health Dashboard
✅ Explore Beautiful UI

---

## 🚀 When You're Ready

### Want to Add Features?
Edit the files:
- `server.js` - Add API endpoints
- `public/js/app.js` - Add interactions
- `public/css/style.css` - Change colors

### Want More Data?
Edit `server.js` around line 30-50:
- Add more medicines
- Add more doctors
- Add more symptoms

### Want to Deploy?
- Upload to Heroku
- Upload to Replit
- Upload to your server

---

## 💬 Questions?

Read the full README.md for more details!

---

**Enjoy! 🏥✨**
