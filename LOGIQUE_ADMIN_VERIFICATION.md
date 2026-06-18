# Vérification de la logique administrateur

Corrections ajoutées dans cette version :

## Tableau de bord administrateur
- Statistiques globales reliées aux données mock centralisées.
- Correction du débordement du champ "Revenu Total" dans les cartes statistiques.
- Boutons d'accès rapide fonctionnels : utilisateurs, catégories, signalements, rapport PDF.

## Gestion des utilisateurs
- Affichage de tous les types d'utilisateurs : clients, librairies, administrateur et utilisateurs inscrits localement.
- Recherche par nom, email, téléphone et localisation.
- Filtrage par rôle : client, librairie, administrateur.
- Activation/désactivation des comptes clients et librairies.
- Protection du compte administrateur principal contre la désactivation.
- Consultation du profil utilisateur via le bouton œil.
- Un compte désactivé ne peut plus se reconnecter.

## Gestion des librairies
- Liste des librairies partenaires reliée à l'état global de la plateforme.
- Activation/désactivation d'une librairie.
- Vérification/dé-vérification d'une librairie.
- Consultation du profil détaillé d'une librairie via le bouton œil.
- Accès à la fiche publique et à Google Maps depuis le profil admin.

## Validation des demandes librairie
- Affichage des demandes de création de librairie.
- Acceptation d'une demande : création du compte librairie + ajout de la librairie dans la plateforme.
- Refus d'une demande.
- Filtres : toutes, en attente, acceptées, refusées.

## Catégories et genres
- Gestion des catégories et genres.
- Ajout de catégorie.
- Modification de catégorie.
- Suppression de catégorie.
- Activation/désactivation de catégorie.
- Gestion des genres sous forme de liste séparée par des virgules.

## Signalement de livre côté client
- Ajout d'un bouton de signalement sur la fiche produit.
- Seul un client connecté peut signaler un livre.
- Le signalement est transmis au panneau administrateur.

## Traitement des livres signalés côté administrateur
- Consultation des signalements.
- Passage en vérification.
- Classement sans retrait.
- Retrait d'un livre signalé.
- Restauration d'un livre retiré.
- Les livres retirés sont exclus des listes visibles côté client : accueil, catalogue, recherche et produits associés.

## Rapports PDF
- Téléchargement d'un rapport global en PDF.
- Téléchargement des rapports prédéfinis en PDF.

## Paramètres de l'application
- Configuration du nom de l'application.
- Langue et devise par défaut.
- Email de support.
- Mode maintenance.
- Autorisation inscription client/librairie.
- Validation librairie obligatoire.
- Commission plateforme.
- Règles de sécurité de base.

## Vérifications techniques
- `npm run build` réussi.
- `npm audit --audit-level=moderate` : 0 vulnérabilité.
