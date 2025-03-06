console.log("Registering root component");

import { registerRootComponent } from "expo";
import App from "../App";

console.log("Importing App component");

registerRootComponent(App);

console.log("App component registered");
