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
    ├── app/            # Main application routes (App Router)
    │   ├── (auth)/    #Route for authentication 
    │   │   ├──login/
    │   │   ├──signup/
    │   │   ├──check-mail/
    │   │   └── layout.tsx             #Layout for authentication related pages 
    │   ├── (main)/           #Route for main pages  
    │   │   ├──kaiwa/
    │   │   ├── kanji/[id]/
    │   │   ├── reading/[id]/
    │   │   ├── vocabulary/[id]/
    │   │   ├── page.tsx    # Homepage
    │   │   └── layout.tsx  # Layout for main pages
    │   └── layout.tsx  # Overall Layout
    ├── components/     # Reusable React components (Button, Header, InputField,....)
    ├── context/        # React Context for global state (AuthContext, LayoutContext)
    ├── hooks/          # Custom React hooks (useReading, useSpeech2Text )
    ├── types/          # Global TypeScript type definitions (interfaces)
    ├── styles/          # Global CSS file
    └──lib/          # Utility functions, especially for API calls
```
### `/backend/`

