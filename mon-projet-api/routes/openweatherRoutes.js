const express = require('express');
const router = express.Router();
const Openweather = require('../models/Openweather'); // Assurez-vous que le chemin est correct

router.get('/', async (req, res) => {
    try {
        const weatherData = await Openweather.find();
        let tableContent = "";
        weatherData.forEach(data => {
            // Adaptez ces champs en fonction de votre modèle Openweather
            tableContent += `<tr><td>${data.userEmail}</td><td>${data.lng}</td><td>${data.lat}</td></tr>`;
        });

        const htmlResponse = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `;

        res.send(htmlResponse);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Openweather.findById(req.params.id);
        if (!data) {
            return res.status(404).send({message: "Donnée non trouvée avec l'ID " + req.params.id});
        }
        res.json(data);
    } catch (err) {
        res.status(500).send({message: "Erreur de récupération de la donnée avec l'ID " + req.params.id});
    }
});
// Route pour récupérer les enregistrements en fonction de l'ID de l'utilisateur
router.get('/user/:id', async (req, res) => {
    try {
        const userWeatherData = await Openweather.find({ userEmail: req.params.id });
        if (!userWeatherData || userWeatherData.length === 0) {
            return res.status(404).send({message: "Aucun enregistrement trouvé pour l'utilisateur " + req.params.id});
        }
        res.json(userWeatherData);
    } catch (err) {
        res.status(500).send({message: "Erreur de récupération des données pour l'utilisateur " + req.params.id});
    }
});

router.post('/', async (req, res) => {
    try {
        const newData = new Openweather({
            userEmail: req.body.userEmail,
            name: req.body.name,
            lng: req.body.lng,
            lat: req.body.lat,
            temperature: req.body.temperature,
            pressure: req.body.pressure,
            humidity: req.body.humidity,
            windSpeed: req.body.windSpeed,
            minTemperature:req.body.minTemperature,
            maxTemperature: req.body.maxTemperature,
            pression: req.body.pression,
            vitesseVent: req.body.vitesseVent,
            weatherDescription: req.body.weatherDescription,
            weatherIcon: req.body.weatherIcon,
            sunrise: req.body.sunrise,
            sunset: req.body.sunset,
            feelsLike: req.body.feelsLike,
            visibility: req.body.visibility,
            uvIndex: req.body.uvIndex,
            dewPoint: req.body.dewPoint,
            clouds: req.body.clouds,
            rain: req.body.rain,
            snow: req.body.snow,
        });
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedData = await Openweather.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedData) {
            return res.status(404).send({message: "Donnée non trouvée avec l'ID " + req.params.id});
        }
        res.json(updatedData);
    } catch (err) {
        res.status(500).send({message: "Erreur de mise à jour de la donnée avec l'ID " + req.params.id});
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await Openweather.findByIdAndRemove(req.params.id);
        if (!deletedData) {
            return res.status(404).send({message: "Donnée non trouvée avec l'ID " + req.params.id});
        }
        res.send({message: "Donnée supprimée avec succès!"});
    } catch (err) {
        res.status(500).send({message: "Impossible de supprimer la donnée avec l'ID " + req.params.id});
    }
});


module.exports = router;
