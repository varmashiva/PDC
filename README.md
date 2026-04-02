# DanceEdge - Dance Workshop Booking Platform

A production-ready full-stack application for discovery and booking dance workshops.

## 🚀 Features

- **Monorepo Architecture**: Clean separation between `client/` and `server/`.
- **Authentication**: JWT-based manual auth & Passport.js Google OAuth.
- **Payments**: Integrated Razorpay for secure transactions.
- **Uploads**: Cloudinary integration for workshop images.
- **Real-Time**: Socket.io for live workshop updates and active user tracking.
- **Modern UI**: React 19, Tailwind CSS, Framer Motion, and React Three Fiber (3D).

## 🛠️ Stack

- **Frontend**: React (Vite), Tailwind, Axios, Lucide Icons, R3F.
- **Backend**: Node.js, Express, MongoDB, Socket.io, Multer.
- **Services**: Cloudinary (Image storage), Razorpay (Payments).

## ⚙️ Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/varmashiva/PDC.git
   ```

2. **Environment Variables**
   Create a `.env` in the root (refer to `.env` template provided).

3. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

4. **Run the application**
   From the root:
   ```bash
   npm run dev
   ```

## 🔐 Credentials Needed
- MongoDB URI
- Google Cloud Console (OAuth Client ID/Secret)
- Razorpay API Keys
- Cloudinary API Keys

## 📁 Structure
```
root/
├── client/     # React + Vite
├── server/     # Node + Express
└── .env        # Shared environment config
```
