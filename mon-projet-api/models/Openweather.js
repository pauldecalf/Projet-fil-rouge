const mongoose = require('mongoose');

const openweatherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pressure: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    userEmail: { type: String, required: true },
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
    date: {
        type: String,
        default: () => {
            const date = new Date();
            return `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' })}`;
        }
    },
    temperature: { type: Number },
    minTemperature: { type: Number },
    maxTemperature: { type: Number },
    pression: { type: Number },
    vitesseVent: { type: Number },
    weatherDescription: { type: String },
    weatherIcon: { type: String },
    sunrise: { type: String },
    sunset: { type: String },
    feelsLike: { type: Number },
    visibility: { type: Number },
    uvIndex: { type: Number },
    dewPoint: { type: Number },
    clouds: { type: Number },
    rain: { type: Number },
    snow: { type: Number },
});


const Openweather = mongoose.model('Openweather', openweatherSchema);

module.exports = Openweather;
