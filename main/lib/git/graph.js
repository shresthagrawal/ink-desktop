import Git from 'nodegit';

const commitToObject = commit => ({
  hash: commit.sha(),
  author: {
    name: commit.author().name(),
    email: commit.author().email(),
  },
  date: commit.date(),
  message: commit.message(),
});

// also very interesting:
// <https://github.com/nodegit/nodegit/issues/1174>
export async function getGraph(repo) {
  const commits = [];

  try {
    const masterCommit = await repo.getMasterCommit();
    const history = masterCommit.history(Git.Revwalk.SORT.REVERSE);

    await new Promise((resolve, reject) => {
      history.on('commit', commit => commits.push(commitToObject(commit)));
      history.on('end', () => resolve(commits));
      history.on('error', err => {
        console.error('some nasty error', err);
        throw err;
        reject(err);
      });

      history.start();
    });
  } catch (err) {
    // no history found or no master found, empty repository
    if (err.errno === -3) {
      return [];
    } else {
      throw err;
    }
  }

  return commits;
}
