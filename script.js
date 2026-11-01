const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name"); const amountInput = document.getElementById("expense-amount"); const dateInput = document.getElementById("expense-date");
const categoryInput = document.getElementById("expense-category"); const filterInput = document.getElementById("filter-category");
const expenseList = document.getElementById("expense-list"); const totalDisplay = document.getElementById("total");
let expenses = JSON.parse(localStorage.getItem("expenses")) || []; function saveExpenses() {
localStorage.setItem("expenses", JSON.stringify(expenses));
}

function displayExpenses() {
 
expenseList.innerHTML = ""; let total = 0;

expenses.forEach((expense, index) => { total += expense.amount;

if (filterInput.value !== "All" && expense.category !== filterInput.value) { return;
}

const li = document.createElement("li"); li.textContent = expense.name + " - ₹" + expense.amount.toFixed(2) + " - " +
expense.date + " - " + expense.category + " ";

const deleteButton = document.createElement("button"); deleteButton.textContent = "Delete";
deleteButton.addEventListener("click", () => { expenses.splice(index, 1);
saveExpenses(); displayExpenses();
});

li.appendChild(deleteButton); expenseList.appendChild(li);
});

totalDisplay.textContent = total.toFixed(2);
}

form.addEventListener("submit", function(event) { event.preventDefault();

const name = nameInput.value.trim();
const amount = Number(amountInput.value); const date = dateInput.value;
const category = categoryInput.value;
 
if (!name || amount <= 0 || !date || !category) { alert("Please enter valid expense details."); return;
}

expenses.push({ name: name, amount: amount, date: date, category: category
});

 



});
 
saveExpenses(); displayExpenses(); form.reset();
 

filterInput.addEventListener("change", displayExpenses); displayExpenses();
