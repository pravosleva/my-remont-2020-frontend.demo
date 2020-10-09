import { HttpError } from '~/utils/errors/http'

export const httpErrorHandler = (res: any): any => {
  if (res.ok && res.status === 200) {
    return res.json()
  } else {
    throw new HttpError(res.status, res.statusText)
  }
}
