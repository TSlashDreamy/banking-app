"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2023-01-29T23:36:17.929Z",
    "2023-02-02T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2020-02-25T14:18:46.235Z",
    "2021-02-26T16:33:06.386Z",
    "2021-04-13T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2021-05-08T14:11:59.604Z",
    "2021-05-27T17:01:17.194Z",
    "2022-07-11T23:16:17.929Z",
    "2022-09-12T10:31:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
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
const labelLoan = document.querySelector(".operation--loan h2");

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

// Functions
/**
 * Format every date like (Today, yesterday, n days ago, or just the date 01/01/2023)
 * @param {Date} date
 * @param {string} locale - account locale (Ex: "en-US")
 * @returns formatted string of movement date
 */
const formatMovementDate = function (date, locale = navigator.language) {
  // calculating how much days passed
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  // formatting date
  if (daysPassed === 0) {
    return "Today";
  } else if (daysPassed === 1) {
    return "Yesterday";
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

/**
 * Formating all the account movements to the account locale
 * @param {Number} value - account movement or the balance
 * @param {string} locale - account locale
 * @param {string} currency - account currency
 * @returns formatted value
 */
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * Starts the timer for auto log out from the account
 * @returns timer
 */
const startLogoutTimer = function () {
  // setting the amount of time for log out
  let time = 120;

  // creating separate function to call it immediately
  const tick = function () {
    // transforming time in seconds to the (minutes:seconds)
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    // checking if timer run out
    if (time <= 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
      currentAccount = null;
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/**
 * Showing every account movement in the UI
 * @param {object} account - account object
 * @param {boolean} sort - let you choose to sort movements before showing or not
 */
const displayMovements = function (account, sort = false) {
  // resetting all containers
  containerMovements.innerHTML = "";

  const processedMovemenets = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  processedMovemenets.forEach(function (movement, index) {
    // updating current date in the UI
    const date = new Date(account.movementsDates[index]);
    const dateToDisplay = formatMovementDate(date, account.locale);

    // setting type of movement
    const type = movement > 0 ? "deposit" : "withdrawal";

    // formating currency
    const formatedMovement = formatCurrency(
      movement,
      account.locale,
      account.currency
    );

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">${dateToDisplay}</div>
      <div class="movements__value">${formatedMovement}</div>
    </div>
    `;

    // inserting content into the DOM
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Calculating and showing current balance of the account
 * @param {object} account - account object
 */
const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

/**
 * Calculating and showing account summary, like incomes, outcomes, and interests
 * @param {object} account - account object
 */
const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
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
  displayMovements(account);

  // calculating and displaying balance
  calcDisplayBalance(account);

  // calculating and displaying account summary
  calcDisplaySummary(account);
};

// Buttons functionality
/* ================ Login button functionality ================ */
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // switching account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // checking if entered data is correct
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    // formatting date to the account locale
    const now = new Date();
    const locale = currentAccount.locale;
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    // updating current date in the UI
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // calculate data and update UI
    updateUI(currentAccount);

    // changing welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    // starting logout timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

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

    // adding date of operation to account object
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // adding money to receiver account
    receiverAcc.movements.push(amount);

    // recalculating data and updating UI
    updateUI(currentAccount);

    // restarting timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }

  // clearing and unfocusing inputs
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
});

/* ================ Loan button functionality ================ */
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    labelLoan.textContent += " (Waiting for approval) 🔃";
    // adding delay for fake approval
    setTimeout(() => {
      // adding date of operation to account object
      currentAccount.movementsDates.push(new Date().toISOString());

      // Add loan to the account movements
      currentAccount.movements.push(amount);

      // changing label to default
      labelLoan.textContent = "Request loan";

      // Recalculate data and update the UI
      updateUI(currentAccount);
    }, 2500);
  }

  // clearing and unfocusing inputs
  inputLoanAmount.value = "";
  inputLoanAmount.blur();

  // restarting timer
  clearInterval(timer);
  timer = startLogoutTimer();
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
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

// call to create usernames for each account
createUsernames(accounts);
