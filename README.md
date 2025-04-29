Tasky
<div align="center"> <img src="https://raw.githubusercontent.com/yourusername/tasky/main/client/public/tasky-logo.png" alt="Tasky Logo" width="200" /> <h3>Simple Task & Team Management with Real-Time Chat</h3> <img alt="React" src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react" /> <img alt="Spring Boot" src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=spring-boot" /> <img alt="WebSocket" src="https://img.shields.io/badge/WebSocket-Enabled-4caf50" /> </div>
📖 What is Tasky?
Tasky helps people and teams get work done by organizing tasks, tracking progress, and chatting in real-time — all in one place. Whether you're planning a small personal project or working with a big team, Tasky makes it easy to stay on track and in touch.

✨ What You Can Do
✅ Stay Organized
Drag and drop tasks on a visual board

Add priorities, deadlines, tags, and team members to tasks

Filter tasks to find what you need fast

Keep track of what’s done and what’s still in progress

💬 Talk With Your Team
Send messages instantly without switching apps

Get notified when someone sends you a message

See who’s online right now

Look back at past conversations when needed

🔒 Safe and Secure
Choose who can see or change things

Sign in safely with secure login

Keep your data safe with encryption

Log all changes so you can track what happened

🎨 Easy to Use
Works great on computers and phones

Change how your workspace looks to fit your style

Use keyboard shortcuts to move faster

Designed for everyone, including people with disabilities

🛠️ What It's Built With
Frontend
React – For building the user interface

WebSocket + STOMP – For real-time updates and chat

CSS/SASS – For styling

Axios – To send requests to the backend

Backend
Spring Boot – For handling API and logic

Spring Security – For user login and permissions

JPA – For working with the database

WebSocket – For real-time messaging

Database & Storage
MySQL or PostgreSQL – To store data

Redis – To speed things up and manage sessions

AWS S3 (optional) – To store files like attachments

📦 How to Set It Up
Requirements
Node.js (version 16 or higher)

Java JDK 17 or higher

Maven 3.8 or higher

MySQL 8+ or PostgreSQL 13+

Backend (Server)
bash
Copy
Edit
# Clone the project
git clone https://github.com/yourusername/tasky.git
cd tasky

# Update your database info in server/src/main/resources/application.properties

# Build and start the backend
cd server
mvn clean install
mvn spring-boot:run
Frontend (Client)
bash
Copy
Edit
cd ../client

# Install everything
npm install

# Start the app
npm run dev
🖥️ How to Use Tasky
Make a New Project
Click "New Project" on the main screen

Add a name, description, and pick your team

Choose a template or start fresh

Set who can see and edit the project

Add and Manage Tasks
Go to the project board

Click "+ Add Task"

Fill in task name, details, and pick team members

Set deadlines or tags

Drag tasks between columns as they move forward

Chat with Others
Pick a teammate or group on the sidebar

Type your message and hit Enter

Use @name to tag someone

Click the paperclip to attach a file

📊 API Info
Full API Docs: https://api.taskyapp.com/docs

Swagger UI (for local testing): http://localhost:9193/swagger-ui.html

Postman Collection: Check the /docs folder

⚙️ Settings You Can Change

| Setting           | Default   | What It Does                          |
|-------------------|-----------|----------------------------------------|
| `APP_PORT`        | `9193`    | Port for backend server               |
| `CLIENT_PORT`     | `5173`    | Port for frontend dev server          |
| `DB_TYPE`         | `mysql`   | Choose `mysql` or `postgresql`        |
| `JWT_EXPIRATION`  | `3600000` | How long login stays active (ms)      |
| `WS_ENDPOINT`     | `/ws`     | WebSocket path for real-time chat     |
| `ENABLE_HISTORY`  | `true`    | Save chat history or not              |
🤝 Want to Help?
We’d love your help! To contribute:

Fork this repo

Create a new branch: git checkout -b feature/your-feature-name

Make your changes and commit: git commit -m "Add your feature"

Push it: git push origin feature/your-feature-name

Open a Pull Request on GitHub
