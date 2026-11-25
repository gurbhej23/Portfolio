const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const htmlTags = /<[^>]*>/g;

export function sanitizePlainText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(controlCharacters, '').replace(htmlTags, '').trim();
}
