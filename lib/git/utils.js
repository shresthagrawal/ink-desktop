import Git from 'nodegit';

const getPushTransferProgress = (current_, total_, bytes) => {
  const current = parseInt(current_);
  const total = parseInt(total_);

  if (total === 0) {
    return 0;
  }

  return current / total;
};

const getFetchTransferProgress = (stats) =>
  (stats.receivedObjects() + stats.indexedObjects()) /
  (stats.totalObjects() * 2);

const createProgressHandler = (onProgress, opts = {}) => {
  const pushTransfer = opts.pushTransfer || false;
  if (typeof onProgress !== 'function') {
    return () => {};
  }

  return (...args) => {
    const progress = pushTransfer
      ? getPushTransferProgress(...args)
      : getFetchTransferProgress(args[0]);

    onProgress(progress);
  };
};

export async function gitCheckAndInit(projectPath) {
  try {
    await Git.Repository.open(`${projectPath}/.git`);
    console.log('ALREADY INITIALIZED', projectPath); // TODO: use `debug` module
  } catch (err) {
    if (err.errno === Git.Error.CODE.ENOTFOUND) {
      const repo = await Git.Repository.init(`${projectPath}/.git`, 0);
      console.log('REPO CREATED', repo); // TODO: use `debug` module
    } else {
      throw err;
    }
  }
}

export async function gitStatus(repo) {
  const statuses = await repo.getStatus();
  const state = {
    modified: [],
    new: [],
    deleted: [],
  };

  statuses.forEach((file) => {
    if (file.isModified()) {
      state.modified.push(file.path());
    } else if (file.isNew()) {
      state.new.push(file.path());
    } else if (file.isDeleted()) {
      state.deleted.push(file.path());
    }
  });
  return state;
}

export async function gitCommit(projectPath, commitMessage, userEmail) {
  try {
    const repo = await Git.Repository.open(`${projectPath}/.git`);
    const index = await repo.refreshIndex();
    await index.addAll();
    await index.write();
    const oid = await index.writeTree();

    // Fetching parents to create commit
    const headCommit = await repo.getHeadCommit();
    // If no commit yet, parents is an empty array
    let parents = [];
    if (headCommit) {
      const head = await Git.Reference.nameToId(repo, 'HEAD');
      const parent = await repo.getCommit(head);
      parents = [parent];
    }

    // Using logged in user email as signature's name and email
    // Can be changed later on when the collaboration platform is in place
    const signature = await Git.Signature.now(userEmail, userEmail);

    await repo.createCommit(
      'HEAD',
      signature,
      signature,
      commitMessage,
      oid,
      parents
    );
    return 0; // TODO Return the id
  } catch (err) {
    // TODO Handle error to display to the user
    console.error(err);
    return;
  }
}

export async function gitAddRemote(projectPath, remoteName, remoteUrl) {
  try {
    const repo = await Git.Repository.open(`${projectPath}/.git`);
    return await Git.Remote.create(repo, remoteName, remoteUrl);
  } catch (err) {
    console.error(err);
    throw Error(err);
  }
}

export async function getRemote(projectPath, remoteName) {
  const repo = await Git.Repository.open(`${projectPath}/.git`);
  let remotes = await repo.getRemotes();
  for (let i = 0; i < remotes.length; i++) {
    if (remotes[i].name() == remoteName) {
      return remotes[i];
    }
  }
  return null;
}

export async function fetch(projectPath, onProgress) {
  const repo = await Git.Repository.open(`${projectPath}/.git`);
  const transferProgress = createProgressHandler(onProgress);

  return await repo.fetchAll({
    callbacks: {
      credentials: () =>
        Git.Cred.userpassPlaintextNew(
          process.env.GITHUB_USER,
          process.env.GITHUB_TOKEN
        ),
      certificateCheck: () => 0,
      transferProgress,
    },
  });
}

export async function merge(projectPath, branch, mergeBranch) {
  const repo = await Git.Repository.open(`${projectPath}/.git`);
  return await repo.mergeBranches(branch, mergeBranch);
}

export async function clone(remoteUrl, projectPath, onProgress) {
  const transferProgress = createProgressHandler(onProgress);

  return await Git.Clone.clone(remoteUrl, projectPath, {
    fetchOpts: {
      callbacks: {
        credentials: () =>
          Git.Cred.userpassPlaintextNew(
            process.env.GITHUB_USER,
            process.env.GITHUB_TOKEN
          ),
        transferProgress,
      },
    },
  });
}

export async function push(
  projectPath,
  remoteName,
  localBranch,
  remoteBranch,
  onProgress
) {
  const repo = await Git.Repository.open(`${projectPath}/.git`);
  const remote = await repo.getRemote(remoteName);
  const pushTransferProgress = createProgressHandler(onProgress, {
    pushTransfer: true,
  });

  return await remote.push(
    [`refs/heads/${localBranch}:refs/heads/${remoteBranch}`],
    {
      callbacks: {
        credentials: () =>
          Git.Cred.userpassPlaintextNew(
            process.env.GITHUB_USER,
            process.env.GITHUB_TOKEN
          ),
        pushTransferProgress,
      },
    }
  );
}

export async function pull(
  projectPath,
  remoteName,
  localBranch,
  remoteBranch,
  onProgress
) {
  await fetch(projectPath, onProgress);
  await merge(projectPath, localBranch, `${remoteName}/${remoteBranch}`);
}
