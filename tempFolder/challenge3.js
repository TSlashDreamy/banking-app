"use strict";

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, dogAge, _, dogs) => acc + dogAge / dogs.length, 0);

console.log("~~~~~~~~~~ Data 1 ~~~~~~~~~~");
console.log(calcAverageHumanAge(data1));
console.log("~~~~~~~~~~ Data 2 ~~~~~~~~~~");
console.log(calcAverageHumanAge(data2));
