import { Store } from './store';

const defaultDoc = 'store';
const objectName = 'projects';
const defaultValue = [];
let projectStore;

export function init() {
  projectStore = new Store(defaultDoc, objectName, defaultValue);
  return projectStore;
}

export function Project(id, name, path) {
  this.id = id;
  this.name = name;
  this.path = path;
}

export function append(project) {
  const projects = projectStore.get();
  if (project.id == null || project.name == null || project.path == null) {
    throw new Error('invalid project id/name/path');
  }

  projects.push(project);
  projectStore.set(projects);

  return projects;
}

export function list() {
  return projectStore.get();
}

export function reset() {
  projectStore.set(defaultValue);
  return list();
}

export function getByPath(path) {
  var projects = projectStore.get();
  return projects.find(project => project.path === path);
}

export function getById(projectId) {
  return projectStore.get().find(({ id }) => id === projectId);
}

export function remove(path) {
  let projects = projectStore.get();
  let index = projects.findIndex(project => project.path === path);
  if (index > -1) {
    projects.splice(index, 1);
  }
  projectStore.set(projects);
  return projectStore.get();
}
