import chokidar from 'chokidar';
import { getById } from './store/project-store';
import pushEvent from '../backend/pushEvent';

export default class ProjectWatcher {
  constructor(projectId) {
    this.project = getById(projectId);
    this.watcher = chokidar.watch(this.project.path);
    this.handlers = new Map();
    this.watcher.on('change', path => {
      if(this.handlers.has(path)) this.handlers.get(path);
      pushEvent('project-changed', {
          projectId: this.project.id,
      });
    });
  }

  addHandler(path, handler) {
    this.handlers.set(path, handler);
  }

  async destroy() {
    await this.watcher.destroy();
  }

  static async watch(projectId) {
    if (!this.watchers.has(projectId)) {
      const watcher = new ProjectWatcher(projectId);
      this.watchers.set(projectId, watcher);
    }
    return this.watchers.get(projectId);
  }

  static async unwatchAll() {
    for (const [, watcher] of this.watchers.values()) {
      await watcher.destroy();
    }
  }
}

ProjectWatcher.watchers = new Map();
