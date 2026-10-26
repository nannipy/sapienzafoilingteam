export function mediaForm(path: string, file: File) {
  const form = new FormData();
  form.set('path', path);
  form.set('file', file);
  return form;
}
