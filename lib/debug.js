import log from 'debug';

let defaultLogger;

export function setDebug(process) {
    defaultLogger = log.extend(process); 
}

export function debug(...params) {
    return defaultLogger(...params)
}