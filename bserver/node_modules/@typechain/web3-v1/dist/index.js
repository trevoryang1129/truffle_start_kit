"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const typechain_1 = require("typechain");
const codegen_1 = require("./codegen");
const DEFAULT_OUT_PATH = './types/web3-v1-contracts/';
class Web3V1 extends typechain_1.TypeChainTarget {
    constructor(config) {
        super(config);
        this.name = 'Web3-v1';
        const { cwd, outDir } = config;
        this.outDirAbs = (0, path_1.resolve)(cwd, outDir || DEFAULT_OUT_PATH);
    }
    transformFile(file) {
        const abi = (0, typechain_1.extractAbi)(file.contents);
        const isEmptyAbi = abi.length === 0;
        if (isEmptyAbi) {
            return;
        }
        const name = (0, typechain_1.getFilename)(file.path);
        const documentation = (0, typechain_1.extractDocumentation)(file.contents);
        const contract = (0, typechain_1.parse)(abi, name, documentation);
        return {
            path: (0, path_1.join)(this.outDirAbs, `${name}.ts`),
            contents: (0, codegen_1.codegen)(contract),
        };
    }
    afterRun() {
        return [
            {
                path: (0, path_1.join)(this.outDirAbs, 'types.ts'),
                contents: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../static/types.ts'), 'utf-8'),
            },
        ];
    }
}
exports.default = Web3V1;
//# sourceMappingURL=index.js.map