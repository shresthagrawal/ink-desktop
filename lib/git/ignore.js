import fs from 'fs';
import path from 'path';
import { ignoreRules } from '../parser';

export const generateRules = (projectTypes) =>
  projectTypes
    .reduce((rules, type) => [...rules, ...ignoreRules[type]], [])
    .join('\n');

export function gitAddIgnore(projectPath, projectTypes) {
  return fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
    generateRules(projectTypes)
  );
}
