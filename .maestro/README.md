# Maestro E2E Tests

This directory contains end-to-end (E2E) tests for the Potenzo app using Maestro.

## Test Flows

### `splash-screen.yml`
Tests the basic app launch and main splash screen elements:
- App launches successfully
- Main title "Unlock Your Potential." is visible
- Subtitle "Train anywhere. Eat smart. Win every day." is visible
- "Get Started" button is visible
- Terms and conditions text is visible
- App description is visible

### `settings-screen.yml`
Tests the complete user flow from splash to settings:
- App launches and shows splash screen
- User can tap "Get Started" to navigate to settings
- Settings screen shows expected content:
  - "Settings" title
  - "Consent Status" section
  - "Website & Legal" section
  - Terms and analytics tracking information

### `terms-acceptance.yml`
Tests the terms acceptance functionality:
- App launches and shows splash screen
- "Get Started" button is initially disabled
- User can accept terms and conditions
- After accepting terms, user can proceed to settings

## Running Tests Locally

### Prerequisites
1. Maestro CLI is installed
2. Have an Android emulator or iOS simulator running
3. Build and install your app on the emulator/simulator

### Commands
```bash
# Run all E2E tests
npm run test:e2e

# Or use Maestro CLI directly
maestro test .maestro/splash-screen.yml
maestro test .maestro/settings-screen.yml
maestro test .maestro/terms-acceptance.yml
```

## Running Tests on EAS

The E2E tests are configured to run automatically on pull requests using EAS Workflows:

- **Android**: `.eas/workflows/e2e-test-android.yml`
- **iOS**: `.eas/workflows/e2e-test-ios.yml`

## Running Tests Locally

`curl -Ls "https://get.maestro.mobile.dev" | bash`
Add it to path
```
# MAESTRO
export PATH="$PATH":"$HOME/.maestro/bin" && maestro --version
```

[More here](https://docs.expo.dev/eas/workflows/reference/e2e-tests/#run-maestro-tests-locally-optional)

The E2E tests are configured to run automatically on pull requests using EAS Workflows:

- **Android**: `.eas/workflows/e2e-test-android.yml`
- **iOS**: `.eas/workflows/e2e-test-ios.yml`

### Manual Execution
```bash
# Run Android E2E tests on EAS
npx eas-cli@latest workflow:run .eas/workflows/e2e-test-android.yml

# Run iOS E2E tests on EAS
npx eas-cli@latest workflow:run .eas/workflows/e2e-test-ios.yml
```

## App Configuration

The tests are configured for the app ID: `com.potenzo.app`

Make sure this matches your app's bundle identifier in `app.json`.

## Troubleshooting

1. **Tests fail on text matching**: Ensure the text in the test flows matches exactly what's displayed in your app
2. **App not launching**: Make sure the app is installed and the app ID is correct
3. **Element not found**: Check that accessibility labels are properly set in your React Native components

## Adding New Tests

1. Create a new `.yml` file in the `.maestro/` directory
2. Follow the Maestro syntax: https://maestro.mobile.dev/flow/grammar
3. Add the new test to the workflow files if you want it to run on EAS
4. Update this README with documentation for the new test 