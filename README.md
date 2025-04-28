Tasky
<div align="center"> <img src="https://raw.githubusercontent.com/yourusername/tasky/main/client/public/tasky-logo.png" alt="Tasky Logo" width="200"> <h3>Streamlined Task Management with Real-Time Collaboration</h3>

<img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg">
<img alt="React" src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react">
<img alt="Spring Boot" src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=spring-boot">
<img alt="WebSocket" src="https://img.shields.io/badge/WebSocket-Enabled-4caf50">
</div>
📖 Overview
Tasky is a powerful task management platform designed for modern teams. It combines intuitive project organization with real-time communication features to enhance productivity and team collaboration. Whether managing personal tasks or coordinating complex team projects, Tasky provides the tools you need to stay organized and connected.

✨ Features
📋 Task Management
Interactive Kanban Boards - Visualize workflows with drag-and-drop functionality
Task Customization - Set priorities, deadlines, labels, and assignees
Smart Filtering - Find tasks by status, priority, due date, or team member
Progress Tracking - Track completion rates and project status at a glance
💬 Real-Time Communications
Instant Messaging - Chat with team members without switching applications
Message Notifications - Get alerted when new messages arrive
User Presence Indicators - See who's online and available
Conversation History - Search and reference past discussions
🔒 Security & Administration
Role-Based Access Control - Control who can view or modify projects
JWT Authentication - Secure user sessions and API endpoints
Data Encryption - Protect sensitive information in transit and at rest
Activity Logging - Track changes and maintain accountability
🎨 User Experience
Responsive Design - Seamless experience across desktop and mobile devices
Customizable Interface - Personalize views to suit your workflow
Keyboard Shortcuts - Navigate efficiently for power users
Accessibility Support - Designed for users of all abilities
🚀 Technology Stack
Frontend
React - Component-based UI development with hooks
STOMP/WebSocket - Real-time bidirectional communication
CSS3/SASS - Custom styling with responsive design
Axios - Promise-based HTTP client for API requests
Backend
Spring Boot - Fast and efficient API development
Spring Security - Authentication and authorization
Spring Data JPA - Database operations and ORM
WebSocket - Real-time messaging infrastructure
Database & Storage
MySQL/PostgreSQL - Relational database support
Redis - Caching and session management
AWS S3 - File storage for attachments (optional)
📦 Installation
Prerequisites
Node.js 16.x or later
Java JDK 17 or later
Maven 3.8+
MySQL 8.0 or PostgreSQL 13+
Backend Setup:

# Clone the repository
git clone https://github.com/yourusername/tasky.git
cd tasky

# Configure database
# Edit application.properties with your database credentials

# Build and run the server
cd server
mvn clean install
mvn spring-boot:run

Frontend Setup:

# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev

🖥️ Usage
Creating a Project

1. Click "New Project" in the dashboard
2. Enter project name, description, and select team members
3. Choose template or start from scratch
4. Set project visibility and permissions

Managing Tasks:
1. Navigate to project board
2. Click "+ Add Task" in the appropriate column
3. Fill in task details including title, description, priority
4. Assign team members and set deadline
5. Drag and drop tasks between status columns as they progress

Communication:
1. Select a user or channel from the sidebar
2. Type message in the input field
3. Press Enter or click Send
4. Use @mentions to notify specific team members
5. Attach files by clicking the paperclip icon

📊 API Documentation
Tasky provides a comprehensive RESTful API for integrating with other services:

API Docs: https://api.taskyapp.com/docs
Swagger UI: Available at http://localhost:9193/swagger-ui.html when running locally
Postman Collection: Available in the /docs directory
🛠️ Configuration Options

Option	Default	Description
APP_PORT	9193	Backend server port
CLIENT_PORT	5173	Frontend development server port
DB_TYPE	mysql	Database type (mysql or postgresql)
JWT_EXPIRATION	3600000	JWT token expiration in ms
WS_ENDPOINT	/ws	WebSocket endpoint path
ENABLE_HISTORY	true	Store chat message history
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

