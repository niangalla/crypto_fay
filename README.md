Voici une version Markdown du **README** pour ton projet **CryptoFaye Senegal**, au ton naturel, clair et professionnel — adaptée pour une soumission sur **Devpost (Dakar Bitcoin Hackathon)** :

---

# CryptoFaye Senegal

### Apprends Bitcoin et le Lightning Network en Wolof, Français et Anglais — tout en gagnant des satoshis

---

## Description

**CryptoFaye Senegal** est une application éducative et financière conçue pour favoriser l’inclusion financière au Sénégal grâce à **Bitcoin** et au **Lightning Network**.
Elle combine un **parcours d’apprentissage interactif** et un **portefeuille non-custodial**, permettant aux utilisateurs d’apprendre tout en gagnant de petites récompenses en satoshis.

L’objectif du projet est de rendre Bitcoin accessible, compréhensible et utile au plus grand nombre — notamment aux jeunes et aux non-bancarisés — en supprimant les barrières linguistiques et techniques.

---

## Contexte et problématique

Au Sénégal, une grande partie de la population reste non bancarisée et dépend encore des services de transfert coûteux.
Les concepts autour de Bitcoin sont souvent perçus comme complexes ou réservés à une élite technologique.

CryptoFaye Senegal répond à ces défis par une approche **éducative, locale et interactive** :

* Apprentissage en Wolof, Français et Anglais.
* Interface simple et mobile-first.
* Récompenses symboliques en satoshis pour encourager la progression.

---

## Solution proposée

### 1. Création de portefeuille

* Génération d’une phrase secrète (12 mots) non-custodiale.
* Vérification et sauvegarde locale.
* Sécurisation par un code PIN à 4 chiffres.

### 2. Académie Bitcoin

* Modules pédagogiques en vidéo.
* Quiz interactifs pour valider les acquis.
* Récompenses en satoshis pour chaque module complété.

### 3. Transactions Lightning

* Envoi et réception de satoshis via adresse Lightning.
* Génération de factures et QR codes.
* Historique des transactions.

### 4. Accessibilité et personnalisation

* Interface en trois langues : Français, Wolof, Anglais.
* Mode clair / sombre.
* Application responsive pensée pour mobile.

---

## Stack technique

| Composant             | Description                       |
| --------------------- | --------------------------------- |
| **Framework**         | React                             |
| **Style**             | Tailwind CSS                      |
| **Icônes**            | lucide-react                      |
| **Langues**           | i18n intégré (FR / WO / EN)       |
| **Stockage**          | Local state / LocalStorage        |
| **Lightning (prévu)** | Intégration GetAlby ou LNbits API |

---

## Fonctionnalités principales

* Portefeuille Bitcoin Lightning non-custodial.
* Modules d’apprentissage progressifs avec quiz.
* Récompenses en satoshis pour chaque réussite.
* Interface trilingue et accessible.
* Sécurité par seed phrase et PIN.
* Tableau de progression et suivi des récompenses.

---

## Impact au Sénégal

CryptoFaye Senegal vise à :

* Promouvoir **l’inclusion financière** grâce à Bitcoin.
* Sensibiliser les jeunes aux outils numériques et monétaires modernes.
* Valoriser les **langues locales** comme moyen d’éducation technologique.
* Réduire la dépendance aux services de transfert traditionnels.

---

## Installation et utilisation (local)

```bash
# Cloner le projet
git clone https://github.com/<votre-repo>/cryptofaye-senegal.git
cd cryptofaye-senegal

# Installer les dépendances
npm install

# Lancer le serveur local
npm run dev
```

Ouvrir ensuite [http://localhost:5173](http://localhost:5173) dans le navigateur.

---

## Roadmap

* Intégration réelle avec API Lightning (GetAlby ou LNbits).
* Chiffrement local de la phrase secrète.
* Version mobile progressive (PWA).
* Ajout de mini-jeux éducatifs sur Bitcoin.
* Faucet testnet pour simuler de vraies transactions.

---

## Conformité aux critères du hackathon

| Critère           | Contribution du projet                                            |
| ----------------- | ----------------------------------------------------------------- |
| **Innovation**    | Plateforme éducative Bitcoin trilingue avec portefeuille intégré. |
| **Impact local**  | Inclusion financière et éducation en Wolof.                       |
| **Utilité**       | Apprentissage accessible et pratique du Bitcoin.                  |
| **Mise en œuvre** | Application React fonctionnelle et responsive.                    |
| **Design**        | Interface moderne, claire et adaptée aux mobiles.                 |

---

## Licence

Projet open source sous licence **MIT**.
Libre d’utilisation et de modification à des fins éducatives et communautaires.
