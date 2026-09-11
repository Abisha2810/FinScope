// ==========================================
// FinScope - Personal Finance Dashboard
// Main JavaScript File
// ==========================================

const CATEGORIES = [
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Other"
];

const STORAGE = {
  expenses: "finscope_expenses",
  income: "finscope_income",
  goals: "finscope_goals",
  budget: "finscope_budget",
  theme: "finscope_theme",
  samples: "finscope_samples_cleared"
};

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

const today = () => new Date().toISOString().slice(0, 10);

const monthKey = (date) => String(date || "").slice(0, 7);

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

let expenses = load(STORAGE.expenses, []);
let income = load(STORAGE.income, []);
let goals = load(STORAGE.goals, []);

let budget =
  Number(localStorage.getItem(STORAGE.budget)) || 15000;

let charts = {};
let activeSection = "dashboard";


// ==========================================
// LOCAL STORAGE
// ==========================================

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveAll() {
  localStorage.setItem(
    STORAGE.expenses,
    JSON.stringify(expenses)
  );

  localStorage.setItem(
    STORAGE.income,
    JSON.stringify(income)
  );

  localStorage.setItem(
    STORAGE.goals,
    JSON.stringify(goals)
  );

  localStorage.setItem(
    STORAGE.budget,
    String(budget)
  );
}


// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
  );
}

function currentMonth() {
  return monthKey(today());
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;
  toast.textContent = message;

  document
    .getElementById("toastArea")
    .appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

function confirmDelete(message) {
  return window.confirm(message);
}


// ==========================================
// SAMPLE DATA
// ==========================================

function seedData() {
  if (
    localStorage.getItem(STORAGE.samples) === "cleared" ||
    localStorage.getItem(STORAGE.expenses)
  ) {
    return;
  }

  const year = new Date().getFullYear();

  const month = String(
    new Date().getMonth() + 1
  ).padStart(2, "0");

  const date = (day) =>
    `${year}-${month}-${String(day).padStart(2, "0")}`;

  expenses = [
    {
      id: uid(),
      name: "Groceries",
      amount: 2500,
      category: "Food",
      date: date(3),
      description: "Weekly groceries"
    },

    {
      id: uid(),
      name: "Bus & Auto",
      amount: 1200,
      category: "Transport",
      date: date(5),
      description: "Daily commute"
    },

    {
      id: uid(),
      name: "Online Course",
      amount: 3000,
      category: "Education",
      date: date(8),
      description: "Web development course"
    },

    {
      id: uid(),
      name: "Clothing",
      amount: 2000,
      category: "Shopping",
      date: date(12),
      description: "Casual wear"
    },

    {
      id: uid(),
      name: "Electricity Bill",
      amount: 1450,
      category: "Bills",
      date: date(15),
      description: "Monthly electricity"
    },

    {
      id: uid(),
      name: "Movie Night",
      amount: 650,
      category: "Entertainment",
      date: date(18),
      description: "Weekend outing"
    }
  ];

  income = [
    {
      id: uid(),
      source: "Scholarship",
      amount: 5000,
      date: date(2)
    },

    {
      id: uid(),
      source: "Freelance",
      amount: 8000,
      date: date(10)
    }
  ];

  goals = [
    {
      id: uid(),
      name: "New Laptop",
      target: 30000,
      saved: 12000
    },

    {
      id: uid(),
      name: "Course Fee",
      target: 10000,
      saved: 4500
    },

    {
      id: uid(),
      name: "Emergency Fund",
      target: 20000,
      saved: 7500
    }
  ];

  saveAll();
}


// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  seedData();

  populateCategories();

  setupNavigation();

  setupModal();

  setupFilters();

  bindButtons();

  applyTheme();

  document.getElementById(
    "budgetInput"
  ).value = budget || "";

  document.getElementById(
    "compareMonth2"
  ).value = currentMonth();

  const previousMonth = new Date();

  previousMonth.setMonth(
    previousMonth.getMonth() - 1
  );

  document.getElementById(
    "compareMonth1"
  ).value = previousMonth
    .toISOString()
    .slice(0, 7);

  renderAll();
}


// ==========================================
// CATEGORY DROPDOWNS
// ==========================================

function populateCategories() {
  const expenseCategory =
    document.getElementById(
      "expenseCategory"
    );

  const categoryFilter =
    document.getElementById(
      "categoryFilter"
    );

  expenseCategory.innerHTML =
    CATEGORIES.map(
      (category) =>
        `<option value="${category}">
          ${category}
        </option>`
    ).join("");

  categoryFilter.innerHTML =
    `<option value="">All categories</option>` +
    CATEGORIES.map(
      (category) =>
        `<option value="${category}">
          ${category}
        </option>`
    ).join("");
}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {
  document
    .querySelectorAll(
      ".nav-link[data-section]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => navigate(button.dataset.section)
      );
    });

  document
    .querySelectorAll(
      "[data-section-jump]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () =>
          navigate(
            button.dataset.sectionJump
          )
      );
    });

  document
    .getElementById("mobileMenuBtn")
    .addEventListener("click", () => {
      document
        .getElementById("sidebar")
        .classList.toggle("open");
    });
}

function navigate(section) {
  activeSection = section;

  document
    .querySelectorAll(".page-section")
    .forEach((sectionElement) => {
      sectionElement.classList.toggle(
        "active",
        sectionElement.id === section
      );
    });

  document
    .querySelectorAll(
      ".nav-link[data-section]"
    )
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.section === section
      );
    });

  document
    .getElementById("sidebar")
    .classList.remove("open");

  if (section === "comparison") {
    renderComparison();
  }
}


// ==========================================
// BUTTON EVENTS
// ==========================================

function bindButtons() {
  document
    .getElementById("quickExpenseBtn")
    .addEventListener(
      "click",
      () => openModal("expense")
    );

  document
    .getElementById("addExpenseBtn")
    .addEventListener(
      "click",
      () => openModal("expense")
    );

  document
    .getElementById("addIncomeBtn")
    .addEventListener(
      "click",
      () => openModal("income")
    );

  document
    .getElementById("addGoalBtn")
    .addEventListener(
      "click",
      () => openModal("goal")
    );

  document
    .getElementById("exportBtn")
    .addEventListener(
      "click",
      exportCSV
    );

  document
    .getElementById("clearSampleBtn")
    .addEventListener(
      "click",
      clearSampleData
    );

  document
    .getElementById("themeBtn")
    .addEventListener(
      "click",
      toggleTheme
    );

  document
    .getElementById("notificationBtn")
    .addEventListener(
      "click",
      () =>
        showToast(
          "You're all caught up!"
        )
    );

  document
    .getElementById("budgetForm")
    .addEventListener(
      "submit",
      handleBudgetSubmit
    );

  document
    .getElementById("globalSearch")
    .addEventListener(
      "input",
      (event) => {
        document.getElementById(
          "expenseSearch"
        ).value = event.target.value;

        navigate("expenses");

        renderExpenses();
      }
    );
}


// ==========================================
// BUDGET
// ==========================================

function handleBudgetSubmit(event) {
  event.preventDefault();

  const value = Number(
    document.getElementById(
      "budgetInput"
    ).value
  );

  if (value <= 0) {
    showToast(
      "Budget must be greater than 0.",
      "error"
    );

    return;
  }

  budget = value;

  saveAll();

  renderAll();

  showToast(
    "Monthly budget saved."
  );
}


// ==========================================
// FILTERS
// ==========================================

function setupFilters() {
  [
    "expenseSearch",
    "categoryFilter",
    "monthFilter",
    "dateFilter",
    "sortFilter"
  ].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener(
        "input",
        renderExpenses
      );
  });

  [
    "compareMonth1",
    "compareMonth2"
  ].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener(
        "change",
        renderComparison
      );
  });
}


// ==========================================
// MODAL
// ==========================================

function setupModal() {
  document
    .getElementById("closeModal")
    .addEventListener(
      "click",
      closeModal
    );

  document
    .getElementById("cancelModal")
    .addEventListener(
      "click",
      closeModal
    );

  document
    .getElementById("modalBackdrop")
    .addEventListener(
      "click",
      (event) => {
        if (
          event.target.id ===
          "modalBackdrop"
        ) {
          closeModal();
        }
      }
    );

  document
    .getElementById("transactionForm")
    .addEventListener(
      "submit",
      handleFormSubmit
    );
}

function openModal(type, data = null) {
  const form =
    document.getElementById(
      "transactionForm"
    );

  form.reset();

  document.getElementById(
    "transactionType"
  ).value = type;

  document.getElementById(
    "transactionId"
  ).value = data?.id || "";

  const title =
    type === "expense"
      ? "Expense"
      : type === "income"
      ? "Income"
      : "Savings Goal";

  document.getElementById(
    "modalTitle"
  ).textContent =
    `${data ? "Edit" : "Add"} ${title}`;

  document.getElementById(
    "expenseFields"
  ).hidden = type !== "expense";

  document.getElementById(
    "incomeFields"
  ).hidden = type !== "income";

  document.getElementById(
    "goalFields"
  ).hidden = type !== "goal";

  document.getElementById(
    "formError"
  ).textContent = "";

  // Fill existing expense
  if (
    type === "expense" &&
    data
  ) {
    document.getElementById(
      "expenseName"
    ).value = data.name;

    document.getElementById(
      "expenseAmount"
    ).value = data.amount;

    document.getElementById(
      "expenseCategory"
    ).value = data.category;

    document.getElementById(
      "expenseDate"
    ).value = data.date;

    document.getElementById(
      "expenseDescription"
    ).value =
      data.description || "";
  }

  // Fill existing income
  if (
    type === "income" &&
    data
  ) {
    document.getElementById(
      "incomeSource"
    ).value = data.source;

    document.getElementById(
      "incomeAmount"
    ).value = data.amount;

    document.getElementById(
      "incomeDate"
    ).value = data.date;
  }

  // Fill existing goal
  if (
    type === "goal" &&
    data
  ) {
    document.getElementById(
      "goalName"
    ).value = data.name;

    document.getElementById(
      "goalTarget"
    ).value = data.target;

    document.getElementById(
      "goalSaved"
    ).value = data.saved;
  }

  if (
    type === "expense" &&
    !data
  ) {
    document.getElementById(
      "expenseDate"
    ).value = today();
  }

  if (
    type === "income" &&
    !data
  ) {
    document.getElementById(
      "incomeDate"
    ).value = today();
  }

  if (
    type === "goal" &&
    !data
  ) {
    document.getElementById(
      "goalSaved"
    ).value = 0;
  }

  document.getElementById(
    "modalBackdrop"
  ).hidden = false;

  setTimeout(() => {
    document
      .querySelector(
        "#modalBackdrop input:not([type='hidden'])"
      )
      ?.focus();
  }, 50);
}

function closeModal() {
  document.getElementById(
    "modalBackdrop"
  ).hidden = true;
}


// ==========================================
// ADD / EDIT FORM
// ==========================================

function handleFormSubmit(event) {
  event.preventDefault();

  const type =
    document.getElementById(
      "transactionType"
    ).value;

  const id =
    document.getElementById(
      "transactionId"
    ).value;

  let item;
  let collection;

  // -----------------------------
  // EXPENSE
  // -----------------------------

  if (type === "expense") {
    const name =
      document.getElementById(
        "expenseName"
      ).value.trim();

    const amount = Number(
      document.getElementById(
        "expenseAmount"
      ).value
    );

    const category =
      document.getElementById(
        "expenseCategory"
      ).value;

    const date =
      document.getElementById(
        "expenseDate"
      ).value;

    const description =
      document.getElementById(
        "expenseDescription"
      ).value.trim();

    if (
      !name ||
      !category ||
      !date ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return formError(
        "Please enter a valid name, category, date and amount greater than 0."
      );
    }

    if (
      new Date(`${date}T00:00:00`) >
      new Date()
    ) {
      return formError(
        "Date cannot be in the future."
      );
    }

    item = {
      id: id || uid(),
      name,
      amount,
      category,
      date,
      description
    };

    collection = expenses;
  }

  // -----------------------------
  // INCOME
  // -----------------------------

  else if (type === "income") {
    const source =
      document.getElementById(
        "incomeSource"
      ).value.trim();

    const amount = Number(
      document.getElementById(
        "incomeAmount"
      ).value
    );

    const date =
      document.getElementById(
        "incomeDate"
      ).value;

    if (
      !source ||
      !date ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return formError(
        "Please enter a source, valid date and amount greater than 0."
      );
    }

    if (
      new Date(`${date}T00:00:00`) >
      new Date()
    ) {
      return formError(
        "Date cannot be in the future."
      );
    }

    item = {
      id: id || uid(),
      source,
      amount,
      date
    };

    collection = income;
  }

  // -----------------------------
  // SAVINGS GOAL
  // -----------------------------

  else {
    const name =
      document.getElementById(
        "goalName"
      ).value.trim();

    const target = Number(
      document.getElementById(
        "goalTarget"
      ).value
    );

    const saved = Number(
      document.getElementById(
        "goalSaved"
      ).value
    );

    if (
      !name ||
      !Number.isFinite(target) ||
      target <= 0 ||
      !Number.isFinite(saved) ||
      saved < 0 ||
      saved > target
    ) {
      return formError(
        "Enter a goal name, a target greater than 0, and saved amount between 0 and the target."
      );
    }

    item = {
      id: id || uid(),
      name,
      target,
      saved
    };

    collection = goals;
  }

  // -----------------------------
  // SAVE OR UPDATE
  // -----------------------------

  if (id) {
    const index =
      collection.findIndex(
        (item) => item.id === id
      );

    if (index > -1) {
      collection[index] = item;
    }
  } else {
    collection.push(item);
  }

  saveAll();

  closeModal();

  renderAll();

  showToast(
    `${type[0].toUpperCase() + type.slice(1)}
    ${id ? "updated" : "added"} successfully.`
  );
}

function formError(message) {
  document.getElementById(
    "formError"
  ).textContent = message;
}


// ==========================================
// EXPENSE CRUD
// ==========================================

function editExpense(id) {
  const expense =
    expenses.find(
      (item) => item.id === id
    );

  if (expense) {
    openModal(
      "expense",
      expense
    );
  }
}

function deleteExpense(id) {
  if (
    !confirmDelete(
      "Delete this expense? This action cannot be undone."
    )
  ) {
    return;
  }

  expenses = expenses.filter(
    (item) => item.id !== id
  );

  saveAll();

  renderAll();

  showToast(
    "Expense deleted."
  );
}


// ==========================================
// INCOME CRUD
// ==========================================

function editIncome(id) {
  const item =
    income.find(
      (incomeItem) =>
        incomeItem.id === id
    );

  if (item) {
    openModal(
      "income",
      item
    );
  }
}

function deleteIncome(id) {
  if (
    !confirmDelete(
      "Delete this income? This action cannot be undone."
    )
  ) {
    return;
  }

  income = income.filter(
    (item) => item.id !== id
  );

  saveAll();

  renderAll();

  showToast(
    "Income deleted."
  );
}


// ==========================================
// GOALS CRUD
// ==========================================

function editGoal(id) {
  const goal =
    goals.find(
      (item) => item.id === id
    );

  if (goal) {
    openModal(
      "goal",
      goal
    );
  }
}

function deleteGoal(id) {
  if (
    !confirmDelete(
      "Delete this savings goal?"
    )
  ) {
    return;
  }

  goals = goals.filter(
    (item) => item.id !== id
  );

  saveAll();

  renderAll();

  showToast(
    "Savings goal deleted."
  );
}


// ==========================================
// RENDER ALL
// ==========================================

function renderAll() {
  renderDashboard();
  renderExpenses();
  renderIncome();
  renderGoals();
  renderBudget();
  renderComparison();
  renderCharts();
}


// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {
  const month = currentMonth();

  const totalIncome =
    income
      .filter(
        (item) =>
          monthKey(item.date) === month
      )
      .reduce(
        (total, item) =>
          total + item.amount,
        0
      );

  const totalExpenses =
    expenses
      .filter(
        (item) =>
          monthKey(item.date) === month
      )
      .reduce(
        (total, item) =>
          total + item.amount,
        0
      );

  const totalSavings =
    goals.reduce(
      (total, goal) =>
        total + Number(goal.saved),
      0
    );

  const balance =
    totalIncome - totalExpenses;

  document.getElementById(
    "totalIncome"
  ).textContent =
    currency(totalIncome);

  document.getElementById(
    "totalExpenses"
  ).textContent =
    currency(totalExpenses);

  document.getElementById(
    "currentBalance"
  ).textContent =
    currency(balance);

  document.getElementById(
    "totalSavings"
  ).textContent =
    currency(totalSavings);

  document.getElementById(
    "incomeMeta"
  ).textContent =
    `${income.filter(
      (item) =>
        monthKey(item.date) === month
    ).length} entries this month`;

  document.getElementById(
    "expenseMeta"
  ).textContent =
    `${expenses.filter(
      (item) =>
        monthKey(item.date) === month
    ).length} entries this month`;

  document.getElementById(
    "savingsMeta"
  ).textContent =
    `${goals.length} goal${
      goals.length === 1
        ? ""
        : "s"
    }`;

  // Recent transactions

  const recentTransactions = [
    ...expenses.map((item) => ({
      ...item,
      type: "expense"
    })),

    ...income.map((item) => ({
      ...item,
      type: "income"
    }))
  ]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date)
    )
    .slice(0, 6);

  const recentElement =
    document.getElementById(
      "recentTransactions"
    );

  if (!recentTransactions.length) {
    recentElement.innerHTML = `
      <div class="empty-state">
        <strong>No transactions yet</strong>
        <span>
          Add your first income or expense.
        </span>
      </div>
    `;

    return;
  }

  recentElement.innerHTML =
    recentTransactions
      .map(
        (transaction) => `
        <div class="transaction-row">

          <div class="tx-icon">
            ${
              transaction.type ===
              "expense"
                ? "↘"
                : "↗"
            }
          </div>

          <div class="tx-main">
            <strong>
              ${escapeHTML(
                transaction.name ||
                  transaction.source
              )}
            </strong>

            <small>
              ${escapeHTML(
                transaction.category ||
                  "Income"
              )}
              ·
              ${formatDate(
                transaction.date
              )}
            </small>
          </div>

          <div class="tx-amount ${
            transaction.type
          }">
            ${
              transaction.type ===
              "expense"
                ? "−"
                : "+"
            }

            ${currency(
              transaction.amount
            )}
          </div>

        </div>
      `
      )
      .join("");

  // Dashboard savings goals

  const dashboardGoals =
    document.getElementById(
      "dashboardGoals"
    );

  dashboardGoals.innerHTML =
    goals.length
      ? goals
          .slice(0, 3)
          .map(goalHTML)
          .join("")
      : `
        <div class="empty-state">
          <strong>
            No savings goals
          </strong>

          <span>
            Create a goal to track progress.
          </span>
        </div>
      `;
}


// ==========================================
// GOAL HTML
// ==========================================

function goalHTML(goal) {
  const percentage = Math.min(
    100,
    Math.round(
      (goal.saved / goal.target) *
        100
    )
  );

  return `
    <div
      class="goal-item"
      style="padding:10px 0 16px"
    >

      <div class="goal-top">

        <span class="goal-name">
          ${escapeHTML(
            goal.name
          )}
        </span>

        <strong>
          ${percentage}%
        </strong>

      </div>

      <div class="progress">

        <div
          class="progress-bar"
          style="width:${percentage}%"
        ></div>

      </div>

      <small
        style="
          color:var(--muted);
          display:block;
          margin-top:7px;
        "
      >
        ${currency(
          goal.saved
        )}
        of
        ${currency(
          goal.target
        )}
      </small>

    </div>
  `;
}


// ==========================================
// FILTER EXPENSES
// ==========================================

function filteredExpenses() {
  const search =
    document.getElementById(
      "expenseSearch"
    ).value
      .trim()
      .toLowerCase();

  const category =
    document.getElementById(
      "categoryFilter"
    ).value;

  const month =
    document.getElementById(
      "monthFilter"
    ).value;

  const date =
    document.getElementById(
      "dateFilter"
    ).value;

  const sort =
    document.getElementById(
      "sortFilter"
    ).value;

  let list =
    expenses.filter(
      (expense) =>
        (
          !search ||
          expense.name
            .toLowerCase()
            .includes(search)
        ) &&
        (
          !category ||
          expense.category ===
            category
        ) &&
        (
          !month ||
          monthKey(
            expense.date
          ) === month
        ) &&
        (
          !date ||
          expense.date === date
        )
    );

  list.sort((a, b) => {
    if (sort === "high") {
      return b.amount - a.amount;
    }

    if (sort === "low") {
      return a.amount - b.amount;
    }

    if (sort === "oldest") {
      return a.date.localeCompare(
        b.date
      );
    }

    return b.date.localeCompare(
      a.date
    );
  });

  return list;
}


// ==========================================
// EXPENSE TABLE
// ==========================================

function renderExpenses() {
  const list =
    filteredExpenses();

  const wrapper =
    document.getElementById(
      "expenseTableWrap"
    );

  if (!list.length) {
    wrapper.innerHTML = `
      <div class="empty-state">

        <strong>
          No matching expenses
        </strong>

        <span>
          Try changing your filters
          or add a new expense.
        </span>

        <br>

        <button
          class="btn btn-primary"
          onclick="openModal('expense')"
        >
          ＋ Add Expense
        </button>

      </div>
    `;

    return;
  }

  wrapper.innerHTML = `
    <table class="data-table">

      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        ${list
          .map(
            (expense) => `
            <tr>

              <td data-label="Name">
                <strong>
                  ${escapeHTML(
                    expense.name
                  )}
                </strong>
              </td>

              <td data-label="Category">
                ${escapeHTML(
                  expense.category
                )}
              </td>

              <td data-label="Date">
                ${formatDate(
                  expense.date
                )}
              </td>

              <td data-label="Description">
                ${escapeHTML(
                  expense.description ||
                    "—"
                )}
              </td>

              <td data-label="Amount">
                <strong>
                  ${currency(
                    expense.amount
                  )}
                </strong>
              </td>

              <td data-label="Actions">

                <div class="actions">

                  <button
                    class="small-btn"
                    onclick="editExpense('${expense.id}')"
                  >
                    Edit
                  </button>

                  <button
                    class="small-btn delete"
                    onclick="deleteExpense('${expense.id}')"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>
          `
          )
          .join("")}

      </tbody>

    </table>
  `;
}


// ==========================================
// INCOME TABLE
// ==========================================

function renderIncome() {
  const wrapper =
    document.getElementById(
      "incomeTableWrap"
    );

  if (!income.length) {
    wrapper.innerHTML = `
      <div class="empty-state">

        <strong>
          No income records
        </strong>

        <span>
          Add salary, freelance work,
          scholarship or other income.
        </span>

      </div>
    `;

    return;
  }

  const list = [...income].sort(
    (a, b) =>
      b.date.localeCompare(
        a.date
      )
  );

  wrapper.innerHTML = `
    <table class="data-table">

      <thead>
        <tr>
          <th>Source</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        ${list
          .map(
            (item) => `
            <tr>

              <td data-label="Source">
                <strong>
                  ${escapeHTML(
                    item.source
                  )}
                </strong>
              </td>

              <td data-label="Date">
                ${formatDate(
                  item.date
                )}
              </td>

              <td data-label="Amount">

                <strong
                  class="tx-amount income"
                >
                  +
                  ${currency(
                    item.amount
                  )}
                </strong>

              </td>

              <td data-label="Actions">

                <div class="actions">

                  <button
                    class="small-btn"
                    onclick="editIncome('${item.id}')"
                  >
                    Edit
                  </button>

                  <button
                    class="small-btn delete"
                    onclick="deleteIncome('${item.id}')"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>
          `
          )
          .join("")}

      </tbody>

    </table>
  `;
}


// ==========================================
// SAVINGS GOALS
// ==========================================

function renderGoals() {
  const wrapper =
    document.getElementById(
      "goalsGrid"
    );

  if (!goals.length) {
    wrapper.innerHTML = `
      <article
        class="panel empty-state"
        style="grid-column:1/-1"
      >

        <strong>
          No savings goals yet
        </strong>

        <span>
          Set a target and watch
          your progress grow.
        </span>

        <br>

        <button
          class="btn btn-primary"
          onclick="openModal('goal')"
        >
          ＋ Create Goal
        </button>

      </article>
    `;

    return;
  }

  wrapper.innerHTML = goals
    .map((goal) => {
      const percentage = Math.min(
        100,
        Math.round(
          (goal.saved /
            goal.target) *
            100
        )
      );

      const remaining =
        Math.max(
          0,
          goal.target -
            goal.saved
        );

      return `
        <article class="goal-card">

          <div class="goal-top">

            <div>

              <span class="goal-name">
                ${escapeHTML(
                  goal.name
                )}
              </span>

              <small
                style="
                  display:block;
                  color:var(--muted);
                  margin-top:4px;
                "
              >
                Savings goal
              </small>

            </div>

            <div class="goal-actions">

              <button
                class="small-btn"
                onclick="editGoal('${goal.id}')"
              >
                Edit
              </button>

              <button
                class="small-btn delete"
                onclick="deleteGoal('${goal.id}')"
              >
                ×
              </button>

            </div>

          </div>

          <div class="goal-numbers">

            <div>

              <span>
                Saved
              </span>

              <strong>
                ${currency(
                  goal.saved
                )}
              </strong>

            </div>

            <div
              style="text-align:right"
            >

              <span>
                Target
              </span>

              <strong>
                ${currency(
                  goal.target
                )}
              </strong>

            </div>

          </div>

          <div class="progress">

            <div
              class="progress-bar"
              style="width:${percentage}%"
            ></div>

          </div>

          <div class="goal-percent">

            ${percentage}% complete
            ·
            ${currency(
              remaining
            )}
            remaining

          </div>

        </article>
      `;
    })
    .join("");
}


// ==========================================
// BUDGET DISPLAY
// ==========================================

function renderBudget() {
  const spent =
    expenses
      .filter(
        (expense) =>
          monthKey(
            expense.date
          ) === currentMonth()
      )
      .reduce(
        (total, expense) =>
          total + expense.amount,
        0
      );

  const remaining =
    budget - spent;

  const percentage = budget
    ? Math.min(
        100,
        (spent / budget) * 100
      )
    : 0;

  let statusClass = "";

  if (percentage >= 100) {
    statusClass = "danger";
  } else if (
    percentage >= 80
  ) {
    statusClass = "warning";
  }

  document.getElementById(
    "budgetDisplay"
  ).innerHTML = `

    <div class="budget-display">

      <div class="budget-top">

        <div>

          <span
            style="color:var(--muted)"
          >
            Spent this month
          </span>

          <strong
            style="display:block"
          >
            ${currency(spent)}
          </strong>

        </div>

        <div
          style="text-align:right"
        >

          <span
            style="color:var(--muted)"
          >
            Budget
          </span>

          <strong
            style="display:block"
          >
            ${currency(budget)}
          </strong>

        </div>

      </div>

      <p class="budget-status">

        ${
          remaining >= 0
            ? `${currency(
                remaining
              )} remaining`
            : `${currency(
                Math.abs(
                  remaining
                )
              )} over budget`
        }

      </p>

      <div
        class="budget-progress ${statusClass}"
      >

        <span
          style="width:${percentage}%"
        ></span>

      </div>

      <p
        style="margin-top:9px"
      >

        ${
          percentage >= 100
            ? "⚠ You have reached or exceeded your monthly budget."
            : percentage >= 80
            ? "⚠ You are approaching your budget limit."
            : "✓ Your spending is within the budget."
        }

      </p>

    </div>
  `;
}


// ==========================================
// MONTHLY COMPARISON
// ==========================================

function monthExpenses(month) {
  return expenses
    .filter(
      (expense) =>
        monthKey(
          expense.date
        ) === month
    )
    .reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );
}

function renderComparison() {
  const firstMonth =
    document.getElementById(
      "compareMonth1"
    ).value;

  const secondMonth =
    document.getElementById(
      "compareMonth2"
    ).value;

  if (
    !firstMonth ||
    !secondMonth
  ) {
    return;
  }

  const firstAmount =
    monthExpenses(
      firstMonth
    );

  const secondAmount =
    monthExpenses(
      secondMonth
    );

  const difference =
    secondAmount -
    firstAmount;

  const percentage =
    firstAmount
      ? Math.abs(
          (difference /
            firstAmount) *
            100
        )
      : secondAmount
      ? 100
      : 0;

  const direction =
    difference > 0
      ? "trend-up"
      : difference < 0
      ? "trend-down"
      : "trend-neutral";

  const symbol =
    difference > 0
      ? "↑"
      : difference < 0
      ? "↓"
      : "→";

  const text =
    difference > 0
      ? "increase"
      : difference < 0
      ? "decrease"
      : "no change";

  const firstLabel =
    new Date(
      `${firstMonth}-01`
    ).toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );

  const secondLabel =
    new Date(
      `${secondMonth}-01`
    ).toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    );

  document.getElementById(
    "comparisonResult"
  ).innerHTML = `

    <div class="compare-metrics">

      <div class="metric">

        <span>
          ${firstLabel}
        </span>

        <strong>
          ${currency(
            firstAmount
          )}
        </strong>

      </div>

      <div class="metric">

        <span>
          ${secondLabel}
        </span>

        <strong>
          ${currency(
            secondAmount
          )}
        </strong>

      </div>

      <div class="metric">

        <span>
          Difference
        </span>

        <strong>
          ${currency(
            Math.abs(
              difference
            )
          )}
        </strong>

      </div>

    </div>

    <div class="comparison-summary">

      <strong
        class="${direction}"
        style="font-size:28px"
      >
        ${symbol}
      </strong>

      <div>

        <strong
          class="${direction}"
        >
          ${percentage.toFixed(
            1
          )}%
          ${text}
        </strong>

        <p>

          ${
            difference === 0
              ? "Spending is unchanged between the selected months."
              : difference > 0
              ? "The second month has higher spending."
              : "The second month has lower spending."
          }

        </p>

      </div>

    </div>
  `;
}


// ==========================================
// CHART DATA
// ==========================================

function sixMonths() {
  const result = [];

  const date = new Date();

  date.setDate(1);

  date.setMonth(
    date.getMonth() - 5
  );

  for (
    let i = 0;
    i < 6;
    i++
  ) {
    const key =
      date.toISOString()
        .slice(0, 7);

    result.push(key);

    date.setMonth(
      date.getMonth() + 1
    );
  }

  return result;
}


// ==========================================
// CHART THEME
// ==========================================

function chartTheme() {
  const styles =
    getComputedStyle(
      document.documentElement
    );

  return {
    text: styles
      .getPropertyValue(
        "--muted"
      )
      .trim(),

    grid: styles
      .getPropertyValue(
        "--border"
      )
      .trim(),

    primary: styles
      .getPropertyValue(
        "--primary"
      )
      .trim(),

    success: styles
      .getPropertyValue(
        "--success"
      )
      .trim(),

    danger: styles
      .getPropertyValue(
        "--danger"
      )
      .trim()
  };
}


// ==========================================
// CREATE CHART
// ==========================================

function makeChart(
  id,
  type,
  data,
  options
) {
  const canvas =
    document.getElementById(id);

  if (!canvas) {
    return;
  }

  if (charts[id]) {
    charts[id].destroy();
  }

  charts[id] = new Chart(
    canvas,
    {
      type,
      data,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    }
  );
}


// ==========================================
// RENDER CHARTS
// ==========================================

function renderCharts() {
  if (
    typeof Chart ===
    "undefined"
  ) {
    return;
  }

  const theme =
    chartTheme();

  const months =
    sixMonths();

  const labels =
    months.map(
      (month) =>
        new Date(
          `${month}-01`
        ).toLocaleDateString(
          "en-IN",
          {
            month: "short"
          }
        )
    );

  const commonOptions = {
    plugins: {
      legend: {
        labels: {
          color: theme.text,
          font: {
            family: "Inter",
            size: 11
          }
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: theme.text
        },

        grid: {
          color: theme.grid
        }
      },

      y: {
        ticks: {
          color: theme.text,

          callback: (value) =>
            "₹" +
            Number(
              value
            ).toLocaleString(
              "en-IN"
            )
        },

        grid: {
          color: theme.grid
        }
      }
    }
  };


  // ----------------------------------------
  // MONTHLY EXPENSE CHART
  // ----------------------------------------

  makeChart(
    "monthlyChart",
    "bar",
    {
      labels,

      datasets: [
        {
          label: "Expenses",

          data:
            months.map(
              monthExpenses
            ),

          backgroundColor:
            theme.primary,

          borderRadius: 7
        }
      ]
    },

    commonOptions
  );


  // ----------------------------------------
  // CATEGORY CHART
  // ----------------------------------------

  const month =
    currentMonth();

  const categoryData =
    CATEGORIES.map(
      (category) =>
        expenses
          .filter(
            (expense) =>
              expense.category ===
                category &&
              monthKey(
                expense.date
              ) === month
          )
          .reduce(
            (total, expense) =>
              total +
              expense.amount,
            0
          )
    );

  const categoryColors = [
    "#3157d5",
    "#15966b",
    "#c78312",
    "#8b5cf6",
    "#e45757",
    "#0891b2",
    "#d946ef",
    "#64748b"
  ];

  const categoryChartData = {
    labels: CATEGORIES,

    datasets: [
      {
        data: categoryData,

        backgroundColor:
          categoryColors,

        borderWidth: 0
      }
    ]
  };


  const doughnutOptions = {
    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: theme.text,
          font: {
            size: 10
          }
        }
      }
    }
  };


  makeChart(
    "categoryChart",
    "doughnut",
    categoryChartData,
    doughnutOptions
  );


  // ----------------------------------------
  // INCOME VS EXPENSES
  // ----------------------------------------

  const incomeData =
    months.map(
      (month) =>
        income
          .filter(
            (item) =>
              monthKey(
                item.date
              ) === month
          )
          .reduce(
            (total, item) =>
              total +
              item.amount,
            0
          )
    );

  const expenseData =
    months.map(
      monthExpenses
    );


  makeChart(
    "incomeExpenseChart",
    "line",
    {
      labels,

      datasets: [
        {
          label: "Income",

          data: incomeData,

          borderColor:
            theme.success,

          backgroundColor:
            theme.success,

          tension: 0.35
        },

        {
          label: "Expenses",

          data: expenseData,

          borderColor:
            theme.danger,

          backgroundColor:
            theme.danger,

          tension: 0.35
        }
      ]
    },

    commonOptions
  );


  // ----------------------------------------
  // ANALYTICS MONTHLY CHART
  // ----------------------------------------

  makeChart(
    "analyticsMonthlyChart",
    "bar",
    {
      labels,

      datasets: [
        {
          label: "Expenses",

          data:
            months.map(
              monthExpenses
            ),

          backgroundColor:
            theme.primary,

          borderRadius: 7
        }
      ]
    },

    commonOptions
  );


  // ----------------------------------------
  // ANALYTICS INCOME CHART
  // ----------------------------------------

  makeChart(
    "analyticsIncomeChart",
    "line",
    {
      labels,

      datasets: [
        {
          label: "Income",

          data: incomeData,

          borderColor:
            theme.success,

          backgroundColor:
            theme.success,

          tension: 0.35
        },

        {
          label: "Expenses",

          data: expenseData,

          borderColor:
            theme.danger,

          backgroundColor:
            theme.danger,

          tension: 0.35
        }
      ]
    },

    commonOptions
  );


  // ----------------------------------------
  // ANALYTICS CATEGORY CHART
  // ----------------------------------------

  makeChart(
    "analyticsCategoryChart",
    "doughnut",
    categoryChartData,
    doughnutOptions
  );
}


// ==========================================
// EXPORT CSV
// ==========================================

function exportCSV() {
  if (!expenses.length) {
    showToast(
      "There are no expenses to export.",
      "error"
    );

    return;
  }

  const rows = [
    [
      "Name",
      "Amount",
      "Category",
      "Date",
      "Description"
    ],

    ...expenses.map(
      (expense) => [
        expense.name,
        expense.amount,
        expense.category,
        expense.date,
        expense.description || ""
      ]
    )
  ];

  const csv = rows
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(
              value
            ).replace(
              /"/g,
              '""'
            )}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    [csv],
    {
      type:
        "text/csv;charset=utf-8"
    }
  );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `finscope-expenses-${today()}.csv`;

  link.click();

  URL.revokeObjectURL(url);

  showToast(
    "Expense CSV exported."
  );
}


// ==========================================
// CLEAR SAMPLE DATA
// ==========================================

function clearSampleData() {
  if (
    !confirmDelete(
      "Clear all current sample/transaction data? This will remove expenses, income and goals."
    )
  ) {
    return;
  }

  expenses = [];
  income = [];
  goals = [];

  localStorage.setItem(
    STORAGE.samples,
    "cleared"
  );

  saveAll();

  renderAll();

  showToast(
    "Sample data cleared."
  );
}


// ==========================================
// DARK / LIGHT MODE
// ==========================================

function applyTheme() {
  const theme =
    localStorage.getItem(
      STORAGE.theme
    ) || "light";

  document.documentElement.dataset.theme =
    theme;

  document.getElementById(
    "themeIcon"
  ).textContent =
    theme === "dark"
      ? "☀"
      : "☾";

  document.getElementById(
    "themeText"
  ).textContent =
    theme === "dark"
      ? "Light Mode"
      : "Dark Mode";
}

function toggleTheme() {
  const currentTheme =
    document.documentElement
      .dataset.theme;

  const nextTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";

  localStorage.setItem(
    STORAGE.theme,
    nextTheme
  );

  applyTheme();

  renderCharts();

  showToast(
    `${
      nextTheme === "dark"
        ? "Dark"
        : "Light"
    } mode enabled.`
  );
}


// ==========================================
// KEYBOARD ACCESSIBILITY
// ==========================================

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  }
);


// ==========================================
// START APPLICATION
// ==========================================

init();