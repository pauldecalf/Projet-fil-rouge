const mongoose = require('mongoose');

const openweatherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lng: {type: Number, required: true},
    lat: {type: Number, required: true},

    // Information concernant l'appel API
    date: {type: Date, default: Date.now},

    // Information météo
    temperature: {type: Number},
    pression: {type: Number},
    humidite: {type: Number},
    vitesseVent: {type: Number},


});

const Openweather = mongoose.model('Openweather', openweatherSchema);

module.exports = Openweather;
