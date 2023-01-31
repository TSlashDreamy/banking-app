"use strict";

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const dogsInHumansAges = ages.map(dogAge =>
    dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4
  );
  const adultDogs = dogsInHumansAges.filter(dogAge => dogAge >= 18);
  const avarageAdultDogsAge =
    adultDogs.reduce((acc, dogAge) => acc + dogAge, 0) / adultDogs.length;

  console.log(`Dogs ages in humans ages => ${dogsInHumansAges}`);
  console.log(`Adult dogs in humans ages => ${adultDogs}`);
  console.log(
    `Avarage age of adult dogs in human ages => ${avarageAdultDogsAge}`
  );
};

console.log("========== Data 1 ==========");
calcAverageHumanAge(data1);
console.log("========== Data 2 ==========");
calcAverageHumanAge(data2);
