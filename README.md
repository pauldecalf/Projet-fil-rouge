
# 🌍 GeoMeteo

## 📝 Description
**GeoMeteo** est une application web innovante qui offre un suivi en temps réel de votre position géographique, tout en fournissant des informations météorologiques précises basées sur votre localisation actuelle. Développée avec **AngularJS**, elle intègre **Leaflet** pour la cartographie interactive et utilise l'API **OpenWeather** pour les données météorologiques.

L'objectif est de fournir une expérience utilisateur fluide et intuitive, permettant aux utilisateurs de visualiser leur position en temps réel sur une carte interactive, tout en accédant aux conditions météorologiques actuelles et aux prévisions.

## ✨ Fonctionnalités
- 🗺️ **Visualisation en temps réel** : Affichez votre position actuelle sur une carte interactive.
- ☁️ **Conditions météorologiques** : Consultez la météo actuelle et les prévisions basées sur votre localisation.
- 🕒 **Historique des déplacements** : Suivez et consultez vos trajets précédents grâce à un historique détaillé.
- 🔒 **Sécurité et conformité RGPD** : Vos données sont protégées et gérées conformément aux réglementations en vigueur.
- 🔑 **Connexion via Google** : Accédez facilement à l'application grâce à l'authentification Google.

## 📋 Prérequis
- 🟢 **Node.js** v18.x ou supérieur
- 📦 **npm** ou **yarn**
- 🍃 **MongoDB** pour la base de données

## 🚀 Installation et utilisation

### 1. Cloner le dépôt
```bash
git clone https://github.com/pauldecalf/Projet-fil-rouge.git
cd Projet-fil-rouge
```

### 2. Installer les dépendances
```bash
npm install
# ou avec yarn
yarn install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet avec les informations suivantes :
```
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geometeo?retryWrites=true&w=majority
```

### 4. Lancer l'application en mode développement
```bash
npm start
# ou avec yarn
yarn start
```
Accédez à l'application via `http://localhost:4200`.

## 💻 Technologies utilisées
- ⚛️ **AngularJS** pour le frontend
- 🗺️ **Leaflet** pour la cartographie interactive
- ☁️ **OpenWeather API** pour les données météorologiques
- 🍃 **MongoDB** pour la base de données
- 🔑 **Google OAuth** pour l'authentification
- 🏗️ **Architecture microservices** pour une scalabilité optimale

## 🗂️ Structure du projet
```
├── src
│   ├── app
│   │   ├── components
│   │   ├── services
│   │   └── ...
├── public
├── config
├── .env
└── README.md
```


## 🤝 Contribuer
Les contributions sont les bienvenues ! Si vous souhaitez ajouter des fonctionnalités ou améliorer le code existant, n'hésitez pas à créer une pull request.

1. Fork le projet
2. Créez une branche (`git checkout -b feature/ajout-fonctionnalité`)
3. Committez vos modifications (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Poussez sur la branche (`git push origin feature/ajout-fonctionnalité`)
5. Ouvrez une pull request

---

🔗 Pour plus d'informations, visitez le site officiel : [geometeo.pauldecalf.fr](https://geometeo.pauldecalf.fr/).
