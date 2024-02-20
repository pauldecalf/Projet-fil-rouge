const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const Routes = require('./routes/Routes');
const openweatherRoutes = require('./routes/openweatherRoutes');
const cors = require('cors');

const mongoURI = 'mongodb+srv://admin:admin@atlascluster.vfolo9m.mongodb.net/';

mongoose.connect(mongoURI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use(cors());
app.use(express.json());

// Montage des routeurs
app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
