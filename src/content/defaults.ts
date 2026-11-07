/**
 * Contenu par défaut du site. Chaque clé de premier niveau correspond à une
 * ligne de public.client_site_content (site_id = SITE_ID) éditable depuis la
 * console Atlas Studio (module « Sites clients »).
 *
 * Le site est généré à l'avance en HTML (voir scripts/prerender.mjs) : le
 * contenu de la console est relu au moment de la construction. Une
 * modification publiée dans la console n'apparaît en ligne qu'après une
 * nouvelle construction (Deploy Hook Cloudflare).
 *
 * Mise en forme dans les textes : *mot* = italique doré.
 *
 * Règles de rédaction (cahier des charges, section 8) :
 *   pas de tiret long, pas de point médian, pas de nom d'usine ni de client,
 *   aucun chiffre d'activité non vérifiable, chaque chiffre de marché sourcé.
 */

export const SITE_ID = 'gulf-bridge-sourcing';

export interface PageHero { title: string; text: string; image: string }
export interface TitledText { title: string; text: string }
export interface Deliverable { title: string; text: string; deliverable: string }
export interface ProblemAnswer { problem: string; answer: string }
export interface Family { title: string; items: string; brands: string }

/** Avertissement obligatoire sur chaque page qui cite des marques. */
export const BRAND_NOTICE = "Gulf Bridge Sourcing n'est distributeur officiel d'aucune de ces marques. Les marques citées restent la propriété de leurs détenteurs.";

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
    legalNameCi: "[Raison sociale GBS Côte d'Ivoire]",
    legalFormCi: '[Forme juridique]',
    capitalCi: '[Capital]',
    rccm: '[n° RCCM]',
    taxIdCi: '[Compte contribuable]',
    legalNameCn: '',
    legalNameCnZh: '',
    uscc: '',
    linkedin: '',
    clientPortalUrl: '',
    ctaLabel: 'Demander une étude',
    responsePromise: 'Premier contact sous 1 jour ouvré, gratuit.',
  },

  seo: {
    siteName: 'Gulf Bridge Sourcing',
    baseUrl: 'https://gulfbridgesourcing.com',
    defaultOgImage: '/images/hero-port.webp',
    description: "Votre bureau d'achat en Chine. Nous équipons vos sites avant leur ouverture et approvisionnons vos sites industriels, direct usine, vérifié sur place.",
  },

  intro: {
    // Désactivée par défaut. Depuis le passage au pré-rendu, l'animation ne
    // peut se déclencher qu'après l'hydratation : elle recouvrirait une page
    // déjà lisible, ce que le cahier des charges interdit (section 11).
    // À réactiver depuis la console seulement si ce compromis est accepté.
    enabled: false,
    cityFrom: 'Guangzhou',
    cityTo: 'Abidjan',
  },

  /* ----------------------------------------------------------- Accueil */

  home_hero: {
    eyebrow: 'Direct usine, vérifié sur place.',
    title: 'Ce que vous achetez en Chine doit arriver *conforme*, complet et à temps',
    text: "Nous sommes votre bureau d'achat en Chine. Nous réglons dans les usines, sur place, les problèmes qui arriveraient sinon chez vous.",
    ctaSecondary: 'Voir notre méthode',
    note: 'Premier contact sous 1 jour ouvré, gratuit. Proposition chiffrée avant tout engagement.',
    image: '/images/hero-port.webp',
    fromLabel: 'Bureau',
    fromCity: 'Guangzhou',
    toLabel: "Livraison suivie jusqu'au port",
    toCity: 'Abidjan, San-Pédro, Owendo, Douala, Kribi',
    milestones: ['Inspection', 'Consolidation'],
  },

  home_problems: {
    eyebrow: 'Ce que nous réglons',
    title: 'Six phrases que nous entendons, et ce que nous faisons pour *chacune*',
    items: [
      { problem: "Ce que j'ai reçu ne ressemble pas à l'échantillon.", answer: "Échantillon validé et scellé, contrôle en usine pendant la production, inspection avant expédition. Le solde du fournisseur n'est versé qu'après une inspection validée." },
      { problem: 'Mon ouverture a été repoussée.', answer: "Planning d'achats bâti à rebours depuis votre date d'ouverture, point d'avancement à chaque étape, alerte dès que la date est menacée." },
      { problem: "J'ai payé un intermédiaire qui se disait fabricant.", answer: "Existence légale, capacité et certifications vérifiées sur place. Paiement vers un compte d'entreprise au nom du fabricant, contrôlé avant le premier versement." },
      { problem: "C'était moins cher, mais ça me coûte plus cher.", answer: 'Offres comparées sur le coût global : prix, consommation, durée de vie, entretien et prix des pièces, déclarés par écrit par chaque fournisseur.' },
      { problem: 'Ma marchandise est bloquée au port.', answer: "Documents vérifiés et cohérents entre eux, conformité du pays de destination préparée en Chine avant l'embarquement." },
      { problem: 'En panne, plus personne ne répond.', answer: "Pièces de rechange prévues au devis, garantie écrite au contrat, service après-vente à Abidjan et recours organisé auprès du fabricant." },
    ] as ProblemAnswer[],
  },

  home_specialties: {
    eyebrow: 'Nos deux spécialités',
    title: 'Deux métiers que nous connaissons *de bout en bout*',
    items: [
      {
        page: 'equipement',
        title: 'Équiper votre site avant son ouverture',
        clients: "Promoteurs de centres commerciaux, hôtels, enseignes du retail, programmes résidentiels, cliniques et écoles privées.",
        geo: "Priorité Côte d'Ivoire",
        offer: 'Forfait au projet et commission réduite',
        image: '/images/secteur-hotellerie.webp',
        link: 'Préparer une ouverture',
      },
      {
        page: 'industriel',
        title: 'Approvisionner vos sites industriels',
        clients: 'Sous-traitants Oil & Gas et miniers, exploitants de bases-vie, sites industriels.',
        geo: 'Priorité Gabon et Cameroun',
        offer: 'Accord-cadre annuel',
        image: '/images/secteur-industrie.webp',
        link: 'Étudier un accord-cadre',
      },
    ],
  },

  home_locks: {
    title: 'Deux *verrous*, sur chaque dossier',
    locks: ['Aucun achat sans contrat signé.', 'Aucune expédition sans inspection validée.'],
  },

  home_founder: {
    quote: '« Je ne vous demande pas de me croire. Je vous montre ce que je *vérifie*. »',
    author: 'Pamela Atokouna, fondatrice',
    linkLabel: 'Qui nous sommes',
  },

  home_firststep: {
    eyebrow: 'Un premier pas sans risque',
    title: 'Commencez par faire *vérifier* un fournisseur',
    text: "Vous avez déjà trouvé votre fabricant. Nous allons sur place : existence légale, capacité réelle, certifications, références, compte bancaire au nom de la société. Vous recevez un rapport noté.",
    deduction: "Si vous commandez ensuite avec Gulf Bridge Sourcing sous 90 jours, 50 % du montant de la vérification sont déduits de notre commission.",
    cta: 'Faire vérifier un fournisseur',
  },

  home_others: {
    text: 'BTP et matériaux de construction, agro-industrie et chaîne du froid, éducation et santé hors équipement médical, sport et loisirs : ces secteurs sont traités sur demande.',
    link: 'Voir les autres secteurs',
  },

  report: {
    images: ['/images/rapport-page-1.webp', '/images/rapport-page-2.webp', '/images/rapport-page-3.webp'],
    captions: ['Couverture et usine contrôlée', 'Résultat global, quantité et qualité', 'Emballage, tests et actions correctives'],
    eyebrow: 'Jugez sur pièces',
    title: "Le modèle exact du rapport d'inspection que vous *recevrez*",
    text: "Photos, mesures et points contrôlés contre votre cahier des charges. Chaque écart est classé par gravité et suivi jusqu'à sa correction. Ce modèle est anonymisé : aucun nom d'usine, aucun nom de client.",
    link: 'Recevoir le modèle complet',
  },

  cta: {
    title: 'Parlons de votre prochain *projet*',
    text: 'Premier contact sous 1 jour ouvré, gratuit. Proposition chiffrée avant tout engagement.',
  },

  /* ------------------------------------------- Spécialité : équipement */

  equipement: {
    hero: {
      title: 'Équiper votre site *avant* son ouverture',
      text: "Les produits sur mesure de nombreux fournisseurs doivent arriver complets, conformes et posés avant la date d'ouverture.",
      image: '/images/secteur-hotellerie.webp',
    } as PageHero,
    problemTitle: 'Votre problème',
    problemText: "Un centre commercial, un hôtel, une clinique ou un programme de logements s'équipent auprès de dizaines de fournisseurs, souvent sur mesure. Un seul lot en retard ou non conforme et la date d'ouverture recule. Chaque semaine perdue se paie en loyers, en salaires et en réputation.",
    solutionTitle: 'Notre solution',
    solutionSteps: [
      { title: "Planning d'achats à rebours", text: "Nous partons de votre date d'ouverture et remontons jusqu'à la commande, lot par lot, avec les délais de fabrication et de transport maritime réels." },
      { title: 'Mise en concurrence sur le coût global', text: 'Les fabricants sont comparés en prix et en coût sur la durée de vie : consommation, entretien, prix des pièces, déclarés par écrit.' },
      { title: 'Échantillons validés et scellés', text: "Vous validez un échantillon de référence. Il est scellé en usine et sert de base à tous les contrôles." },
      { title: 'Contrôle en production et avant expédition', text: 'Deux inspections au minimum, chiffrées dans la proposition. Rapport photo avant le paiement du solde.' },
      { title: 'Envoi consolidé', text: "Plusieurs fournisseurs, un seul envoi regroupé en Chine, documents export cohérents entre eux." },
      { title: 'Réception et pose coordonnées', text: "À l'arrivée, notre bureau d'Abidjan coordonne la réception, la pose et la levée des réserves." },
    ] as TitledText[],
    pricingTitle: 'Comment nous sommes rémunérés',
    pricingText: "Un forfait au projet, payé par étapes, et une commission réduite sur les achats. Le forfait rémunère le travail de sourcing et de planification. La commission se paie en deux fois : 50 % à la signature du contrat fournisseur, 50 % à l'expédition après inspection validée. Chaque mission est chiffrée et signée avant tout engagement.",
    familiesTitle: 'Ce que nous fournissons',
    familiesNote: "Familles de produits et marques à reprendre de la plaquette commerciale. Les marques sont citées en texte seulement, jamais en logo.",
    families: [] as Family[],
    exampleTitle: 'Exemple de mission',
    exampleText: "Équiper une galerie commerciale avant son ouverture : mobilier, éclairage, signalétique, faux plafonds, revêtements et climatisation, commandés auprès de plusieurs fabricants, regroupés en un envoi et réceptionnés sur le chantier. Exemple de mission type, sans chiffre ni nom de client.",
    stepsTitle: "Les étapes d'un projet d'ouverture",
    steps: [
      "Expression du besoin et cahier des charges par lot",
      "Planning à rebours depuis la date d'ouverture",
      "Sourcing et comparaison des offres sur le coût global",
      "Validation et scellement des échantillons",
      "Contrats fournisseurs avec délais, pénalités et garantie",
      "Suivi de production et inspection en usine",
      "Inspection avant expédition et libération de la marchandise",
      "Consolidation, expédition et documents export",
      "Réception, pose et levée des réserves",
    ],
    cta: "Préparer l'équipement de mon site",
  },

  /* ------------------------------------------ Spécialité : industriels */

  industriel: {
    hero: {
      title: 'Approvisionner vos *sites industriels*',
      text: "Ruptures d'EPI, de consommables et de pièces, exigences de traçabilité et d'éthique du donneur d'ordre.",
      image: '/images/secteur-industrie.webp',
    } as PageHero,
    problemTitle: 'Votre problème',
    problemText: "Sur un site en activité, une rupture d'EPI ou de consommables arrête le travail. Les commandes au coup par coup coûtent cher, les délais sont imprévisibles, et le donneur d'ordre exige une traçabilité et une conformité éthique que des achats dispersés ne permettent pas de prouver.",
    solutionTitle: "Notre solution : l'accord-cadre",
    solutionSteps: [
      { title: "Articles et prix fixés pour l'année", text: "Un catalogue négocié, des prix tenus sur la durée de l'accord, des quantités engagées ou prévisionnelles selon votre choix." },
      { title: 'Fournisseurs agréés', text: "Chaque fabricant du catalogue est vérifié sur place avant son entrée dans l'accord, puis suivi." },
      { title: 'Réassort prioritaire', text: 'Un seuil par article déclenche la commande. Les références critiques sont traitées en priorité.' },
      { title: 'Contrôle avant chaque expédition', text: "Une inspection avant chaque départ, chiffrée dans l'accord, avec rapport photo." },
      { title: "Dossier qualité au format du donneur d'ordre", text: "Certificats, traçabilité et rapports d'inspection assemblés dans le format exigé par votre client final." },
    ] as TitledText[],
    pricingTitle: 'Comment nous sommes rémunérés',
    pricingText: "Un forfait mensuel pour la tenue de l'accord-cadre et une commission réduite sur les achats. La commission se paie en deux fois : 50 % à la signature du contrat fournisseur, 50 % à l'expédition après inspection validée. Chaque mission est chiffrée et signée avant tout engagement.",
    familiesTitle: 'Ce que nous fournissons',
    familiesNote: "Familles de produits et marques à reprendre de la plaquette commerciale. Aucune marque visée par des sanctions ou des restrictions américaines ou européennes ne figure sur cette page.",
    families: [] as Family[],
    complianceTitle: "Pour les sites des grands donneurs d'ordre",
    complianceText: "Avant toute commande, nous vérifions que chaque marque proposée est acceptée par votre donneur d'ordre et qu'elle n'est visée par aucune sanction ni restriction américaine ou européenne. Les marques écartées à ce titre ne sont ni proposées ni citées sur cette page. La liste est revue tous les six mois.",
    cta: 'Étudier un accord-cadre',
  },

  /* ----------------------------------------------- Les autres secteurs */

  autres: {
    hero: {
      title: 'Les autres secteurs, traités *sur demande*',
      text: "Hors de nos deux spécialités, nous prenons les projets qui relèvent de la même méthode.",
      image: '',
    } as PageHero,
    items: [
      { icon: 'foundation', title: 'BTP et matériaux de construction', problem: "Les matériaux arrivent hors tolérance ou incomplets, et le chantier s'arrête.", solution: 'Spécifications écrites avant commande, contrôle dimensionnel et contrôle de lot avant expédition.', products: 'Familles de produits et marques à reprendre de la plaquette.' },
      { icon: 'ac_unit', title: 'Agro-industrie et chaîne du froid', problem: "Un équipement de froid sous-dimensionné pour le climat local tombe en panne la première saison.", solution: "Puissance et conditions d'usage vérifiées avec le fabricant, pièces de rechange prévues au devis.", products: 'Familles de produits et marques à reprendre de la plaquette.' },
      { icon: 'school', title: 'Éducation et santé, hors équipement médical', problem: 'Mobilier et agencement livrés non conformes aux normes de sécurité exigées.', solution: 'Normes du pays de destination vérifiées en Chine, certificats réunis avant embarquement.', products: 'Familles de produits et marques à reprendre de la plaquette.' },
      { icon: 'sports_soccer', title: 'Sport et loisirs', problem: "Équipements de plein air qui ne tiennent pas au climat ni à l'usage intensif.", solution: 'Matériaux et traitements de surface spécifiés au contrat, échantillon validé et scellé.', products: 'Familles de produits et marques à reprendre de la plaquette.' },
      { icon: 'category', title: 'Divers', problem: 'Un besoin ponctuel, sans fournisseur de confiance en Chine.', solution: "Vérification de fournisseur ou inspection seule, sans engager un sourcing complet.", products: 'Nous vous disons si nous savons faire, ou non.' },
    ],
    portsTitle: "Livraison suivie jusqu'au port",
    portsText: 'Abidjan, San-Pédro, Owendo, Douala et Kribi. Plusieurs fournisseurs, un seul envoi consolidé en Chine.',
    ports: ['Abidjan', 'San-Pédro', 'Owendo', 'Douala', 'Kribi'],
    complianceTitle: "La conformité à l'arrivée, préparée en Chine",
    complianceText: "Les contrôles exigés à l'arrivée se préparent avant l'embarquement : documents cohérents entre eux, certificats du pays de destination, inspection documentée. Un dossier incomplet se paie en jours de stationnement au port.",
    exclusionsTitle: 'Ce que nous ne fournissons pas',
    exclusions: [
      'Équipement médical et dispositifs médicaux',
      'Armes, munitions et matériel de sécurité réglementé',
      'Produits chimiques dangereux et matières réglementées',
      'Denrées alimentaires périssables',
      'Toute marque visée par des sanctions ou des restrictions américaines ou européennes',
      'Produits contrefaisants ou sans origine vérifiable',
    ],
  },

  /* ------------------------------------------------------ Nos solutions */

  solutions: {
    hero: {
      title: 'Le bon fabricant, au bon prix, *vérifié*',
      text: "Nos solutions, du premier pas jusqu'au suivi annuel de vos achats.",
      image: '',
    } as PageHero,
    eyebrow: 'Nos solutions',
    title: 'Chaque mission est chiffrée et *signée* avant tout engagement',
    asideLabel: 'Pour commencer',
    asideText: "Faites vérifier un fournisseur, ou commandez une inspection seule. Si vous commandez ensuite avec nous sous 90 jours, 50 % du montant de la vérification sont déduits de notre commission.",
    note: "Les tarifs ne sont pas affichés sur le site. Chaque mission est chiffrée et signée avant tout engagement.",
    pendingNote: "La liste des neuf solutions et leur formulation exacte sont reprises de la plaquette commerciale. Les solutions ci-dessous sont celles que les documents de référence attestent ; les autres sont à compléter depuis la console.",
    items: [
      { key: 'verification', title: 'Vérification de fournisseur', problem: "Vous avez trouvé un fabricant en ligne et vous ne savez pas s'il existe vraiment.", text: "Nous allons sur place : existence légale, audit d'usine, capacité réelle, certifications, références, compte bancaire au nom de la société.", deliverable: 'Un rapport noté sous 10 jours ouvrés.' },
      { key: 'inspection', title: 'Inspection seule', problem: 'Vous achetez en direct et vous voulez contrôler la marchandise avant de payer le solde.', text: 'Inspection en cours de production ou avant expédition, contre votre cahier des charges. Facturée à la journée.', deliverable: 'Un rapport photo avant le paiement du solde.' },
      { key: 'consultation', title: 'Forfait de consultation', problem: 'Vous ne savez pas encore ce que votre projet coûte ni combien de temps il prend.', text: "Nous cadrons le besoin, identifions les familles de produits, estimons les délais et les ordres de grandeur. Payé d'avance, il rémunère le travail de sourcing déjà fait.", deliverable: 'Une note de cadrage et une estimation des délais.' },
      { key: 'sourcing', title: 'Sourcing et mise en concurrence', problem: 'Vous ne savez pas quels fabricants consulter ni comment comparer leurs offres.', text: 'Fabricants identifiés et mis en concurrence, offres comparées en prix et en coût sur la durée de vie, audit du fournisseur retenu.', deliverable: 'Trois offres analysées, en prix et en coût global.' },
      { key: 'achat', title: 'Achat pour votre compte', problem: "Vous n'avez personne en Chine pour négocier, contractualiser et suivre la production.", text: "Négociation, contrat avec délais, pénalités et garantie, suivi de production, paiements vers des comptes d'entreprise vérifiés.", deliverable: "La facture originale du fabricant et notre note d'honoraires, séparée." },
      { key: 'controle', title: 'Contrôle qualité', problem: 'Vous découvrez les défauts au déballage, sur le chantier.', text: "Contrôle en production et inspection avant expédition. Les inspections sont prévues et chiffrées dans chaque proposition, à la journée.", deliverable: "Un rapport d'inspection avant le paiement du solde." },
      { key: 'consolidation', title: 'Consolidation et expédition', problem: 'Plusieurs fournisseurs, plusieurs envois, des frais et des risques multipliés.', text: "Regroupement en Chine, emballage contrôlé, documents export cohérents, suivi du fret jusqu'au port de destination.", deliverable: 'Un pack documentaire par expédition.' },
      { key: 'conformite', title: 'Conformité documentaire', problem: "Votre marchandise est bloquée au port pour un document manquant.", text: "Documents vérifiés entre eux, certificats du pays de destination, dossier de domiciliation, certificat d'inspection conforme à votre lettre de crédit.", deliverable: 'Un dossier conforme avant embarquement.' },
      { key: 'accord', title: 'Accord-cadre annuel', problem: 'Vos sites sont en rupture et chaque commande repart de zéro.', text: "Catalogue et prix fixés pour l'année, fournisseurs agréés, réassort prioritaire, contrôle avant chaque expédition.", deliverable: "Un dossier qualité au format de votre donneur d'ordre." },
    ],
  },

  /* ------------------------------------------------ Méthode et garanties */

  methode: {
    hero: { title: 'Sept étapes, deux *verrous*', text: 'Aucun achat sans contrat signé. Aucune expédition sans inspection validée.', image: '/images/methode-hero.webp' } as PageHero,
    eyebrow: 'Notre méthode',
    title: 'Sept étapes, deux *verrous*',
    locks: ['Aucun achat sans contrat signé.', 'Aucune expédition sans inspection validée.'],
    steps: [
      { title: 'Votre besoin', text: 'Un guide par catégorie de produits pour un cahier des charges complet. Vous le validez et le signez.', rule: '' },
      { title: 'Sourcing', text: "Fabricants mis en concurrence, offres comparées en prix et en coût global. Audit d'usine du fournisseur retenu.", rule: '' },
      { title: 'Contrat', text: "Spécifications, délais, pénalités et garantie. Planning à rebours depuis votre date d'ouverture ou de besoin.", rule: 'Aucun achat sans contrat signé' },
      { title: 'Production', text: 'Points réguliers, contrôle en cours de fabrication, alerte au moindre écart.', rule: '' },
      { title: 'Inspection', text: 'Rapport photo avant le solde. Vous décidez avec nous de libérer ou non la marchandise.', rule: 'Aucune expédition sans inspection validée' },
      { title: 'Expédition', text: "Consolidation, documents export cohérents, suivi du fret jusqu'à Abidjan, San-Pédro, Owendo, Douala ou Kribi.", rule: '' },
      { title: 'Réception', text: "Réception coordonnée depuis Abidjan, levée des réserves, mise en service et après-vente.", rule: '' },
    ],
    note: "Le solde du fournisseur n'est versé qu'après une inspection validée. Rien d'important ne se décide sans vous.",
    commitmentsEyebrow: 'Nos engagements',
    commitmentsTitle: 'Six engagements, et le document que vous *recevez* pour chacun',
    commitments: [
      { title: "Le coût global, en plus du prix d'achat", text: "Chaque fournisseur déclare par écrit consommation, durée de vie, entretien et prix des pièces.", deliverable: 'le rapport des offres, en prix et en coût sur la durée de vie.' },
      { title: "Les standards de vos donneurs d'ordre", text: 'Fabricants vérifiés sur place, inspections documentées, traçabilité des équipements livrés.', deliverable: 'un dossier qualité au format de votre client final.' },
      { title: 'Des prix vérifiables', text: "La facture originale du fabricant, notre commission présentée à part. Chaque fournisseur s'engage par écrit à ne nous verser aucune rétrocession.", deliverable: "la facture originale du fabricant et notre note d'honoraires, séparée." },
      { title: "Votre date d'ouverture", text: "Le planning est bâti à rebours depuis l'ouverture de votre site, avec une alerte dès qu'elle est menacée.", deliverable: "le planning à jour, avec le nombre de jours d'avance avant votre ouverture." },
      { title: 'Ni blocage à la banque, ni au port', text: "Des documents cohérents entre eux, un certificat d'inspection conforme à votre lettre de crédit, un dossier de domiciliation prêt.", deliverable: 'un pack documentaire par expédition.' },
      { title: "L'après-livraison prévue dès le devis", text: 'Pièces de rechange proposées au devis, garantie écrite au contrat, recours organisé auprès du fabricant.', deliverable: "un interlocuteur jusqu'à la réception de votre commande." },
    ] as Deliverable[],
    complianceTitle: "La conformité à l'arrivée",
    complianceText: "Les exigences du pays de destination sont vérifiées en Chine, avant l'embarquement : normes applicables, certificats, étiquetage, cohérence des documents. Un contrôle préparé en Chine coûte moins cher qu'une marchandise immobilisée au port.",
  },

  /* ------------------------------------------------- Qui nous sommes */

  about: {
    hero: { title: "Une entreprise qui démarre, avec le regard d'une *exploitante*", text: 'Une marque, deux sociétés, deux bureaux.', image: '' } as PageHero,
    eyebrow: 'Qui nous sommes',
    title: "Acheter comme j'aurais voulu qu'on achète *pour moi*.",
    founderName: 'Pamela Atokouna',
    founderRole: 'Fondatrice',
    bio: "Pendant vingt ans, j'ai dirigé des opérations dans le pétrole et les mines, puis un portefeuille d'immobilier commercial. J'étais du côté de ceux qui reçoivent les équipements, et qui paient quand ils sont défectueux ou en retard. J'ai fondé Gulf Bridge Sourcing pour tout vérifier sur place, avant de payer.",
    bioNote: "Formulation du parcours à confirmer par la fondatrice (cahier des charges, section 16).",
    companiesTitle: 'Une marque, *deux* sociétés',
    companiesIntro: "Gulf Bridge Sourcing est une marque portée par deux sociétés. Vous savez avec laquelle vous contractez, et pourquoi.",
    companies: [
      { name: 'GBS Chine', city: 'Guangzhou', text: "Recherche et audit des usines, négociation directe, suivi de production et contrôle qualité en personne.", registered: false },
      { name: "GBS Côte d'Ivoire", city: 'Abidjan', text: "Écoute du besoin, contrat et facture de droit ivoirien, réception, installation et après-vente.", registered: true },
    ],
    agentsTitle: 'Nos relais au Gabon et au Cameroun',
    agentsText: "Des agents sur place assurent la réception et le suivi local à Owendo, Douala et Kribi.",
    sizeTitle: 'Ce que notre taille *change* pour vous',
    sizePoints: [
      { title: 'La fondatrice sur chaque dossier', text: "Votre commande n'est pas confiée à un junior. Elle est suivie personnellement, de l'usine au port." },
      { title: 'Un premier contact sous 1 jour ouvré', text: "Accusé de réception immédiat, puis un appel ou un message WhatsApp sous un jour ouvré. Le délai de la proposition chiffrée vous est annoncé lors de ce premier contact." },
      { title: 'Deux fuseaux horaires couverts', text: "Guangzhou en UTC+8, Abidjan en UTC+0. Il y a toujours un bureau ouvert pendant vos heures de travail." },
    ] as TitledText[],
  },

  /* -------------------------------------------- Demander une étude */

  etude: {
    hero: {
      title: 'Demander une *étude*',
      text: 'Trois étapes courtes. Accusé de réception immédiat, premier contact sous 1 jour ouvré.',
      image: '',
    } as PageHero,
    stepLabels: ['Votre projet', 'Vos documents', 'Vos coordonnées'],
    specialtyLabel: 'Spécialité ou secteur',
    specialtyOptions: [
      'Équiper un site avant ouverture',
      'Approvisionner un site industriel',
      'BTP et matériaux',
      'Agro-industrie et froid',
      'Éducation et santé',
      'Sport et loisirs',
      'Autre',
    ],
    serviceLabel: 'Service souhaité',
    serviceUnknown: 'Je ne sais pas encore',
    countryLabel: 'Pays de livraison',
    countryOptions: ["Côte d'Ivoire", 'Gabon', 'Cameroun', 'Autre'],
    productsLabel: 'Produits et quantités',
    productsHint: "Décrivez ce que vous cherchez et les quantités envisagées.",
    dateLabel: "Date d'ouverture ou date de besoin",
    supplierLabel: 'Fournisseur déjà identifié',
    supplierNameLabel: 'Nom du fournisseur',
    filesLabel: 'Cahier des charges, plans, photos',
    filesHint: 'PDF, JPG, PNG, DOCX ou XLSX. 5 fichiers de 10 Mo au plus.',
    nameLabel: 'Nom et prénom',
    roleLabel: 'Fonction',
    companyLabel: 'Entreprise',
    emailLabel: 'E-mail professionnel',
    phoneLabel: 'WhatsApp, avec indicatif pays',
    sourceLabel: 'Comment nous avez-vous connus ?',
    sourceOptions: ['Recherche Google', 'LinkedIn', 'Recommandation', 'Plaquette', 'Salon', 'Autre'],
    consent: "J'accepte que mes données soient utilisées pour répondre à ma demande et préparer une proposition, conformément à la politique de confidentialité.",
    next: 'Continuer',
    back: 'Revenir',
    submit: 'Envoyer ma demande',
    sending: 'Envoi en cours',
    thanksTitle: 'Votre demande est bien reçue',
    thanksText: 'Vous recevez un accusé de réception par e-mail. Nous vous contactons sous 1 jour ouvré, par téléphone ou WhatsApp.',
    thanksRef: 'Référence de votre demande',
    required: 'Champ obligatoire',
  },

  /* --------------------------------------- Contact et questions fréquentes */

  contact: {
    hero: { title: 'Contact et questions *fréquentes*', text: 'Deux bureaux, deux fuseaux horaires. Écrivez-nous, nous répondons.', image: '' } as PageHero,
    eyebrow: 'Contact',
    ctaTitle: 'Pour un projet chiffré, passez par le formulaire guidé',
    ctaText: "Il nous donne la spécialité, le pays, les produits et la date. C'est ce qui nous permet de vous rappeler sous 1 jour ouvré avec quelque chose d'utile à dire.",
    ctaLabel: 'Demander une étude',
    faqTitle: "Les questions à se poser avant d'acheter en Chine",
    faq: [
      { q: 'Avec quelle société est-ce que je contracte ?', a: "Gulf Bridge Sourcing est une marque portée par deux sociétés. GBS Côte d'Ivoire, à Abidjan, porte le contrat et la facture de droit ivoirien. GBS Chine, à Guangzhou, exécute le travail en usine. Le contrat indique la société qui s'engage." },
      { q: 'Sous quel délai me répondez-vous ?', a: "Vous recevez un accusé de réception immédiat et automatique. Un premier contact par téléphone ou WhatsApp suit sous 1 jour ouvré. La proposition chiffrée arrive dans un délai qui vous est annoncé lors de ce premier contact, selon la taille du projet." },
      { q: 'Comment êtes-vous rémunérés ?', a: "Une commission sur vos achats, affichée à part de la facture du fabricant. Elle se paie en deux fois : 50 % à la signature du contrat fournisseur, 50 % à l'expédition après inspection validée. S'y ajoutent, selon la mission, un forfait au projet ou un forfait mensuel, un prix fixe pour la vérification d'un fournisseur et le contrôle qualité facturé à la journée. Tout est chiffré et signé avant la commande." },
      { q: "Les inspections sont-elles comprises dans la commission ?", a: "Non. Les deux inspections, en production et avant expédition, sont prévues et chiffrées dans chaque proposition, au même titre que les autres prestations. Nous préférons l'écrire que de les annoncer comprises et les facturer autrement." },
      { q: 'Vous êtes une jeune entreprise. Pourquoi vous confier nos achats ?', a: "Parce que la méthode protège votre argent dès la première commande. Aucun achat sans contrat signé, paiements vers des comptes d'entreprise vérifiés uniquement, solde versé après inspection validée. Et vous pouvez commencer petit, par la vérification d'un fournisseur." },
      { q: 'Pouvez-vous me fournir une marque précise ?', a: "Souvent oui, en direct usine quand le fabricant accepte, sinon par un distributeur agréé. Nous ne sommes distributeur officiel d'aucune marque et nous le disons. Deux limites : une marque visée par des sanctions ou des restrictions américaines ou européennes ne sera pas proposée, et une marque refusée par votre donneur d'ordre non plus." },
      { q: "La garantie du fabricant s'applique-t-elle dans mon pays ?", a: "Cela dépend du fabricant. Nous le vérifions avant la commande et nous l'écrivons au contrat : durée, pièces couvertes, qui prend en charge le transport d'une pièce de remplacement. Quand le fabricant n'assure pas le service sur place, nous faisons prévoir les pièces de rechange au devis." },
      { q: 'Qui est responsable si un produit est défectueux ?', a: "Votre première protection, c'est le solde retenu jusqu'à l'inspection validée : un défaut constaté se corrige avant de payer. Ensuite joue la garantie écrite du fabricant. Nous répondons de nos prestations de vérification, d'inspection et de coordination." },
      { q: 'Pourquoi ne pas commander sur une plateforme en ligne ?', a: "Vous le pouvez. Nous ajoutons ce qu'une plateforme ne fait pas. Vérifier le fabricant sur place, contrôler la marchandise avant le solde, regrouper plusieurs fournisseurs dans une seule expédition, préparer la conformité du pays de destination." },
      { q: 'Quels délais faut-il prévoir ?', a: "Ils dépendent de la fabrication et du transport maritime. Vous recevez un calendrier à la signature du contrat fournisseur, puis un point à chaque étape." },
      { q: 'Y a-t-il un minimum de commande ?', a: "Non. Une commission minimale s'applique aux petites commandes. Elle figure dans la proposition chiffrée, avant tout engagement." },
    ],
  },

  /* -------------------------------------------------------------- Légal */

  legal: {
    mentionsTitle: 'Mentions légales',
    mentions: "Éditeur du site\nGBS Côte d'Ivoire, [forme juridique], au capital de [capital], immatriculée au RCCM sous le numéro [n° RCCM], compte contribuable [n°], siège social à Abidjan, [adresse].\n\nSociété en Chine\nGBS Chine, à Guangzhou. Sa raison sociale, son numéro de crédit social unifié et son adresse seront publiés dès son immatriculation.\n\nDirectrice de la publication\nPamela Atokouna.\n\nContact\ncontact@gulfbridgesourcing.com. Téléphones des deux bureaux en page Contact.\n\nHébergement\nCloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.\n\nGestion du contenu\nConsole Atlas Studio.\n\nMarques citées\nLes marques citées sur ce site sont la propriété de leurs détenteurs. Gulf Bridge Sourcing n'est distributeur officiel d'aucune d'entre elles.",
    privacyTitle: 'Politique de confidentialité',
    privacy: "Responsable du traitement\nGBS Côte d'Ivoire, à Abidjan. Contact : contact@gulfbridgesourcing.com.\n\nCadre applicable\nLoi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel, sous le contrôle de l'ARTCI. Pour les visiteurs du Gabon et du Cameroun, les lois nationales applicables s'ajoutent à ce cadre.\n\nDonnées collectées\nUniquement celles que vous saisissez dans le formulaire : nom et prénom, fonction, entreprise, e-mail professionnel, numéro WhatsApp, spécialité ou secteur, service souhaité, pays de livraison, produits et quantités, date de besoin, fournisseur déjà identifié, origine de votre visite, et les fichiers que vous joignez.\n\nFinalité\nRépondre à votre demande et préparer une proposition chiffrée. Vos données ne sont ni vendues ni cédées.\n\nHébergement et transfert\nLes données sont hébergées hors de Côte d'Ivoire. Le transfert est encadré et déclaré auprès de l'ARTCI lorsque la formalité est requise.\n\nDurée de conservation\nTrois ans après le dernier échange pour un prospect. Les durées légales applicables pour un client. Les fichiers joints à une demande restée sans suite sont supprimés après douze mois.\n\nVos droits\nAccès, rectification, suppression et opposition, par e-mail à contact@gulfbridgesourcing.com. Réponse sous trente jours.\n\nCookies\nCe site ne dépose aucun cookie publicitaire. La mesure d'audience est réalisée sans cookie et sans donnée personnelle, ce qui dispense de bandeau de consentement.",
  },
};

export type SiteContent = typeof defaults;
export type ContentKey = keyof SiteContent;

/** Libellés et ordre des sections dans la console. */
export const SECTION_META: Record<ContentKey, { label: string; order: number }> = {
  settings: { label: 'Coordonnées et mentions', order: 1 },
  seo: { label: 'SEO, nom du site et domaine', order: 2 },
  intro: { label: "Animation d'ouverture", order: 3 },
  home_hero: { label: 'Accueil, en-tête', order: 10 },
  home_problems: { label: 'Accueil, les six problèmes', order: 11 },
  home_specialties: { label: 'Accueil, les deux spécialités', order: 12 },
  home_locks: { label: 'Accueil, les deux verrous', order: 13 },
  home_founder: { label: 'Accueil, citation de la fondatrice', order: 14 },
  home_firststep: { label: 'Accueil, premier pas sans risque', order: 15 },
  home_others: { label: 'Accueil, autres secteurs', order: 16 },
  report: { label: "Rapport d'inspection", order: 17 },
  cta: { label: "Bandeau d'appel à l'action", order: 18 },
  equipement: { label: 'Page, équiper votre site', order: 20 },
  industriel: { label: 'Page, sites industriels', order: 21 },
  autres: { label: 'Page, autres secteurs', order: 22 },
  solutions: { label: 'Page, nos solutions', order: 23 },
  methode: { label: 'Page, méthode et garanties', order: 24 },
  about: { label: 'Page, qui nous sommes', order: 25 },
  etude: { label: 'Page, demander une étude', order: 26 },
  contact: { label: 'Page, contact et questions fréquentes', order: 27 },
  legal: { label: 'Mentions légales et confidentialité', order: 30 },
};
