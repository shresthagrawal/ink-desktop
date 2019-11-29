// mock data, i.e. commits. make sure to give commits a unique hash, something
// arbitrary will be sufficient.
export const initialMockCommits = [
  {
    hash: 'foo',
    author: {
      name: 'Shresth',
    },
    message: 'Create project',
    tags: ['genesis'],
    subBranch: [
      {
        hash: 'foo1',
        author: {
          name: 'Emma',
        },
        message: 'Add bass line',
      },
      {
        hash: 'foo2',
        author: {
          name: 'Emma',
        },
        message: 'Adjust compressor settings',
      },
    ],
  },
  {
    hash: 'bar',
    author: {
      name: 'Shresth',
    },
    message: 'Add guitar',
    tags: ['vocals', 'fx'],
  },
  {
    hash: 'bar2',
    author: {
      name: 'Shresth',
    },
    message: 'Add delay',
    tags: ['vocals', 'fx'],
  },
];

export const timedCommit = {
  hash: 'stefanscommit1337',
  author: {
    name: 'Stefan',
  },
  message: "Adjust EQ on Shresth's rec",
};

export const trackEmoji = ['🎸', '🥁', '🎺', '🎶', '🎷'];
