# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://www.youtube.com/watch?v=UFIzxoMBEbc) instructions till "Creating a new application" step, before proceeding.

## Step 1: Installing the packages

### React Navigation
>**Note**: You can also follow this detailed tutorial  [React Native - Setting up Navigation](https://www.youtube.com/watch?v=pyWIzdYB2Xk&t) for setting up react-navigation.

```bash
# using npm
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# OR using Yarn
yarn add @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

### Additional dependencies for navigation
```bash
# using npm
npm install react-native-gesture-handler react-native-safe-area-context react-native-screens

# using yarn
yarn add react-native-gesture-handler react-native-safe-area-context react-native-screens
```

### Zego Installation
```bash
# using npm
npm install @zegocloud/zego-uikit-prebuilt-call-rn@6.2.3

# using yarn
yarn add @zegocloud/zego-uikit-prebuilt-call-rn@6.2.3
```

#### Other packages
```bash
# using npm
npm install @zegocloud/zego-uikit-rn@latest react-delegate-component zego-express-engine-reactnative@3.14.5 react-native-sound react-native-keep-awake@4.0.0 react-native-screens react-native-safe-area-context react-native-encrypted-storage react-native-device-info

# using yarn
yarn add @zegocloud/zego-uikit-rn@latest react-delegate-component zego-express-engine-reactnative@3.14.5 react-native-sound react-native-keep-awake@4.0.0 react-native-screens react-native-safe-area-context react-native-encrypted-storage react-native-device-info
```

>**Note**: Don't forget to add this package
```bash
# using npm
npm install zego-zim-react-native

# using yarn
yarn add zego-zim-react-native
```




## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
