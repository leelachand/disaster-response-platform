An intelligent, real-time coordination platform to monitor, manage, and respond to disaster events using live geolocation, crowd-sourced data, and social media reports. Built with the **MERN stack**, Supabase, Socket.IO, and Google Gemini API.

---

## 🚀 Live Demo

**Frontend:** [View Dashboard](https://disaster-response-platform-delta.vercel.app/)  
**Backend API:** [View API Docs](https://disaster-response-platform-49ff.onrender.com)

---

## 🧩 Key Features

- 📍 **Interactive Map (Leaflet)**: View disasters by geolocation on an OpenStreetMap interface
- 🔄 **Real-Time Alerts**: Live updates using WebSockets (Socket.IO)
- 🧠 **Social Media Summaries**: AI-generated summaries using Google Gemini API
- ✍️ **Submit Disasters**: Create, update, or delete alerts with tags and metadata
- 📡 **Nearby Alerts**: Get alerts filtered by current location (Haversine formula)
- 🧾 **Paginated Feed**: Easy navigation of alerts with filters and sorting
- 📁 **Supabase**: Cloud PostgreSQL DB with real-time capabilities
- 🌐 **Responsive Design**: Built with React and CSS for all screen sizes

---

## 🛠️ Tech Stack

| Layer      | Technologies |
|------------|--------------|
| **Frontend**  | React.js, Leaflet, Socket.IO-client |
| **Backend**   | Node.js, Express, Supabase (PostgreSQL), Socket.IO |
| **AI Service**| Google Gemini API (via fetch) |
| **Deployment**| Vercel (Frontend), Render (Backend) |
| **Utilities** | Git, GitHub, ESLint, Concurrently |

---

## 📁 Project Structure

```
citymall/
├── disaster-dashboard/       # React frontend
├── disaster-response-backend/ # Express backend
│   ├── client.js              # Supabase client
│   ├── index.js               # Server entry
│   ├── disasterController.js  # Main business logic
│   └── geminiSummarizer.js    # Gemini API integration
├── package.json
└── README.md
🌐 API Endpoints
Disaster Routes:
POST /api/disasters – Create a disaster

GET /api/disasters – Get all disasters (filter by tag, pagination)

GET /api/disasters/nearby?lat=...&lng=... – Get nearby disasters

PUT /api/disasters/:id – Update a disaster

DELETE /api/disasters/:id – Delete a disaster

GET /api/disasters/:id/social-media – Mock social media feed

🧪 Setup & Installation

Clone the repo
bash
git clone https://github.com/leelachand/disaster-response-platform.git
cd disaster-response-platform
Install dependencies

bash
npm install
Run both client and server

bash
npm start
Frontend available at: http://localhost:3001
Backend available at: http://localhost:3000

Create a .env file in both frontend and backend for custom keys.

🤖 Gemini AI Integration
Uses Google Gemini API to summarize crowd-sourced data in real-time.
Edit or add API logic in /disaster-response-backend/geminiSummarizer.js
