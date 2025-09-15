# 💰 BudgetTrack

**A modern budgeting app for students & young adults to track income and expenses with AI-driven personalized insights to save more and stop overspending.**

![BudgetTrack](https://img.shields.io/badge/Status-Active-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-orange)

## 🌟 Features

### 📊 **Dashboard & Analytics**
- **Real-time Overview**: Track income, expenses, and current balance at a glance
- **Visual Charts**: Interactive pie charts and line graphs for spending patterns
- **Category Breakdown**: Detailed spending analysis by category
- **Balance Tracking**: Monitor your financial health with color-coded summaries

### 💸 **Expense & Income Management**
- **Quick Entry**: Add expenses and income with simple form inputs
- **Smart Categories**: Organize transactions by type (income/expense)
- **Date Tracking**: Automatic timestamping with custom date options
- **CRUD Operations**: Create, read, update, and delete transactions seamlessly

### 🎯 **Goal Setting & Tracking**
- **Financial Goals**: Set savings targets with deadlines
- **Progress Monitoring**: Track completion status of financial objectives
- **Goal Management**: Create, update, and mark goals as completed
- **Deadline Alerts**: Keep track of important financial milestones

### 🤖 **AI-Powered Insights**
- **Smart Analysis**: Get personalized spending insights using OpenAI GPT-4
- **Spending Patterns**: Identify areas where you're overspending (>30% in any category)
- **Custom AI Summaries**: Generate detailed financial reports and recommendations
- **Behavioral Tips**: Receive actionable advice to improve your financial habits

### 📝 **Quick Notes**
- **Financial Reminders**: Jot down quick notes about expenses or financial goals
- **Contextual Notes**: Add notes related to specific transactions or insights

### 📱 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tailwind CSS**: Clean, modern interface with beautiful styling
- **Dark Mode**: Stylish dark theme for insights page
- **Intuitive Navigation**: Easy-to-use navigation between different features

## 🏗️ Architecture

**Frontend (React):**
- React 18 with modern hooks and context
- React Router for navigation
- Recharts for data visualization
- Tailwind CSS for styling
- Axios for API communication

**Backend (Node.js/Express):**
- Express.js REST API
- MongoDB with Mongoose ODM
- OpenAI integration for AI insights
- CORS enabled for frontend communication
- Helmet for security

**Database (MongoDB):**
- Expense/Income tracking
- Goals management
- Flexible schema for future enhancements

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (optional for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dionjoshualobo/budgettrack.git
cd budgettrack
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/budgettrack
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

5. **Start MongoDB**
Make sure MongoDB is running locally or update the connection string for Atlas.

6. **Run the Application**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

7. **Access the App**
Open your browser and navigate to `http://localhost:3000`

The backend API will be running on `http://localhost:5000`

## 📋 API Endpoints

### Expenses/Transactions
- `GET /api/expenses` - Fetch all transactions
- `POST /api/expenses` - Create new transaction
- `PUT /api/expenses/:id` - Update transaction
- `DELETE /api/expenses/:id` - Delete transaction

### Goals
- `GET /api/goals` - Fetch all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Insights
- `GET /api/insights?from=DATE&to=DATE` - Get spending insights for date range
- `POST /api/ai-summary` - Generate AI-powered financial summary

## 💻 Usage Guide

### Adding Transactions
1. Navigate to "Add Expense" from the navigation
2. Fill in the transaction details (title, amount, type)
3. Click "Add Transaction" to save

### Viewing Dashboard
- Dashboard shows real-time overview of your finances
- Interactive charts display spending patterns
- Color-coded cards show income, expenses, and balance

### Setting Goals
1. Go to "Goals" section
2. Create new financial goals with target amounts and deadlines
3. Track progress and mark goals as completed

### Getting AI Insights
1. Visit "AI Insights" page
2. View automated spending analysis
3. Get personalized recommendations for better financial habits
4. Use the AI summary feature for detailed reports

## 🛠️ Development

### Project Structure
```
budgettrack/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Main page components
│   │   ├── context/     # React context for state
│   │   └── assets/
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Adding New Features
1. For new API endpoints, add routes in `backend/routes/`
2. Update MongoDB models in `backend/models/`
3. Add frontend pages in `frontend/src/pages/`
4. Update navigation in `frontend/src/App.jsx`

## 🔧 Configuration

### MongoDB Setup
**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/budgettrack
```

**MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/budgettrack
```

### OpenAI Integration
1. Get an API key from OpenAI
2. Add to `.env` file:
```env
OPENAI_API_KEY=sk-your-api-key-here
```
3. AI features will work automatically

## 🚀 Deployment

### Vercel Deployment (Single Full-Stack Application)

This project is configured for easy deployment on Vercel as a single full-stack application where the Express backend serves the React frontend.

#### Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Add full-stack Vercel configuration"
git push origin deploy  # or your target branch
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import your GitHub repository
   - Select the `deploy` branch (or your deployment branch)
   - **Important**: Set the root directory to the repository root (not backend or frontend)
   - Vercel will automatically detect the configuration from `vercel.json`

3. **Set Environment Variables in Vercel Dashboard**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/budgettrack
   OPENAI_API_KEY=sk-your-openai-api-key-here
   NODE_ENV=production
   ```

4. **Deploy!**
   - Vercel will:
     - Install backend dependencies
     - Build the React frontend automatically
     - Deploy the Express server that serves both API and frontend
     - Give you a single URL for the full application

#### How It Works

- **Backend** (`/api/*` routes): Express.js serves API endpoints
- **Frontend** (all other routes): Express.js serves the built React app
- **Single Domain**: Both frontend and backend run on the same Vercel URL
- **Automatic Builds**: Frontend builds automatically during backend deployment

#### Project Structure for Deployment
```
budgettrack/
├── backend/          # Express server + API
│   ├── server.js     # Main server (serves API + static files)
│   ├── package.json  # Backend deps + build scripts
│   └── vercel.json   # Deployment config
├── frontend/         # React application
│   ├── src/          # React source code
│   ├── package.json  # Frontend dependencies
│   └── build/        # Generated by build process
├── vercel.json       # Root deployment configuration
└── README.md
```

### Alternative Deployment Options

#### Manual CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel --prod
```

#### Other Platforms (Heroku, Railway, etc.)
1. Set environment variables in your hosting platform
2. Use the `heroku-postbuild` script in backend/package.json
3. Deploy using `npm start` from the backend directory

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Yashu** - Backend Development
- **Gayathri** - Frontend Development

## 🙏 Acknowledgments

- OpenAI for AI-powered insights
- Recharts for beautiful data visualizations
- Tailwind CSS for modern styling
- MongoDB for flexible data storage

---

**Happy Budgeting! 💰✨**
