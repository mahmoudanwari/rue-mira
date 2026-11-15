import { SIZE_ROWS } from "./en";
import type { SiteContent } from "./types";

const content: SiteContent = {
  about: {
    intro:
      "RUE MIRA est une marque fictive imaginée pour un portfolio de design : un petit atelier bruxellois qui crée des vêtements et accessoires du quotidien, réfléchis, chaleureux et discrètement singuliers — à des prix qui restent doux.",
    sections: [
      {
        heading: "L’idée",
        paragraphs: [
          "La plupart de nos vêtements se portent les jours ordinaires. RUE MIRA part de là : le tram, le bureau, le marché, le dîner imprévu. Les pièces sont pensées pour aller ensemble, durer plus d’une saison et faire du bien même la centième fois.",
          "Les couleurs viennent de la ville — bordeaux brique, pierre, espresso, un bleu pâle du matin — pour qu’une robe, une veste et un sac se retrouvent dans une même tenue sans effort.",
        ],
      },
      {
        heading: "L’atelier (imaginaire)",
        paragraphs: [
          "Notre histoire est inventée : il n’y a ni véritable atelier, ni véritable équipe, ni produits en vente. Ce qui est réel, c’est le savoir-faire derrière ce site — direction artistique, design d’interface, accessibilité et développement front-end, à découvrir sur chaque page.",
        ],
      },
      {
        heading: "Nos engagements",
        paragraphs: [
          "Une présentation honnête. Pas d’avis inventés, pas de fausse rareté, pas de compte à rebours. Les stocks sont des chiffres de démo, clairement indiqués comme tels.",
          "Des images inclusives avec des adultes. Tous les modèles de nos photos sont adultes, et chaque image a été créée spécialement pour cette démo.",
        ],
      },
    ],
    quote: "« Nous dessinons pour la journée que vous vivez vraiment, pas pour celle des magazines. »",
    portraitAlt: "Portrait de la fondatrice fictive de RUE MIRA dans l’atelier",
    studioAlt: "L’atelier imaginaire de RUE MIRA avec des échantillons de tissu et une table de travail",
  },
  journal: {
    intro: "Deux courts récits de l’atelier (fictif) — sur l’art de s’habiller, et sur la ville qui nous inspire.",
    readMore: "Lire l’article",
    backToJournal: "Retour au journal",
    stories: [
      {
        slug: "city-uniform",
        title: "Éloge de l’uniforme urbain",
        dek: "Pourquoi les meilleures garde-robes se répètent — et comment faire de la répétition une signature.",
        date: "2026-03-12",
        image: "/images/Home page and campaign images/75-home-editorial-city-style.png",
        imageAlt: "",
        pull: "La répétition n’est pas ennuyeuse quand chaque pièce mérite sa place.",
        body: [
          "Il y a une assurance tranquille chez celles et ceux qui semblent porter la même chose tous les jours. En regardant de plus près, ce n’est presque jamais la même chose — c’est la même idée : une forme qui fonctionne, des couleurs qui s’accordent, un détail qui change.",
          "Nos pièces de ville partent de cette idée. Un pantalon large qui tient à la taille. Une chemise qu’on rentre, qu’on noue ou qu’on porte ouverte. Un trench court qui s’arrête exactement là où commence une taille haute.",
          "Trois pièces comme celles-là, et la semaine est faite. Ajoutez un petit sac de couleur chaude, et la semaine vous ressemble.",
          "Cet article est un contenu éditorial fictif rédigé pour une démo de portfolio.",
        ],
      },
      {
        slug: "slow-weekend",
        title: "Notes d’un week-end lent",
        dek: "Marchés, terrasses et l’art de s’habiller pour aller nulle part en particulier.",
        date: "2026-04-02",
        image: "/images/Home page and campaign images/76-home-weekend-edit.png",
        imageAlt: "",
        pull: "La meilleure tenue de week-end est celle qu’on oublie qu’on porte.",
        body: [
          "Les vêtements du week-end ont une autre mission. Ils doivent survivre à un marché, à un long déjeuner et à un retour par le chemin des écoliers.",
          "Nous choisissons une viscose fleurie qui bouge, un cabas tressé assez grand pour des fleurs et du pain, et des sandales au talon assez bas pour qu’on l’oublie.",
          "Rien de trop précieux, rien de trop prévu — et pourtant, une allure soignée.",
          "Cet article est un contenu éditorial fictif rédigé pour une démo de portfolio.",
        ],
      },
    ],
  },
  help: {
    intro: "Réponses aux questions fréquentes — rédigées pour cette boutique de démo. Rien ici ne décrit un service réel.",
    faq: [
      { q: "Puis-je vraiment acheter quelque chose ?", a: "Non. RUE MIRA est une démo de portfolio. Le paiement est simulé du début à la fin et ne demande ni ne conserve jamais de données de paiement." },
      { q: "Où mon panier est-il enregistré ?", a: "Dans le stockage local de votre navigateur, sur cet appareil uniquement. Si votre navigateur bloque le stockage, le panier ne dure que le temps de la visite." },
      { q: "Y a-t-il un code promo ?", a: "Oui — essayez MIRA10 dans le panier pour une réduction de démo de 10 %." },
      { q: "Comment fonctionne la livraison ?", a: "Elle n’existe pas — mais la démo la calcule : 4,95 € à domicile (gratuite dès 70 € avant réduction) ou 2,95 € en point relais. Tous les tarifs sont fictifs." },
      { q: "Comment trouver ma taille ?", a: "Ouvrez le guide des tailles depuis une fiche produit, ou consultez la page guide des tailles pour les tableaux complets en centimètres." },
      { q: "Qu’est-ce que le Demo Studio ?", a: "Un espace public qui imite un back-office. Vous pouvez modifier prix, stocks et visibilité — mais uniquement dans votre navigateur." },
      { q: "Comment tout réinitialiser ?", a: "Ouvrez le Demo Studio et choisissez « Réinitialiser la démo ». Une confirmation vous sera demandée." },
    ],
  },
  delivery: {
    intro: "Notre politique de livraison et de retour — entièrement fictive, rédigée pour que la démo paraisse complète.",
    sections: [
      { heading: "Livraison en Belgique (démo)", paragraphs: ["À domicile : 4,95 €, 2 à 4 jours ouvrables estimés. Gratuite dès 70 € (sous-total avant réduction).", "Point relais : 2,95 €, 3 à 5 jours ouvrables estimés."] },
      { heading: "Retours (démo)", paragraphs: ["Dans une vraie boutique, vous auriez 30 jours pour retourner les articles non portés. Dans cette démo, rien n’est jamais expédié, donc rien n’est à retourner."] },
      { heading: "Prix et TVA", paragraphs: ["Tous les prix sont indiqués en euros et incluent 21 % de TVA belge. Les totaux sont calculés en centimes entiers pour éviter les erreurs d’arrondi."] },
    ],
  },
  sizeGuide: {
    intro: "Les mesures sont en centimètres et décrivent votre corps, pas le vêtement. Ces tableaux sont indicatifs pour cette démo.",
    howTo: {
      heading: "Comment mesurer",
      paragraphs: [
        "Poitrine : autour de la partie la plus forte. Taille : autour de la taille naturelle. Hanches : autour de la partie la plus large. Pied : du talon au plus long orteil, debout.",
        "Entre deux tailles ? Prenez la plus grande pour une coupe ample et la plus petite pour une coupe plus près du corps.",
      ],
    },
    tables: [
      { caption: "Vêtements (XS–XL)", headers: ["Taille", "EU", "Poitrine", "Taille", "Hanches"], rows: SIZE_ROWS.sizeRows },
      { caption: "Denim (tailles de jean)", headers: ["Taille jean", "Équivalent", "Tour de taille (cm)"], rows: SIZE_ROWS.waistRows },
      { caption: "Chaussures (EU)", headers: ["EU", "UK", "Longueur du pied (cm)"], rows: SIZE_ROWS.shoeRows.map((r) => [r[0], r[1].replace(".", ","), r[2].replace(".", ",")]) },
    ],
  },
  privacy: {
    intro: "Cette démo est conçue pour ne rien collecter. Voici précisément ce qu’il advient des données sur ce site.",
    sections: [
      { heading: "Ce qui est conservé", paragraphs: ["Uniquement un état de démo non personnel, dans le stockage local de votre navigateur : lignes du panier (ID produit, taille, quantité), ID des favoris et de la comparaison, modifications du Demo Studio, votre langue et les commandes de démo (code, articles, totaux, horodatage)."] },
      { heading: "Ce qui n’est jamais conservé ni envoyé", paragraphs: ["Les noms, adresses, e-mails et messages saisis dans le paiement, le contact ou la newsletter restent dans la mémoire de la page et disparaissent quand vous la quittez. Rien n’est envoyé à un serveur — il n’y en a pas.", "Aucune donnée de paiement n’est jamais demandée."] },
      { heading: "Cookies et suivi", paragraphs: ["Cette démo n’utilise ni cookies, ni outils d’analyse, ni traceurs tiers."] },
      { heading: "Effacer vos données", paragraphs: ["Utilisez « Réinitialiser la démo » dans le Demo Studio, ou effacez les données de ce site dans les réglages de votre navigateur."] },
    ],
  },
  terms: {
    intro: "Des conditions en langage clair pour une boutique de démo.",
    sections: [
      { heading: "Aucune vente", paragraphs: ["RUE MIRA est fictive. Rien sur ce site n’est proposé à la vente, et l’utilisation du paiement ne forme aucun contrat."] },
      { heading: "Contenu", paragraphs: ["Noms de produits, descriptions, prix, personnes et conditions sont inventés. Les photos ont été créées pour cette démo ; tous les modèles représentés sont adultes. Toute ressemblance avec des marques ou personnes réelles est involontaire."] },
      { heading: "Utilisation", paragraphs: ["Explorez librement chaque fonctionnalité. Merci de ne pas saisir de vraies données personnelles ou financières — elles ne sont pas nécessaires."] },
    ],
  },
  demo: {
    intro: "RUE MIRA est un projet de portfolio qui présente un front-end e-commerce complet, accessible et multilingue — fonctionnant entièrement comme site statique.",
    sections: [
      { heading: "Ce qui fonctionne", paragraphs: ["Recherche avec suggestions, filtres combinables et tri avec URL partageables, aperçu rapide, galeries zoomables, guide des tailles, favoris, comparaison (jusqu’à 4), panier avec code promo et calcul de livraison, paiement simulé en cinq étapes, historique des commandes de démo, lookbook shoppable et Demo Studio local."] },
      { heading: "Ce qui est simulé", paragraphs: ["Paiements, e-mails, comptes, stocks et livraison. Tout se passe dans votre navigateur et est clairement indiqué."] },
      { heading: "Comment c’est construit", paragraphs: ["Next.js App Router avec export statique, TypeScript, Tailwind CSS et Motion. Toutes les pages — dont 96 fiches produits en trois langues — sont générées à la compilation et peuvent être hébergées sur GitHub Pages."] },
      { heading: "Accessibilité", paragraphs: ["Menus utilisables au clavier, boîtes de dialogue avec gestion du focus, focus visible, repères sémantiques, libellés traduits et prise en charge de la réduction des animations."] },
    ],
  },
};

export default content;
