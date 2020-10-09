export type TResponse =
  | {
      isOk: boolean
      response: any
    }
  | {
      isOk: boolean
      msg: string
    }
