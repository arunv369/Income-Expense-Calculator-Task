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
  const submitBtn = document.getElementById("submit-btn");
  const resetFormBtn = document.getElementById("reset-form-btn");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let editId = null;
  let currentFilter = "all";

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

  function renderTransactions(filter = "all") {
    currentFilter = filter;
    transactionList.innerHTML = "";

    const filteredTransactions = transactions.filter(
      (t) => filter === "all" || t.type === filter
    );

    if (filteredTransactions.length === 0) {
      transactionList.innerHTML = `
        <p class="text-center text-gray-500 py-2">No transactions found.</p>
      `;
      updateSummary();
      return;
    }

    filteredTransactions.forEach((t) => {
      const li = document.createElement("li");
      li.className = `p-2 border rounded flex justify-between items-center ${
        t.type === "income" ? "bg-green-100" : "bg-red-100"
      }`;
      li.innerHTML = `
        <span class="font-[700] text-[1.1rem]">${t.description}: $${t.amount}</span>
        <div>
          <button class="edit-btn bg-[#1F2937] text-white px-3 py-1 rounded hover:bg-[#111827] transition" data-id="${t.id}">Edit</button>
          <button class="delete-btn bg-[#F98080] text-white px-3 py-1 rounded hover:bg-red-600 transition" data-id="${t.id}">Delete</button>
        </div>
      `;
      transactionList.appendChild(li);
    });

    updateSummary();
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (description && amount > 0) {
      if (editId === null) {
        transactions.push({ id: Date.now(), description, amount, type });
      } else {
        transactions = transactions.map((t) =>
          t.id === editId ? { id: editId, description, amount, type } : t
        );
        alert("Transaction updated successfully!");
        editId = null;
        submitBtn.textContent = "Add Transaction";
      }

      renderTransactions(currentFilter);
      form.reset();
    }
  });

  transactionList.addEventListener("click", (e) => {
    const transactionId = parseInt(e.target.getAttribute("data-id"));

    if (e.target.classList.contains("delete-btn")) {
      const confirmDelete = confirm("Do you want to delete this transaction?");
      if (confirmDelete) {
        transactions = transactions.filter((t) => t.id !== transactionId);
        renderTransactions(currentFilter);
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const transaction = transactions.find((t) => t.id === transactionId);

      descriptionInput.value = transaction.description;
      amountInput.value = transaction.amount;
      typeInput.value = transaction.type;

      editId = transactionId;
      submitBtn.textContent = "Update Transaction";
    }
  });

  resetFormBtn.addEventListener("click", () => {
    form.reset();
  });

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      renderTransactions(radio.value);
    });
  });

  renderTransactions();
});
