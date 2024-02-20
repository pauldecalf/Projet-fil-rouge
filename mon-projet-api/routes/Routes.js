const express = require('express');
const router = express.Router();
const openweatherRoutes = require('../routes/openweatherRoutes');
const userRoutes = require('../routes/userRoutes');

router.get('/', (req, res) => {
    res.send('Racine GET permettant la récupération de données => GET /');
});

// Montage des routeurs pour /users et /openweather
// Utilisez router.use pour monter le routeur middleware sur un chemin spécifique
router.use('/users', userRoutes);
router.use('/openweather', openweatherRoutes);

module.exports = router;
