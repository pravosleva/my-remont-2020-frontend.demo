type TFormat = {
  hash: string
  [key: string]: any
}
export type TFormatsData = {
  large?: TFormat
  medium?: TFormat
  thumbnail?: TFormat
  small?: TFormat
}
export const getHash = (data: TFormatsData) => {
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
