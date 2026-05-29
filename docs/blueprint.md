# **App Name**: Nexus Study

## Core Features:

- Live Real-Time Study Hubs: Collaborative study rooms utilizing Socket.IO for synchronized group work and live event handling.
- Presence Tracking System: Redis-powered tracking to monitor real-time member availability and activity within study sessions.
- Session Recap Tool: A generative AI study assistant tool that analyzes room activity and chat logs to generate session summaries.
- Secure MongoDB Storage: Persistent data architecture using Mongoose for user profiles, session history, and complex relational messaging.
- Interactive Dashboards: Next.js 14-based UI with side-bar navigation for quick access to rooms, profile management, and session analytics.
- Real-time Messaging System: Shared messaging context using WebSockets for instantaneous communication during deep-work blocks.
- Session Management Controller: Comprehensive tools for room creation, status coding, and activity logging via high-performance server logic.

## Style Guidelines:

- Primary color: #3b82f6 (Electric Blue) providing a high-contrast focal point against dark canvases.
- Background color: #0f172a (Deep Navy), a dark-mode base for reduced eye strain during long study hours.
- Accent color: #f59e0b (Warm Amber) for alerts, highlights, and status indicators.
- Primary body font: 'Plus Jakarta Sans' (Sans-serif) for high legibility in dense study contexts. Heading font: 'Outfit' (Sans-serif) for professional display typography. Note: currently only Google Fonts are supported.
- Clean, thin-line Lucide-react icons consistent with the modern, technical interface.
- Sidebar-driven modular dashboard featuring a fixed side-nav for persistent navigation between study tools.
- Fluid state transitions and interaction feedback powered by Framer Motion.