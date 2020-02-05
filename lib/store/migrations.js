import uuid from 'uuid/v4'

/* these are our migrations of the store scheme — the store is a JSON-based
 * database which contains informations about users and projects. as changes
 * on the store scheme happen over time, we can issue migrations here.
 *
 * make sure to check whether a particular key already has been set — for
 * instance, a new installation might already have a user set up, but no
 * projects. if these users update to a newer version, migrations might crash
 * if they rely on the `projects` key to be set.
 *
 * also, make sure to update the `storeVersion` in `store.js` if you create a
 * new migration, so that new versions adhere to this version.
 */
const migrations = {}

migrations['0.1.0'] = store => {
  if (!store.projects) {
    return store
  }
  
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
