import chokidar from 'chokidar';
import { getById } from './store/project-store';

export default class ProjectWatcher {
  constructor(projectId, onChange) {
    this.project = getById(projectId);
    this.watcher = chokidar.watch(this.project.path);

    this.watcher.on('change', path => onChange(path));
  }

  async destroy() {
    await this.watcher.destroy();
  }

  static async watch(projectId, onChange) {
    if (!this.watchers.has(projectId)) {
      const watcher = new ProjectWatcher(projectId, onChange);
      this.watchers.set(projectId, watcher);
      return watcher;
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
