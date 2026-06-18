# Modifications ajoutées

## 1. Prix d'achat et bénéfices
- Ajout du champ `purchasePrice` dans le type `Product`.
- Ajout du champ "Prix d’achat" dans le formulaire d’ajout/modification produit.
- Affichage du prix d’achat et du bénéfice unitaire dans la page "Mes produits" de la librairie.
- Ajout de statistiques de bénéfice brut dans la page "Statistiques" de la librairie.
- Ajout d’une courbe de bénéfice dans le graphique revenu/bénéfice.

## 2. Demande client lorsqu’un produit est introuvable
- Ajout d’un contexte `ProductRequestsContext` persistant en localStorage.
- Lorsqu’une recherche ne donne aucun résultat, le client peut envoyer une demande à toutes les librairies.
- Ajout d’une page client `/product-requests` pour voir les demandes envoyées et les réponses reçues.
- Ajout d’une page librairie `/librairie/product-requests` pour consulter toutes les demandes clients et y répondre.
- Ajout des entrées de menu correspondantes côté client et côté librairie.

## 3. Catégories sans ordre imposé
- Suppression du champ d’ordre dans l’interface d’administration des catégories.
- Suppression de l’affichage de l’ordre sur les cartes de catégories.
- Les catégories sont maintenant gérées librement par nom, description, icône, statut et genres.

## 4. Validation des inscriptions librairie
- Correction de la synchronisation des demandes d’inscription librairie avec le stockage local.
- Ajout d’un événement de mise à jour afin que l’administrateur voie les nouvelles demandes après soumission.
- Les demandes restent visibles dans l’onglet Admin > Validations.

## Vérifications
- `npm run build` : réussi.
- `npm audit --audit-level=moderate` : 0 vulnérabilité.
