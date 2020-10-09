import { NetworkError } from '~/utils/errors/network/NetworkError'

export const networkErrorHandler = (res: any): any | NetworkError => {
  if (!!res.status) {
    return res
  } else {
    throw new NetworkError()
  }
}
