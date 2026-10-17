/**
 * Contenu par défaut du site. Chaque clé de premier niveau correspond à une
 * ligne de public.client_site_content (site_id = SITE_ID) éditable depuis la
 * console Atlas Studio (module « Sites clients »). Le site s'affiche avec ces
 * valeurs tant que la console ne les a pas remplacées.
 *
 * Mise en forme dans les textes : *mot* = italique doré.
 */

export const SITE_ID = 'gulf-bridge-sourcing';

export interface PageHero { title: string; text: string; image: string }
export interface TitledText { title: string; text: string }
export interface Deliverable { title: string; text: string; deliverable: string }

export const defaults = {
  settings: {
    email: 'contact@gulfbridgesourcing.com',
    website: 'www.gulfbridgesourcing.com',
    whatsapp: '',
    whatsappLabel: '[numéro]',
    phoneAbidjan: '+225 07 67 31 61 67',
    phoneGuangzhou: '[Téléphone]',
    addressAbidjan: '[Adresse]',
    addressGuangzhou: '[Adresse]',
    legalName: '[Raison sociale]',
    rccm: '[n°]',
    chinaLicence: '[n°]',
    linkedin: '',
    ctaLabel: 'Parler de mon projet',
  },

  seo: {
    siteName: 'Gulf Bridge Sourcing',
    description: "Agent d'achat basé à Guangzhou : vérification de fournisseurs, sourcing, achat accompagné et contrôle qualité, pour la Côte d'Ivoire, le Gabon et le Cameroun.",
    ogImage: '/images/hero-port.webp',
    titleHome: 'Vos achats en Chine, vérifiés sur place avant le solde',
    titleApproche: 'Notre approche',
    titleServices: 'Services',
    titleMethode: 'Méthode',
    titleSecteurs: 'Secteurs',
    titleAbout: 'Qui nous sommes',
    titleContact: 'Contact',
  },

  intro: {
    enabled: true,
    cityFrom: 'Guangzhou',
    cityTo: 'Abidjan',
  },

  home_hero: {
    eyebrow: 'Sourcing · Achat pour votre compte · Contrôle qualité',
    title: 'Vos achats en Chine, vérifiés sur place *avant* de payer le solde.',
    text: "Nous trouvons les meilleurs fabricants et les mettons en concurrence, vérifions l'usine, négocions le contrat et contrôlons la marchandise. Vous payez le solde seulement quand tout est conforme.",
    ctaSecondary: 'Voir notre méthode',
    note: 'Premier échange sous 48 h ouvrées, gratuit. Proposition chiffrée avant tout engagement.',
    image: '/images/hero-port.webp',
    fromLabel: 'Bureau',
    fromCity: 'Guangzhou',
    toLabel: "Livraison suivie jusqu'au port",
    toCity: 'Abidjan · Owendo · Douala · Kribi',
    milestones: ['Inspection', 'Consolidation'],
  },

  home_constat: {
    title: 'La Chine est déjà votre premier fournisseur. Acheter à distance reste *risqué*.',
    text: "La Chine est le premier partenaire commercial de la Côte d'Ivoire depuis huit ans¹ et le premier fournisseur du Cameroun, avec 22,2 % de ses importations². Les entreprises qui achètent sans présence sur place rencontrent quatre problèmes récurrents.",
    footnotes: [
      "¹ Douanes chinoises (GACC), échanges 2025 de 7,42 Md$, en hausse de 46,9 %. Cité par l'Agence ivoirienne de presse, octobre 2026.",
      '² Institut national de la statistique du Cameroun et Direction générale des douanes, Comptes du commerce extérieur 2024.',
    ],
    risks: [
      { title: 'Qualité non conforme', text: "Le produit ne correspond pas à l'échantillon. Le défaut se découvre au déballage, sur le chantier, et le fournisseur ne répond plus." },
      { title: 'Délais qui glissent', text: "La production prend du retard, l'expédition aussi. L'ouverture du site recule et chaque semaine perdue se paie." },
      { title: 'Fournisseurs non vérifiés', text: "Un intermédiaire se présente comme fabricant et l'acompte part sur un compte personnel. Il est rarement récupéré." },
      { title: 'Blocage au port', text: 'Documents incomplets ou normes du pays ignorées. La marchandise attend et les frais de stationnement s\'accumulent.' },
    ] as TitledText[],
  },

  home_audience: {
    items: [
      { title: 'Hôtels, galeries commerciales, bureaux', text: "Mobilier, éclairage, signalétique, revêtements, climatisation, livrés conformes avant la date d'ouverture.", image: '/images/secteur-hotellerie.webp' },
      { title: 'Bases-vie, sites industriels, Oil & Gas', text: 'Modulaires, cuisines, buanderies, énergie, EPI, consolidés en Chine et expédiés en un seul envoi.', image: '/images/secteur-industrie.webp' },
    ],
  },

  home_founder: {
    quote: '« Je ne vous demande pas de me croire. Je vous montre ce que je *vérifie*. »',
    author: 'Pamela Atokouna · Fondatrice',
    linkLabel: 'Qui nous sommes',
  },

  home_startup: {
    eyebrow: 'Une entreprise qui démarre',
    title: 'Ce que notre taille *change* pour vous',
    points: [
      { title: 'La fondatrice sur chaque dossier', text: "Votre commande n'est pas confiée à un junior. Elle est suivie personnellement, de l'usine au port." },
      { title: 'Un premier échange sous 48 heures ouvrées', text: 'Nous revenons vers vous sous deux jours ouvrés. La proposition chiffrée suit, dans un délai annoncé selon la taille du projet.' },
      { title: 'Un premier pas sans risque', text: 'Commencez par la vérification de votre fournisseur. 50 % sont déduits si vous commandez ensuite avec nous.' },
    ] as TitledText[],
    reportEyebrow: 'Jugez sur pièces',
    reportTitle: 'Le modèle exact du rapport que vous recevrez',
    reportText: 'Photos, mesures et écarts classés, reçus avant le paiement du solde.',
    reportLink: 'Recevoir le modèle complet',
  },

  home_positioning: {
    title: 'Direct usine. *Vérifié* sur place.',
    text: "Vous achetez directement au fabricant, sans intermédiaire. Nous sommes dans l'usine pour vérifier le fournisseur, la production et la commande avant son départ.",
    image: '/images/positionnement-usine.webp',
  },

  home_explore: {
    eyebrow: 'Explorer',
    title: "Tout ce qu'il faut savoir avant de nous confier vos achats",
    cards: [
      { page: 'approche', icon: 'verified', title: 'Notre approche', text: '6 engagements écrits au contrat' },
      { page: 'services', icon: 'inventory', title: 'Services', text: 'Sourcing, achat pour votre compte, contrôle qualité' },
      { page: 'methode', icon: 'route', title: 'Méthode', text: '6 étapes, 2 verrous, 1 rapport' },
      { page: 'secteurs', icon: 'domain', title: 'Secteurs', text: '5 secteurs, 3 pays, 4 ports' },
    ],
  },

  report: {
    images: ['/images/rapport-page-1.webp', '/images/rapport-page-2.webp', '/images/rapport-page-3.webp'],
    captions: ['Couverture et usine contrôlée', 'Résultat global, quantité et qualité', 'Emballage, tests et actions correctives'],
  },

  cta: {
    title: 'Parlons de votre prochain *projet*',
    text: 'Premier échange sous 48 h ouvrées, gratuit. Proposition chiffrée avant tout engagement.',
  },

  approche: {
    hero: { title: "Ce qu'un exploitant exige, *prouvé* à chaque commande", text: 'Six engagements, tenus sur chaque dossier. Pour chacun, un document que vous recevez.', image: '' } as PageHero,
    eyebrow: 'Ce qui nous distingue',
    title: "Ce qu'un exploitant exige, nous le *prouvons* à chaque commande",
    text: 'Six engagements. Pour chacun, un document que vous recevez et pouvez vérifier.',
    items: [
      { title: "Le coût global, en plus du prix d'achat", text: 'Chaque fournisseur déclare consommation, durée de vie, entretien et prix des pièces. Ces données sont déclarées par écrit dans son offre.', deliverable: 'le rapport des 3 offres, en prix et en coût sur la durée de vie.' },
      { title: "Les standards de vos donneurs d'ordre", text: 'Fabricants vérifiés sur place, inspections documentées, traçabilité des équipements livrés.', deliverable: 'un dossier qualité au format de votre client final.' },
      { title: 'Des prix vérifiables', text: "La facture originale du fabricant, notre commission présentée à part. Chaque fournisseur s'engage par écrit à ne nous verser aucune rétrocession.", deliverable: "la facture originale du fabricant et notre note d'honoraires, séparée." },
      { title: "Votre date d'ouverture", text: "Le planning est bâti à rebours depuis l'ouverture de votre site, avec une alerte dès qu'elle est menacée.", deliverable: "le planning à jour, avec le nombre de jours d'avance avant votre ouverture." },
      { title: 'Ni blocage à la banque, ni au port', text: "Des documents cohérents entre eux, un certificat d'inspection conforme à votre lettre de crédit, un dossier de domiciliation prêt.", deliverable: 'un pack documentaire par expédition.' },
      { title: "L'après-livraison prévue dès le devis", text: 'Pièces de rechange proposées au devis, garantie écrite au contrat, recours organisé auprès du fabricant.', deliverable: "un interlocuteur jusqu'à la réception de votre commande." },
    ] as Deliverable[],
  },

  services: {
    hero: { title: 'Le bon fabricant, au bon prix, *vérifié*.', text: 'Notre cœur de métier : trouver le fabricant et acheter pour vous. Et deux services pour sécuriser vos achats directs.', image: '' } as PageHero,
    eyebrow: 'Nos services',
    title: 'Trois services, une même *exigence*',
    asideLabel: 'Pour commencer',
    asideText: 'Faites vérifier votre fournisseur. Si vous commandez ensuite avec nous sous 90 jours, 50 % du montant de la vérification sont déduits de notre commission. Chaque mission est chiffrée et signée avant tout engagement.',
    items: [
      { title: 'Sourcing et achat pour votre compte', text: "Notre cœur de métier. Nous trouvons les fabricants, les mettons en concurrence et comparons 3 offres en prix et en coût sur la durée de vie, audit d'usine du fournisseur retenu inclus. Puis nous achetons pour vous, en votre nom : négociation, contrat avec pénalités, suivi de production, paiements sécurisés et expédition jusqu'au port.", deliverable: "3 offres analysées, puis une commande conforme suivie jusqu'au port." },
      { title: 'Vérification de fournisseur', text: 'Pour ceux qui ont déjà trouvé leur fabricant. Existence légale, audit d\'usine, capacités, certifications, références, compte bancaire au nom de la société.', deliverable: 'Un rapport noté sous 10 jours ouvrés.' },
      { title: 'Contrôle qualité', text: 'Inspection en cours de production et avant expédition, contre votre cahier des charges. Deux inspections incluses dans le sourcing et l\'achat pour votre compte (en production et avant expédition), les suivantes à la journée. Ou seul, pour vos achats directs.', deliverable: 'Un rapport photo avant le paiement du solde.' },
    ] as Deliverable[],
  },

  methode: {
    hero: { title: 'Six étapes, deux *verrous*', text: 'Aucun achat sans contrat signé. Aucune expédition sans inspection validée.', image: '/images/methode-hero.png' } as PageHero,
    eyebrow: 'Notre méthode',
    title: 'Six étapes, deux *verrous*',
    locks: ['Aucun achat sans contrat signé.', 'Aucune expédition sans inspection validée.'],
    steps: [
      { title: 'Votre besoin', text: 'Un guide par catégorie de produits pour un cahier des charges complet. Vous le validez et le signez.', rule: '' },
      { title: 'Sourcing', text: "Fabricants mis en concurrence, 3 offres comparées en prix et en coût global. Audit d'usine du fournisseur retenu inclus.", rule: '' },
      { title: 'Contrat', text: 'Spécifications, délais, pénalités et garantie. Planning à rebours depuis votre ouverture.', rule: 'Aucun achat sans contrat signé' },
      { title: 'Production', text: 'Points réguliers, inspection en cours de fabrication, alerte au moindre écart.', rule: '' },
      { title: 'Inspection', text: 'Rapport photo avant le solde. Vous décidez avec nous de libérer ou non la marchandise.', rule: 'Aucune expédition sans inspection validée' },
      { title: 'Expédition', text: "Consolidation, documents export cohérents, suivi du fret jusqu'à Abidjan, Owendo, Douala ou Kribi.", rule: '' },
    ],
    note: "Le solde du fournisseur n'est versé qu'après une inspection validée. Rien d'important ne se décide sans vous.",
    reportEyebrow: "La preuve, avant l'expédition",
    reportTitle: "Un rapport d'inspection pour *chaque* commande",
    reportText: "Photos, mesures et points contrôlés contre votre cahier des charges. Chaque écart est classé par gravité et suivi jusqu'à sa correction. Vous recevez ce rapport avant de payer le solde, et vous décidez avec nous de libérer ou non la marchandise.",
    reportButton: 'Recevoir un exemple complet',
    reportCaption: 'Modèle du rapport que vous recevrez.',
  },

  secteurs: {
    hero: { title: "Les secteurs que nous connaissons *de l'intérieur*", text: "Vingt ans d'opérations côté exploitant, en Côte d'Ivoire, au Gabon et au Cameroun.", image: '' } as PageHero,
    items: [
      { icon: 'hotel', title: 'Immobilier commercial et hôtelier', text: 'Mobilier, éclairage, signalétique, faux plafonds, revêtements, climatisation', example: 'Équiper une galerie commerciale avant son ouverture.' },
      { icon: 'cottage', title: 'Bases-vie et sites industriels', text: 'Modulaires, cuisines collectives, buanderies, groupes électrogènes, solaire', example: 'Une base-vie complète, livrée en un seul envoi consolidé.' },
      { icon: 'oil_barrel', title: 'Oil & Gas', text: 'EPI, outillage, consommables industriels, équipements de sites', example: "Les EPI et consommables d'un sous-traitant, vérifiés avant expédition." },
      { icon: 'apartment', title: 'Promotion immobilière résidentielle', text: 'Carrelage, sanitaires, robinetterie, menuiseries aluminium, portes, cuisines', example: "Les finitions d'un programme de logements, livrées par lots." },
      { icon: 'storefront', title: 'Retail et grande distribution', text: 'Gondoles, caisses, vitrines réfrigérées, chambres froides, agencement', example: "L'agencement complet d'un supermarché, du rayonnage au froid." },
    ],
    exampleLabel: 'Exemple de mission',
    portsTitle: "Livraison suivie jusqu'au port",
    portsText: 'Abidjan, Owendo, Douala et Kribi. Plusieurs fournisseurs, un seul envoi consolidé en Chine.',
  },

  about: {
    hero: { title: "Une entreprise qui démarre, avec le regard d'une *exploitante*", text: 'Une seule société, à Guangzhou et à Abidjan.', image: '' } as PageHero,
    eyebrow: 'Qui nous sommes',
    title: "Acheter comme j'aurais voulu qu'on achète *pour moi*.",
    founderName: 'Pamela Atokouna',
    founderRole: 'Fondatrice',
    bio: "Pendant vingt ans, j'ai dirigé des opérations dans le pétrole et les mines, dans dix pays d'Afrique subsaharienne, puis un portefeuille d'immobilier commercial. J'étais du côté de ceux qui reçoivent les équipements, et qui paient quand ils sont défectueux ou en retard. J'ai fondé Gulf Bridge Sourcing pour tout vérifier sur place, avant de payer.",
    places: [
      { title: 'À Guangzhou', text: "Audits d'usines, négociation directe, contrôle qualité en personne." },
      { title: 'À Abidjan', text: "Notre bureau, même société, même équipe. Écoute du besoin, contrats de droit local et suivi de vos dossiers, jusqu'à Libreville et Douala." },
    ] as TitledText[],
    commitmentsEyebrow: 'Nos engagements',
    commitmentsTitle: 'Six engagements, tenus sur chaque *dossier*',
    commitments: [
      { icon: 'receipt_long', title: 'Facture du fabricant', text: 'Vous recevez la facture originale. Notre rémunération est distincte et signée avant toute commande.' },
      { icon: 'rule', title: 'Conformité', text: 'Chaque commande est contrôlée contre votre cahier des charges et les exigences du pays de destination.' },
      { icon: 'gavel', title: 'Éthique des affaires', text: "Aucun avantage accepté des fournisseurs, qui s'y engagent par écrit. Compatible avec vos politiques anti-corruption." },
      { icon: 'lock', title: 'Sécurité des paiements', text: "Vers des comptes d'entreprise vérifiés uniquement. Le solde n'est versé qu'après inspection validée." },
      { icon: 'build', title: 'Garantie et après-vente', text: 'Garantie écrite au contrat, pièces détachées proposées au devis, recours organisé en cas de défaut.' },
      { icon: 'notifications_active', title: 'Information continue', text: "Un point d'avancement à chaque étape, une alerte immédiate en cas d'écart." },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Envoyez-nous le nom de votre *fournisseur*',
    text: "Ou votre cahier des charges. Premier échange sous 48 heures ouvrées, proposition chiffrée avant tout engagement.",
    placeholderName: 'Nom et prénom',
    placeholderCompany: 'Entreprise',
    placeholderEmail: 'E-mail professionnel',
    placeholderPhone: 'WhatsApp',
    placeholderService: 'Service souhaité',
    placeholderMessage: "Votre besoin (produits, quantités, port, date d'ouverture)",
    serviceOptions: ['Sourcing et achat pour votre compte', 'Vérification de fournisseur', 'Contrôle qualité'],
    consent: "J'accepte que mes données soient utilisées pour répondre à ma demande, conformément à la politique de confidentialité.",
    submit: 'Envoyer ma demande',
    thanksTitle: 'Merci',
    thanksText: 'Votre demande est bien reçue. Nous vous recontactons sous 48 heures ouvrées.',
    faqTitle: "Les questions à se poser avant d'acheter en Chine",
    faq: [
      { q: 'Vous êtes une jeune entreprise. Pourquoi vous confier nos achats ?', a: "Parce que la méthode protège votre argent dès la première commande. Aucun achat sans contrat signé, paiements vers des comptes d'entreprise vérifiés uniquement, solde versé après inspection validée. Et vous pouvez commencer petit, par la vérification d'un fournisseur." },
      { q: 'Comment êtes-vous rémunérés ?', a: "Une commission dégressive sur vos achats, affichée à part de la facture du fabricant, un prix fixe pour la vérification d'un fournisseur et le contrôle qualité à la journée. Tout est signé avant la commande. La commission se paie en deux fois : 70 % à la signature du contrat fournisseur, pour le sourcing, l'audit et la négociation déjà réalisés ; 30 % à l'expédition après inspection validée. Le solde du fournisseur, lui, reste bloqué jusqu'à l'inspection." },
      { q: 'Qui est responsable si un produit est défectueux ?', a: "Votre vraie protection, c'est le solde retenu jusqu'à l'inspection validée : un défaut constaté se corrige avant de payer. Ensuite joue la garantie écrite du fabricant. Nous répondons de nos prestations de vérification, d'inspection et de coordination." },
      { q: 'Pourquoi ne pas commander sur une plateforme en ligne ?', a: "Vous le pouvez. Nous ajoutons ce qu'une plateforme ne fait pas. Vérifier le fabricant sur place, contrôler la marchandise avant le solde, regrouper plusieurs fournisseurs dans une seule expédition." },
      { q: 'Quels délais faut-il prévoir ?', a: 'Ils dépendent de la fabrication et du transport maritime. Vous recevez un calendrier à la signature du contrat fournisseur, puis un point à chaque étape.' },
      { q: 'Y a-t-il un minimum de commande ?', a: 'Non. Une commission minimale s\'applique aux petites commandes. Elle figure dans la proposition chiffrée, avant tout engagement.' },
    ],
  },

  legal: {
    mentionsTitle: 'Mentions légales',
    mentions: "Éditeur du site : Gulf Bridge Sourcing, [Raison sociale], RCCM [n°], siège à Abidjan, [Adresse].\nDirectrice de la publication : Pamela Atokouna.\nContact : contact@gulfbridgesourcing.com.\n\nHébergement : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.\nConception et gestion du site : Atlas Studio.",
    privacyTitle: 'Politique de confidentialité',
    privacy: "Les informations saisies dans le formulaire de contact (nom, entreprise, e-mail, numéro WhatsApp, besoin) sont utilisées uniquement pour répondre à votre demande et préparer une proposition.\n\nElles ne sont ni vendues ni cédées. Elles sont conservées au maximum trois ans après le dernier échange.\n\nVous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment en écrivant à contact@gulfbridgesourcing.com.",
  },
};

export type SiteContent = typeof defaults;
export type ContentKey = keyof SiteContent;

/** Libellés et ordre des sections dans la console. */
export const SECTION_META: Record<ContentKey, { label: string; order: number }> = {
  settings: { label: 'Coordonnées & mentions', order: 1 },
  seo: { label: 'SEO & titres de pages', order: 2 },
  intro: { label: "Animation d'ouverture", order: 3 },
  home_hero: { label: 'Accueil · Hero', order: 10 },
  home_constat: { label: 'Accueil · Constat', order: 11 },
  home_audience: { label: 'Accueil · Pour qui', order: 12 },
  home_founder: { label: 'Accueil · Citation fondatrice', order: 13 },
  home_startup: { label: 'Accueil · Jeune entreprise', order: 14 },
  home_positioning: { label: 'Accueil · Positionnement', order: 15 },
  home_explore: { label: 'Accueil · Explorer', order: 16 },
  report: { label: "Rapport d'inspection (images)", order: 17 },
  cta: { label: "Bandeau d'appel à l'action", order: 18 },
  approche: { label: 'Page · Notre approche', order: 20 },
  services: { label: 'Page · Services', order: 21 },
  methode: { label: 'Page · Méthode', order: 22 },
  secteurs: { label: 'Page · Secteurs', order: 23 },
  about: { label: 'Page · Qui nous sommes', order: 24 },
  contact: { label: 'Page · Contact & FAQ', order: 25 },
  legal: { label: 'Mentions légales & confidentialité', order: 30 },
};
