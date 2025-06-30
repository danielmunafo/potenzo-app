# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Contributing

To contribute to this repository, follow these steps:

### Commiting

Checkout a branch from `main`
For commiting run: `yarn commit`

### Releasing to Main

`git checkout main`

`git merge <your-branch>`

`yarn release`

`git push --follow-tags origin main`

### Install on local device

The devices and local development server have to be in the same network.

**Android**
Connect the device on USB, make sure to have developer tools enabled in the device.
`yarn android:dev-client`
`adb install /Users/danieltostes/workspace/potenzo-app/build-****`
`yarn start:local-device`

**iOS**
The same for ios with exception that it should connect manually to the host and they have to be in the same network.
`yarn ios:dev-client`

> The generated build should be installed via Xcode->Window->Devices And Simulators-> + (find your .ipa) install
> `yarn start:local-device`

### Sentry

Always run `eas-update` before trying to run a preview/production build and upload the source files properly with `npx sentry-expo-upload-sourcemaps dist` (to do that the environment variable `SENTRY_AUTH_TOKEN` has to be set in the terminal)
Then run the build and be happy
