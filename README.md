# TODO:

add import deck ability

  Add a delimiter TextInput field that defaults to ' - '

  requires accessing the downloads folder or whatever folder the app can get access to

add edit mode toggle in deck list view

  add edit deck ability - goes to import but any cards that match the current terms will replace the old cards

  add delete deck

add edit mode for cards in study session mode

  allow to edit term and definition

add a light/dark mode toggle to the settings

add sqlite storage for app settings and decks

add ability to create new deck within the app itself

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


# React Native Starter 🚀

[View Demo](https://play.google.com/store/apps/details?id=com.reactnativestarter.upd) | [Download](https://github.com/flatlogic/react-native-starter.git) | [More templates](https://flatlogic.com/templates) | [Support forum](https://flatlogic.com/forum)

*You're viewing the new and updated version of React Native Starter, previous version can be found under the [v1 branch](https://github.com/flatlogic/react-native-starter/tree/v1)*

A powerful React Native starter template that bootstraps the development of your mobile application, handy for [business software](https://flatlogic.com/) projects.React Native Starter is a mobile application template with lots of built-in components like sidebar, navigation, form elements, etc - all you need to start building your mobile app faster.

![React Native Starter](https://i.imgur.com/vcz4bU6.png)

<a href='https://play.google.com/store/apps/details?id=com.reactnativestarter.upd'><img width="200" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>
<a href='https://play.google.com/store/apps/details?id=com.reactnativestarter.upd'><img width="200" alt='Download on App Store' src='https://i.imgur.com/7IxtMV0.png'/></a>

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
git clone https://github.com/flatlogic/react-native-starter.git

# Navigate to clonned folder and Install dependencies
cd react-native-starter && yarn install

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

That's it! Cool, right?

## Documentation

Our handy documentation can be found on official RNS website: https://docs.reactnativestarter.com 

## Contributing

If you find any problems, please [open an issue](https://github.com/flatlogic/react-native-starter/issues/new) or submit a fix as a pull request.

## Want more?

We have a premium version of this mobile application template that saves you even more time and money and comes with advanced features:
- Premium RED color scheme
- More than 5 additional screens (such as chat, profile, product item, etc.)
- Contains an extended charting library to visualize all the data you need
- Premium support and updates included
- Much, much more..

Read more and purchase it at https://reactnativestarter.com

## Support
For any additional information please go to our [**support forum**](https://flatlogic.com/forum) and raise your questions or feedback provide there. We highly appreciate your participation!

## How can I support developers?
- Star our GitHub repo :star:
- [Tweet about it](https://twitter.com/intent/tweet?text=Amazing%20Mobile%20Application%20Template%20built%20with%20React%20Native!&url=https://github.com/flatlogic/react-native-starter&via=flatlogic).
- Create pull requests, submit bugs, suggest new features or documentation updates :wrench:
- Follow [@flatlogic on Twitter](https://twitter.com/flatlogic).
- Subscribe to React Native Starter newsletter at [reactnativestarter.com](https://reactnativestarter.com/)
- Like our page on [Facebook](https://www.facebook.com/flatlogic/) :thumbsup:

## More from Flatlogic
- [✔️Awesome Bootstrap Checkboxes & Radios](https://github.com/flatlogic/awesome-bootstrap-checkbox) - Pure css way to make inputs look prettier
- [💥Sing App Dashboard](https://github.com/flatlogic/sing-app) - Free and open-source admin dashboard template built with Bootstrap 4 

## License

[Mozilla Public License 2.0](LICENSE)
