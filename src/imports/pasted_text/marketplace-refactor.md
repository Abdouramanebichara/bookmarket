Je veux modifier mon application marketplace multi-librairies en gardant le style visuel déjà existant, mais en améliorant l’ergonomie, les tableaux de bord et le système de paiement.

CONTEXTE GÉNÉRAL
L’application est une marketplace de librairies où il existe plusieurs rôles : Client, Librairie et Administrateur. Les clients peuvent rechercher des livres, CD, DVD, documents, supports didactiques, etc. Les librairies peuvent gérer leurs produits, leurs stocks, leurs commandes et leurs ventes.
Je veux que les interfaces des clients et des librairies soient plus professionnelles, plus organisées et moins saturées.

1. MODIFICATION DE LA NAVIGATION : TABLEAU DE BORD À GAUCHE

Pour les interfaces Client et Librairie, il faut remplacer la navigation trop chargée en haut par un tableau de bord latéral à gauche de l’écran, un peu comme Gmail.

La barre du haut ne doit plus contenir toutes les pages. Elle doit rester légère avec seulement :

* logo et nom de l’application ;
* barre de recherche ;
* changement de langue ;
* changement de devise ;
* notifications ;
* profil utilisateur.

À gauche, ajouter une sidebar fixe ou rétractable avec icônes + textes.
La sidebar doit être claire, moderne, responsive et adaptée au rôle connecté.

Pour le CLIENT, la sidebar doit contenir :

* Accueil
* Catalogue
* Librairies proches
* Mon panier
* Mes commandes
* Mon wallet / Porte-monnaie
* Mes livres numériques / Mes PDF
* Favoris
* Historique d’achats
* Mon profil
* Support / Aide
* Déconnexion

Pour la LIBRAIRIE, la sidebar doit contenir :

* Tableau de bord
* Mes produits
* Ajouter un produit
* Gestion du stock
* Commandes reçues
* Ventes
* Wallet / Porte-monnaie
* Produits numériques / PDF
* Statistiques
* Paramètres de la librairie
* Support / Aide
* Déconnexion

La sidebar doit ressembler à un vrai dashboard professionnel :

* icônes modernes ;
* élément actif bien visible ;
* possibilité de réduire la sidebar ;
* design propre ;
* éviter de saturer la navbar du haut ;
* garder une bonne lisibilité sur desktop, tablette et mobile.

2. AJOUT D’UN WALLET / PORTE-MONNAIE POUR CLIENT ET LIBRAIRIE

Remplacer le paiement direct par un système de wallet.

Chaque client doit avoir un wallet personnel avec :

* solde disponible ;
* bouton “Recharger mon wallet” ;
* historique des transactions ;
* paiements effectués ;
* remboursements ;
* statut des transactions : réussi, en attente, échoué ;
* méthodes de recharge : Mobile Money, Orange Money, MTN Mobile Money, carte bancaire, virement.

Le client ne paie plus directement une commande avec Mobile Money ou carte.
Il recharge d’abord son wallet, puis lorsqu’il achète un produit, le montant est retiré de son wallet.

Exemple :

* Le client recharge son wallet avec 20 000 FCFA.
* Il achète un livre à 5 000 FCFA.
* Son wallet passe à 15 000 FCFA.
* La librairie reçoit 5 000 FCFA dans son propre wallet.

Chaque librairie doit aussi avoir un wallet avec :

* solde total ;
* argent reçu après chaque commande ;
* historique des ventes ;
* historique des retraits ;
* bouton “Demander un retrait” ;
* détails des paiements reçus ;
* statut des fonds : disponible, en attente, retiré.

Quand une commande est validée et payée :

* le wallet du client est débité ;
* le wallet de la librairie est crédité ;
* une transaction doit apparaître dans les deux historiques.

Prévoir aussi les cas d’erreur :

* solde insuffisant ;
* recharge échouée ;
* paiement en attente ;
* remboursement si commande annulée avant validation ;
* message clair pour chaque situation.

3. AJOUT DES LIVRES NUMÉRIQUES / PDF

Lorsqu’une librairie ajoute ou modifie un produit, elle doit pouvoir indiquer si le produit possède une version numérique.

Dans la page “Ajouter un produit”, ajouter une section :
“Version numérique du produit”

Cette section doit contenir :

* case à cocher : “Ce produit possède une version numérique PDF”
* champ pour importer le fichier PDF
* champ prix de la version numérique
* champ taille du fichier
* champ nombre de pages
* aperçu du PDF
* indication des droits d’accès après achat

Le client doit pouvoir acheter :

* seulement la version physique ;
* seulement la version PDF ;
* ou les deux si disponibles.

Sur la fiche produit, afficher clairement :

* Prix version physique
* Prix version PDF
* Disponibilité du stock physique
* Bouton “Acheter le livre physique”
* Bouton “Acheter le PDF”
* Bouton “Ajouter au panier”

Après l’achat d’un PDF :

* le fichier doit apparaître dans la page “Mes livres numériques / Mes PDF” du client ;
* le client doit pouvoir consulter ou télécharger son PDF ;
* le PDF ne doit être accessible qu’après paiement via wallet.

4. AMÉLIORATION DE LA PAGE D’AJOUT DE PRODUIT LIBRAIRIE

Sur la page “Ajouter un produit” de la librairie, il faut créer un formulaire complet, inspiré de la manière dont les livres sont présentés sur les sites professionnels comme Eyrolles.

Le formulaire doit contenir les sections suivantes :

A. Informations principales

* Titre du produit
* Type de produit : Livre, CD, DVD, document, support didactique, autre
* Catégorie
* Sous-catégorie
* Auteur(s)
* Maison d’édition
* Collection
* Langue
* Image de couverture
* Images supplémentaires

B. Prix et disponibilité

* Prix version physique
* Prix version numérique PDF si disponible
* Devise
* Stock actuel
* Quantité minimale d’alerte
* Disponibilité : disponible, en rupture, bientôt disponible

C. Description du produit
La description doit être riche et professionnelle, comme sur une vraie fiche de livre.
Ajouter les champs :

* Résumé court
* Description détaillée
* Points forts du livre
* Public cible
* Objectifs du livre
* Ce que le lecteur va apprendre
* Sommaire
* Mots-clés
* Extrait ou aperçu

D. Caractéristiques techniques
Ajouter les champs :

* ISBN
* EAN
* Nombre de pages
* Format
* Poids
* Dimensions
* Type de couverture : broché, relié, spirale, numérique
* Date de parution
* Édition
* Couleur intérieure : noir et blanc, couleur
* Support : papier, PDF, CD, DVD, autre

E. Auteur et édition

* Biographie courte de l’auteur
* Informations sur l’éditeur
* Collection
* Domaine du livre
* Niveau : débutant, intermédiaire, avancé, scolaire, universitaire, professionnel

F. Version numérique

* Le produit a-t-il une version PDF ?
* Upload du PDF
* Prix du PDF
* Taille du fichier
* Nombre de pages numériques
* Accès après achat

G. Stock
Au lieu de cliquer plusieurs fois pour ajouter du stock, la librairie doit pouvoir entrer directement le nombre de produits à ajouter.

Ajouter un champ :
“Quantité à ajouter au stock”

Exemple :
Stock actuel : 12
Quantité à ajouter : 30
Nouveau stock : 42

Ajouter aussi :

* bouton “Ajouter au stock”
* bouton “Réduire le stock”
* historique des mouvements de stock
* raison du mouvement : nouvel arrivage, correction, retour client, perte, produit endommagé

5. AMÉLIORATION DE LA FICHE PRODUIT CÔTÉ CLIENT

La fiche produit côté client doit être plus complète et professionnelle.

Elle doit afficher :

* image de couverture
* titre
* auteur
* prix physique
* prix PDF si disponible
* librairie vendeuse
* disponibilité
* note / avis
* résumé
* description détaillée
* caractéristiques techniques
* sommaire
* public cible
* détails auteur
* produits similaires
* bouton ajouter au panier
* bouton acheter avec wallet
* bouton acheter PDF si disponible

Ajouter une présentation claire entre :

* version physique ;
* version numérique ;
* offre physique + numérique si les deux sont disponibles.

6. TABLEAU DE BORD CLIENT

Créer un dashboard client clair avec des cartes statistiques :

* Solde wallet
* Commandes en cours
* Commandes terminées
* PDFs achetés
* Articles favoris
* Derniers achats
* Dernières transactions

Ajouter une section “Actions rapides” :

* Recharger wallet
* Voir catalogue
* Voir mes commandes
* Voir mes PDF
* Rechercher une librairie proche

7. TABLEAU DE BORD LIBRAIRIE

Créer un dashboard librairie clair avec :

* Solde wallet
* Ventes du jour
* Commandes en attente
* Produits en rupture
* Produits les plus vendus
* Revenus récents
* Dernières commandes reçues
* Dernières transactions wallet

Ajouter une section “Actions rapides” :

* Ajouter un produit
* Ajouter du stock
* Voir commandes
* Voir wallet
* Ajouter un PDF à un produit

8. DESIGN ET STYLE

Garder un design moderne, propre et professionnel.
L’interface doit ressembler à une vraie application e-commerce / marketplace.

Style souhaité :

* sidebar gauche moderne ;
* cartes propres ;
* beaucoup d’espace ;
* couleurs cohérentes ;
* icônes modernes ;
* boutons visibles ;
* dashboard professionnel ;
* responsive desktop, tablette et mobile ;
* éviter de surcharger la barre du haut.

9. DONNÉES MOCK À AJOUTER

Ajouter des données fictives pour qu’on puisse voir le rendu réel :

* plusieurs clients avec wallet ;
* plusieurs librairies avec wallet ;
* plusieurs produits physiques ;
* plusieurs produits PDF ;
* plusieurs commandes ;
* plusieurs transactions ;
* plusieurs mouvements de stock ;
* plusieurs livres avec descriptions complètes ;
* plusieurs achats PDF ;
* plusieurs recharges wallet.

Utiliser un contexte camerounais :

* devise par défaut : FCFA / XAF ;
* méthodes de paiement : MTN Mobile Money, Orange Money, carte bancaire ;
* librairies situées dans différents quartiers de Yaoundé ;
* exemples de livres scolaires, universitaires, romans africains, documents numériques, supports didactiques.

10. OBJECTIF FINAL

Je veux que Figma AI mette à jour l’interface pour obtenir :

* une navigation latérale claire pour client et librairie ;
* un vrai système de wallet visible dans l’interface ;
* une gestion des paiements par wallet ;
* une gestion des livres numériques PDF ;
* une page d’ajout produit librairie beaucoup plus complète ;
* une gestion de stock où on entre directement la quantité à ajouter ;
* des fiches produits professionnelles inspirées des sites de librairie comme Eyrolles ;
* des dashboards modernes adaptés à chaque rôle.
