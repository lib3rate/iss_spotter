const request = require('request');

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }

    const address = JSON.parse(body).ip;
    callback(null, address);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coords. Response: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    // const latitude = JSON.parse(body).data.latitude;
    // const longitude = JSON.parse(body).data.longitude;
    // const coords = { latitude, longitude }
    
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`), null);
      return;
    }

    const flyOverTimes = JSON.parse(body).response;
    
    callback(null, flyOverTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    // console.log('It worked! Returned IP:' , ip);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      // console.log('It worked! The coords are:' , coords);
      
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
        // console.log('It worked! The flyover times are:' , data);
        
        callback(error, data);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };