const REACT_APP_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getApiUrl = (): string => {
  return REACT_APP_API_ENDPOINT || ''
}