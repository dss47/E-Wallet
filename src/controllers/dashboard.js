import { finduser, finsuserbymail, getusers } from "/src/controllers/database.js";
import Loading from "/src/controllers/index.js";

const userData = JSON.parse(sessionStorage.getItem("userSession"));

if (!userData) {
    document.location = "/src/views/login.html";
}

const greetingName = document.getElementById("greetingName");
if (greetingName) greetingName.textContent = userData.name;

const availableBalance = document.getElementById("availableBalance");
if (availableBalance) availableBalance.textContent = userData.wallet.balance + " " + userData.wallet.currency;

const   userStats = () => {
    const expenses = userData.wallet.transactions
        .filter(t => t.type === "debit").reduce((total, t) => total + t.amount, 0);

    const incomes = userData.wallet.transactions
        .filter(t => t.type === "credit").reduce((total, t) => total + t.amount, 0);

    const monthlyIncome = document.getElementById("monthlyIncome");
    if (monthlyIncome) monthlyIncome.textContent = "+" + incomes + " " + userData.wallet.currency;

    const monthlyExpenses = document.getElementById("monthlyExpenses");
    if (monthlyExpenses) monthlyExpenses.textContent = "-" + expenses + " " + userData.wallet.currency;
}

userStats();

const recentTransactionsList = document.getElementById("recentTransactionsList");
const showRecentTransactions = () => {
    if (!recentTransactionsList) return;
    recentTransactionsList.style.whiteSpace = "pre-line";
    const transactions = userData.wallet.transactions;
    let txt = "";
    for (let i = transactions.length - 1, c = 0; i >= 0 && c < 5; i--, c++) {
        const t = transactions[i];
        const sign = t.type === "credit" ? "+" : "-";
        txt += t.date + " | " + sign + t.amount + " " + userData.wallet.currency + "\n";
    }
    recentTransactionsList.textContent = txt;
}

showRecentTransactions();

const currentUser = finsuserbymail(userData.email, userData.password);
const cardsGrid = document.getElementById("cardsGrid");
const firstCard = cardsGrid ? cardsGrid.querySelector(".card-item") : null;
const transferSection = document.getElementById("transfer-section");
const quickTransfer = document.getElementById("quickTransfer");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCardSelect = document.getElementById("sourceCard");

if (quickTransfer && transferSection) {
    quickTransfer.addEventListener("click", () => {
        transferSection.classList.remove("hidden");
    });
}

if (closeTransferBtn && transferSection) {
    closeTransferBtn.addEventListener("click", () => {
        transferSection.classList.add("hidden");
    });
}

if (cancelTransferBtn && transferSection) {
    cancelTransferBtn.addEventListener("click", () => {
        transferSection.classList.add("hidden");
    });
}

if (sourceCardSelect && currentUser) {
    for (let i = 0; i < currentUser.wallet.cards.length; i++) {
        const card = currentUser.wallet.cards[i];
        const option = document.createElement("option");
        option.value = card.numcards;
        option.textContent = card.numcards;
        sourceCardSelect.appendChild(option);
    }
}

if (beneficiarySelect) {
    const users = getusers();
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.email !== userData.email) {
            const option = document.createElement("option");
            option.value = user.email;
            option.textContent = user.name + " - " + user.email;
            beneficiarySelect.appendChild(option);
        }
    }
}

if (currentUser && firstCard) {
    const cards = currentUser.wallet.cards;
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        let cardItem = firstCard;
        if (i > 0) {
            cardItem = firstCard.cloneNode(true);// Clone the first card item for additional cards  
        }
        cardItem.querySelector(".card-number").textContent = card.numcards
        cardItem.querySelector(".card-holder").textContent = currentUser.name + " • " + card.type;
        if (i > 0) cardsGrid.appendChild(cardItem);
    }
}

const TransfertButton = document?.getElementById("submitTransferBtn");
if (TransfertButton) TransfertButton.type = "button";

TransfertButton?.addEventListener("click", () => {
    const recipientEmail = document?.getElementById("beneficiary").value;
    const amount = parseFloat(document?.getElementById("amount").value);
    const senderCardNum = document?.getElementById("sourceCard").value;

    if (!recipientEmail || !senderCardNum) {
        alert("Please select beneficiary and card");
        return;
    }

    const savedRecipient = localStorage.getItem("userData_" + recipientEmail);
    const recipient = savedRecipient ? JSON.parse(savedRecipient) : finduser(recipientEmail); //We only need to find the recipient by email, the password is not needed here
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    if (!recipient) {
        alert("Recipient not found");
        return;
    }

    const senderCard = userData.wallet.cards.find(card => card.numcards === senderCardNum);
    if (!senderCard || senderCard.balance < amount) {
        alert("Insufficient funds or invalid card");
        return;
    }
    // Update balances and transactions
    TransfertButton.disabled = true;
    Loading(".",TransfertButton,"Transfert en cours");
    setTimeout(() => {
        senderCard.balance -= amount;
        userData.wallet.balance -= amount;
        recipient.wallet.balance += amount;
        userData.wallet.transactions.push({
            id: Date.now().toString(),
            type: "debit",
            amount: amount,
            date: new Date().toLocaleDateString(),
            from: senderCardNum,
            to: recipientEmail
        });
        recipient.wallet.transactions.push({
            id: Date.now().toString(),
            type: "credit",
            amount: amount,
            date: new Date().toLocaleDateString(),
            from: userData.name,
            to: recipientEmail
        });
        TransfertButton.textContent = "Transfert réussi";
        sessionStorage.setItem("userSession", JSON.stringify(userData));
        sessionStorage.setItem("recipientSession", JSON.stringify(recipient));
        localStorage.setItem("userData_" + userData.email, JSON.stringify(userData));
        localStorage.setItem("userData_" + recipient.email, JSON.stringify(recipient));
        if (availableBalance) availableBalance.textContent = userData.wallet.balance + " " + userData.wallet.currency;
        userStats();
        showRecentTransactions();
        if (transferSection) transferSection.classList.add("hidden");
        TransfertButton.disabled = false;
    }, 2000);
});

