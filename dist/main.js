"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const exec = __importStar(require("@actions/exec"));
async function run() {
    try {
        const version = core.getInput('version', { required: true });
        const downloadHashes = core.getBooleanInput('hashindex', {
            required: false
        }) || false;
        // for the latest version, we need to specify it reverse
        const urlPath = version === 'latest' ? 'latest/download' : `download/${version}`;
        const url = `https://github.com/ate47/atian-cod-tools/releases/${urlPath}/acts.zip`;
        core.info(`Downloading ${url}`);
        const zipPath = await tc.downloadTool(url);
        const extracted = await tc.extractZip(zipPath);
        const installDir = path.join(process.env['HOME'] || '', '.local');
        fs.mkdirSync(installDir, { recursive: true });
        core.info(`Installing to ${installDir}`);
        fs.cpSync(extracted, installDir, { recursive: true });
        const actsPathDir = path.join(installDir, 'acts', 'bin');
        core.addPath(actsPathDir);
        core.setOutput("acts-path", actsPathDir);
        core.info(`AtianCodTools version ${version} installed successfully`);
        // we write the default config to disable the updater (it would be dumb to run it twice)
        const actsConfig = {
            cli: {
                showTitle: true
            },
            updater: {
                disabled: true
            }
        };
        fs.writeFileSync(path.join(actsPathDir, 'acts.json'), JSON.stringify(actsConfig, null, 4));
        if (downloadHashes) {
            await exec.exec(path.join(actsPathDir, 'acts.exe'), ['download_hash_index']);
            core.info('Hash index downloaded successfully');
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
