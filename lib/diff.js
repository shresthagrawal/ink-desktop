import { gitStatus } from './git/utils';
import { getById } from './store/project-store';
import { ParserManager } from './parser';
import Git from 'nodegit';

export async function getDiff(projectId) {
    const project = getById(projectId);
    const repo = await Git.Repository.open(`${project.path}/.git`);
    const status = await gitStatus(repo);
    // const diff = await Git.Diff.indexToWorkdir(repo, null, {
    // flags: Git.Diff.OPTION.INCLUDE_UNTRACKED |
    //        Git.Diff.OPTION.RECURSE_UNTRACKED_DIRS
    // });
    // let test = await diff.patches();
    // console.log(await test[0].hunks());
    const parser = await ParserManager.getInstance(project.id);
    return status;
}