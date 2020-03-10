import * as md5 from 'md5-file/promise';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { ParserManager } from './parser';
import * as path from 'path';

export async function manageResource(project) {
    let resDir = path.join(project.path, 'resources');
    if (!existsSync(resDir)) {
        mkdirSync(resDir);
    }
    let parsers = await ParserManager.getInstance(project.id);
    let modified = []
    for (var filePath in parsers) {
        let sourceList = parsers[filePath].getResources();
        for (let originalResource of sourceList) {
            originalResource = path.join('/', originalResource);
            if (!existsSync(originalResource)) {
                // TODO: Throw Error? Handle on originalResource not available locally.
                continue;
            }
            let localResource = path.join(resDir, path.parse(originalResource).base);
            let isResourceSame = await compareResource(localResource, originalResource);
            if (!isResourceSame) {
                copyResource(parsers[filePath].type, originalResource, localResource);
                modified.push(localResource);
            }
        }
        parsers[filePath].changeResource(resDir);
    }
    return modified;
}

async function copyResource(projectType, currPath, newPath) {
    if (projectType === 'ableton-project') {
        copyFileSync(currPath, newPath);
        copyFileSync(currPath + '.asd', newPath + '.asd');
    } else {
        throw new Error('Invalid Project Type');
    }
}

async function compareResource(pathA, pathB) {
    if (!existsSync(pathA)) return false
    if (pathA == pathB) true;
    if (!existsSync(pathB)) return false
    let hashA = await md5(pathA);
    let hashB = await md5(pathB);
    if (hashA == hashB) return true;
    return false;
}
