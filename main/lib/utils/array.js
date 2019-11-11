export function diffArrayTooSimple(origin, head) {
  return head.filter(item => !origin.includes(item));
}
