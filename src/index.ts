import os from 'os';
import fs from 'fs';
import path from 'path';
import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { issueCommand } from '@actions/core/lib/command';

function getDownloadUrl(osPlat: string, osArch: string, version: string): string {
  let basePath;
  if (version) {
    basePath = `https://github.com/Azure/bicep/releases/download/${version}`;
  } else {
    basePath = `https://github.com/Azure/bicep/releases/latest/download`;
  }

  switch (`${osPlat}_${osArch}`) {
    case 'win32_x64': return `${basePath}/bicep-win-x64.exe`;
    case 'linux_x64': return `${basePath}/bicep-linux-x64`;
    case 'darwin_x64': return `${basePath}/bicep-osx-x64`;
    default: throw `Bicep CLI is not available for platform ${osPlat} and architecture ${osArch}`;
  }
}

async function main() {
  try {
    issueCommand('add-matcher', {} , path.join(__dirname, 'bicep-problem-matcher.json'));

    const osPlat: string = os.platform();
    const osArch: string = os.arch();
    const version = core.getInput('version');

    const downloadUrl = getDownloadUrl(osPlat, osArch, version);

    core.info(`Downloading bicep from '${downloadUrl}'`);
    const downloadFile = await tc.downloadTool(downloadUrl);
    core.info(`Downloaded bicep to ${downloadFile}`);

    const targetFile = osPlat === 'win32' ? 'bicep.exe' : 'bicep';
    const toolPath = await tc.cacheFile(downloadFile, targetFile, 'bicep', version, osArch);
    const bicePath = path.join(toolPath, targetFile);

    // make bicep executable
    await fs.promises.chmod(bicePath, 0o755);

    // add bicep to PATH
    core.addPath(toolPath);

    // print bicep version info
    await exec.exec('bicep', ['--version']);

    core.info(`Installed bicep to ${bicePath}`);
  } catch (e) {
    issueCommand('remove-matcher', {owner: 'bicep'}, '');
    core.setFailed(`${e}`);
  }
}

main();