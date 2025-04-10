# TODO:

## MVP

cleanup git history

## Rest

add edit mode toggle in deck list view

  add edit deck ability - goes to import but any cards that match the current terms will replace the old cards

add edit mode for cards in study session mode

  allow to edit term and definition

add a light/dark mode toggle to the settings

add sqlite storage for app settings

address warnings and errors in console from various actions - also shown as popup at bottom of the app

  its all in my dependencies - updating dependencies may fix it, but thats a large effort

# Marketing

Study Sama

From laptop to phone flashcards

Take notes in class on your laptop and quickly upload them to Flashcard Link to start studying now!

# Check if you have all dependencies

npx react-native doctor

# Running

npx react-native start

then input a or i for android or ios

OR

npx react-native run-android

npx react-native run-ios

## Running with reset cache

npx react-native start --reset-cache

# Very detailed logs

npx react-native log-android

npx react-native log-ios

## NOTE: console.log should appear without this in the main running terminal. if it doesnt, then use one of these and it will start to show, then you can stop the details logs

<!-- <a href='https://play.google.com/store/apps/details?id=com.studysama.upd'><img width="200" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a> -->
<!-- <a href='https://play.google.com/store/apps/details?id=com.studysama.upd'><img width="200" alt='Download on App Store' src='https://i.imgur.com/7IxtMV0.png'/></a> -->

## What's inside

- Always up-to-date React Native scaffolding
- UI/UX Design from industry experts
- Modular and well-documented structure for application code
- Redux for state management
- React Navigation for simple navigation
- Disk-persisted application state caching
- More than 16 Ready-to-use Pages

## Getting Started

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://github.com/majorziploc/flashcards_app.git

# Navigate to clonned folder and Install dependencies
cd flashcards_app && yarn install

# Install Pods
cd ios && pod install
```

#### 2. Open RNS in your iOS simulator

Run this command to start the development server and to start your app on iOS simulator:
```
yarn run:ios
```

Or, if you prefer Android:
```
yarn run:android
```
