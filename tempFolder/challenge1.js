"use strict";

const juliaDogsData1 = [3, 5, 2, 12, 7];
const kateDogsData1 = [4, 1, 15, 8, 3];
const juliaDogsData2 = [9, 16, 6, 8, 3];
const kateDogsData2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const juliasArrShallowCopy = dogsJulia.slice(1, dogsJulia.length - 2);
  const allDogs = [...juliasArrShallowCopy, ...dogsKate];

  allDogs.forEach(function (dogAge, index) {
    const definedAge = dogAge >= 3 ? "an adult" : "still a puppy 🐶";

    console.log(
      `Dog number ${index + 1} is ${definedAge}${
        dogAge >= 3 ? `, and is ${dogAge} years old` : ""
      }.`
    );
  });
};

checkDogs(juliaDogsData1, kateDogsData1);
checkDogs(juliaDogsData2, kateDogsData2);
