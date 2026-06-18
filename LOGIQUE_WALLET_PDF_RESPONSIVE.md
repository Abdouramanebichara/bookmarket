# Vérification logique wallet, PDF et responsive

## Responsive mobile

- Le menu latéral client est masqué sur téléphone et remplacé par un menu mobile accessible avec l’icône menu.
- Le menu latéral librairie est masqué sur téléphone et remplacé par un menu mobile.
- Les marges fixes `ml-64` / `ml-20` sont maintenant appliquées uniquement à partir du format desktop (`lg:`), pour éviter que le contenu sorte de l’écran sur mobile.
- Les tableaux, images, vidéos, cartes et grands contenus ont des règles globales pour éviter les débordements horizontaux.
- Les montants importants utilisent `break-words` afin d’éviter le débordement dans les cartes sur téléphone.

## Portefeuille client

- Le client peut maintenant recharger son portefeuille.
- Le client peut maintenant retirer de l’argent depuis son portefeuille.
- Le retrait client vérifie : montant valide, solde suffisant et numéro Mobile Money si nécessaire.
- Le retrait est enregistré comme transaction de type `withdrawal`.
- L’historique du client affiche les retraits dans les dépenses.
- Les notifications acceptent maintenant le type `wallet_withdrawal`.

## Portefeuille librairie

- Les textes “retraits traités sous 24–48h”, “frais de retrait” et “frais 1%” ont été supprimés.
- Le récapitulatif du retrait affiche simplement le montant à retirer.
- La logique ne retire plus de frais fictifs dans l’interface.

## Achat PDF

- Un PDF correspond maintenant à un seul achat numérique.
- La quantité n’est plus affichée ni modifiable pour les PDF dans la fiche produit.
- La quantité n’est plus affichée ni modifiable pour les PDF dans le panier.
- Le panier force les produits numériques à une quantité de 1.
- Le checkout calcule les PDF sans multiplication par quantité.
- Aucuns frais de livraison ne sont appliqués si le panier contient uniquement des PDF.
- La livraison et le paiement à la livraison sont ignorés pour un panier uniquement numérique.

## Fichiers modifiés principaux

- `src/app/context/CartContext.tsx`
- `src/app/context/NotificationsContext.tsx`
- `src/app/pages/ClientWalletPage.tsx`
- `src/app/pages/LibrairieWalletPage.tsx`
- `src/app/pages/ProductDetailsPageDemo.tsx`
- `src/app/pages/CartPageDemo.tsx`
- `src/app/pages/CheckoutPage.tsx`
- `src/app/components/Sidebar.tsx`
- `src/app/layouts/ClientLayout.tsx`
- `src/app/layouts/LibrairieLayout.tsx`
- `src/styles/theme.css`

## À tester localement

Après extraction :

```bash
npm install
npm run dev
```

Puis vérifier sur navigateur mobile ou DevTools :

- largeur 390px / 430px ;
- menu client ;
- menu librairie ;
- retrait portefeuille client ;
- retrait portefeuille librairie ;
- achat d’un PDF seul ;
- achat d’un produit physique ;
- panier mixte PDF + livre physique.
