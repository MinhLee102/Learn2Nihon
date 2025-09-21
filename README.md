# **Learn2Nihon**

## 👥 Team Information
- **University:** University of Engineering and Technology, VNU
- **Numbers of team members:** 4 members
- **Member details:**
    - Lê Đức Minh: Team lead and Frontend.
    - Đỗ Chí Long: Frontend
    - Đỗ Tuấn Hưng: Backend
    - Đặng Đình Khang: Backend
- **Collaboration tools:** GitHub, Jira and Discord
- **Project duration:** 2 months
---

> This README only provides **project overview, tech stack, directory structure and installation & setup on local computer**. 

> **UPDATED:** Project is now deployed. Web domain's name: [Learn2Nihon](http://learnnihon.me/)

> For more details on **web's features**, access: [Features](FEATURES.md)

## **I. Setup**
- Prepare enviroment for project:
    - Frontend: 
        + Download Node.js (node -v --> v22.17.0; npm, npx --> 10.9.2)
        + Open cmd in frontend folder 
        + Run: npm install
    - Backend: 
        + Download Python 3.13.5
        + Open cmd in backend folder
        + Create virtual environment: python -m venv venv
        + Activate: venv\Scripts\activate
        + Run: pip install -r requirements.txt

## **II. Project Overview**
- Many learners face difficulties when studying Japanese, especially in memorizing vocabulary, kanji, reading comprehension, and practicing real-life communication. Existing applications often focus only on grammar or isolated vocabulary, lacking interactivity and personalization.

- To address these challenges, our team proposes Learn2Nihon, an online Japanese learning platform that helps users review vocabulary and kanji effectively, improve reading skills, and provides an interactive environment to practice communication.

- With this approach, we aim to create a more engaging and practical learning experience, supporting learners to achieve their language goals more efficiently.

## **III. Project Tech Stack**

### **Frontend:**

- Language: TypeScript
- Framework: React.js + Next.js
- CSS Framework: Tailwind CSS
- State Management: React Context API
- API Call: Axios

### **Backend:**

- Language: Python
- Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy + Alembic
- Deployment: Docker

### **Collaboration Tools:**

- Version Control: GitHub
- Project Management: Jira

## **IV. Project Directory Structure** 

### `/frontend/`


```
frontend/
└── src/
    ├── app/                         # Main application routes (App Router)
    │   ├── (auth)/                  #Route for authentication 
    │   │   ├──login/
    │   │   ├──signup/
    │   │   ├──check-mail/
    │   │   └── layout.tsx           #Layout for authentication related pages 
    │   ├── (main)/                  #Route for main pages  
    │   │   ├──kaiwa/
    │   │   ├── kanji/[id]/
    │   │   ├── reading/[id]/
    │   │   ├── vocabulary/[id]/
    │   │   ├── page.tsx             # Homepage
    │   │   └── layout.tsx           # Layout for main pages
    │   └── layout.tsx               # Overall Layout
    ├── components/                  # Reusable React components (Button, Header, InputField,....)
    ├── context/                     # React Context for global state (AuthContext, LayoutContext)
    ├── hooks/                       # Custom React hooks (useReading, useSpeech2Text )
    ├── types/                       # Global TypeScript type definitions (interfaces)
    ├── styles/                      # Global CSS file
    └──lib/                          # Utility functions, especially for API calls
```
### `/backend/`

```
backend/
├── alembic/           # Handles database migrations
│   └── versions/      # Contains migration scripts for each version
├── app/               # Main application source code directory
│   ├── api/           # Module to aggregate and manage all API routers
│   ├── crud/          # Contains CRUD functions (Create, Read, Update, Delete) that interact directly with the database
│   ├── csv_data/      # Contains CSV data files (if any)
│   ├── json_data/     # Contains JSON data files (if any)
│   ├── models/        # Defines SQLAlchemy ORM models (maps to database tables)
│   ├── routers/       # Defines API endpoints (e.g., /users, /items)
│   ├── schemas/       # Contains Pydantic schemas for data validation and serialization
│   ├── services/      # Contains business logic, handles complex tasks
│   ├── config.py      # Contains application configuration variables
│   ├── database.py    # Database connection setup
│   └── main.py        # Main entry point to initialize and run the FastAPI application
├── utils.py           # Contains utility/helper functions for use across the project
├── .env               # File for environment variables (database URL, secret keys, etc.)
├── alembic.ini        # Configuration file for Alembic
├── Dockerfile         # Instructions for building the application's Docker image
└── requirements.txt   # List of required Python dependencies for the project
```

