import os from 'os';
import fs from 'fs';
import path from 'path';
import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { issueCommand } from '@actions/core/lib/command';
import { Bicep } from 'bicep-node';

async function main() {
  try {
    issueCommand('add-matcher', {} , path.join(__dirname, 'bicep-problem-matcher.json'));

    const platform: string = os.platform();
    const arch: string = os.arch();
    const version = core.getInput('version') || undefined;

    const downloadUrl = await Bicep.getDownloadUrl(version, platform, arch);

    core.info(`Downloading bicep from '${downloadUrl}'`);
    const downloadFile = await tc.downloadTool(downloadUrl);
    core.info(`Downloaded bicep to ${downloadFile}`);

    const targetFile = platform === 'win32' ? 'bicep.exe' : 'bicep';
    const toolPath = await tc.cacheFile(downloadFile, targetFile, 'bicep', version || 'latest', arch);
    const bicepPath = path.join(toolPath, targetFile);

    // make bicep executable
    await fs.promises.chmod(bicepPath, 0o755);

    // add bicep to PATH
    core.addPath(toolPath);

    // print bicep version info
    await exec.exec('bicep', ['--version']);

    core.info(`Installed bicep to ${bicepPath}`);
  } catch (e) {
    issueCommand('remove-matcher', {owner: 'bicep'}, '');
    core.setFailed(`${e}`);
  }
}

main();
