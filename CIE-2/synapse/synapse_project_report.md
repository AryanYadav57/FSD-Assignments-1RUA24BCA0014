---
title: "Synapse: Project Report & Architecture"
author: "FSD Assignment (CIE-2)"
date: "October 2026"
---

# Synapse
### *Start connecting your thoughts.*

---

## 1. The Idea & Vision
**Synapse** is a modern, web-based "Second Brain" and note-taking application. The core philosophy behind Synapse is to eliminate the friction between thinking and writing. It is designed for users who need to capture ideas instantly, interlink their thoughts to build a knowledge web, and write in a distraction-free, premium editorial environment.

Unlike traditional hierarchical folder-based note apps, Synapse relies on **networked thought**—allowing users to connect ideas naturally using bidirectional wikilinks, visualised through an interactive Graph View.

---

## 2. Core Features
- **Quick Capture (⌘⇧N):** A global floating action menu that allows users to instantly drop thoughts without breaking their current workflow.
- **Networked Knowledge (Wikilinks):** Users can type `[[` to instantly link notes together, creating a web of interconnected ideas.
- **Interactive Graph View:** A dynamic force-directed graph that visually represents how all the user's notes are connected.
- **Rich Text Editing:** Powered by a headless editor, supporting Markdown-style shortcuts, checklists, headings, and code blocks.
- **Command Palette (⌘K):** A unified search interface allowing users to instantly jump to any note or execute actions via fuzzy search.
- **Public Note Sharing:** Users can claim a unique `@username` and generate public URLs (e.g., `synapsenotes.netlify.app/@username/slug`) to share specific notes with the world.
- **Dark/Light Mode:** A meticulously designed theme system using a warm "parchment" aesthetic for light mode and a deep, low-contrast dark mode for eye comfort.

---

## 3. Technology Stack

### Frontend (Client-Side)
- **Framework:** **React** (via Expo Web)
- **Routing:** **Expo Router** (File-based routing, static site generation)
- **Styling:** **Tailwind CSS** (Utility-first CSS) + Custom global CSS variables for themeing.
- **State Management:** **Zustand** (Lightweight, unopinionated state management for instantaneous UI updates).
- **Editor Engine:** **Tiptap** (A headless wrapper around ProseMirror, providing extreme customizability for the rich-text experience).
- **Icons:** **Lucide React Native**

### Backend & Database (Server-Side / BaaS)
- **Backend as a Service:** **Supabase**
- **Database:** **PostgreSQL** (Relational database for structured data storage).
- **Authentication:** Supabase Auth (Email/Password, secure session management).
- **Security:** **Row Level Security (RLS)** implemented at the PostgreSQL level to ensure strict data isolation between users.

### Deployment & Hosting
- **Hosting:** **Netlify**
- **Build Strategy:** Expo Static Site Generation (SSG) with `_redirects` configuration for SPA client-side routing.

---

## 4. How It Works (Architecture)

### 4.1. Frontend Architecture
Synapse uses a highly modular React architecture. To ensure future compatibility with mobile native apps (iOS/Android), the web app uses React Native Web primitives (`View`, `Text`, `Pressable`, `ScrollView`). 
We wrap these primitives in a custom `tw` (Tailwind) higher-order component to allow seamless inline utility styling (e.g., `<View className="flex-1 bg-synapse-bg" />`).

### 4.2. Data Flow & Optimistic Updates
To make the application feel incredibly fast and responsive:
1. When a user types in the editor or creates a note, the changes are **immediately** saved to the local Zustand store.
2. The UI instantly re-renders using this local state (Optimistic UI).
3. A debounced background sync silently pushes the JSON document structure to the Supabase PostgreSQL database.

### 4.3. The Editor & Storage
Notes are not saved as raw HTML. The Tiptap editor generates a structured JSON Abstract Syntax Tree (AST) (e.g., `{"type": "doc", "content": [...]}`). 
- **Why JSON over HTML?** It is safer against XSS attacks, easier to parse for generating the Graph View, and allows seamless rendering across different platforms (Web, iOS, Android) in the future.
- The app converts this JSON to Markdown on the fly if the user requests an export.

### 4.4. Security Model
The application operates on a "Zero-Trust" database model using PostgreSQL Row Level Security (RLS). 
Even if the frontend code is compromised or a malicious API call is made, the database evaluates the JWT (JSON Web Token) of the currently authenticated user. A user physically cannot `SELECT`, `UPDATE`, or `DELETE` rows in the `notes` table where `user_id` does not match their own UUID, ensuring total privacy.

---

## 5. UI / UX Design Philosophy
The design language is intentionally anti-corporate. Instead of bright white backgrounds and generic blue buttons, Synapse uses:
- **Typography:** *Playfair Display* (Serif) for elegant headings, and *Inter* (Sans-serif) for highly readable body text.
- **Colors:** A warm, desaturated palette featuring `bg-synapse-bg` (Parchment), offset by vibrant accents (`#FF6B35` Orange and `#D4A336` Gold).
- **Animations:** Subtle hardware-accelerated transitions on hovers and modal openings to make the interface feel organic and fluid.

---
*End of Report*
