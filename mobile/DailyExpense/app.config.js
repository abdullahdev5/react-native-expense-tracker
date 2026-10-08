module.exports = {
  expo: {
    name: "DailyExpense",
    slug: "DailyExpense",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png",

    scheme: ["dailyexpense", `fb${process.env.FACEBOOK_APP_ID}`],

    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/icons/ios-app.icon",
      bundleIdentifier: "com.abdullah.dailyexpense",
    },
    android: {
      package: "com.abdullah.dailyexpense",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage:
          "./assets/icons/android-app.icon/android-icon-foreground.png",
        backgroundImage:
          "./assets/icons/android-app.icon/android-icon-background.png",
        monochromeImage:
          "./assets/icons/android-app.icon/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "single",
      // favicon: "./assets/images/favicon.png"
    },
    plugins: [
      // "expo-router",
      // [
      //   "expo-splash-screen",
      //   {
      //     "backgroundColor": "#208AEF",
      //     "image": "./assets/images/splash-icon.png",
      //     "imageWidth": 76
      //   }
      // ],
      "expo-sharing",
      [
        "expo-file-system",
        {
          supportsOpeningDocumentsInPlace: true,
          enableFileSharing: true,
        },
      ],
      "expo-localization",
      "@react-native-google-signin/google-signin",
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.FACEBOOK_APP_ID,
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          displayName: "DailyExpense",
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
        },
      ],
    ],
    experiments: {
      // typedRoutes: true,
      reactCompiler: true,
    },
  },
};
