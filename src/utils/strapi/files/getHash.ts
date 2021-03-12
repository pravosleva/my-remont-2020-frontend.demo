import { TFormatsData } from './interfaces'

export const getHash = (data: TFormatsData): string | null => {
  const possibleFields = ['large', 'medium', 'small', 'thumbnail']
  let fileHash = null
  let result = null

  for (const key of possibleFields) {
    if (!!data[key]?.hash) fileHash = data[key]?.hash
  }

  if (typeof fileHash === 'string') {
    try {
      result = fileHash.split('_').reverse()[0]
    } catch (err) {
      console.log(err)
    }
  }

  return result
}
