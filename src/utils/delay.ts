export const delay = (ms: number = 500): Promise<any> =>
  new Promise((res, _rej) => {
    setTimeout(res, ms)
  })
