FinScope – Personal Finance Dashboard 📊

FinScope is a modern, responsive personal finance dashboard designed to help users track their income, expenses, savings goals, and monthly budget in one place.

This project was developed as an useful project using frontend technologies without requiring a backend or database.

🚀 Features

- 📊 Interactive financial dashboard
- 💰 Income management
- 💸 Expense tracking
- 🔎 Search and dynamic filtering
- 📅 Month and date filtering
- ↕️ Expense sorting
- 📈 Interactive charts using Chart.js
- 📊 Monthly expense analytics
- 🔄 Income vs Expense comparison
- 📅 Monthly spending comparison
- 🎯 Savings goal management
- 💵 Monthly budget management
- ⚠️ Budget limit warnings
- 💾 LocalStorage data persistence
- 📥 Export expenses to CSV
- 🌙 Light/Dark mode
- 📱 Fully responsive design
- 🔔 Toast notifications
- ✅ Form validation
- ♿ Accessibility-friendly interface

🛠️ Technologies Used

- HTML5 – Semantic webpage structure
- CSS3 – Responsive and modern UI design
- JavaScript (ES6+) – Application logic and dynamic interactions
- Chart.js – Interactive financial charts
- LocalStorage – Client-side data persistence
- Git & GitHub – Version control and project hosting
- Netlify – Deployment and hosting

📂 Project Structure

FinScope/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
    └── images/icons (if required)

📊 Dashboard

The dashboard provides an overview of the user's financial activity, including:

- Total Income
- Total Expenses
- Current Balance
- Total Savings
- Recent Transactions
- Monthly Expenses
- Expense Categories
- Income vs Expenses
- Savings Goals
- Monthly Budget

💸 Expense Tracker

Users can add and manage expenses with:

- Expense name
- Amount
- Category
- Date
- Optional description

Available categories:

- Food
- Transport
- Education
- Shopping
- Entertainment
- Bills
- Healthcare
- Other

Users can also edit or delete existing expenses.

💰 Income Management

Income records can be added, edited, and deleted.

Supported income sources include:

- Salary
- Freelance
- Scholarship
- Other

Income is automatically included in dashboard calculations and analytics.

🎯 Savings Goals

Users can create savings goals by entering:

- Goal name
- Target amount
- Current saved amount

FinScope automatically calculates:

- Amount remaining
- Completion percentage
- Progress bar

Example:

New Laptop
Target: ₹30,000
Saved: ₹12,000
Progress: 40%

💵 Budget Management

Users can set a monthly spending budget.

The application displays:

- Monthly budget
- Amount spent
- Remaining amount
- Budget usage percentage
- Progress indicator
- Warning when the budget is close to or exceeds the limit

📈 Analytics

FinScope uses Chart.js to display interactive visualizations:

- Category-wise expense doughnut chart
- Monthly expense bar chart
- Income vs expense line chart
- Monthly financial trends

Charts automatically update whenever financial data changes.

📅 Monthly Comparison

Users can compare expenses between two different months.

For example:

August 2026 vs September 2026

The application displays:

- Expenses for each month
- Spending difference
- Percentage increase/decrease
- Visual trend indicator

💾 LocalStorage

FinScope does not use a backend or database.

Financial data is stored in the browser using LocalStorage.

The following information is persisted:

Expenses
Income
Savings Goals
Monthly Budget
Theme Preference

This means data remains available after refreshing or reopening the browser on the same device/browser.

📥 Export CSV

Users can export their expense records as a CSV file.

The exported file contains:

Name
Amount
Category
Date
Description

This allows users to analyze their expenses using spreadsheet applications.

🌙 Theme Support

FinScope supports:

- Light Mode
- Dark Mode

The selected theme is saved using LocalStorage so the preference remains after reopening the application.

📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The layout automatically adapts to different screen sizes.

▶️ How to Run Locally

Option 1 – Open directly

Download or clone the repository and open:

index.html

in a modern web browser.

Option 2 – Using VS Code

Open the project folder in VS Code and use the Live Server extension.

Open:

index.html

with Live Server.

🔧 Installation

No package installation is required.

There is:

- No Node.js requirement
- No npm requirement
- No backend
- No database
- No API key
- No environment variables

Chart.js is loaded through a CDN.

🌐 Deployment

The project can be deployed easily using Netlify.

Deployment flow:

GitHub Repository
       ↓
     Netlify
       ↓
Live Website

Since FinScope is a static frontend project, no build command or environment variables are required.

🔐 Privacy

FinScope stores financial data locally in the user's browser.

No financial information is sent to a backend server because this project does not have a backend.

🎓 Project Purpose

This project was created as a frontend portfolio/resume project to demonstrate practical knowledge of:

- Frontend development
- JavaScript DOM manipulation
- CRUD operations
- LocalStorage
- Data filtering and sorting
- Data visualization
- Responsive web design
- Form validation
- Accessibility
- Git/GitHub
- Web deployment

🔮 Future Improvements

Possible future enhancements include:

- User authentication
- Cloud synchronization
- Backend API
- Database integration
- PDF financial reports
- Advanced budget recommendations
- Recurring transactions
- More detailed financial analytics
- Multiple currency support
- PWA/offline support

👩‍💻 Author

Abisha S

Computer Science Student

⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
