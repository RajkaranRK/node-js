const yargs = require('yargs');
const axios = require('axios');

var argv = yargs.option({
  a:{
    alias:'address',
    demand:true,
    description:'For Address'
  }
}).help().alias('help','h').argv;

var encodedAddress = encodeURIComponent(argv.address);

var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
axios.get(geocodeURL).then((response)=>{
  var location ={
    formatted_address : response.data.results[0].formatted_address,
    lat : response.data.results[0].geometry.location.lat,
    lng :response.data.results[0].geometry.location.lng
  };
  var weatherURL = `https://api.darksky.net/forecast/a00eac9961143fb050602973154d5963/${location.lat},${location.lng}`;
  return axios.get(weatherURL);
})
 .then((response)=>{
    var temperature = response.data.currently.temperature;
    var apperentTemp = response.data.currently.apparentTemperature;
    console.log(`It is ${temperature} but it seems like ${apperentTemp}`);
  }).catch((e)=>{
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to conect to server...');
  }
  else{
    console.log(e);
  }
});
