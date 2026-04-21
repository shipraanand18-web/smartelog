const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// =============================================
// IN-MEMORY STORE
// =============================================
let vehicles = [
  { id: 1, regno: "BR01PU1001", model: "Tata Starbus",      type: "Bus",             driver: "Rajan Kumar",  status: "On Trip", lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 2, regno: "BR01PU1002", model: "Ashok Leyland",     type: "Bus",             driver: "Suresh Mahato",status: "On Trip", lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 3, regno: "BR01PU1003", model: "Eicher Skyline",    type: "Bus",             driver: "Amit Verma",   status: "Idle",    lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 4, regno: "BR01PU1004", model: "Force Traveller",   type: "Tempo Traveller", driver: "Deepak Singh", status: "On Trip", lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 5, regno: "BR01PU1005", model: "Tempo Traveller",   type: "Tempo Traveller", driver: "Rohit Prasad", status: "On Trip", lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 6, regno: "BR01PU1006", model: "Mahindra Bolero",   type: "Cab",             driver: "Vikram Das",   status: "Idle",    lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 7, regno: "BR01PU1007", model: "Maruti Ertiga",     type: "Cab",             driver: "Anil Sharma",  status: "On Trip", lat: null, lng: null, speed: 0, lastSeen: null },
  { id: 8, regno: "BR01PU1008", model: "Toyota Innova",     type: "Cab",             driver: "—",            status: "Idle",    lat: null, lng: null, speed: 0, lastSeen: null },
];

let drivers = [
  { id: 1, name: "Rajan Kumar",  license: "DL-2021-012345", phone: "9801234567", empid: "EMP-001", exp: 8,  status: "On-trip" },
  { id: 2, name: "Suresh Mahato",license: "DL-2019-056789", phone: "9712345678", empid: "EMP-002", exp: 12, status: "On-trip" },
  { id: 3, name: "Amit Verma",   license: "DL-2022-098765", phone: "8801234567", empid: "EMP-003", exp: 5,  status: "Active"  },
  { id: 4, name: "Deepak Singh", license: "DL-2020-034567", phone: "7712345678", empid: "EMP-004", exp: 7,  status: "On-trip" },
  { id: 5, name: "Rohit Prasad", license: "DL-2018-078901", phone: "9901234567", empid: "EMP-005", exp: 15, status: "On-trip" },
];

let locationHistory = {}; // { vehicleId: [{lat,lng,speed,timestamp}] }

// =============================================
// REST ENDPOINTS
// =============================================

// GET all vehicles with latest location
app.get("/api/vehicles", (req, res) => {
  res.json(vehicles);
});

// GET single vehicle
app.get("/api/vehicles/:id", (req, res) => {
  const v = vehicles.find(x => x.id === parseInt(req.params.id));
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  res.json({ ...v, history: locationHistory[v.id] || [] });
});

// ADD vehicle
app.post("/api/vehicles", (req, res) => {
  const v = { id: Date.now(), lat: null, lng: null, speed: 0, lastSeen: null, ...req.body };
  vehicles.push(v);
  io.emit("vehicles_updated", vehicles);
  res.json(v);
});

// UPDATE vehicle
app.put("/api/vehicles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  vehicles = vehicles.map(v => v.id === id ? { ...v, ...req.body } : v);
  io.emit("vehicles_updated", vehicles);
  res.json({ message: "Updated" });
});

// DELETE vehicle
app.delete("/api/vehicles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  vehicles = vehicles.filter(v => v.id !== id);
  delete locationHistory[id];
  io.emit("vehicles_updated", vehicles);
  res.json({ message: "Deleted" });
});

// GET all drivers
app.get("/api/drivers", (req, res) => res.json(drivers));

// ADD driver
app.post("/api/drivers", (req, res) => {
  const d = { id: Date.now(), ...req.body };
  drivers.push(d);
  res.json(d);
});

// UPDATE driver
app.put("/api/drivers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  drivers = drivers.map(d => d.id === id ? { ...d, ...req.body } : d);
  res.json({ message: "Updated" });
});

// DELETE driver
app.delete("/api/drivers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  drivers = drivers.filter(d => d.id !== id);
  res.json({ message: "Deleted" });
});

// =============================================
// GPS LOCATION UPDATE (called by phone page)
// =============================================
app.post("/api/location", (req, res) => {
  const { vehicleId, lat, lng, speed, accuracy } = req.body;

  if (!vehicleId || !lat || !lng) {
    return res.status(400).json({ error: "vehicleId, lat, lng required" });
  }

  const id = parseInt(vehicleId);
  const timestamp = new Date().toISOString();

  // Update vehicle location
  vehicles = vehicles.map(v => {
    if (v.id === id) {
      return { ...v, lat, lng, speed: speed || 0, accuracy, lastSeen: timestamp, status: "On Trip" };
    }
    return v;
  });

  // Save to history (keep last 50 points per vehicle)
  if (!locationHistory[id]) locationHistory[id] = [];
  locationHistory[id].push({ lat, lng, speed: speed || 0, timestamp });
  if (locationHistory[id].length > 50) locationHistory[id].shift();

  // Broadcast to all dashboard clients via WebSocket
  io.emit("location_update", {
    vehicleId: id,
    lat, lng, speed: speed || 0, accuracy, timestamp
  });

  io.emit("vehicles_updated", vehicles);

  console.log(`📍 GPS Update: Vehicle ${id} → lat:${lat.toFixed(5)}, lng:${lng.toFixed(5)}, speed:${speed || 0} km/h`);

  res.json({ success: true, timestamp });
});

// GET location history for a vehicle
app.get("/api/location/history/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.json(locationHistory[id] || []);
});

// =============================================
// WEBSOCKET CONNECTION
// =============================================
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send current state immediately on connect
  socket.emit("vehicles_updated", vehicles);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Smart E-Log Backend running on port ${PORT}`);
  console.log(`📡 WebSocket ready for real-time GPS`);
  console.log(`\n📱 GPS Sender URL: http://YOUR_IP:${PORT}`);
  console.log(`🖥️  Dashboard URL:  open frontend/index.html in browser\n`);
});
