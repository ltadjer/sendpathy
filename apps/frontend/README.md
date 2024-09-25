# Sendpathy Vite/Vue

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/docs/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://v3.vuejs.org/)
[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)

[![docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

![vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

[![Prettier](https://img.shields.io/badge/Prettier-1B2B34?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![Prettier](https://img.shields.io/badge/ESLINT-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)



## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a installed [Docker](https://docs.docker.com/get-docker/)
- You have a installed [Docker compose](https://docs.docker.com/compose/)
- You have installed [Just]()
- [Ionic CLI](https://ionicframework.com/docs/cli) (If you're using this, you can skip the next step)
- Install ESlint
- Install Prettier

> it is recommended to set tabSize to 2

if you want to run the project without docker
- You have installed the latest version of [Node.js and pnpm](https://nodejs.org/en/download/)
- You have installed the last version of Nest.js CLI `pnpm i -g @nestjs/cli`

## Run project locally
> Create a .env file at the root of the project and fill it with the .env.example file

With docker and justfile
```bash
  just front dev
```

Manually with pnpm
```bash
  pnpm install
  pnpm run dev
```

Using Ionic CLI
```shell
$ ionic dev
```

### Running on iOS (Mac OS only)

This bit **REQUIRES** you to use Mac OS, with Xcode installed.  
In order to setup your Xcode environment, you can follow [this documentation, provided by the Ionic Team](https://ionicframework.com/docs/developing/ios).

Once your environment is set up, you can run the app on your iOS simulated device by using this command:

```shell
$ ionic capacitor run ios
```

### Running on Android

This bit **REQUIRES** you to have Android Studio installed.  
In order to setup your Android Studio environment, you can follow [this documentation, provided by the Ionic Team](https://ionicframework.com/docs/developing/android).

Once your environment is set up, you can run the app on either your own Android device or your Android emulated device by using this command:

```shell
$ ionic capacitor run android
```


## Building the app

You will need to use Ionic CLI to build for ios and android:
```shell
$ ionic capacitor build
```
This will create `/ios` and `/android` folders.


### Only iOS

1. **Switch to the up-to-date branch**: Ensure you are on the latest branch.
2. **Verify `.env` file**: Make sure your `.env` file is correctly configured.
3. **Build the app**: Run the following command to build the app:
    ```shell
    $ ionic capacitor build ios
    ```
4. **Open Xcode**: After the build, Xcode will open automatically.
5. **Archive the build**:
  - In Xcode, go to the menu `Product > Archive`.
  - Ensure the build version is correct in the `General` (1.1.12 for example).
6. **Distribute the archive**: Follow the prompts to distribute the archive.

### Only Android

1. **Switch to the up-to-date branch**: Ensure you are on the latest branch.
2. **Verify `.env` file**: Make sure your `.env` file is correctly configured.
3. **Build the app**: Run the following command to build the app:
    ```shell
    $ ionic capacitor build android
    ```
4. **Open Android Studio**: After the build, Android Studio will open automatically.
5. **Check the `FileProvider` configuration**: Ensure the `FileProvider` configuration is set to `androidx.core.content.FileProvider `.
6. **Generate APK or AAB**:
  - To generate an APK, go to the menu `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
  - To generate a signed AAB, go to the menu `Build > Build Signed Bundle / APK...`.
  - **Note**: You will need a `.jks` file for signing the .aab.

## Running tests

If you want to run unit and end-to-end test, you can use either npm.

Using npm:
```shell
$ npm run test:unit # For unit testing
$ npm run test:e2e # For end-to-end testing
```

## 7. Running lint

ESLint runs by default in real-time when the app is running; you still can run it with npm.

Using npm:
```shell
$ npm run lint
```

## 8. Keeping the codebase clean

In order to maintain a certain code quality, you have to make sure that the syntax is respected across the repository.  
In order to ensure that, you can use Prettier, either with npm or with Make. If you're using Make, the prettied up code will automatically be committed to your branch; be careful with using that.

Using npm:
```shell
$ npm run prettier
$ # You'll have to manually add and commit files
```

## Commit message convention
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Authors
- [Liticia Tadjer](https://github.com/ltadjer)

## License

This project is proprietary and confidential. Code duplication and re-use without explicit permission is not allowed.