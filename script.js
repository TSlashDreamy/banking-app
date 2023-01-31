"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// UI Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// APP

/**
 * Showing every account movement in the UI
 * @param {[Number]} movements - account movements
 * @param {boolean} sort - let you choose to sort movements before showing or not
 */
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const processedMovemenets = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  processedMovemenets.forEach(function (movement, index) {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">3 days ago (DUMMY DATA)</div>
      <div class="movements__value">${movement}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Calculating and showing current balance of the account
 * @param {object} account - account object
 */
const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${account.balance} | €`;
};

/**
 * Calculating and showing account summary, like incomes, outcomes, and interests
 * @param {object} account - account object
 */
const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/**
 * Creates username for each existing account
 * Example - owner: "Jonas Schmedtmann" => username: "js"
 * @param {[object]} accounts - account objects
 */
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};

/**
 * Updates the entire UI
 * @param {object} account - current account
 */
const updateUI = function (account) {
  // calculating and displaying movements
  displayMovements(account.movements);

  // calculating and displaying balance
  calcDisplayBalance(account);

  // calculating and displaying account summary
  calcDisplaySummary(account);
};

/* ================ Login button functionality ================ */
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // switching account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // checking if entered data is correct
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    // calculate data and update UI
    updateUI(currentAccount);

    // changing welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    // showing the UI
    containerApp.style.opacity = 1;

    // clearing and unfocusing inputs
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
  }
});

/* ================ Transfer money button functionality ================ */
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // reducing money from current account
    currentAccount.movements.push(-amount);

    // adding money to receiver account
    receiverAcc.movements.push(amount);

    // recalculating data and updating UI
    updateUI(currentAccount);
  }

  // clearing and unfocusing inputs
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
});

/* ================ Loan button functionality ================ */
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    // Add loan to the account movements
    currentAccount.movements.push(amount);

    // Recalculate data and update the UI
    updateUI(currentAccount);
  }

  // clearing and unfocusing inputs
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

/* ================ Close account button functionality ================ */
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // finding account index in accounts array
    const index = accounts.findIndex(
      account => account.username === inputCloseUsername.value
    );

    // removing account from array
    accounts.splice(index, 1);

    // hiding the UI
    containerApp.style.opacity = 0;

    // changing top label
    labelWelcome.textContent = `Log in to get started`;

    // clearing and unfocusing inputs
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
  }
});

/* ================ Sort button functionality ================ */
let sort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});

// call to create usernames for each account
createUsernames(accounts);
