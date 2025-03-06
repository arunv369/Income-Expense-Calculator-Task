document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transaction-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const transactionList = document.getElementById("transaction-list");
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpenseEl = document.getElementById("total-expense");
  const netBalanceEl = document.getElementById("net-balance");
  const filterRadios = document.querySelectorAll("input[name='filter']");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  function updateSummary() {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    totalIncomeEl.textContent = `$${income}`;
    totalExpenseEl.textContent = `$${expense}`;
    netBalanceEl.textContent = `$${income - expense}`;
  }

  // Function to Render Transactions
  function renderTransactions(filter = "all") {
    transactionList.innerHTML = "";
    transactions
      .filter((t) => filter === "all" || t.type === filter)
      .forEach((t, index) => {
        const li = document.createElement("li");
        li.className = `p-2 border rounded flex justify-between items-center ${
          t.type === "income" ? "bg-green-100" : "bg-red-100"
        }`;
        li.innerHTML = `
                    <span class="font-[700] text-[1.1rem]">${t.description}: $${t.amount}</span>
                    <div>
                <button class="edit-btn bg-[#1F2937] text-white px-3 py-1 rounded hover:bg-[#111827] transition" data-index="${index}">Edit</button>
                <button class="delete-btn bg-[#F98080] text-white px-3 py-1 rounded hover:bg-red-600 transition" data-index="${index}">Delete</button>
            </div>
                `;
        transactionList.appendChild(li);
      });

    updateSummary();
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  let editIndex = -1;
  const submitBtn = document.getElementById("submit-btn");

  transactionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      const confirmDelete = confirm("Do you want to delete this transaction?");

      if (confirmDelete) {
        transactions.splice(index, 1);
        renderTransactions();
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const index = e.target.getAttribute("data-index");
      const transaction = transactions[index];

      descriptionInput.value = transaction.description;
      amountInput.value = transaction.amount;
      typeInput.value = transaction.type;

      editIndex = index;
      submitBtn.textContent = "Update Transaction";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (description && amount > 0) {
      if (editIndex === -1) {
        transactions.push({ description, amount, type });
      } else {
        transactions[editIndex] = { description, amount, type };
        alert("Transaction updated successfully!");
        editIndex = -1;
        submitBtn.textContent = "Add Transaction";
      }

      renderTransactions();
      form.reset();
    }
  });

  const resetFormBtn = document.getElementById("reset-form-btn");

  resetFormBtn.addEventListener("click", () => {
    document.getElementById("transaction-form").reset();
  });

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      renderTransactions(radio.value);
    });
  });

  renderTransactions();
});
