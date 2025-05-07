// scripts/rollup/dev.config.js
import reactDomConfig from "./react-dom.config";
import reactConfig from "./react.config";

export default [...reactConfig, ...reactDomConfig];
