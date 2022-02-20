The prject is a minimalistic setup of a one-way AMM ie a smart contract enabling distribution
of FA1.2 and FA2 compatible tokens in exchange of native ones.

The repository is a monorepo containing frontend, contracts and infrastucture code.

## Frontend

Frontend is built as a one-page React app communicating with smart contracts via the `taquito` library.

To launch the frontend locally: 

in the `web` directory run the script:

`./run-web-app.sh`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Below are a few more standard React commands for testing and debugging.

`yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

`yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Smart contracts

### Core
The Core smart contract contains AMM functionality and enables holding FA1.2, FA2 and native tokens on it's balance as well as exchanging those according to built-in algorithm.

The code is in the `contracts/core` directory 

More info on different types of AMM could be found 
here: https://opentezos.com/defi/dexs/#different-types-of-amm
and here: http://mason.gmu.edu/~rhanson/mktscore.pdf

### FA-compatible tokens
The directory `contracts/tokens` contains the smart cintracts code for the non-native assets.