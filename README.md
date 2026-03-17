# HospitalSystem

Description du Projet

Cette application est une solution numérique de santé conçue pour optimiser le transfert des patients entre les structures sanitaires. Elle intègre un moteur de recommandation basé sur l'intelligence décisionnelle pour orienter les patients vers l'établissement le plus apte à les prendre en charge, en fonction de la pathologie, de l'urgence et de la disponibilité des services.
Architecture Technique
Frontend (Client)

    Framework : React.js 18+

    Stylisation : CSS-in-JS avec des Design Tokens personnalisés (Sora & Lora fonts).

    Gestion d'état : React Hooks (useState, useEffect, useRef).

    Iconographie : Lucide-React.

    Impression : React-to-print pour la génération des fiches de référence.

Backend (Serveur)

    Framework : Django avec Django Rest Framework (DRF).

    Base de données : PostgreSQL (ou SQLite en développement).

    Communication : API RESTful avec authentification par Token (ou JWT).

Modules Principaux
1. Tableau de Bord (Dashboard)

Interface centrale permettant de visualiser l'activité de référencement, de suivre les dossiers en cours et d'accéder rapidement aux outils de création.
2. Formulaire de Référence par Étapes

Processus guidé pour sécuriser la saisie des données médicales :

    Identification : Liaison avec la base de données patients.

    Bilan Clinique : Saisie assistée des motifs, diagnostics et traitements.

    Aide à la Décision : Recommandation intelligente d'hôpitaux de destination.

3. Gestion des Patients et Services

Système de gestion des dossiers patients et catalogue des services médicaux disponibles par établissement.
4. Moteur de Recommandation (SID)

Module exploitant les données pour suggérer l'hôpital optimal. Ce module permet d'améliorer les indicateurs de santé en réduisant les délais de prise en charge.
Installation et Configuration
Installation du Frontend

    Cloner le dépôt.

    Installer les dépendances :
    Bash

    npm install

    Lancer l'application :
    Bash

    npm start

Configuration de l'API

Le frontend attend une instance de l'API accessible via le service api.js. L'URL de base doit être configurée dans les variables d'environnement ou directement dans le fichier de service :

    URL par défaut : http://127.0.0.1:8000/api

Fonctionnalités Avancées

    Validation Stricte : Empêche l'envoi de requêtes incomplètes au serveur (erreurs 400).

    Autocomplétion Médicale : Suggestions dynamiques pour les diagnostics et examens.

    Responsive Design : Interface adaptée aux tablettes et ordinateurs pour une utilisation en milieu hospitalier.

    Système d'Impression : Génération instantanée de fiches de référence normalisées.

Structure du Code Source

    /src/components/reference : Composants liés au processus de référencement.

    /src/services : Configuration de l'instance Axios pour les appels API.

    /src/assets : Styles globaux et ressources visuelles.

Auteurs

Projet développé dans le cadre du Master 2 MIAGE - Spécialité Système Intelligent Décisionnel (SID) à l'Université de Douala.