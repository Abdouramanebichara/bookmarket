# BookMarket

BookMarket est une application web de marketplace spécialisée dans la vente de livres, documents, supports scolaires et produits numériques.

Le projet permet de connecter des clients à plusieurs librairies à travers une interface moderne, responsive et pseudo-fonctionnelle. L’application peut fonctionner sans backend complet grâce à des données mock locales, ce qui permet de tester les principales fonctionnalités du système.

Ce projet a été réalisé dans le cadre d’un projet académique afin de simuler le fonctionnement d’une plateforme e-commerce multi-librairies adaptée au contexte camerounais.

---

## Objectif du projet

L’objectif de BookMarket est de proposer une plateforme permettant :

- aux clients de rechercher, consulter et acheter des livres ;
- aux librairies de gérer leurs produits, leurs commandes et leur portefeuille ;
- à l’administrateur de superviser les utilisateurs, les librairies et l’activité générale de la plateforme.

L’application prend aussi en charge les produits numériques, notamment les livres PDF, avec possibilité d’ouverture et de téléchargement.

---

## Fonctionnalités principales

### Côté client

- inscription et connexion ;
- consultation des livres et articles disponibles ;
- recherche avancée de produits ;
- filtrage par catégorie, prix, librairie ou localisation ;
- ajout au panier ;
- gestion des favoris ;
- achat de produits physiques ou numériques ;
- accès aux livres PDF achetés ;
- ouverture et téléchargement des PDF ;
- consultation des librairies ;
- visualisation des librairies sur une carte ;
- changement de langue ;
- changement de devise ;
- gestion du profil client.

### Côté librairie

- tableau de bord librairie ;
- gestion des produits ;
- ajout, modification et suppression de produits ;
- gestion des stocks ;
- ajout d’une version numérique PDF pour un livre ;
- consultation des commandes reçues ;
- validation des commandes ;
- suivi du portefeuille ;
- consultation des statistiques de vente.

### Côté administrateur

- tableau de bord administrateur ;
- gestion des librairies ;
- gestion des utilisateurs ;
- consultation des statistiques générales ;
- suivi de l’activité de la plateforme ;
- supervision globale du système.

---

## Technologies utilisées

Le projet utilise principalement :

- React ;
- TypeScript ;
- Vite ;
- React Router ;
- Tailwind CSS ;
- données mock locales ;
- stockage local avec `localStorage` ;
- carte interactive avec coordonnées GPS ;
- architecture frontend organisée par composants, pages, données et services.

---

## Structure générale du projet

```txt
bookmarket/
├── public/
│   ├── images/
│   │   ├── books/
│   │   └── libraries/
│   └── pdfs/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
├── package.json
├── vite.config.ts
└── README.md
```

---

## Installation du projet

Pour installer le projet localement :

```bash
npm install
```

---

## Lancement en développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

L’application sera accessible localement à l’adresse affichée dans le terminal, généralement :

```txt
http://localhost:5173
```

---

## Compilation du projet

Pour générer la version de production :

```bash
npm run build
```

---

## Prévisualisation de la version buildée

Après le build, il est possible de prévisualiser le projet avec :

```bash
npm run preview
```

---

## Comptes de test

Pour tester les différents rôles de l’application, les comptes suivants peuvent être utilisés :

| Rôle | Email | Mot de passe |
|---|---|---|
| Client | client@bookstore.cm | Client@123 |
| Librairie | librairie@bookstore.cm | Librairie@123 |
| Administrateur | admin@bookstore.cm | Admin@123 |

Ces comptes permettent d’accéder aux différentes interfaces selon le rôle de l’utilisateur.

---

## Données mock

Le projet fonctionne avec des données mock locales afin de simuler le comportement d’une vraie application.

Les données concernent notamment :

- les livres ;
- les librairies ;
- les clients ;
- les commandes ;
- les favoris ;
- les produits PDF ;
- les portefeuilles ;
- les statistiques ;
- les informations de localisation.

Cela permet de tester l’application sans dépendre immédiatement d’un backend complet.

---

## Gestion des images

Les images locales doivent être placées dans le dossier `public/images`.

Exemple :

```txt
public/images/books/munyal.jpg
```

Dans le code, le chemin doit être écrit ainsi :

```ts
"/images/books/munyal.jpg"
```

Il ne faut pas écrire :

```ts
"public/images/books/munyal.jpg"
```

---

## Gestion des PDF

Les fichiers PDF doivent être placés dans le dossier :

```txt
public/pdfs/
```

Exemple :

```txt
public/pdfs/prod-1.pdf
```

Dans les données du produit, le chemin peut être indiqué ainsi :

```ts
"/pdfs/prod-1.pdf"
```

Les PDF peuvent ensuite être ouverts ou téléchargés depuis l’espace client.

---

## Recherche

L’application dispose d’un système de recherche local permettant de retrouver les produits selon plusieurs critères :

- titre ;
- auteur ;
- catégorie ;
- description ;
- ISBN ;
- librairie ;
- ville ;
- adresse.

La recherche a été pensée pour donner des résultats pertinents même sans backend.

---

## Carte des librairies

L’application contient une partie dédiée aux librairies avec un aperçu cartographique.

Chaque librairie peut contenir :

- un nom ;
- une adresse ;
- une ville ;
- des coordonnées GPS ;
- un numéro de téléphone ;
- une image ;
- un lien vers Google Maps ;
- des informations publiques disponibles.

Cela permet au client de mieux localiser les librairies disponibles sur la plateforme.

---

## Multilangue et multidevise

L’application propose un changement de langue et de devise.

Les langues prévues sont :

- français ;
- anglais.

Les devises prévues sont :

- FCFA ;
- EUR ;
- USD.

Le choix de langue et de devise est conservé localement afin de rester actif même après actualisation de la page.

---

## Logique métier simulée

Même sans backend complet, plusieurs actions ont été reliées à une logique fonctionnelle :

- connexion selon le rôle ;
- redirection vers le bon tableau de bord ;
- ajout au panier ;
- ajout aux favoris ;
- achat simulé ;
- ajout des PDF achetés dans la bibliothèque numérique ;
- ouverture des PDF ;
- téléchargement des PDF ;
- affichage des commandes ;
- validation simulée des commandes ;
- gestion du portefeuille ;
- affichage des librairies sur la carte.

---

## Déploiement

Le projet peut être déployé facilement sur Vercel.

Paramètres recommandés :

```txt
Framework : Vite
Build Command : npm run build
Output Directory : dist
Install Command : npm install
```

Après connexion du dépôt GitHub à Vercel, chaque `push` sur la branche principale peut déclencher automatiquement un nouveau déploiement.

---

## Auteur

Projet réalisé par :

**Abdouramane Bichara**

Étudiant en génie informatique.

---

## État du projet

Le projet est actuellement une version frontend avancée et pseudo-fonctionnelle.

Il peut être amélioré avec :

- un backend Node.js / Express ;
- une base de données PostgreSQL ;
- une authentification JWT ;
- un vrai système de paiement ;
- une vraie gestion des commandes ;
- une API pour les librairies ;
- une API pour les produits ;
- un stockage réel des fichiers PDF ;
- une intégration complète Google Maps.

---

## Licence

Ce projet est réalisé dans un cadre académique et pédagogique.
