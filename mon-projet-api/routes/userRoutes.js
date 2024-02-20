const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assurez-vous que le chemin est correct

// GET tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        let tableContent = "";
        users.forEach(user => {
            tableContent += `<tr><td>${user.name}</td><td>${user.email}</td></tr>`; // Adaptez selon les champs de votre modèle User
        });

        const htmlResponse = `
      <table border="1">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
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


// GET un utilisateur par ID
router.get('/:id', (req, res) => {
    res.send(`Affiche l'utilisateur avec l'ID ${req.params.id}`);
});

// POST pour créer un nouvel utilisateur
router.post('/', async (req, res) => {
    try {
        const {name, email} = req.body;
        if (!email) {
            return res.status(400).send({message: "L'email est requis."});
        }
        const newUser = new User({name, email});
        await newUser.save();
        res.status(201).send(newUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT pour mettre à jour un utilisateur par ID
router.put('/:id', async (req, res) => {
    try {
        const update = req.body;
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, update, {new: true});
        if (!updatedUser) {
            return res.status(404).send({message: "Utilisateur non trouvé."});
        }
        res.send(updatedUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// DELETE un utilisateur par ID
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send({message: "Utilisateur non trouvé."});
        }
        res.send({message: "Utilisateur supprimé avec succès."});
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;
