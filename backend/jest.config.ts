//1.why we need it

import type {Config} from "jest";
import {createDefaultEsmPreset} from "ts-jest"

const presetConfig = createDefaultEsmPreset();

const config: Config = {
    ...presetConfig,
    testEnvironment:"node",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
},
};


export default config;