export const config = {};

export function setConfig(newConfig) {
  for (const key in newConfig) {
    config[key] = newConfig[key];
  }
}
