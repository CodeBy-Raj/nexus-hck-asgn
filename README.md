
# Nexus Study | Real-time Collaboration Hub

The ultimate collaborative platform for modern learners, built for high-performance deep work and AI-powered insights. Nexus Study transforms solitary studying into a synchronized, gamified, and intelligent team experience.

## 🚀 Features

### **Core Functionality**
- **Real-time Study Hubs**: Create or join persistent virtual rooms using unique 6-character invite codes.
- **Synchronized Focus Engine**: High-fidelity synced timers supporting both Standard countdowns and Pomodoro (25/5) cycles.
- **Collaborative Hub Chat**: Real-time communication with presence detection and typing indicators.
- **Structural Activity Logs**: Telemetry tracking of every significant action within a room for transparency and accountability.

### **Creative Enhancements (Additional Functionality)**
- **AI Intel Recaps**: Automated session summaries powered by **Genkit & Gemini 2.5 Flash**. After a session, the system analyzes chat logs and activity to generate structured summaries, discussion points, and decisions.
- **Scholar Terminal (Advanced Analytics)**: A GitHub-style contribution heatmap, study streaks, and focus trajectory charts to visualize long-term consistency.
- **Hyper-Focus Protocol**: Instant UI decluttering via keyboard macros (`CTRL+SHIFT+F`) to eliminate distractions during deep work.
- **Shared Markdown Board**: A concurrent, collaborative workspace for real-time notes and active recall exercises.
- **Dynamic Guest Mode**: A high-fidelity demo experience for anonymous users with sample data projections.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: Tailwind CSS, ShadCN UI, Framer Motion (Animations)
- **Backend & Real-time**: Firebase (Firestore, Authentication)
- **AI Orchestration**: Genkit with Google Gemini 2.5 Flash
- **State Management**: Zustand (Auth persistence)

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+
- Firebase Project with Firestore & Auth enabled (Password and Anonymous providers)

### **Local Environment Setup**
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nexus-study
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_key
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
5. **Set up Firestore Indexes**:
   Upon first load of the Dashboard or Recaps page, check the browser console. Firestore will provide direct links to create the required "Collection Group" indexes. Click these links to enable the analytics queries.

## 🐳 Deployment (Docker)
To deploy using the multi-stage production build:
```bash
docker-compose up -d --build
```

## 🧠 Operational Data Tree
- `/users/{userId}`: Scholar identity, bio, and weekly goals.
- `/rooms/{roomId}`: Hub metadata and shared structural notes.
- `/rooms/{roomId}/messages`: Real-time chat stream.
- `/rooms/{roomId}/sessions`: Active and historical focus cycles.
- `/rooms/{roomId}/recaps`: AI-generated session summaries for spaced repetition.
- `/rooms/{roomId}/logs`: Telemetry logs for room actions.

## ⌨️ Keyboard Protocols
- `CTRL+SHIFT+F`: Toggle Focus Mode (Declutter UI).
- `CMD+B`: Toggle Sidebar visibility.
- `ESC`: Exit modals or forms.

---
*Optimized for deep work and collaborative intelligence.*
