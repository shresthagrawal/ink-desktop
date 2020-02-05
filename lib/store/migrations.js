import uuid from 'uuid/v4'

const migrations = {}

migrations['0.1.0'] = store => {
  const projects = store.projects.map(project => {
    if (project.id) {
      return project
    }

    return {
      ...project,
      id: uuid()
    }
  })

  return {
    ...store,
    projects
  }
}

export default migrations
