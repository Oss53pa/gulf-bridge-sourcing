/**
 * Contenu par défaut du site. Chaque clé de premier niveau correspond à une
 * ligne de public.client_site_content (site_id = SITE_ID) éditable depuis la
 * console Atlas Studio (module « Sites clients »). Le site s'affiche avec ces
 * valeurs tant que la console ne les a pas remplacées.
 *
 * Refonte premium (novembre 2026) : les clés sont nouvelles. Les anciennes
 * lignes publiées (settings, home_hero, about…) ne correspondent plus à cette
 * structure et sont ignorées par le site.
 *
 * Mise en forme dans les textes :
 *   *mot*    = italique (champagne sur fond sombre, bronze sur fond clair)
 *   **mot**  = gras
 *   retour à la ligne (\n) = saut de ligne forcé dans un titre
 */

export const SITE_ID = 'gulf-bridge-sourcing';

export type Audience = 'ouverture' | 'site';
export type ServiceKey = 'sourcing' | 'verification' | 'qualite' | 'nsp';

export interface Problem { q: string; pain: string; answer: string }
export interface CatalogRow { cat: string; brands: string; note: string }
export interface AudienceContent {
  label: string;
  eyebrow: string;
  title: string;
  catLabel: string;
  problems: Problem[];
  catalog: CatalogRow[];
}
export interface LegalBlock { title: string; paragraphs: string[]; list: string[]; after: string[] }
export interface Option { value: string; label: string }

export const defaults = {
  site: {
    email: 'contact@gulfbridgesourcing.com',
    phone: '+225 07 67 31 61 67',
    whatsapp: '+225 07 67 31 61 67',
    ctaLabel: 'Demander une étude',
    footerLine: "Gulf Bridge Sourcing · Abidjan, Côte d'Ivoire · Guangzhou, Chine",
    copyright: '© 2026',
    /** Profil présélectionné à l'arrivée : 'ouverture' ou 'site'. */
    defaultAudience: 'ouverture' as Audience,
    /** Effet de superposition des sections au défilement. */
    stacking: true,
    /** Le même effet sous 960 px. À couper si l'effet saccade sur mobile d'entrée de gamme. */
    stackingMobile: true,
  },

  seo_pages: {
    titleHome: "Gulf Bridge Sourcing | Bureau d'achat en Chine pour l'Afrique centrale et de l'Ouest",
    descHome: "Sourcing, vérification de fournisseurs et contrôle qualité en Chine. Le solde n'est versé qu'après inspection. Bureaux à Abidjan et Guangzhou, livraisons en Côte d'Ivoire, au Gabon et au Cameroun.",
    titleAbout: "Qui sommes-nous | Gulf Bridge Sourcing, bureau d'achat en Chine",
    descAbout: "Une fondatrice issue de l'exploitation en Afrique, un bureau à Abidjan, un bureau à Guangzhou et des livraisons en Côte d'Ivoire, au Gabon et au Cameroun.",
    titleLegal: 'Mentions légales et confidentialité | Gulf Bridge Sourcing',
    descLegal: 'Mentions légales et politique de confidentialité du site gulfbridgesourcing.com.',
  },

  accueil_hero: {
    eyebrow: "Bureau d'achat en Chine · Abidjan & Guangzhou",
    titleLines: ['Vos achats en Chine,', 'vérifiés sur place', '*avant* de payer le solde.'],
    text: "Nous mettons les fabricants en concurrence, vérifions l'usine, négocions le contrat et contrôlons la marchandise.",
    note: 'Premier contact sous 1 jour ouvré, gratuit.',
    guaranteeLabel: 'Notre garantie',
    guarantee: "Le solde du fournisseur n'est versé qu'après une inspection validée.",
    image: '/images/hero-port.webp',
    routeFromLabel: 'Bureau',
    routeFrom: 'Guangzhou',
    routeToLabel: 'Livraison',
    routeTo: 'Abidjan · Owendo · Douala · Kribi',
    /** Repères placés à intervalles réguliers sur la route (33 % et 67 % pour deux repères). */
    routeMilestones: ['Inspection', 'Consolidation'],
  },

  accueil_profil: {
    eyebrow: 'I — Votre projet',
    title: 'Quel est votre projet ?',
    text: "Choisissez votre situation. Les enjeux et les produits présentés plus bas s'adaptent à votre choix.",
    selectedLabel: 'Votre situation',
    chooseLabel: 'Choisir cette situation',
    cards: [
      { key: 'ouverture' as Audience, tag: 'Je prépare une ouverture', title: 'Hôtels, galeries commerciales, bureaux', text: "Mobilier, éclairage, signalétique, revêtements, climatisation, livrés conformes avant la date d'ouverture.", image: '/images/secteur-hotellerie.webp' },
      { key: 'site' as Audience, tag: "J'exploite un site", title: 'Bases-vie, sites industriels, Oil & Gas', text: 'Modulaires, cuisines, buanderies, énergie, EPI, consolidés en Chine et expédiés en un seul envoi.', image: '/images/secteur-industrie.webp' },
    ],
  },

  accueil_enjeux: {
    eyebrowPrefix: 'II — ',
    profileLabel: 'Profil :',
    changeLabel: 'Changer',
    context: "Depuis 8 ans, la Chine est le premier partenaire commercial de la Côte d'Ivoire, avec 7,42 Md$ d'échanges en 2025¹. Elle fournit aussi 22,2 % des importations du Cameroun². Acheter à distance reste un pari : les problèmes se découvrent au déballage, sur le chantier, au port.",
    footnotes: [
      "¹ Douanes chinoises (GACC), cité par l'Agence ivoirienne de presse.",
      '² Institut national de la statistique du Cameroun, Comptes du commerce extérieur 2024.',
    ],
    answerLabel: 'Notre réponse',
  },

  /** Contenu propre à chaque profil : enjeux et catalogue. */
  accueil_profils: {
    ouverture: {
      label: 'Je prépare une ouverture',
      eyebrow: "Les enjeux d'une ouverture",
      title: 'Ouvrir à la date prévue, sans mauvaise surprise.',
      catLabel: 'Équipement des sites',
      problems: [
        { q: 'Mon ouverture a été repoussée', pain: 'Production en retard, expédition décalée : chaque semaine perdue se paie en loyers, en pénalités et en image.', answer: "Un planning d'achats bâti à rebours depuis votre date d'ouverture, avec alerte dès qu'elle est menacée." },
        { q: 'Les finitions ne ressemblent pas aux échantillons', pain: 'Le défaut se découvre une fois le chantier terminé, quand il est trop tard pour refaire.', answer: 'Échantillons validés et scellés, contrôle en production et avant expédition.' },
        { q: "J'ai dix fournisseurs et personne ne coordonne", pain: 'Des dizaines de produits, souvent sur mesure, arrivent séparément, incomplets ou dans le désordre.', answer: 'Un seul envoi consolidé, réception et pose coordonnées sur site.' },
        { q: "C'était moins cher, mais ça me coûte plus cher", pain: "Consommation élevée, entretien fréquent, pièces introuvables : le prix d'achat bas cache un coût d'exploitation élevé.", answer: 'Des offres comparées sur le coût global, sur toute la durée de vie.' },
      ],
      catalog: [
        { cat: 'Mobilier et agencement', brands: '', note: "Boutiques, chambres d'hôtel, halls, bureaux, en fabrication sur mesure, à vos plans ou à votre marque" },
        { cat: 'Climatisation', brands: 'Gree, Midea, Haier, Hisense, TCL', note: '' },
        { cat: 'Éclairage', brands: 'Opple, NVC', note: '' },
        { cat: 'Ascenseurs et escaliers mécaniques', brands: 'Canny, SJEC', note: '' },
        { cat: "Sûreté et contrôle d'accès", brands: 'ZKTeco, Hikvision, Dahua', note: '' },
        { cat: 'Carrelage et revêtements', brands: 'Dongpeng, Marco Polo, Monalisa', note: '' },
        { cat: 'Sanitaires et robinetterie', brands: 'JOMOO, Arrow, Huida', note: '' },
        { cat: 'Retail', brands: 'Sunmi', note: 'Gondoles, vitrines réfrigérées, caisses' },
        { cat: 'Écrans et salles de réunion', brands: 'MAXHUB', note: '' },
        { cat: 'Informatique et réseau', brands: 'Lenovo, Huawei, TP-Link', note: '' },
        { cat: 'Électricité et appareillage', brands: 'CHINT, Delixi', note: '' },
        { cat: 'Signalétique, faux plafonds, menuiseries', brands: '', note: 'Fabrication sur mesure' },
        { cat: 'Literie et linge hôtelier', brands: '', note: 'Fabrication sur mesure' },
      ],
    } as AudienceContent,
    site: {
      label: "J'exploite un site",
      eyebrow: "Les enjeux d'un site",
      title: "Un site qui tourne, sans rupture ni écart d'audit.",
      catLabel: 'Sites industriels',
      problems: [
        { q: 'Une rupture immobilise mon site', pain: "EPI, consommables et pièces de rechange en rupture au mauvais moment : un engin immobilisé, une équipe qui attend, une pénalité du donneur d'ordre.", answer: 'Un accord-cadre annuel et des réassorts traités en priorité.' },
        { q: 'Mon client exige la traçabilité', pain: "Produits certifiés, traçables, achetés auprès de fournisseurs conformes à ses règles d'éthique et de sécurité.", answer: "Des fournisseurs agréés après due diligence et un dossier qualité au format de votre donneur d'ordre." },
        { q: 'Mes achats locaux coûtent cher et ne sont pas documentés', pain: "Prix élevés, origine incertaine, aucun certificat à présenter à l'audit.", answer: "Vos articles et vos prix fixés pour l'année, certificats d'usine vérifiés avant expédition." },
        { q: 'Ma marchandise est bloquée au port', pain: "Documents incomplets ou incohérents, normes du pays ignorées : les frais de stationnement s'accumulent.", answer: "Documents vérifiés et conformité préparée en Chine avant l'embarquement." },
      ],
      catalog: [
        { cat: 'EPI et vêtements de travail', brands: '', note: "Fabricants certifiés selon les normes EN et ISO exigées par votre donneur d'ordre" },
        { cat: 'Consommables et pièces de rechange', brands: '', note: "Selon vos références d'origine" },
        { cat: 'Groupes électrogènes', brands: 'Weichai, Yuchai, Cummins Chine', note: '' },
        { cat: 'Énergie solaire', brands: 'LONGi, JinkoSolar, Trina Solar, Growatt', note: 'Panneaux et onduleurs' },
        { cat: 'Engins', brands: 'Sany, XCMG, Zoomlion, LiuGong, SDLG, Shantui', note: '' },
        { cat: 'Chariots élévateurs', brands: 'Heli, Hangcha', note: '' },
        { cat: 'Compresseurs', brands: 'Kaishan', note: '' },
        { cat: 'Outillage', brands: 'Ingco, Total, Deli Tools', note: '' },
        { cat: 'Bâtiments modulaires de bases-vie', brands: 'CIMC', note: '' },
        { cat: 'Camions et bus de site', brands: 'Sinotruk, Shacman, King Long', note: '' },
        { cat: "Contrôle d'accès", brands: 'ZKTeco', note: '' },
        { cat: 'Cuisines collectives, buanderies, literie', brands: '', note: 'Fabrication sur commande' },
      ],
    } as AudienceContent,
  },

  accueil_methode: {
    eyebrow: 'III — La méthode',
    title: 'Six étapes,\ndeux *verrous*.',
    text: "Vous achetez directement au fabricant, sans intermédiaire. Nous sommes dans l'usine pour vérifier le fournisseur, la production et la commande avant son départ.",
    locks: ['Aucun achat sans contrat signé.', 'Aucune expédition sans inspection validée.'],
    stepLabel: 'Étape',
    steps: [
      { title: 'Votre besoin', text: 'Un guide par catégorie de produits pour un cahier des charges complet. Vous le validez et le signez.', rule: '' },
      { title: 'Sourcing', text: "Fabricants mis en concurrence, 3 offres comparées en prix et en coût global. Audit d'usine inclus.", rule: '' },
      { title: 'Contrat', text: 'Spécifications, délais, pénalités et garantie. Planning à rebours depuis votre ouverture.', rule: 'Verrou 1 : aucun achat sans contrat signé.' },
      { title: 'Production', text: 'Points réguliers, inspection en cours de fabrication, alerte au moindre écart.', rule: '' },
      { title: 'Inspection', text: 'Rapport photo avant le solde. Vous décidez avec nous de libérer ou non la marchandise.', rule: 'Verrou 2 : aucune expédition sans inspection validée.' },
      { title: 'Expédition', text: "Consolidation, documents export cohérents, suivi du fret jusqu'à Abidjan, Owendo, Douala ou Kribi.", rule: '' },
    ],
  },

  accueil_services: {
    eyebrow: 'IV — Nos services',
    title: 'Trois services,\nune même exigence.',
    text: 'Pour commencer, faites vérifier votre fournisseur. Si vous commandez ensuite avec nous sous 90 jours, **50 % du montant sont déduits** de notre commission.',
    deliverableLabel: 'Livrable',
    linkLabel: 'Demander ce service',
    items: [
      { key: 'sourcing' as ServiceKey, title: 'Sourcing et achat pour votre compte', text: "Notre cœur de métier. Fabricants mis en concurrence, 3 offres comparées en prix et en coût sur la durée de vie, audit d'usine inclus. Puis l'achat en votre nom : négociation, contrat avec pénalités, suivi de production, paiements sécurisés, expédition.", deliverable: "3 offres analysées, puis une commande conforme suivie jusqu'au port." },
      { key: 'verification' as ServiceKey, title: 'Vérification de fournisseur', text: "Pour ceux qui ont déjà trouvé leur fabricant. Existence légale, audit d'usine, capacités, certifications, références, compte bancaire au nom de la société.", deliverable: 'Un rapport noté sous 10 jours ouvrés.' },
      { key: 'qualite' as ServiceKey, title: 'Contrôle qualité', text: "Inspection en cours de production et avant expédition, contre votre cahier des charges. Inclus dans l'achat pour votre compte, ou seul pour vos achats directs.", deliverable: 'Un rapport photo avant le paiement du solde.' },
    ],
  },

  accueil_produits: {
    eyebrowPrefix: 'V — ',
    title: 'Les produits et les marques que nous vous procurons.',
    disclaimer: "Marques sourcées auprès de fabricants ou de distributeurs en Chine. Gulf Bridge Sourcing n'est distributeur officiel d'aucune de ces marques.",
    visibleRows: 6,
    showAllLabel: 'Voir les {n} catégories',
    showLessLabel: 'Réduire la liste',
  },

  accueil_rapport: {
    eyebrow: 'VI — Jugez sur pièces',
    title: 'Le modèle exact du rapport que vous recevrez.',
    text: 'Photos, mesures et écarts classés par gravité, reçus avant le paiement du solde. Vous décidez avec nous de libérer ou non la marchandise.',
    pages: [
      { image: '/images/rapport-page-1.webp', caption: 'Couverture et usine contrôlée' },
      { image: '/images/rapport-page-2.webp', caption: 'Résultat global, quantité et qualité' },
      { image: '/images/rapport-page-3.webp', caption: 'Emballage, tests et actions correctives' },
    ],
    formLabel: 'Recevoir le modèle complet',
    placeholder: 'vous@entreprise.com',
    submit: 'Recevoir le PDF',
    sending: 'Envoi…',
    privacyNote: 'Votre adresse sert uniquement à vous envoyer ce document.',
    privacyLink: 'Confidentialité',
    thanks: "Merci. Le modèle complet vous est envoyé à l'adresse indiquée.",
  },

  accueil_confiance: {
    eyebrow: 'VII — Votre premier dossier',
    title: 'Pourquoi nous confier votre premier dossier.',
    text: 'Gulf Bridge Sourcing est une jeune maison. Voici ce qui vous protège dès la première commande.',
    commitments: [
      { tag: "Le regard de l'exploitant", title: 'Nous achetons ce que vous devrez réceptionner et exploiter.', text: 'Avant de créer Gulf Bridge Sourcing, Pamela Atokouna a été facility manager, real estate manager puis senior director retail. Elle a géré des centres commerciaux et conduit la réception de nouveaux sites. Elle sait ce qui bloque un handover.', list: [] as string[] },
      { tag: 'Un premier pas sans risque', title: 'Commencez par vérifier votre fournisseur.', text: 'Un rapport noté sous 10 jours ouvrés. Si vous commandez ensuite avec nous sous 90 jours, 50 % de ce montant sont déduits de notre commission.', list: [] as string[] },
      { tag: 'Des garanties écrites', title: 'Tout est au contrat.', text: '', list: ["Le solde n'est versé qu'après une inspection validée.", 'Vous recevez la facture originale du fabricant.', 'Nos honoraires sont présentés séparément. Aucun fabricant ne nous rémunère.'] },
    ],
    casesTitle: 'Situations types',
    /** Mention obligatoire (exigée par les mentions légales). */
    casesDisclaimer: 'Exemples illustratifs de ce que nous prenons en charge. Ce ne sont pas des références clients.',
    stakeLabel: "L'enjeu.",
    answerLabel: 'Notre réponse.',
    cases: [
      { tag: "Ouverture · Côte d'Ivoire", title: 'Un hôtel de 80 chambres à Abidjan', stake: "Mobilier sur mesure, climatisation, éclairage et linge auprès de plusieurs fabricants, pour une date d'ouverture fixe.", answer: "Planning à rebours depuis l'ouverture, échantillons validés et scellés, inspection de chaque lot, un seul envoi consolidé." },
      { tag: 'Site en exploitation · Gabon', title: "La base-vie d'un site minier", stake: "EPI, consommables et modulaires sans rupture, avec la traçabilité exigée par le donneur d'ordre.", answer: 'Accord-cadre annuel, fournisseurs agréés après audit, dossier qualité au format du client, livraison par Owendo.' },
      { tag: 'Rénovation · Cameroun', title: 'Une galerie commerciale à Douala', stake: 'Remplacer climatisation et éclairage sans fermer les boutiques plus longtemps que nécessaire.', answer: "Offres comparées sur le coût global, contrôle avant expédition, livraison par phases, réception sur site avec l'exploitant." },
    ],
  },

  accueil_fondatrice: {
    eyebrow: 'VIII — Qui sommes-nous',
    image: '/images/pamela-atokouna-sepia.webp',
    imageAlt: 'Pamela Atokouna, fondatrice de Gulf Bridge Sourcing',
    quote: "« Plus de vingt ans côté exploitant m'ont appris une chose : un achat se juge à l'arrivée. »",
    name: 'Pamela Atokouna, fondatrice',
    bio: "Opérations dans le pétrole, le gaz et les mines dans dix pays d'Afrique subsaharienne (Addax Petroleum, Halliburton, BHP), puis un portefeuille de centres commerciaux à Abidjan. Elle suit personnellement chaque dossier.",
    linkLabel: 'Découvrir notre histoire',
  },

  accueil_contact: {
    eyebrow: 'IX — Demander une étude',
    title: 'Envoyez-nous le nom de votre *fournisseur*.',
    text: 'Ou votre cahier des charges. Premier contact sous 1 jour ouvré, gratuit. Proposition chiffrée avant tout engagement.',
    whatsappLabel: 'WhatsApp',
    phoneLabel: 'Téléphone',
    emailLabel: 'E-mail',
    // Les champs correspondent à la politique de confidentialité (section 2) :
    // n'en ajouter aucun sans la mettre à jour.
    labelName: 'Nom et prénom',
    labelRole: 'Fonction',
    labelCompany: 'Entreprise',
    labelEmail: 'E-mail professionnel',
    labelWhatsapp: 'Numéro WhatsApp',
    placeholderWhatsapp: '+225…',
    labelCountry: 'Pays de livraison',
    countries: ["Côte d'Ivoire", 'Gabon', 'Cameroun', 'Autre pays'],
    labelSector: 'Secteur',
    sectors: [
      { value: 'ouverture', label: 'Ouverture : hôtel, commerce, bureaux' },
      { value: 'site', label: 'Site en exploitation : industrie, mines, Oil & Gas' },
      { value: 'autre', label: 'Autre' },
    ] as Option[],
    labelService: 'Service souhaité',
    services: [
      { value: 'sourcing', label: 'Sourcing et achat pour votre compte' },
      { value: 'verification', label: 'Vérification de fournisseur' },
      { value: 'qualite', label: 'Contrôle qualité' },
      { value: 'nsp', label: 'Je ne sais pas encore' },
    ] as Option[],
    labelProject: 'Votre projet',
    placeholderProject: 'Produits, quantités, contraintes…',
    labelDate: "Date d'ouverture ou de besoin",
    labelSupplier: 'Fournisseur déjà identifié',
    placeholderSupplier: 'Nom ou lien, si vous en avez un',
    labelFiles: 'Pièces jointes',
    // Aucun stockage privé n'est encore branché : les documents sont demandés
    // par e-mail ou WhatsApp après le premier contact.
    filesNote: 'Cahier des charges, plans, photos : envoyez-les par e-mail ou sur WhatsApp, nous vous répondons sous 1 jour ouvré.',
    labelSource: 'Comment nous avez-vous connus ?',
    consent: 'Vos données servent uniquement à répondre à votre demande. Elles ne sont jamais vendues ni cédées.',
    consentLink: 'Politique de confidentialité',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    errorRequired: 'Ce champ est obligatoire.',
    errorEmail: 'Indiquez une adresse e-mail valide, par exemple nom@entreprise.com.',
    errorTooLong: 'Ce texte est trop long.',
    errorDate: 'Indiquez une date valide.',
    sentLabel: 'Demande envoyée',
    sentTitle: 'Merci. Nous revenons vers vous sous 1 jour ouvré.',
    sentText: "Une question d'ici là ? Écrivez-nous sur WhatsApp.",
  },

  qsn_hero: {
    eyebrow: 'Qui sommes-nous',
    titleLines: ["Né d'un constat", "*d'exploitante*."],
    text: "En Afrique, un site qui ouvre en retard ou une base qui manque de pièces coûte bien plus cher que l'économie faite à l'achat.",
    statement: "Nous faisons pour vous, en Chine, ce que les grands groupes confient à leur *centrale d'achat*.",
    image: '/images/positionnement-usine.webp',
  },

  qsn_fondatrice: {
    eyebrow: 'I — La fondatrice',
    image: '/images/pamela-atokouna-sepia.webp',
    imageAlt: 'Pamela Atokouna, fondatrice de Gulf Bridge Sourcing',
    name: 'Pamela Atokouna',
    role: 'Fondatrice',
    lead: "J'ai passé plus de vingt ans à diriger des opérations et des comptes de résultat dans le pétrole, le gaz et les mines, dans dix pays d'Afrique subsaharienne.",
    employers: [
      { name: 'Addax Petroleum', note: '' },
      { name: 'Halliburton', note: '' },
      { name: 'BHP', note: '(alors BHP Billiton)' },
    ],
    paragraphs: [
      'Sur ces sites, une pièce qui manque arrête une équipe, et une livraison non conforme se paie en jours perdus.',
      "J'ai ensuite dirigé un portefeuille de centres commerciaux à Abidjan, sous l'autorité directe du PDG. J'y ai conduit le passage de la construction à l'exploitation d'un nouveau centre. J'y ai vu la même chose : un équipement commandé loin, mal contrôlé, arrive incomplet ou trop tard, et c'est la date d'ouverture qui recule.",
    ],
    specialties: ['Équiper un site avant son ouverture.', 'Approvisionner les sites industriels sans rupture.'],
    conclusion: "Ces deux métiers sont devenus nos deux spécialités. J'ai créé Gulf Bridge Sourcing pour acheter en Chine comme un exploitant l'exige, avec les contrôles qu'il ferait lui-même s'il était sur place.",
  },

  qsn_citation: {
    quote: "« Plus de vingt ans côté exploitant m'ont appris une chose : un achat se juge *à l'arrivée*. »",
    author: 'Pamela Atokouna',
  },

  qsn_bureaux: {
    eyebrow: 'II — Nos bureaux',
    title: 'Deux bureaux,\nun seul interlocuteur.',
    offices: [
      { tag: "Côte d'Ivoire · 5°19′N", city: 'Abidjan', text: "Nous écoutons votre besoin et nous signons avec vous un contrat et une facture de droit ivoirien. Nous recevons ensuite la marchandise avec vous, sur votre site, et nous en assurons l'installation et le service après-vente." },
      { tag: 'Chine · 23°07′N', city: 'Guangzhou', text: 'Nous sommes dans les usines. Nous vérifions les fournisseurs sur place, nous mettons les offres en concurrence et nous négocions. Nous contrôlons la production et la marchandise avant son départ.' },
    ],
    statement: 'Un seul interlocuteur, du premier rendez-vous à la levée des réserves.',
    note: 'Les deux bureaux couvrent deux fuseaux horaires : votre dossier avance pendant votre nuit.',
  },

  qsn_ports: {
    eyebrow: 'III — Au Gabon et au Cameroun',
    ports: [
      { name: 'Owendo', country: 'Gabon' },
      { name: 'Douala', country: 'Cameroun' },
      { name: 'Kribi', country: 'Cameroun' },
    ],
    statement: "Nous livrons au Gabon et au Cameroun, par les ports d'Owendo, de Douala et de Kribi.",
    text: "Avant l'embarquement, nous préparons en Chine les documents de conformité exigés à l'arrivée. Votre dossier est suivi par le même interlocuteur qu'à Abidjan, par téléphone, WhatsApp ou visio.",
  },

  qsn_taille: {
    eyebrow: 'IV — Notre taille',
    title: 'Ce que notre taille change pour vous.',
    points: [
      { title: 'La fondatrice suit chaque dossier.', text: "Votre projet n'est jamais confié à un service que vous ne connaissez pas." },
      { title: 'Nous ne vendons pas de catalogue.', text: "Aucun fabricant ne nous rémunère : nous n'avons aucun intérêt à vous orienter vers une usine plutôt qu'une autre. Nous le prouvons avec la facture originale du fabricant, et nos honoraires sont présentés séparément." },
      { title: 'Nous prenons ce que nous pouvons contrôler.', text: 'Nous préférons refuser une mission plutôt que de la suivre de loin.' },
      { title: "Vous ne payez pas les frais d'une centrale d'achat.", text: "Vous avez les méthodes d'un grand groupe, sans sa structure." },
    ],
  },

  qsn_contact: {
    eyebrow: 'Contact',
    title: 'Parlons de votre prochain *projet*.',
    note: 'Premier contact sous 1 jour ouvré, gratuit.',
    image: '/images/hero-port.webp',
  },

  mentions_legales: {
    tocLabel: 'Sommaire',
    mentionsTitle: 'Mentions légales',
    privacyTitle: 'Politique de confidentialité',
    updatedLabel: 'Dernière mise à jour : 8 novembre 2026.',
    // À mettre à jour dès réception : numéro RCCM, compte contribuable, autorisation ARTCI.
    mentions: [
      { title: 'Éditeur du site', paragraphs: ["Le site gulfbridgesourcing.com est édité par GBS, société à responsabilité limitée (SARL) au capital de 1 000 000 FCFA, immatriculée au Registre du commerce et du crédit mobilier d'Abidjan (immatriculation en cours). Son numéro de compte contribuable est en cours d'attribution et son siège social est situé L90, Cité BH, Bingerville (Abidjan), Côte d'Ivoire.", 'Téléphone : +225 07 67 31 61 67', 'E-mail : contact@gulfbridgesourcing.com'], list: [], after: [] },
      { title: 'Directrice de la publication', paragraphs: ['Pamela Atokouna, en qualité de Gérante de GBS.'], list: [], after: [] },
      { title: 'Hébergement', paragraphs: ['Le site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis (www.cloudflare.com).'], list: [], after: [] },
      { title: 'Gestion du contenu', paragraphs: ['Le contenu du site est administré au moyen de la console Atlas Studio.'], list: [], after: [] },
      { title: 'Propriété intellectuelle', paragraphs: ["Les textes, photographies, schémas, documents téléchargeables et la marque Gulf Bridge Sourcing sont protégés. Leur reproduction, totale ou partielle, sans autorisation écrite de l'éditeur est interdite. La marque Gulf Bridge Sourcing appartient à sa fondatrice, qui en concède l'usage à l'éditeur."], list: [], after: [] },
      { title: 'Marques citées', paragraphs: ["Les marques de produits citées sur ce site appartiennent à leurs détenteurs respectifs. Elles sont mentionnées pour indiquer les produits que nous pouvons rechercher pour nos clients. Gulf Bridge Sourcing n'est distributeur officiel d'aucune de ces marques et n'est lié à leurs détenteurs par aucun partenariat."], list: [], after: [] },
      { title: 'Exemples et photographies', paragraphs: ['Les exemples de mission décrivent des situations types. Ils ne constituent ni des références clients, ni des engagements de résultat. Les illustrations présentées comme telles ne montrent pas des réalisations de Gulf Bridge Sourcing.'], list: [], after: [] },
      { title: 'Responsabilité', paragraphs: ["Les informations publiées sur ce site sont données à titre indicatif. Seuls engagent l'éditeur la proposition chiffrée et le contrat signés avec chaque client. Nous corrigeons toute erreur qui nous est signalée à contact@gulfbridgesourcing.com."], list: [], after: [] },
      { title: 'Liens', paragraphs: ["Les liens vers des sites extérieurs sont fournis pour information. L'éditeur n'est pas responsable de leur contenu."], list: [], after: [] },
      { title: 'Droit applicable', paragraphs: ['Ce site et les présentes mentions sont soumis au droit ivoirien.'], list: [], after: [] },
    ] as LegalBlock[],
    privacy: [
      { title: '1. Qui est responsable de vos données', paragraphs: ['Le responsable du traitement est GBS, dont les coordonnées figurent dans les mentions légales. Pour toute question sur vos données, écrivez à contact@gulfbridgesourcing.com.', "Cette politique applique la loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel, sous le contrôle de l'Autorité de régulation des télécommunications de Côte d'Ivoire (ARTCI). Si vous êtes au Gabon ou au Cameroun, la loi de votre pays s'applique aussi à vos données."], list: [], after: [] },
      { title: '2. Les données que nous collectons', paragraphs: ['Nous collectons seulement ce que vous nous transmettez par le formulaire « Demander une étude » :'], list: ['vos coordonnées : nom et prénom, fonction, entreprise, e-mail professionnel, numéro WhatsApp ;', "votre projet : spécialité ou secteur, service souhaité, pays de livraison, produits et quantités, date d'ouverture ou de besoin, fournisseur déjà identifié ;", "la façon dont vous nous avez connus, si vous l'indiquez."], after: ["Le formulaire n'accepte pas de fichiers. Si vous nous envoyez ensuite des documents par e-mail ou par WhatsApp (cahier des charges, plans, photos), nous les traitons dans les mêmes conditions.", "Si vous demandez le modèle de rapport d'inspection, nous collectons votre adresse e-mail.", "Pour protéger le formulaire contre les envois abusifs, le nombre de demandes est limité par adresse e-mail. Comme pour tout site, nos prestataires techniques enregistrent l'adresse IP de connexion dans leurs journaux de sécurité ; nous ne l'utilisons à aucune autre fin."] },
      { title: '3. Pourquoi nous les utilisons', paragraphs: [], list: ['répondre à votre demande et vous rappeler ;', 'préparer une proposition chiffrée ;', "suivre la relation commerciale si une collaboration s'engage ;", 'vous envoyer le document que vous avez demandé.'], after: ["Nous utilisons vos données parce que vous y avez consenti en envoyant le formulaire, et parce qu'elles sont nécessaires pour préparer un contrat à votre demande. Elles ne sont jamais vendues, louées ni cédées. Nous ne vous envoyons pas de lettre d'information sans votre accord exprès."] },
      { title: '4. Qui y a accès', paragraphs: [], list: ["L'équipe de Gulf Bridge Sourcing à Abidjan et à Guangzhou, chacun pour ce qui le concerne. Le bureau de Guangzhou a besoin de votre cahier des charges pour consulter les usines. Votre nom et celui de votre entreprise ne sont jamais communiqués aux fabricants avant que vous ayez choisi votre fournisseur.", "Nos prestataires techniques : l'hébergeur du site (Cloudflare) et l'outil de gestion des demandes (console Atlas Studio, dont la base de données est hébergée par Supabase). Ils traitent vos données pour notre compte, sans pouvoir les utiliser pour eux-mêmes."], after: [] },
      { title: "5. Transferts hors de Côte d'Ivoire", paragraphs: ["Vos données sont hébergées hors de Côte d'Ivoire et consultées par notre équipe en Chine. Ces transferts sont limités à ce qui est nécessaire pour traiter votre demande. Ils sont encadrés par des engagements de confidentialité. Une demande d'autorisation est en cours auprès de l'ARTCI."], list: [], after: [] },
      { title: '6. Combien de temps nous les conservons', paragraphs: [], list: ['Demande sans suite : 3 ans après notre dernier échange.', 'Documents transmis pour une demande sans suite : supprimés 12 mois après la demande.', 'Client : pendant toute la relation, puis pendant les durées légales de conservation des documents commerciaux et comptables.'], after: [] },
      { title: '7. Vos droits', paragraphs: ["Vous pouvez à tout moment accéder à vos données, les faire corriger ou supprimer, et vous opposer à leur utilisation. Écrivez à contact@gulfbridgesourcing.com en précisant votre demande. Nous répondons sous 30 jours. Si notre réponse ne vous satisfait pas, vous pouvez saisir l'ARTCI, ou l'autorité de protection des données de votre pays."], list: [], after: [] },
      { title: "8. Cookies et mesure d'audience", paragraphs: ["Ce site ne dépose aucun cookie et n'utilise ni traceur ni outil de mesure d'audience. Ses polices de caractères sont hébergées avec le site : votre navigateur ne contacte aucun service tiers pour les afficher. Pour accélérer l'affichage, votre navigateur conserve une copie du texte des pages, qui ne contient aucune donnée personnelle. C'est pourquoi aucun bandeau de consentement ne vous est présenté. Si nous ajoutons un jour un outil de mesure d'audience ou qui dépose des cookies, nous mettrons cette politique à jour et, si la loi l'exige, nous vous demanderons d'abord votre accord."], list: [], after: [] },
      { title: '9. WhatsApp', paragraphs: ['Si vous nous contactez par le bouton WhatsApp, votre échange passe par le service de Meta et relève aussi de sa politique de confidentialité. Nous utilisons ce que vous nous écrivez dans les mêmes conditions que les demandes du formulaire.'], list: [], after: [] },
      { title: '10. Sécurité', paragraphs: ["Le site est servi en connexion chiffrée (HTTPS). Les demandes envoyées par le formulaire sont enregistrées dans un espace dont l'accès est réservé à notre équipe. Les documents que vous nous transmettez ne sont consultés que par les personnes qui traitent votre demande."], list: [], after: [] },
      { title: '11. Modifications', paragraphs: ['Nous pouvons mettre à jour cette politique. La date de la dernière version figure ci-dessous.'], list: [], after: [] },
    ] as LegalBlock[],
  },
};

export type SiteContent = typeof defaults;
export type ContentKey = keyof SiteContent;

/** Libellés et ordre des sections dans la console. */
export const SECTION_META: Record<ContentKey, { label: string; order: number; preview: string }> = {
  site: { label: 'Coordonnées & réglages', order: 1, preview: '/' },
  seo_pages: { label: 'SEO & titres de pages', order: 2, preview: '/' },
  accueil_hero: { label: 'Accueil · Hero', order: 10, preview: '/' },
  accueil_profil: { label: 'Accueil · I. Votre projet', order: 11, preview: '/#profil' },
  accueil_enjeux: { label: 'Accueil · II. Enjeux (commun)', order: 12, preview: '/#enjeux' },
  accueil_profils: { label: 'Accueil · Enjeux et catalogue par profil', order: 13, preview: '/#enjeux' },
  accueil_methode: { label: 'Accueil · III. Méthode', order: 14, preview: '/#methode' },
  accueil_services: { label: 'Accueil · IV. Services', order: 15, preview: '/#services' },
  accueil_produits: { label: 'Accueil · V. Produits', order: 16, preview: '/#produits' },
  accueil_rapport: { label: 'Accueil · VI. Rapport', order: 17, preview: '/#rapport' },
  accueil_confiance: { label: 'Accueil · VII. Premier dossier', order: 18, preview: '/#confiance' },
  accueil_fondatrice: { label: 'Accueil · VIII. Fondatrice', order: 19, preview: '/#fondatrice' },
  accueil_contact: { label: 'Accueil · IX. Formulaire', order: 20, preview: '/#contact' },
  qsn_hero: { label: 'Qui sommes-nous · Hero', order: 30, preview: '/qui-sommes-nous' },
  qsn_fondatrice: { label: 'Qui sommes-nous · I. Fondatrice', order: 31, preview: '/qui-sommes-nous' },
  qsn_citation: { label: 'Qui sommes-nous · Citation', order: 32, preview: '/qui-sommes-nous' },
  qsn_bureaux: { label: 'Qui sommes-nous · II. Bureaux', order: 33, preview: '/qui-sommes-nous' },
  qsn_ports: { label: 'Qui sommes-nous · III. Gabon et Cameroun', order: 34, preview: '/qui-sommes-nous' },
  qsn_taille: { label: 'Qui sommes-nous · IV. Notre taille', order: 35, preview: '/qui-sommes-nous' },
  qsn_contact: { label: 'Qui sommes-nous · Contact', order: 36, preview: '/qui-sommes-nous' },
  mentions_legales: { label: 'Mentions légales & confidentialité', order: 40, preview: '/mentions-legales' },
};
