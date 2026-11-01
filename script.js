const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const dateInput = document.getElementById("expense-date");
const categoryInput = document.getElementById("expense-category");
const filterInput = document.getElementById("filter-category");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const expenseCount = document.getElementById("expense-count");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function displayExpenses() {
  expenseList.innerHTML = "";
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const visibleExpenses = expenses.filter((expense) => (
    filterInput.value === "All" || expense.category === filterInput.value
  ));

  totalDisplay.textContent = total.toFixed(2);
  expenseCount.textContent = expenses.length;

  if (visibleExpenses.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.innerHTML = "<p>No expenses here yet.<br>Add your first one to get started.</p>";
    expenseList.appendChild(emptyState);
    return;
  }

  visibleExpenses.forEach((expense) => {
    const expenseIndex = expenses.indexOf(expense);
    const item = document.createElement("li");
    item.className = "expense-item";

    const categoryMark = document.createElement("span");
    categoryMark.className = "category-mark";
    categoryMark.textContent = expense.category.slice(0, 2).toUpperCase();
    categoryMark.setAttribute("aria-hidden", "true");

    const info = document.createElement("div");
    info.className = "expense-info";
    info.innerHTML = `<p class="expense-name"></p><p class="expense-meta">${expense.category} · ${formatDate(expense.date)}</p>`;
    info.querySelector(".expense-name").textContent = expense.name;

    const amount = document.createElement("p");
    amount.className = "expense-amount";
    amount.textContent = `₹${expense.amount.toFixed(2)}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", () => {
      expenses.splice(expenseIndex, 1);
      saveExpenses();
      displayExpenses();
    });

    item.append(categoryMark, info, amount, deleteButton);
    expenseList.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !date || !category) {
    alert("Please enter valid expense details.");
    return;
  }

  expenses.unshift({ name, amount, date, category });
  saveExpenses();
  displayExpenses();
  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  nameInput.focus();
});

filterInput.addEventListener("change", displayExpenses);
dateInput.value = new Date().toISOString().split("T")[0];
displayExpenses();
