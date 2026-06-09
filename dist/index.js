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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const exec = __importStar(require("@actions/exec"));
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const bicep_rpc_client_1 = require("@azure/bicep-rpc-client");
async function main() {
    try {
        core.info(`::add-matcher::${path_1.default.join(__dirname, 'bicep-problem-matcher.json')}`);
        const platform = os_1.default.platform();
        const arch = os_1.default.arch();
        const version = core.getInput('version') || undefined;
        const downloadUrl = await bicep_rpc_client_1.Bicep.getDownloadUrl(version, platform, arch);
        core.info(`Downloading bicep from '${downloadUrl}'`);
        const downloadFile = await tc.downloadTool(downloadUrl);
        core.info(`Downloaded bicep to ${downloadFile}`);
        const targetFile = platform === 'win32' ? 'bicep.exe' : 'bicep';
        const toolPath = await tc.cacheFile(downloadFile, targetFile, 'bicep', version || 'latest', arch);
        const bicepPath = path_1.default.join(toolPath, targetFile);
        // make bicep executable
        await promises_1.default.chmod(bicepPath, 0o755);
        // add bicep to PATH
        core.addPath(toolPath);
        // print bicep version info
        await exec.exec('bicep', ['--version']);
        core.info(`Installed bicep to ${bicepPath}`);
    }
    catch (e) {
        core.setFailed(`${e}`);
    }
}
main();
//# sourceMappingURL=index.js.map