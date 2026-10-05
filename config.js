// =====================================================
//  TOUTES LES INFOS DU SITE SE MODIFIENT ICI
// =====================================================
window.MARIAGE = {
  maries: { a: "Narjes", b: "Isiah" },

  // Format AAAA-MM-JJ
  date: "2027-06-26",
  dateLimiteReponse: "2027-03-01",

  lieux: [
    {
      id: "mairie",
      titre: "Mairie de Toulouse",
      sousTitre: "Le Capitole",
      adresse: "Place du Capitole, 31000 Toulouse",
      acces: [
        "Métro ligne A, station Capitole (2 min à pied)",
        "Parking souterrain Capitole ou Victor Hugo",
        "Le centre-ville est piéton : prévoyez un peu d'avance"
      ]
    },
    {
      id: "belonie",
      titre: "La Bélonie",
      sousTitre: "Cérémonie laïque, vin d'honneur & réception",
      adresse: "La Bélonie, 81500 Marzens",
      acces: [
        "Environ 45 min de route depuis Toulouse (direction Lavaur, A68 puis D112)",
        "Parking sur place",
        "Pensez au covoiturage entre invités"
      ]
    }
  ],

  programme: [
    { heure: "12h00", titre: "Mariage civil", lieu: "Mairie de Toulouse", icone: "rings" },
    { heure: "17h00", titre: "Cérémonie laïque", lieu: "La Bélonie, Marzens", icone: "heart" },
    { heure: "18h45", titre: "Vin d'honneur", lieu: "La Bélonie, Marzens", icone: "glass" }
  ],

  temoins: [
    { nom: "Axel Dao",         role: "Témoin d'Isiah",  tel: "06 87 42 96 06" },
    { nom: "Yoan Touré",       role: "Témoin d'Isiah",  tel: "06 09 42 40 22" },
    { nom: "Edouard Degeilh",  role: "Témoin de Narjes", tel: "06 44 27 43 19" },
    { nom: "Aliyah Schmidt",   role: "Témoin de Narjes", tel: "06 42 15 24 39" }
  ],

  faq: [
    {
      q: "Y a-t-il un dress code ?",
      r: "Oui ! Les couleurs du jour sont le bleu et le rose. À vous de les porter comme vous le sentez.",
      couleurs: ["#7FA6DD", "#F2A9C6"]
    },
    {
      q: "Les enfants sont-ils acceptés ?",
      r: "Merci de nous prévenir en amont, via le formulaire ou directement, afin que nous puissions valider ensemble."
    },
    {
      q: "Un hébergement est-il prévu ?",
      r: "Non, aucun hébergement n'est prévu, sauf si nous vous en avons informés personnellement."
    },
    {
      q: "Jusqu'à quand puis-je répondre ?",
      r: "Merci de répondre au formulaire avant le 1er mars. Pour toute modification ensuite, contactez un témoin."
    }
  ],

  // Configuration Firebase (voir README.md, étape 2)
  firebase: {
    apiKey: "AIzaSyDaz_sw96BUpV2I_FpCLLEUyIx6DBB46E0",
  authDomain: "mariage-a0ade.firebaseapp.com",
  projectId: "mariage-a0ade",
  storageBucket: "mariage-a0ade.firebasestorage.app",
  messagingSenderId: "672195581101",
  appId: "1:672195581101:web:be62092a7f74c09eb9e224"
  }
};
