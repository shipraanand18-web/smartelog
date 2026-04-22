# 🚛 Smart E-Log – Real-Time GPS Setup Guide

## Project Structure
```
smartelog-realtime/
├── backend/
│   ├── server.js         ← Node.js + Socket.IO server
│   └── package.json
└── frontend/
    ├── index.html        ← Main dashboard
    └── gps-sender.html   ← Phone GPS page
```

---

## 🚀 Step 1: Backend Start Karo (Laptop)

```bash
cd backend
npm install
node server.js
```

Terminal mein dikhega:
```
🚀 Smart E-Log Backend running on port 5000
📡 WebSocket ready for real-time GPS
```
2nd terminal per ye karo:

cd C:\Users\nishu\OneDrive\Desktop\smartelog
git add .
git commit -m "fix start script"
git push
---

## 🖥️ Step 2: Dashboard Open Karo (Laptop Browser)

Simply open karo: `frontend/index.html`

Login karo: `owner@fleet.com` / `fleet123`

---

## 📱 Step 3: Phone ko GPS Device Banao

**IMPORTANT: Laptop aur Phone ek hi WiFi pe hone chahiye!**

### Laptop ka IP address pata karo:
- **Windows:** `ipconfig` → IPv4 Address dekho (e.g., 192.168.1.5)
- **Mac/Linux:** `ifconfig` → inet address (e.g., 192.168.1.5)

### Phone mein:
1. Same WiFi connect karo
2. Browser mein open karo: `http://192.168.1.5:5173/gps-sender.html`
   - Ya `gps-sender.html` file ko phone mein open karo
3. Server IP fill karo: `192.168.1.5` (tumhara laptop ka IP)
4. Vehicle select karo (e.g., BR01PU1001)
5. **"GPS Tracking Start Karo"** button dabao
6. Browser GPS permission allow karo

---

## 🗺️ Step 4: Google Maps Enable Karo (Free)

1. [console.cloud.google.com](https://console.cloud.google.com) pe jao
2. New Project banao → "Fleet Tracker"
3. Left menu → **APIs & Services** → **Library**
4. "Maps JavaScript API" search karo → **Enable**
5. **Credentials** → **Create Credentials** → **API Key**
6. Key copy karo
7. Dashboard mein Tracking page pe "Google Maps API Key" field mein paste karo
8. **"Load Map"** click karo

**Free Tier:** $200/month credit milta hai Google se = practically free for college project

---

## ✅ Result: Kya Dikhega

- Phone GPS data har 5 second mein server ko bhejega
- Dashboard mein **Live** badge dikhega vehicle card pe
- Google Maps mein real marker move karega
- Coordinates real-time update honge
- Speed bhi dikhegi

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Phone connect nahi ho raha | Same WiFi check karo |
| GPS permission nahi mil raha | Browser settings → Site Settings → Location → Allow |
| Map load nahi ho raha | API key check karo, Maps JS API enabled hai? |
| Server not found | `node server.js` chal raha hai? Port 5000 block nahi? |

---

## 📊 Teachers ko Demo Kaise Karo

1. Laptop pe dashboard open karo (projector pe)
2. Phone haath mein lo / vehicle pe rakh do
3. Phone mein GPS sender open karo
4. Walk around karo – map pe dot move karega!
5. Vehicle click karo – popup mein live coordinates dikhenge
