export const getReadableCamelCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2') // /([a-z0-9])([A-Z])/ for numbers counting as lowercase characters
}
