export default {
  "expo": {
    "name": "potenzo-app",
    "slug": "potenzo-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/images/icon.png",
    "scheme": "potenzoapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.potenzo.app",
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./src/assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./src/assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-datadog",
        {
          "apiKey": process.env.DATADOG_API_KEY,
          "appKey": process.env.DATADOG_APP_KEY,
          "site": process.env.DATADOG_SITE || "eu1.datadoghq.com",
          "service": process.env.DATADOG_SERVICE || "potenzo-app",
          "env": process.env.DATADOG_ENV || "local",
          "uploadDsyms": false
        }
      ],
      "expo-web-browser"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "00735ae6-3cdc-4aca-a8f9-f57843391a30"
      },
      "datadogApiKey": process.env.DATADOG_API_KEY,
      "datadogAppKey": process.env.DATADOG_APP_KEY,
      "datadogSite": process.env.DATADOG_SITE || "eu1.datadoghq.com",
      "datadogService": process.env.DATADOG_SERVICE || "potenzo-app",
      "datadogEnv": process.env.DATADOG_ENV || "local",
      "nodeEnv": process.env.NODE_ENV || "development"
    }
  }
}