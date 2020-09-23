export default function (locale) {
  switch (locale) {
    case 'fr':
      return import('compiled-lang/fr.json')
    default:
      return import('compiled-lang/en.json')
  }
}
