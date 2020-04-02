import chokidar from 'chokidar';
import { getById } from './store/project-store';
import pushEvent from '../backend/pushEvent';
import path from 'path'

export default class ProjectWatcher {
  constructor(projectId, parsers) {
    this.project = getById(projectId);
    this.watcher = chokidar.watch(this.project.path, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true
    });
    this.parsers = parsers;
    this.watcher.on('all', async (event, path) => {
      if(this.parsers[path]) await this.parsers[path].onChange();
      pushEvent('project-changed', {
          projectId: this.project.id,
      });
    });
  }

  async destroy() {
    await this.watcher.destroy();
  }

  static async getInstance(projectId, parsers) {
    if (!this.watchers.has(projectId)) {
      const watcher = new ProjectWatcher(projectId, parsers);
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
