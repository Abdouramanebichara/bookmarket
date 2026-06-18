import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';

const FR_TO_EN: Record<string, string> = {
  'La marketplace N°1 au Cameroun': 'The #1 marketplace in Cameroon',
  'Trouvez vos livres et': 'Find your books and',
  'fournitures scolaires': 'school supplies',
  "Des milliers de produits disponibles à l'achat ou en location dans plus de 11 librairies à Yaoundé": 'Thousands of products available for purchase or rental in more than 11 bookstores in Yaoundé',
  'Explorer le catalogue': 'Explore catalog',
  'Voir les librairies': 'View bookstores',
  'Produits': 'Products',
  'Librairies': 'Bookstores',
  'Commandes/mois': 'Orders/month',
  'Clients satisfaits': 'Satisfied customers',
  'Catégories populaires': 'Popular categories',
  'Librairies partenaires': 'Partner bookstores',
  'Produits populaires': 'Popular products',
  'Nouveautés': 'New arrivals',
  'Voir tout': 'View all',
  'Ajouter': 'Add',
  'Ajouter au panier': 'Add to cart',
  'Voir la boutique': 'View store',
  'Voir le produit': 'View product',
  'Voir détails': 'View details',
  'Catalogue': 'Catalog',
  'Filtres': 'Filters',
  'Catégories': 'Categories',
  'Toutes': 'All',
  'Tous': 'All',
  'Prix': 'Price',
  'Recommandés': 'Featured',
  'Prix croissant': 'Price: Low to High',
  'Prix décroissant': 'Price: High to Low',
  'Mieux notés': 'Highest rated',
  'Connexion requise': 'Login required',
  'Annuler': 'Cancel',
  'Se connecter': 'Login',
  'Créer un compte': 'Create account',
  'Mes Favoris': 'My Favorites',
  'Vos produits préférés en un seul endroit': 'Your favorite products in one place',
  'Aucun favori pour le moment': 'No favorites yet',
  'Récents': 'Recent',
  'Nom (A-Z)': 'Name (A-Z)',
  'Mon Panier': 'My Cart',
  'Votre panier est vide': 'Your cart is empty',
  'Continuer mes achats': 'Continue shopping',
  'Finaliser la commande': 'Checkout',
  'Retour au panier': 'Back to cart',
  'Livraison': 'Delivery',
  'Paiement': 'Payment',
  'Confirmation': 'Confirmation',
  'Adresse de livraison': 'Shipping address',
  'Mode de paiement': 'Payment method',
  'Résumé de commande': 'Order summary',
  'Total': 'Total',
  'Mes Commandes': 'My Orders',
  'Mes Locations': 'My Rentals',
  'Mes Livres Numériques': 'My Digital Books',
  'Mes PDF': 'My PDFs',
  'Lire': 'Read',
  'Télécharger': 'Download',
  'Dernier téléchargement:': 'Last download:',
  'Notifications': 'Notifications',
  'Tout marquer comme lu': 'Mark all as read',
  'Profil': 'Profile',
  'Mon Profil': 'My Profile',
  'Informations personnelles': 'Personal information',
  'Modifier': 'Edit',
  'Enregistrer': 'Save',
  'Déconnexion': 'Logout',
  'Tableau de bord': 'Dashboard',
  'Dashboard Administrateur': 'Admin Dashboard',
  "Vue d'ensemble de la plateforme": 'Platform overview',
  'Gestion des utilisateurs': 'User management',
  'Gestion des catégories': 'Category management',
  'Signalements': 'Reports',
  'Activité récente': 'Recent activity',
  'Tableau de bord librairie': 'Bookstore dashboard',
  'Gérer mes produits': 'Manage my products',
  'Ajouter un produit': 'Add product',
  'Inventaire': 'Inventory',
  'Commandes': 'Orders',
  'Locations': 'Rentals',
  'Ventes': 'Sales',
  'Statistiques': 'Statistics',
  'Paramètres': 'Settings',
  'Portefeuille': 'Wallet',
  'Recherche': 'Search',
  'Rechercher': 'Search',
  'Pertinence': 'Relevance',
  'Tout': 'All',
  'Produit': 'Product',
  'Librairie': 'Bookstore',
  'Voir la librairie': 'View bookstore',
  'Vérifiée': 'Verified',
  'Aucun résultat trouvé': 'No results found',
  'Aperçu carte': 'Map preview',
  'Informations web': 'Web information',
  'Ville': 'City',
  'Horaires': 'Opening hours',
  'Site web': 'Website',
  'Source mock': 'Mock source',
  'Coordonnées GPS': 'GPS coordinates',
};

function translateTextNode(node: Text) {
  const original = node.nodeValue || '';
  const trimmed = original.trim();
  if (!trimmed) return;

  const translated = FR_TO_EN[trimmed];
  if (!translated) return;

  node.nodeValue = original.replace(trimmed, translated);
}

function walkTextNodes(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach(translateTextNode);
}

export function AutoTranslate() {
  const { language } = useLocalization();
  const location = useLocation();

  useEffect(() => {
    if (language !== 'en') return;

    const run = () => walkTextNodes(document.body);
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language, location.pathname, location.search]);

  return null;
}
