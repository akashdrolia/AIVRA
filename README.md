<div align="center">

<font size="1000"> **AIVRA** </font>
</div>
<div align="center">
AI Virtual Resource Assistant
Node JS • React JS • PostgreSQL • JWT Auth • Ollama AI Integration
</div>

AIVRA is a full-stack, privacy-centric generative AI platform that enables users to interact with Large Language Models (LLMs) locally. By leveraging the PERN stack and Ollama, AIVRA provides a seamless, ChatGPT-like experience without relying on expensive, third-party cloud APIs.

**🚀 Core Features**
Conversational Intelligence: Integrated with Ollama to run models like Llama 3 or Mistral locally.

Dynamic Session Management: State-driven chat workspace allowing users to create, rename, and persist multiple conversation threads.

Persistent Storage: All chat history and user preferences are stored in a normalized PostgreSQL database.

Modern UI/UX: Responsive interface built with Material-UI (MUI) featuring a custom dark/purple theme, auto-focus flows, and sidebar navigation.

Secure Authentication: User accounts protected via JWT (JSON Web Tokens) and encrypted password storage.

**🛠️ Technical Stack**
**Frontend:** React.js, Material-UI, Context API

**Backend:** Node.js, Express.js

**Database:** PostgreSQL (Relational schema for session/message tracking)

**AI Engine:** Ollama (Local LLM Runtime)

**Development:** AI-Augmented via GitHub Copilot

**🏗️ System Architecture**
The application follows a decoupled architecture to handle the high latency associated with AI inference:

Frontend (React): Handles real-time UI updates and manages complex chat states.

API Layer (Node/Express): Acts as a bridge between the user and the local LLM, implementing robust error logging to catch model timeouts.

Data Layer (PostgreSQL): Ensures data integrity and quick retrieval of chat history through optimized indexing.

**📈 Engineering Highlights**
Latency Management: Implemented graceful client-side error handling to manage LLM "cold starts" and processing delays.

State-Driven Navigation: Developed a custom routing logic to handle "Chats, Advice, and History" views within a single-page application (SPA) framework.

Profile Customization: Built an editable user profile system with career-specific fields to tailor the AI's response context.

**🔧 Installation & Setup**
Clone the repo: git clone https://github.com/yourusername/AIVRA.git

Setup Ollama: Ensure Ollama is installed and running locally.

Configure DB: Create a PostgreSQL database and update your .env credentials.

Install Dependencies: ```bash npm install # Root (Backend) cd client && npm install # Frontend

Run the App: ```bash npm run dev
