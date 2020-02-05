import * as Octokit from "@octokit/rest";
import { getRemote, gitAddRemote } from './git/utils';

export class GitServer {
  constructor() {
    this.octokit = Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  } 
  async listRepo() {
    let res = await this.octokit.repos.list()
    if(res.status < 200 && res.status >= 300) throw Error("Error Listing the Repository");
    return res.data;
  }
  async createRepo(name) {
    let res = await this.octokit.repos.createForAuthenticatedUser({
        name: name,
        private: true
    });
    if(res.status < 200 && res.status >= 300) throw Error("Error Creating the Repository");
    return res.data.clone_url;
  }
  async deleteRepo(name) {
    let user_repos = await this.listRepo();
    let owner = "";
    user_repos.forEach(function (repo) {
      if(repo.name === name) {
        owner = repo.owner.login;
      }
    })
    let res = await this.octokit.repos.delete({
      owner: owner,
      repo: name
    });
    if(res.status < 200 && res.status >= 300) throw Error("Error Delting the Repository");
    return true;
  }
}

export async function checkCreateRemote(name, path, remoteName) {
  let remote = await getRemote(path, remoteName);
  if (remote != null) {
    console.log("Remote Already Exisits", remote.url());
    return remote.url();
  }
  let gitServer = new GitServer();
  let remoteUrl = await gitServer.createRepo(name);
  console.log("Remote Created", remoteUrl)
  await gitAddRemote(path, 'origin', remoteUrl);
  return remoteUrl;
}
