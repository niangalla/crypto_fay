import React, { useState, useEffect } from 'react';
import { Wallet, BookOpen, User, Home, Send, Download, QrCode, Trophy, Star, Globe, Lock, CheckCircle } from 'lucide-react';

const CryptoFayeSenegal = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('fr');
  const [balance, setBalance] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setDarkMode] = useState(false);
  
  // Wallet creation states
  const [hasWallet, setHasWallet] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState('welcome'); // welcome, name, create, seedphrase, verify, pin, success, login, loginSeed
  const [seedPhrase, setSeedPhrase] = useState([]);
  const [seedPhraseRevealed, setSeedPhraseRevealed] = useState(false);
  const [verificationWords, setVerificationWords] = useState([]);
  const [selectedVerificationWords, setSelectedVerificationWords] = useState([]);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [loginSeedInput, setLoginSeedInput] = useState('');
  
  // Module learning states
  const [showModuleViewer, setShowModuleViewer] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [moduleProgress, setModuleProgress] = useState('video'); // video, quiz, completed
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // BTC to USD rate (approximate)
  const BTC_TO_USD = 65000;
  const SATS_TO_USD = BTC_TO_USD / 100000000;
  
  // Navigation functions
  const goBack = () => {
    if (onboardingStep === 'name') setOnboardingStep('welcome');
    else if (onboardingStep === 'seedphrase') setOnboardingStep('name');
    else if (onboardingStep === 'verify') {
      setSeedPhraseRevealed(false);
      setOnboardingStep('seedphrase');
    }
    else if (onboardingStep === 'pin') setOnboardingStep('verify');
    else if (onboardingStep === 'login') setOnboardingStep('welcome');
    else if (onboardingStep === 'loginSeed') setOnboardingStep('login');
  };

  const startLogin = () => {
    setOnboardingStep('login');
  };

  const proceedToLoginSeed = () => {
    if (tempUserName.trim().length < 2) {
      alert(language === 'fr' ? 
        'Veuillez entrer un nom valide' : 
        language === 'en' ? 
        'Please enter a valid name' : 
        'Duggal sa tur bu baax'
      );
      return;
    }
    setOnboardingStep('loginSeed');
  };

  const completeLogin = () => {
    const words = loginSeedInput.trim().split(/\s+/);
    if (words.length !== 12) {
      alert(language === 'fr' ? 
        '⚠️ Veuillez entrer les 12 mots de votre phrase secrète' : 
        language === 'en' ? 
        '⚠️ Please enter your 12-word secret phrase' : 
        '⚠️ Duggal 12 baat yi ci sa phrase secrète'
      );
      return;
    }
    
    // Simulate successful login
    setUserName(tempUserName);
    setSeedPhrase(words);
    setHasWallet(true);
    setBalance(500); // Existing balance
  };
  
  // Generate random seed phrase
  const generateSeedPhrase = () => {
    const wordList = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'afford', 'afraid', 'again', 'age', 'agent', 'agree',
      'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol'
    ];
    const phrase = [];
    for (let i = 0; i < 12; i++) {
      phrase.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return phrase;
  };
  
  const startWalletCreation = () => {
    setOnboardingStep('name');
  };

  const proceedToSeedPhrase = () => {
    if (tempUserName.trim().length < 2) {
      alert(language === 'fr' ? 
        'Veuillez entrer un nom valide' : 
        language === 'en' ? 
        'Please enter a valid name' : 
        'Duggal sa tur bu baax'
      );
      return;
    }
    const newSeedPhrase = generateSeedPhrase();
    setSeedPhrase(newSeedPhrase);
    setOnboardingStep('seedphrase');
  };
  
  const proceedToVerification = () => {
    // Select 4 random positions for verification
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const selectedPositions = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      selectedPositions.push(positions[randomIndex]);
      positions.splice(randomIndex, 1);
    }
    selectedPositions.sort((a, b) => a - b);
    
    // Create verification array with some wrong words
    const wrongWords = ['wrong', 'incorrect', 'fake', 'error', 'test', 'dummy'];
    const verifyWords = selectedPositions.map(pos => ({
      position: pos,
      correctWord: seedPhrase[pos],
      options: [
        seedPhrase[pos],
        wrongWords[Math.floor(Math.random() * wrongWords.length)],
        wrongWords[Math.floor(Math.random() * wrongWords.length)]
      ].sort(() => Math.random() - 0.5)
    }));
    
    setVerificationWords(verifyWords);
    setSelectedVerificationWords(Array(4).fill(null));
    setOnboardingStep('verify');
  };
  
  const checkVerification = () => {
    const allCorrect = verificationWords.every((item, index) => 
      selectedVerificationWords[index] === item.correctWord
    );
    
    if (allCorrect) {
      setOnboardingStep('pin');
    } else {
      alert('❌ Certains mots ne correspondent pas. Veuillez réessayer.');
    }
  };
  
  const finishWalletCreation = () => {
    if (pin.length !== 4) {
      alert('⚠️ Le PIN doit contenir 4 chiffres');
      return;
    }
    if (pin !== confirmPin) {
      alert('❌ Les codes PIN ne correspondent pas');
      return;
    }
    
    setUserName(tempUserName);
    setOnboardingStep('success');
    setTimeout(() => {
      setHasWallet(true);
      setBalance(100); // Welcome bonus
    }, 2000);
  };

  const translations = {
    fr: {
      appName: 'CryptoFaye Senegal',
      home: 'Accueil',
      wallet: 'Portefeuille',
      academy: 'Académie',
      profile: 'Profil',
      balance: 'Solde',
      send: 'Envoyer',
      receive: 'Recevoir',
      transactions: 'Transactions',
      learning: 'Apprentissage Bitcoin',
      modules: 'Modules',
      completed: 'Complété',
      start: 'Commencer',
      continue: 'Continuer',
      reward: 'Récompense',
      sats: 'sats',
      welcome: 'Bienvenue sur',
      welcomeMsg: 'Apprenez Bitcoin et Lightning Network tout en gagnant des satoshis !',
      getStarted: 'Commencer',
      recentActivity: 'Activité récente',
      progress: 'Votre progression',
      settings: 'Paramètres',
      security: 'Sécurité',
      backupSeed: 'Sauvegarder la phrase secrète',
      changePIN: 'Changer le code PIN',
      selectLanguage: 'Langue',
      sendSats: 'Envoyer des sats',
      amount: 'Montant',
      invoice: 'Facture Lightning',
      pasteInvoice: 'Coller une facture ou Lightning Address',
      scanQR: 'Scanner QR Code',
      receiveSats: 'Recevoir des sats',
      generateInvoice: 'Générer une facture',
      shareLink: 'Partager le lien',
      yourAddress: 'Votre adresse Lightning',
      moduleReward: 'Récompense par module complété',
      // Wallet creation
      welcomeTitle: 'Bienvenue sur CryptoFaye',
      welcomeSubtitle: 'Votre portefeuille Bitcoin Lightning sécurisé',
      welcomeDesc: 'Créez votre portefeuille non-custodial et commencez à apprendre Bitcoin tout en gagnant des satoshis !',
      createWallet: 'Créer mon portefeuille',
      restoreWallet: 'Restaurer un portefeuille',
      seedPhraseTitle: 'Votre Phrase Secrète',
      seedPhraseDesc: 'Ces 12 mots sont la CLÉ de votre portefeuille. Notez-les dans l\'ordre sur papier et gardez-les en sécurité.',
      seedPhraseWarning: '⚠️ Ne partagez JAMAIS cette phrase. Quiconque la possède peut accéder à vos fonds.',
      revealSeed: 'Révéler la phrase secrète',
      copySeed: 'Copier',
      seedCopied: 'Phrase copiée !',
      haveSaved: 'J\'ai sauvegardé ma phrase secrète',
      verifyTitle: 'Vérification',
      verifyDesc: 'Pour confirmer que vous avez bien noté votre phrase, sélectionnez les mots manquants :',
      verifyButton: 'Vérifier',
      pinTitle: 'Code PIN de Sécurité',
      pinDesc: 'Créez un code PIN à 4 chiffres pour sécuriser votre portefeuille',
      enterPin: 'Entrez votre code PIN',
      confirmPinLabel: 'Confirmez votre code PIN',
      createWalletBtn: 'Créer le portefeuille',
      successTitle: 'Félicitations ! 🎉',
      successDesc: 'Votre portefeuille a été créé avec succès',
      successBonus: 'Bonus de bienvenue : +100 sats',
      successReady: 'Vous êtes prêt à commencer !',
      word: 'Mot',
      // Quiz
      watchVideo: 'Regarder la vidéo',
      transcript: 'Transcription',
      startQuiz: 'Commencer le quiz',
      submitQuiz: 'Valider mes réponses',
      nextModule: 'Module suivant',
      backToAcademy: 'Retour à l\'Académie',
      quizTitle: 'Quiz - Testez vos connaissances',
      question: 'Question',
      correctAnswers: 'Bonnes réponses',
      quizPassed: 'Quiz réussi ! 🎉',
      quizFailed: 'Quiz échoué',
      tryAgain: 'Réessayer',
      moduleCompleted: 'Module complété avec succès !',
      rewardEarned: 'Récompense gagnée',
      locked: 'Verrouillé',
      // Username
      yourName: 'Votre nom',
      enterYourName: 'Entrez votre nom',
      nameDesc: 'Comment souhaitez-vous être appelé ?',
      next: 'Suivant',
      // Dark mode
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      // Send/Receive
      recipientAddress: 'Adresse du destinataire',
      pasteAddress: 'Coller l\'adresse Lightning',
      scanQRCode: 'Scanner QR Code',
      close: 'Fermer',
      congratulations: 'Félicitations',
      // Login
      login: 'Connexion',
      loginTitle: 'Se connecter',
      loginDesc: 'Connectez-vous à votre portefeuille existant',
      enterSeedPhrase: 'Entrez votre phrase secrète',
      seedPhraseHelp: 'Entrez vos 12 mots séparés par des espaces',
      connect: 'Se connecter',
      backToWelcome: 'Retour',
      backButton: 'Retour',
      // Login
      login: 'Connexion',
      loginTitle: 'Se connecter',
      loginDesc: 'Connectez-vous avec votre nom et phrase secrète',
      enterSeedPhrase: 'Entrez votre phrase secrète',
      seedPhrasePlaceholder: 'Entrez vos 12 mots séparés par des espaces',
      connect: 'Se connecter',
      backButton: 'Retour',
      alreadyHaveAccount: 'Vous avez déjà un compte ?'
    },
    wo: {
      appName: 'CryptoFaye Senegal',
      home: 'Kër',
      wallet: 'Kalpé',
      academy: 'Jàngal',
      profile: 'Sa momel',
      balance: 'Sa poss',
      send: 'Yónnée',
      receive: 'Joot',
      transactions: 'Jokalanté',
      learning: 'Jàngal Bitcoin',
      modules: 'Ay bind',
      completed: 'Jeex',
      start: 'Tambali',
      continue: 'Yegaléh',
      reward: 'Nexal',
      sats: 'sats',
      welcome: 'Dalal ak jaam',
      welcomeMsg: 'Jàngal Bitcoin ak Lightning Network nguir yok say chance gagner satos!',
      getStarted: 'Tambali',
      recentActivity: 'Liggéey yigua jota def',
      progress: 'Yokutté',
      settings: 'Paramètres',
      security: 'Kaarangué',
      backupSeed: 'Defarat sa seed phrase',
      changePIN: 'Soppi sa code PIN',
      selectLanguage: 'Tanaal sa Làkk',
      sendSats: 'Yónnée sats',
      amount: 'Lim',
      invoice: 'Facture Lightning',
      pasteInvoice: 'Facture yi dial',
      scanQR: 'Scanner QR',
      receiveSats: 'Jëkk sats',
      generateInvoice: 'Guené facture',
      shareLink: 'Sedalé sa lien',
      yourAddress: 'Sa adresse Lightning',
      moduleReward: 'Nexal thi bind bi',
      // Wallet creation
      welcomeTitle: 'Dalal Jam si CryptoFaye',
      welcomeSubtitle: 'Sa portefeuille Bitcoin Lightning bu gëm',
      welcomeDesc: 'Defal sa portefeuille te tambali jàngal Bitcoin te am sats!',
      createWallet: 'Defal sama portefeuille',
      restoreWallet: 'Delloo portefeuille',
      seedPhraseTitle: 'Sa Baat bu Sutura',
      seedPhraseDesc: '12 baat yi mooy CLÉEF sa portefeuille. Bind leen ci papiye te tëral leen.',
      seedPhraseWarning: '⚠️ Bul KO dëkkale WANTE KO ni. Ku am ko mën na jël sa xaalis.',
      revealSeed: 'Wone baat yi',
      copySeed: 'Koppi',
      seedCopied: 'Baat yi koppi!',
      haveSaved: 'Dama tëral sama baat',
      verifyTitle: 'Verification',
      verifyDesc: 'Nga teg ne bind nga baat yi, tànne baat yi des:',
      verifyButton: 'Tànne',
      pinTitle: 'Code PIN bu Sécurité',
      pinDesc: 'Defal code PIN 4 chiffres ngir gëm sa portefeuille',
      enterPin: 'Duggal sa code PIN',
      confirmPinLabel: 'Teg sa code PIN',
      createWalletBtn: 'Defal portefeuille bi',
      successTitle: 'Jërëjëf! 🎉',
      successDesc: 'Sa portefeuille defal nañu ko',
      successBonus: 'Caddo bu dalal: +100 sats',
      successReady: 'Nga gëna tambali!',
      word: 'Baat',
      // Quiz
      watchVideo: 'Xool video bi',
      transcript: 'Transcription',
      startQuiz: 'Tambali quiz bi',
      submitQuiz: 'Validé sama réponses',
      nextModule: 'Module bu ñéew',
      backToAcademy: 'Dellu ci Jàngal',
      quizTitle: 'Quiz - Test sa xam-xam',
      question: 'Làkk',
      correctAnswers: 'Réponses yu baax',
      quizPassed: 'Quiz bi jeex ! 🎉',
      quizFailed: 'Quiz bi jeexul',
      tryAgain: 'Jéema',
      moduleCompleted: 'Module bi jeex !',
      rewardEarned: 'Caddo am nga',
      locked: 'Tëj',
      // Username
      yourName: 'Sa tur',
      enterYourName: 'Duggal sa tur',
      nameDesc: 'Naka nga bëgg ma ko tax?',
      next: 'Ci biti',
      // Dark mode
      darkMode: 'Mode bu ñuul',
      lightMode: 'Mode bu weex',
      // Send/Receive
      recipientAddress: 'Adresse bu destinataire',
      pasteAddress: 'Tëral adresse Lightning',
      scanQRCode: 'Scanner QR',
      close: 'Tëj',
      congratulations: 'Jërëjëf',
      // Login
      login: 'Connexion',
      loginTitle: 'Connexion',
      loginDesc: 'Connexion ci sa portefeuille',
      enterSeedPhrase: 'Duggal sa phrase secrète',
      seedPhraseHelp: 'Duggal sa 12 baat yi',
      connect: 'Connexion',
      backToWelcome: 'Dellu',
      // Login
      login: 'Connexion',
      loginTitle: 'Duñu connexion',
      loginDesc: 'Duñu connexion ak sa tur ak sa phrase secrète',
      enterSeedPhrase: 'Duggal sa phrase secrète',
      seedPhrasePlaceholder: 'Duggal 12 baat yi ci espaces',
      connect: 'Connexion',
      backButton: 'Dellu',
      alreadyHaveAccount: 'Am nga sa compte?'
    },
    en: {
      appName: 'CryptoFaye Senegal',
      home: 'Home',
      wallet: 'Wallet',
      academy: 'Academy',
      profile: 'Profile',
      balance: 'Balance',
      send: 'Send',
      receive: 'Receive',
      transactions: 'Transactions',
      learning: 'Bitcoin Learning',
      modules: 'Modules',
      completed: 'Completed',
      start: 'Start',
      continue: 'Continue',
      reward: 'Reward',
      sats: 'sats',
      welcome: 'Welcome to',
      welcomeMsg: 'Learn Bitcoin and Lightning Network while earning satoshis!',
      getStarted: 'Get Started',
      recentActivity: 'Recent Activity',
      progress: 'Your Progress',
      settings: 'Settings',
      security: 'Security',
      backupSeed: 'Backup Seed Phrase',
      changePIN: 'Change PIN',
      selectLanguage: 'Language',
      sendSats: 'Send sats',
      amount: 'Amount',
      invoice: 'Lightning Invoice',
      pasteInvoice: 'Paste invoice or Lightning Address',
      scanQR: 'Scan QR Code',
      receiveSats: 'Receive sats',
      generateInvoice: 'Generate Invoice',
      shareLink: 'Share Link',
      yourAddress: 'Your Lightning Address',
      moduleReward: 'Reward per completed module',
      // Wallet creation
      welcomeTitle: 'Welcome to CryptoFaye',
      welcomeSubtitle: 'Your secure Bitcoin Lightning wallet',
      welcomeDesc: 'Create your non-custodial wallet and start learning Bitcoin while earning satoshis!',
      createWallet: 'Create Wallet',
      restoreWallet: 'Restore Wallet',
      seedPhraseTitle: 'Your Secret Phrase',
      seedPhraseDesc: 'These 12 words are the KEY to your wallet. Write them down on paper in order and keep them safe.',
      seedPhraseWarning: '⚠️ NEVER share this phrase. Anyone who has it can access your funds.',
      revealSeed: 'Reveal seed phrase',
      copySeed: 'Copy',
      seedCopied: 'Phrase copied!',
      haveSaved: 'I have saved my seed phrase',
      verifyTitle: 'Verification',
      verifyDesc: 'To confirm you noted your phrase, select the missing words:',
      verifyButton: 'Verify',
      pinTitle: 'Security PIN Code',
      pinDesc: 'Create a 4-digit PIN code to secure your wallet',
      enterPin: 'Enter your PIN code',
      confirmPinLabel: 'Confirm your PIN code',
      createWalletBtn: 'Create Wallet',
      successTitle: 'Congratulations! 🎉',
      successDesc: 'Your wallet has been successfully created',
      successBonus: 'Welcome bonus: +100 sats',
      successReady: 'You are ready to start!',
      word: 'Word',
      // Quiz
      watchVideo: 'Watch video',
      transcript: 'Transcript',
      startQuiz: 'Start quiz',
      submitQuiz: 'Submit answers',
      nextModule: 'Next module',
      backToAcademy: 'Back to Academy',
      quizTitle: 'Quiz - Test your knowledge',
      question: 'Question',
      correctAnswers: 'Correct answers',
      quizPassed: 'Quiz passed! 🎉',
      quizFailed: 'Quiz failed',
      tryAgain: 'Try again',
      moduleCompleted: 'Module completed successfully!',
      rewardEarned: 'Reward earned',
      locked: 'Locked',
      // Username
      yourName: 'Your name',
      enterYourName: 'Enter your name',
      nameDesc: 'How would you like to be called?',
      next: 'Next',
      // Dark mode
      darkMode: 'Dark mode',
      lightMode: 'Light mode',
      // Send/Receive
      recipientAddress: 'Recipient address',
      pasteAddress: 'Paste Lightning address',
      scanQRCode: 'Scan QR Code',
      close: 'Close',
      congratulations: 'Congratulations',
      // Login
      login: 'Login',
      loginTitle: 'Login',
      loginDesc: 'Connect to your existing wallet',
      enterSeedPhrase: 'Enter your secret phrase',
      seedPhraseHelp: 'Enter your 12 words separated by spaces',
      connect: 'Connect',
      backToWelcome: 'Back',
      // Login
      login: 'Login',
      loginTitle: 'Log In',
      loginDesc: 'Connect with your name and secret phrase',
      enterSeedPhrase: 'Enter your secret phrase',
      seedPhrasePlaceholder: 'Enter your 12 words separated by spaces',
      connect: 'Connect',
      backButton: 'Back',
      alreadyHaveAccount: 'Already have an account?'
    }
  };

  const t = translations[language];

  const modules = [
    {
      id: 1,
      title: { fr: 'Comprendre Bitcoin', wo: 'Faham Bitcoin', en: 'Understanding Bitcoin' },
      duration: '25 min',
      reward: 50,
      icon: '₿',
      videoUrl: 'https://www.youtube.com/embed/l1si5ZWLgy0',
      transcript: {
        fr: `Bitcoin est la première monnaie numérique décentralisée au monde. Créée en 2009 par Satoshi Nakamoto, cette innovation révolutionnaire permet d'effectuer des transactions directement entre personnes, sans intermédiaire bancaire.

Contrairement aux monnaies traditionnelles contrôlées par les banques centrales, Bitcoin fonctionne sur un réseau peer-to-peer où chaque participant peut vérifier les transactions. C'est ce qu'on appelle la blockchain : un grand livre de comptes public et transparent.

Le Bitcoin est limité à 21 millions d'unités, ce qui en fait une réserve de valeur similaire à l'or numérique. Cette rareté programmée protège contre l'inflation et préserve votre pouvoir d'achat.

Au Sénégal, Bitcoin peut vous aider à envoyer et recevoir de l'argent rapidement, à moindre coût, et sans dépendre du système bancaire traditionnel. C'est une opportunité d'inclusion financière pour tous.`,
        en: `Bitcoin is the world's first decentralized digital currency. Created in 2009 by Satoshi Nakamoto, this revolutionary innovation allows transactions directly between people, without banking intermediaries.

Unlike traditional currencies controlled by central banks, Bitcoin operates on a peer-to-peer network where each participant can verify transactions. This is called the blockchain: a public and transparent ledger.

Bitcoin is limited to 21 million units, making it a store of value similar to digital gold. This programmed scarcity protects against inflation and preserves your purchasing power.

In Senegal, Bitcoin can help you send and receive money quickly, at low cost, and without depending on the traditional banking system. It's an opportunity for financial inclusion for everyone.`,
        wo: `Bitcoin mooy xaalis bu njëkk bu numérique bu dekk ci àdduna bi. Satoshi Nakamoto def ko ci 2009, innovation bi revolucionnaire mën nga yàlla jëfandikoo ngir yónnee ak jël xaalis ci biir nit ñi, amul banque.

Daal ak xaalis yi tradisionel yi banque centrale yi di control, Bitcoin dafay liggéey ci réseau peer-to-peer, funk nit mën na gis transaction yi. Mooy li ñu tax blockchain: teg dafay ñu mën gis ak transparent.

Bitcoin limité na ci 21 million, mooy réserve bu ñu mën xam ni ñu mel ni or numérique. Rareté bi programmé dafay gëm ngir inflation te tëral sa pouvoir d'achat.

Ci Senegal, Bitcoin mën na la indi ngir yónnee ak jël xaalis bou gaw, bu jafe, te amul dépendance ci système bancaire bi traditionnel. Dañu la jox inclusion financière ngir ñep.`
      },
      quiz: [
        {
          question: {
            fr: "Qui a créé Bitcoin ?",
            en: "Who created Bitcoin?",
            wo: "Ku def Bitcoin?"
          },
          options: {
            fr: ["Satoshi Nakamoto", "Elon Musk", "Bill Gates", "Mark Zuckerberg"],
            en: ["Satoshi Nakamoto", "Elon Musk", "Bill Gates", "Mark Zuckerberg"],
            wo: ["Satoshi Nakamoto", "Elon Musk", "Bill Gates", "Mark Zuckerberg"]
          },
          correct: 0
        },
        {
          question: {
            fr: "Combien de Bitcoins seront créés au maximum ?",
            en: "What is the maximum number of Bitcoins that will be created?",
            wo: "Ñaata Bitcoin ñu gën a def?"
          },
          options: {
            fr: ["21 millions", "100 millions", "1 milliard", "Illimité"],
            en: ["21 million", "100 million", "1 billion", "Unlimited"],
            wo: ["21 million", "100 million", "1 milliard", "Amul limite"]
          },
          correct: 0
        },
        {
          question: {
            fr: "Qu'est-ce que la blockchain ?",
            en: "What is the blockchain?",
            wo: "Lan mooy blockchain?"
          },
          options: {
            fr: [
              "Un grand livre de comptes public et transparent",
              "Une banque en ligne",
              "Un type de cryptomonnaie",
              "Un logiciel antivirus"
            ],
            en: [
              "A public and transparent ledger",
              "An online bank",
              "A type of cryptocurrency",
              "An antivirus software"
            ],
            wo: [
              "Teg bu public te transparent",
              "Banque bu en ligne",
              "Type bu cryptomonnaie",
              "Logiciel antivirus"
            ]
          },
          correct: 0
        },
        {
          question: {
            fr: "Quel est l'avantage principal de Bitcoin au Sénégal ?",
            en: "What is the main advantage of Bitcoin in Senegal?",
            wo: "Lan mooy avantage bu mag ci Bitcoin ci Senegal?"
          },
          options: {
            fr: [
              "Inclusion financière sans banque",
              "Gagner de l'argent rapidement",
              "Remplacer le Franc CFA",
              "Acheter des voitures"
            ],
            en: [
              "Financial inclusion without banks",
              "Make money quickly",
              "Replace CFA Franc",
              "Buy cars"
            ],
            wo: [
              "Inclusion financière bu amul banque",
              "Am xaalis bou gaw",
              "Remplaci Franc CFA",
              "Jënd woto"
            ]
          },
          correct: 0
        }
      ]
    },
    {
      id: 2,
      title: { fr: 'Sécurité d\'abord', wo: 'Sécurité njëkk', en: 'Security First' },
      duration: '20 min',
      reward: 50,
      icon: '🔒'
    },
    {
      id: 3,
      title: { fr: 'Lightning en Action', wo: 'Lightning ci liggéey', en: 'Lightning in Action' },
      duration: '30 min',
      reward: 75,
      icon: '⚡'
    },
    {
      id: 4,
      title: { fr: 'Premier Paiement', wo: 'Fayment bu njëkk', en: 'Your First Payment' },
      duration: '25 min',
      reward: 50,
      icon: '💸'
    },
    {
      id: 5,
      title: { fr: 'Recevoir de l\'Argent', wo: 'Jëkk xaalis', en: 'Receiving Money' },
      duration: '20 min',
      reward: 50,
      icon: '📥'
    },
    {
      id: 6,
      title: { fr: 'Usage Responsable', wo: 'Jëfandikoo bu baax', en: 'Responsible Usage' },
      duration: '30 min',
      reward: 75,
      icon: '✅'
    }
  ];

  const transactions = [
    { type: 'reward', amount: 50, desc: { fr: 'Récompense Module 1', en: 'Module 1 Reward', wo: 'Caddo Module 1' }, date: '2025-10-20' },
    { type: 'received', amount: 1000, desc: { fr: 'Reçu de Alice', en: 'Received from Alice', wo: 'Jëkk ci Alice' }, date: '2025-10-19' },
    { type: 'sent', amount: -500, desc: { fr: 'Envoyé à Bob', en: 'Sent to Bob', wo: 'Yónnee ci Bob' }, date: '2025-10-18' }
  ];

  const completeModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
      const module = modules.find(m => m.id === moduleId);
      setBalance(balance + module.reward);
      alert(`🎉 ${t.completed}! +${module.reward} ${t.sats}`);
    }
  };

  const openModule = (module) => {
    // Check if previous module is completed (except for module 1)
    if (module.id > 1 && !completedModules.includes(module.id - 1)) {
      alert(language === 'fr' ? 
        '🔒 Veuillez d\'abord compléter le module précédent' : 
        language === 'en' ? 
        '🔒 Please complete the previous module first' : 
        '🔒 Jeex module bi njëkk'
      );
      return;
    }
    
    setCurrentModule(module);
    setModuleProgress('video');
    setQuizAnswers({});
    setShowQuizResults(false);
    setShowModuleViewer(true);
  };

  const startQuiz = () => {
    setModuleProgress('quiz');
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  const submitQuiz = () => {
    const module = currentModule;
    if (!module.quiz) return;

    let correctCount = 0;
    module.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    const passed = correctCount === module.quiz.length;
    setShowQuizResults(true);

    if (passed) {
      setTimeout(() => {
        if (!completedModules.includes(module.id)) {
          setCompletedModules([...completedModules, module.id]);
          setBalance(balance + module.reward);
        }
        setModuleProgress('completed');
      }, 1500);
    }
  };

  const closeModuleViewer = () => {
    setShowModuleViewer(false);
    setCurrentModule(null);
    setModuleProgress('video');
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  const HomePage = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-2xl p-8 text-white`}>
        <h1 className="text-3xl font-bold mb-2">{t.welcome}</h1>
        <h2 className="text-4xl font-bold mb-4">{t.appName} 🪙</h2>
        <p className="text-lg mb-6">{t.welcomeMsg}</p>
        <button 
          onClick={() => setActiveTab('academy')}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition`}
        >
          {t.getStarted} →
        </button>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.balance}</h3>
          <Wallet className="text-blue-500" size={28} />
        </div>
        <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          {balance.toLocaleString()} {t.sats}
        </div>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} space-y-1`}>
          <div>≈ ${(balance * SATS_TO_USD).toFixed(2)} USD</div>
          <div>≈ {(balance * 0.0005).toFixed(2)} CFA</div>
        </div>
        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => setShowSendModal(true)}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <Send size={20} /> {t.send}
          </button>
          <button 
            onClick={() => setShowReceiveModal(true)}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <Download size={20} /> {t.receive}
          </button>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t.progress}</h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
            />
          </div>
          <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {completedModules.length}/{modules.length}
          </span>
        </div>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          {t.modules} {t.completed.toLowerCase()}
        </p>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t.recentActivity}</h3>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx, idx) => (
            <div key={idx} className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'reward' ? isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600' :
                  tx.type === 'received' ? isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600' :
                  isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {tx.type === 'reward' ? '🎁' : tx.type === 'received' ? '↓' : '↑'}
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {tx.desc[language]}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.date}</div>
                </div>
              </div>
              <div className={`font-bold ${tx.amount > 0 ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} {t.sats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WalletPage = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-2xl p-8 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{t.balance}</h2>
          <Lock size={24} />
        </div>
        <div className="text-5xl font-bold mb-2">{balance.toLocaleString()}</div>
        <div className="text-lg">{t.sats} ⚡</div>
        <div className={`${isDarkMode ? 'text-blue-200' : 'text-blue-100'} mt-2 space-y-1`}>
          <div>≈ ${(balance * SATS_TO_USD).toFixed(2)} USD</div>
          <div>≈ {(balance * 0.0005).toFixed(2)} CFA</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowSendModal(true)}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
        >
          <Send className="text-blue-500 mb-3" size={32} />
          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.send}</div>
        </button>
        <button 
          onClick={() => setShowReceiveModal(true)}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
        >
          <Download className="text-green-500 mb-3" size={32} />
          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.receive}</div>
        </button>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t.transactions}</h3>
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div key={idx} className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} last:border-0`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  tx.type === 'reward' ? isDarkMode ? 'bg-purple-900' : 'bg-purple-100' :
                  tx.type === 'received' ? isDarkMode ? 'bg-green-900' : 'bg-green-100' :
                  isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  {tx.type === 'reward' ? '🎁' : tx.type === 'received' ? '📥' : '📤'}
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {tx.desc[language]}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.date}</div>
                </div>
              </div>
              <div className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AcademyPage = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-2xl p-8 text-white`}>
        <BookOpen size={48} className="mb-4" />
        <h2 className="text-3xl font-bold mb-2">Bitcoin {t.academy}</h2>
        <p className="text-lg">{t.welcomeMsg}</p>
        <div className="mt-4 flex items-center gap-2">
          <Trophy className="text-yellow-300" size={24} />
          <span className="font-semibold">50+ {t.sats} {t.moduleReward}</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.progress}</h3>
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {completedModules.length}/{modules.length}
          </span>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 mb-2`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
          />
        </div>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          {((completedModules.length / modules.length) * 100).toFixed(0)}% {t.completed}
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          const isLocked = module.id > 1 && !completedModules.includes(module.id - 1);
          
          return (
            <div 
              key={module.id}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg transition ${
                isCompleted ? 'border-2 border-green-400' : 
                isLocked ? 'opacity-60' : 'hover:shadow-xl'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{module.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {module.title[language]}
                      </h4>
                      {isLocked && (
                        <div className="flex items-center gap-2 mt-1">
                          <Lock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{t.locked}</span>
                        </div>
                      )}
                    </div>
                    {isCompleted && <CheckCircle className="text-green-500" size={24} />}
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    <span>⏱️ {module.duration}</span>
                    <span className="text-yellow-600 font-semibold">+{module.reward} {t.sats}</span>
                  </div>
                  <button
                    onClick={() => openModule(module)}
                    disabled={isLocked}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      isLocked 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                      isCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isLocked ? `🔒 ${t.locked}` : isCompleted ? `✓ ${t.completed}` : t.start}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg text-center`}>
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
          {userName ? userName[0].toUpperCase() : 'U'}
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
          {userName || 'Utilisateur'}
        </h2>
        <div className={`flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Star className="text-yellow-500" size={20} />
          <span>{completedModules.length} {t.modules} {t.completed}</span>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t.settings}</h3>
        <div className="space-y-4">
          <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <Globe className="text-blue-500" size={24} />
              <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t.selectLanguage}</span>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-4 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg font-semibold`}
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="wo">🇸🇳 Wolof</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
          <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <span className="text-2xl">🌙</span>
              ) : (
                <span className="text-2xl">☀️</span>
              )}
              <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {isDarkMode ? t.darkMode : t.lightMode}
              </span>
            </div>
            <button
              onClick={() => setDarkMode(!isDarkMode)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400' 
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t.security}</h3>
        <div className="space-y-3">
          <button className={`w-full flex items-center justify-between py-4 px-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition`}>
            <div className="flex items-center gap-3">
              <Lock className="text-green-600" size={24} />
              <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t.backupSeed}</span>
            </div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>→</span>
          </button>
          <button className={`w-full flex items-center justify-between py-4 px-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition`}>
            <div className="flex items-center gap-3">
              <Lock className="text-blue-600" size={24} />
              <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t.changePIN}</span>
            </div>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>→</span>
          </button>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-100 to-blue-200'} rounded-2xl p-6`}>
        <div className="text-center">
          <Trophy className="text-blue-500 mx-auto mb-3" size={48} />
          <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Statistiques</h4>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
              <div className="text-3xl font-bold text-blue-600">{balance.toLocaleString()}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.sats} gagnés</div>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4`}>
              <div className="text-3xl font-bold text-blue-600">{completedModules.length}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.modules}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SendModal = () => {
    const handleScanQR = () => {
      alert(language === 'fr' ? 
        '📸 Fonction caméra à implémenter avec une bibliothèque comme html5-qrcode' : 
        language === 'en' ? 
        '📸 Camera function to implement with library like html5-qrcode' : 
        '📸 Fonction caméra bu def ak html5-qrcode'
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-md w-full`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.sendSats}</h3>
            <button 
              onClick={() => setShowSendModal(false)} 
              className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-2xl`}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t.amount}
              </label>
              <input 
                type="number" 
                placeholder="100"
                className={`w-full px-4 py-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold`}
              />
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Max: {balance} {t.sats}
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t.recipientAddress}
              </label>
              <textarea 
                placeholder={t.pasteAddress}
                rows="3"
                className={`w-full px-4 py-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none`}
              />
            </div>
            
            <button 
              onClick={handleScanQR}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <QrCode size={20} /> {t.scanQRCode}
            </button>
            
            <button className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition">
              {t.send} ⚡
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReceiveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 max-w-md w-full`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.receiveSats}</h3>
          <button 
            onClick={() => setShowReceiveModal(false)} 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-3xl font-bold leading-none`}
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-green-50 to-blue-50'} p-4 rounded-2xl`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-xl mb-3`}>
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                <QrCode size={56} className="text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{t.yourAddress}</div>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} px-3 py-2 rounded-lg text-xs font-mono break-all`}>
                cryptofaye@getalby.com
              </div>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              {t.amount} (optionnel)
            </label>
            <input 
              type="number" 
              placeholder="100"
              className={`w-full px-4 py-3 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-green-500 focus:outline-none text-lg font-semibold`}
            />
          </div>
          
          <button 
            onClick={() => setShowReceiveModal(false)}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition"
          >
            {t.shareLink} 🔗
          </button>
        </div>
      </div>
    </div>
  );

  // Wallet Creation Screens
  const WelcomeScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🪙</div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.welcomeTitle}</h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.welcomeSubtitle}</p>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-6 mb-6`}>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-center`}>{t.welcomeDesc}</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={startWalletCreation}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
            >
              {t.createWallet} ⚡
            </button>
            
            <button 
              onClick={startLogin}
              className={`w-full ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-4 rounded-xl font-semibold transition`}
            >
              {t.login} 🔑
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={20} />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'} rounded-lg text-sm font-semibold`}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="wo">🇸🇳 Wolof</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
            <button
              onClick={() => setDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NameScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <button
            onClick={goBack}
            className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
          >
            ← {t.backButton}
          </button>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👤</div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.yourName}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.nameDesc}</p>
          </div>
          
          <div className="mb-6">
            <input
              type="text"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder={t.enterYourName}
              className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-lg`}
              autoFocus
            />
          </div>
          
          <button
            onClick={proceedToSeedPhrase}
            disabled={tempUserName.trim().length < 2}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              tempUserName.trim().length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl'
            }`}
          >
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <button
            onClick={goBack}
            className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
          >
            ← {t.backButton}
          </button>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔑</div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.loginTitle}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.loginDesc}</p>
          </div>
          
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              {t.yourName}
            </label>
            <input
              type="text"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder={t.enterYourName}
              className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-lg`}
              autoFocus
            />
          </div>
          
          <button
            onClick={proceedToLoginSeed}
            disabled={tempUserName.trim().length < 2}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              tempUserName.trim().length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl'
            }`}
          >
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );

  const SeedPhraseScreen = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(seedPhrase.join(' ')).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
        <div className="max-w-2xl w-full">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
            <button
              onClick={goBack}
              className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
            >
              ← {t.backButton}
            </button>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔐</div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.seedPhraseTitle}</h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{t.seedPhraseDesc}</p>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 font-semibold text-center">{t.seedPhraseWarning}</p>
            </div>
            
            {!seedPhraseRevealed ? (
              <div className="text-center py-12">
                <button
                  onClick={() => setSeedPhraseRevealed(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
                >
                  👁️ {t.revealSeed}
                </button>
              </div>
            ) : (
              <>
                <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-900'} rounded-2xl p-6 mb-6`}>
                  <div className="grid grid-cols-3 gap-3">
                    {seedPhrase.map((word, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">{index + 1}</div>
                        <div className="text-white font-mono font-semibold">{word}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <button 
                    onClick={handleCopy}
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copied ? '✓ ' + t.seedCopied : '📋 ' + t.copySeed}
                  </button>
                </div>
                
                <button
                  onClick={proceedToVerification}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
                >
                  ✓ {t.haveSaved}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const VerificationScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
      <div className="max-w-2xl w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <button
            onClick={goBack}
            className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
          >
            ← {t.backButton}
          </button>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">✅</div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.verifyTitle}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.verifyDesc}</p>
          </div>
          
          <div className="space-y-6 mb-6">
            {verificationWords.map((item, index) => (
              <div key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-4`}>
                <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                  {t.word} #{item.position + 1}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => {
                        const newSelected = [...selectedVerificationWords];
                        newSelected[index] = option;
                        setSelectedVerificationWords(newSelected);
                      }}
                      className={`py-3 rounded-xl font-semibold transition ${
                        selectedVerificationWords[index] === option
                          ? 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'bg-gray-800 border-2 border-gray-600 text-gray-200 hover:border-blue-400'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={checkVerification}
            disabled={selectedVerificationWords.includes(null)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              selectedVerificationWords.includes(null)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl'
            }`}
          >
            {t.verifyButton} ✓
          </button>
        </div>
      </div>
    </div>
  );

  const LoginNameScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <button
            onClick={goBack}
            className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
          >
            ← {t.backButton}
          </button>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔑</div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.loginTitle}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.loginDesc}</p>
          </div>
          
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              {t.yourName}
            </label>
            <input
              type="text"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder={t.enterYourName}
              className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-lg`}
              autoFocus
            />
          </div>
          
          <button
            onClick={proceedToLoginSeed}
            disabled={tempUserName.trim().length < 2}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              tempUserName.trim().length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl'
            }`}
          >
            {t.next} →
          </button>
        </div>
      </div>
    </div>
  );

  const LoginSeedScreen = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
      <div className="max-w-2xl w-full">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <button
            onClick={goBack}
            className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
          >
            ← {t.backButton}
          </button>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.enterSeedPhrase}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.seedPhraseDesc}</p>
          </div>
          
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              {t.enterSeedPhrase}
            </label>
            <textarea
              value={loginSeedInput}
              onChange={(e) => setLoginSeedInput(e.target.value)}
              placeholder={t.seedPhrasePlaceholder}
              rows="4"
              className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-lg font-mono`}
              autoFocus
            />
            <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {loginSeedInput.trim().split(/\s+/).filter(w => w).length}/12 {language === 'fr' ? 'mots' : language === 'en' ? 'words' : 'baat'}
            </div>
          </div>
          
          <button
            onClick={completeLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
          >
            {t.connect} 🔑
          </button>
        </div>
      </div>
    </div>
  );

  const PinScreen = () => {
    const handlePinChange = (value, setter) => {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 4) {
        setter(numericValue);
      }
    };

    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'} flex items-center justify-center p-4`}>
        <div className="max-w-md w-full">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
            <button
              onClick={goBack}
              className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} font-semibold`}
            >
              ← {t.backButton}
            </button>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔢</div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.pinTitle}</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.pinDesc}</p>
            </div>
            
            <div className="space-y-6 mb-6">
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t.enterPin}</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value, setPin)}
                  className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-center text-3xl font-bold tracking-widest`}
                  placeholder="____"
                  autoComplete="off"
                />
                <div className={`text-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pin.length}/4 {language === 'fr' ? 'chiffres' : language === 'en' ? 'digits' : 'chiffres'}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t.confirmPinLabel}</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={confirmPin}
                  onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                  className={`w-full px-4 py-4 border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-xl focus:border-blue-500 focus:outline-none text-center text-3xl font-bold tracking-widest`}
                  placeholder="____"
                  autoComplete="off"
                />
                <div className={`text-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {confirmPin.length}/4 {language === 'fr' ? 'chiffres' : language === 'en' ? 'digits' : 'chiffres'}
                </div>
              </div>

              {pin.length === 4 && confirmPin.length === 4 && pin !== confirmPin && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 font-semibold text-sm">
                    {language === 'fr' ? '❌ Les codes PIN ne correspondent pas' : 
                     language === 'en' ? '❌ PINs do not match' : 
                     '❌ Code yi dañu ci wuute'}
                  </p>
                </div>
              )}

              {pin.length === 4 && confirmPin.length === 4 && pin === confirmPin && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-600 font-semibold text-sm">
                    {language === 'fr' ? '✓ Les codes PIN correspondent' : 
                     language === 'en' ? '✓ PINs match' : 
                     '✓ Code yi metti'}
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={finishWalletCreation}
              disabled={pin.length !== 4 || confirmPin.length !== 4}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                pin.length !== 4 || confirmPin.length !== 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl'
              }`}
            >
              {t.createWalletBtn} 🚀
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
          <div className="animate-bounce text-7xl mb-6">🎉</div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
            {t.congratulations} {userName} !
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{t.successDesc}</p>
          
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-green-50'} rounded-2xl p-6 mb-6`}>
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-green-600 mb-1">+100 sats</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.successBonus}</div>
          </div>
          
          <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-semibold mb-6`}>{t.successReady}</p>
          
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const ModuleViewer = () => {
    if (!currentModule) return null;

    const allQuestionsAnswered = currentModule.quiz ? 
      currentModule.quiz.every((_, index) => quizAnswers[index] !== undefined) : 
      false;

    let correctCount = 0;
    if (showQuizResults && currentModule.quiz) {
      currentModule.quiz.forEach((question, index) => {
        if (quizAnswers[index] === question.correct) {
          correctCount++;
        }
      });
    }
    const quizPassed = correctCount === currentModule.quiz?.length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen p-4 flex items-start justify-center py-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-4xl w-full shadow-2xl`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-t-3xl p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{currentModule.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentModule.title[language]}</h2>
                    <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>⏱️ {currentModule.duration}</p>
                  </div>
                </div>
                <button 
                  onClick={closeModuleViewer}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
              
              {/* Progress tabs */}
              <div className="flex gap-2 mt-4">
                <div className={`flex-1 py-2 rounded-lg text-center font-semibold transition ${
                  moduleProgress === 'video' ? 'bg-white text-blue-600' : isDarkMode ? 'bg-blue-700 bg-opacity-50' : 'bg-blue-400 bg-opacity-50'
                }`}>
                  📹 {t.watchVideo}
                </div>
                <div className={`flex-1 py-2 rounded-lg text-center font-semibold transition ${
                  moduleProgress === 'quiz' ? 'bg-white text-blue-600' : isDarkMode ? 'bg-blue-700 bg-opacity-50' : 'bg-blue-400 bg-opacity-50'
                }`}>
                  ✏️ Quiz
                </div>
                <div className={`flex-1 py-2 rounded-lg text-center font-semibold transition ${
                  moduleProgress === 'completed' ? 'bg-white text-blue-600' : isDarkMode ? 'bg-blue-700 bg-opacity-50' : 'bg-blue-400 bg-opacity-50'
                }`}>
                  ✅ {t.completed}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {moduleProgress === 'video' && currentModule.videoUrl && (
                <div className="space-y-6">
                  {/* Video */}
                  <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={currentModule.videoUrl}
                      title={currentModule.title[language]}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  {/* Transcript */}
                  {currentModule.transcript && (
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                        📄 {t.transcript}
                      </h3>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line`}>
                        {currentModule.transcript[language]}
                      </div>
                    </div>
                  )}

                  {/* Button to start quiz */}
                  {currentModule.quiz && (
                    <button
                      onClick={startQuiz}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
                    >
                      {t.startQuiz} →
                    </button>
                  )}
                </div>
              )}

              {moduleProgress === 'quiz' && currentModule.quiz && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{t.quizTitle}</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentModule.quiz.length} questions</p>
                  </div>

                  {currentModule.quiz.map((question, qIndex) => (
                    <div key={qIndex} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        {t.question} {qIndex + 1}: {question.question[language]}
                      </h4>
                      <div className="space-y-2">
                        {question.options[language].map((option, oIndex) => {
                          const isSelected = quizAnswers[qIndex] === oIndex;
                          const isCorrect = oIndex === question.correct;
                          const showResult = showQuizResults;

                          return (
                            <button
                              key={oIndex}
                              onClick={() => !showQuizResults && setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                              disabled={showQuizResults}
                              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                                showResult && isSelected && isCorrect ? 'bg-green-500 text-white' :
                                showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                                showResult && isCorrect ? 'bg-green-100 border-2 border-green-500 text-green-800' :
                                isSelected ? 'bg-blue-500 text-white' :
                                isDarkMode ? 'bg-gray-800 border-2 border-gray-600 text-gray-200 hover:border-blue-400' :
                                'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                              }`}
                            >
                              {showResult && isCorrect && '✓ '}
                              {showResult && isSelected && !isCorrect && '✗ '}
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!showQuizResults && (
                    <button
                      onClick={submitQuiz}
                      disabled={!allQuestionsAnswered}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                        !allQuestionsAnswered
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl'
                      }`}
                    >
                      {t.submitQuiz} ✓
                    </button>
                  )}

                  {showQuizResults && (
                    <div className={`rounded-2xl p-6 text-center ${
                      quizPassed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                    }`}>
                      <div className="text-5xl mb-3">{quizPassed ? '🎉' : '😢'}</div>
                      <h3 className={`text-2xl font-bold mb-2 ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                        {quizPassed ? t.quizPassed : t.quizFailed}
                      </h3>
                      <p className="text-lg mb-4">
                        {t.correctAnswers}: {correctCount}/{currentModule.quiz.length}
                      </p>
                      {!quizPassed && (
                        <button
                          onClick={() => {
                            setQuizAnswers({});
                            setShowQuizResults(false);
                          }}
                          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition"
                        >
                          {t.tryAgain}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {moduleProgress === 'completed' && (
                <div className="text-center py-12">
                  <div className="text-7xl mb-6 animate-bounce">🎉</div>
                  <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-3`}>{t.moduleCompleted}</h3>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-yellow-50 to-blue-50'} rounded-2xl p-6 mb-6 inline-block`}>
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-blue-600">+{currentModule.reward} {t.sats}</div>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.rewardEarned}</div>
                  </div>
                  <button
                    onClick={closeModuleViewer}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition"
                  >
                    {t.backToAcademy} 📚
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!hasWallet ? (
        <>
          {onboardingStep === 'welcome' && <WelcomeScreen />}
          {onboardingStep === 'name' && <NameScreen />}
          {onboardingStep === 'login' && <LoginScreen />}
          {onboardingStep === 'loginSeed' && <LoginSeedScreen />}
          {onboardingStep === 'seedphrase' && <SeedPhraseScreen />}
          {onboardingStep === 'verify' && <VerificationScreen />}
          {onboardingStep === 'pin' && <PinScreen />}
          {onboardingStep === 'success' && <SuccessScreen />}
        </>
      ) : (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'}`}>
          <div className="mx-auto p-4 pb-24 w-full px-8 max-w-[1400px]">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🪙</div>
                  <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>CryptoFaye</h1>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Senegal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-4 py-2 rounded-full shadow-lg`}>
                    <span className="text-2xl">⚡</span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{balance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg`}
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                </div>
              </div>
            </div>

            {activeTab === 'home' && <HomePage />}
            {activeTab === 'wallet' && <WalletPage />}
            {activeTab === 'academy' && <AcademyPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </div>

          <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-lg`}>
            <div className="mx-auto w-full px-8 max-w-[1400px] flex justify-around py-2">
              {[
                { id: 'home', icon: Home, label: t.home },
                { id: 'wallet', icon: Wallet, label: t.wallet },
                { id: 'academy', icon: BookOpen, label: t.academy },
                { id: 'profile', icon: User, label: t.profile }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition ${
                    activeTab === tab.id 
                      ? 'text-blue-600' 
                      : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <tab.icon size={24} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {showSendModal && <SendModal />}
          {showReceiveModal && <ReceiveModal />}
          {showModuleViewer && <ModuleViewer />}
        </div>
      )}
    </>
  );
};

export default function App() {
  return <CryptoFayeSenegal />;
}