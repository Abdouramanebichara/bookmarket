# Modifications couleurs et géolocalisation

## Couleurs unies

Tous les fonds en dégradé visibles dans l'application ont été remplacés par des couleurs unies afin d'obtenir un rendu plus sobre et plus professionnel. Les zones concernées incluent les tableaux de bord, cartes statistiques, boutons, profils, pages d'authentification, sections client, librairie et administrateur.

## Inscription librairie : coordonnées GPS

Le formulaire d'inscription librairie conserve les champs latitude et longitude obligatoires, mais propose désormais deux méthodes de récupération automatique :

1. **Position de l'appareil** : le demandeur peut cliquer sur « Utiliser ma position ». Le navigateur demande l'autorisation de géolocalisation et remplit automatiquement latitude et longitude avec une position précise.
2. **Sélection sur carte** : le demandeur peut cliquer directement sur la carte intégrée. Le point sélectionné met automatiquement à jour les champs latitude et longitude.

Les coordonnées GPS renseignées sont transmises à l'administrateur avec les informations légales et les documents obligatoires de la librairie.

## Documents administratifs

La logique existante est conservée : les documents obligatoires restent requis avant envoi de la demande et l'administrateur peut consulter ou télécharger les documents uploadés.
