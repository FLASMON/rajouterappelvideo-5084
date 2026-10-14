# WhatsApp Web — reproduction des captures
Interface française sombre, dense, fidèle aux dix captures. Web responsive, stockage local, appels simulés.
Palette : rail #202020, liste #161717, accueil #1c1e1e, survol #2e2f2f, texte #f1f1f1, secondaire #a0a4a5, accent #21c765, bulle envoyée #005c4b, reçue #242626.
Typographie Arial / Helvetica sans-serif : corps 14px, titres 20px, légendes 11–12px.
Disposition : rail 64px, liste 390px, conversation flexible, panneau contact 360px. Pleine hauteur. Mobile mono-panneau avec retour.
Assets : avatars et papier peint extraits des captures utilisateur, sous public/images.
Composants : boutons icône circulaires, champs arrondis, filtres, menus flottants, panneaux latéraux, fenêtres et visionneuse.
Animations : panneaux 200ms, menus 120ms, messages 160ms. Respect du mouvement réduit.
Fonctions : messagerie locale, recherche, archivage, favoris, réactions, réponse, transfert, fichiers, audio enregistré si autorisé, profil, groupes, paramètres, statuts, sondages, appels simulés.
Architecture : pages/messenger.tsx et composants spécialisés ; état React persisté localement, aucune API WhatsApp.

## Mise à jour — appels immersifs
Référence utilisateur image_vuiSWi.png : grille vidéo 2×2, noms en superposition, barre de commandes et conversation latérale. Adaptation professionnelle sombre, vert WhatsApp, panneaux ardoise, boutons généreux, bordures discrètes. Plein écran applicatif par défaut ; mode réduit réversible. Sur mobile, grille compacte et conversation en panneau superposé.
Photos de démonstration découpées dans la référence fournie, non présentées comme des flux réels. Aucun appel réseau.
Motion : entrée échelonnée des tuiles, présence des panneaux, transition grille/focus, réactions flottantes, anneaux d’attente. Respect du mouvement réduit via MotionConfig.

## Correction grille multi-participants
Calcul réel via ResizeObserver : dimensions, colonnes et lignes optimisées pour maximiser la taille de vidéos au format 16:10. Dernière ligne centrée, tuiles identiques, réduction automatique lors des ajouts. Focus : grande tuile sur toute la hauteur, bande latérale de miniatures ; sur mobile, grande tuile au-dessus d’une bande horizontale. Pagination si trop de participants pour conserver une taille lisible. Aucun défilement ni rognage des noms. Mise à jour fluide lors des changements de taille, panneau, ajout ou retrait.
