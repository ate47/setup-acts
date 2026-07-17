import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';
import * as exec from '@actions/exec';

interface AtianCodToolsConfig {
    cli: {
        showTitle: boolean;
    };
    updater: {
        disabled: boolean;
    };
}

async function run() {
    try {
        const version = core.getInput('version', {required: true});
        const downloadHashes = core.getBooleanInput('hashindex', {
            required: false
        }) || false;

        // for the latest version, we need to specify it reverse
        const urlPath =
            version === 'latest' ? 'latest/download' : `download/${version}`;

        const url = `https://github.com/ate47/atian-cod-tools/releases/${urlPath}/acts.zip`;
        core.info(`Downloading ${url}`);

        const zipPath = await tc.downloadTool(url);
        const extracted = await tc.extractZip(zipPath);

        const installDir = path.join(process.env['HOME'] || '', '.local');
        fs.mkdirSync(installDir, {recursive: true});

        core.info(`Installing to ${installDir}`);
        fs.cpSync(extracted, installDir, {recursive: true});

        const actsPathDir = path.join(installDir, 'acts', 'bin');

        core.addPath(actsPathDir);
        core.setOutput("acts-path", actsPathDir);

        core.info(`AtianCodTools version ${version} installed successfully`);

        // we write the default config to disable the updater (it would be dumb to run it twice)
        const actsConfig: AtianCodToolsConfig = {
            cli: {
                showTitle: true
            },
            updater: {
                disabled: true
            }
        };

        fs.writeFileSync(
            path.join(actsPathDir, 'acts.json'),
            JSON.stringify(actsConfig, null, 4)
        );

        if (downloadHashes) {
            await exec.exec(path.join(actsPathDir, 'acts.exe'), ['download_hash_index']);
            core.info('Hash index downloaded successfully');
        }
    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
