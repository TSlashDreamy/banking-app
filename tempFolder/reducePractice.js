"use strict";

// Data
const account9 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account8 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account7 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account6 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts1 = [account9, account8, account7, account6];

const { deposits, withdrawals } = accounts1
  .flatMap(account => account.movements)
  .reduce(
    (sum, movement) => {
      //   movement > 0 ? (sum.deposits += movement) : (sum.withdrawals += movement);
      sum[movement > 0 ? "deposits" : "withdrawals"] += movement;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);
