export function isBlank(str: string | string[] | undefined) {
  return !str || /^\s*$/.test(str as string);
}
