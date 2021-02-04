# TzSign (front-end)

```diff
- The project is under active development, use at your own discretion.
```

TzSign is the first Tezos multisig web wallet developed by Attic Lab and based on the TQ’s multisig contract. TzSign allows you to create and send transactions, delegations and will also provide the vesting functionality.

The wallet supports Beacon authentication and currently runs on the Delphi testnet.

This is a repo of the front-end part of the project.

## How to run

[Yarn](https://yarnpkg.com/) is a default package manager of the project, therefore install it in advance.

Clone the repo and run `yarn` or `yarn install` from the folder of the project to install all the necessary dependencies.

The project needs some configuration of the .env file. Visit the [official Create React App docs](https://create-react-app.dev/docs/adding-custom-environment-variables/) for more info on .env files. The .env file must have the
following variables set:

`REACT_APP_API_URL="http://exmaple.one"`  
`REACT_APP_TEZOS_NETWORK="example-tezos-network"`

`REACT_APP_API_URL` variable should contain a URL of a back-end API as it is used all over the project. Otherwise, all the
HTTP requests will fail. Visit the [back-end repo](https://github.com/atticlab/tezosign) for more details of
the API used in this project.

`REACT_APP_TEZOS_NETWORK` variable should contain a name of a Tezos network. It can be one of testnets or a `mainnet`.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React AppWrapper documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web AppWrapper

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
