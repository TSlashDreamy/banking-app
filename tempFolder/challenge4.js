"use strict";

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

// 1.
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

// 2.
const sarahDog = dogs.find(dog => dog.owners.includes("Sarah"));
console.log(
  `Sarah dog is eating too ${
    sarahDog.curFood > sarahDog.recommendedFood ? "much" : "little"
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

// 4.
console.log(`${ownersEatTooMuch.join(" and ")} dogs eat to much.`);
console.log(`${ownersEatTooLittle.join(" and ")} dogs eat to little.`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.
const checkEatOk = dog =>
  dog.curFood >= dog.recommendedFood * 0.9 &&
  dog.curFood <= dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatOk));

// 7.
console.log(dogs.filter(checkEatOk));

// 8.
const shallowDogs = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
