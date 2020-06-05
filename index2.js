const { nextISSTimesForMyLocation } = require('./iss_promised');

// const printPassTimes = function(passTimes) {
//   for (const pass of passTimes) {
//     const datetime = new Date(0);
//     datetime.setUTCSeconds(pass.risetime);
//     const duration = pass.duration;
//     console.log(`Next pass at ${datetime} for ${duration} seconds!`);
//   }
// };

// nextISSTimesForMyLocation()
//   .then((passTimes) => {
//     printPassTimes(passTimes);
//   })

nextISSTimesForMyLocation()
  .then((times) => {
    for (let time of times) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(time.risetime);
      console.log(`Next pass at ${datetime} for ${time.duration} seconds!`)
    }
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });