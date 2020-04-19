import fs from 'fs';
import path from 'path';
import { projectType, ignoreRules } from '../parser';


export async function gitAddIgnore(projectPath, projectTypes) {
    let rules = '';
    projectTypes.forEach((type) => {
        rules += ignoreRules[type] + '\n';
    });
    return await fs.writeFileSync(path.join(projectPath, '.gitignore'), rules);
}