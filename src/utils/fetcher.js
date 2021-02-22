/* by Gena (smartprice.ru) */
import axios from 'axios'

const Wget = (args) => {
  return new Fetcher(args).fetch()
}

class FetcherController {
  constructor() {
    this.__abort = new PromiseController()
  }

  abort() {
    this.__abort.resolve()
  }

  onAbort(cb) {
    this.__abort.then(cb)
  }
}

class Fetcher {
  constructor(args) {
    if (!('timeout' in args)) {
      args['timeout'] = 10000
    }

    this.__counter = 0
    this.__maxRetries = pop(args, 'retries', 5)
    this.__shouldRetry = pop(args, 'shouldRetry')
    this.__args = args
    this.__cancelled = false

    const controller = pop(args, 'controller')

    if (controller !== undefined) {
      const cancelTokenSource = axios.CancelToken.source()

      controller.onAbort(() => {
        this.__cancelled = true
        cancelTokenSource.cancel()
      })

      args.cancelToken = cancelTokenSource.token
    }

    this.fetch = this.fetch.bind(this)
    this.__fetch = this.__fetch.bind(this)
    this.__catch = this.__catch.bind(this)
  }

  fetch() {
    return new Promise(this.__fetch)
  }

  __rejectArg() {
    return {
      isAborted: this.__cancelled,
    }
  }

  __fetch(resolve, reject) {
    if (this.__cancelled) {
      reject(this.__rejectArg())
      return
    }

    try {
      axios(this.__args)
        .then((response) => {
          if (this.__cancelled) {
            reject(this.__rejectArg())
            return
          }

          if (this.__shouldRetry && this.__shouldRetry(response)) {
            this.__catch(resolve, reject)
          } else {
            resolve(response)
          }
        })
        .catch(() => {
          this.__catch(resolve, reject)
        })
    } catch (e) {
      console.log(e)
      reject(this.__rejectArg())
    }
  }

  __catch(resolve, reject) {
    if (this.__cancelled || this.__counter >= this.__maxRetries) {
      reject(this.__rejectArg())
      return
    }

    ++this.__counter

    setTimeout(() => {
      this.__fetch(resolve, reject)
    }, 1000 * this.__counter)
  }
}

class FetchQueue {
  static getInstance() {
    if (typeof FetchQueue.instance === 'object') {
      return FetchQueue.instance
    }

    return new FetchQueue()
  }

  constructor() {
    if (typeof FetchQueue.instance === 'object') {
      return FetchQueue.instance
    }

    FetchQueue.instance = this

    this.queue = []
    this.inProg = false
  }

  static push(args) {
    const self = FetchQueue.getInstance()
    const fetcher = new Fetcher(args)
    const out = new Promise((resolve, reject) => {
      self.queue.push({ fetcher, resolve, reject })
    })

    if (self.inProg) {
      return out
    }

    self.__impl()

    return out
  }

  __impl() {
    const self = this
    self.inProg = true

    if (self.queue.length < 1) {
      self.inProg = false
      return
    }

    const { fetcher, resolve, reject } = self.queue.shift()
    const next = (cb) => {
      return function () {
        try {
          cb.apply(undefined, arguments)
        } catch (e) {
          console.log(e)
        }

        self.__impl()
      }
    }

    fetcher.fetch().then(next(resolve)).catch(next(reject))
  }
}

export { Fetcher, FetchQueue, Wget, FetcherController }

const pop = (obj, key, default_) => {
  if (key in obj) {
    const out = obj[key]

    try {
      delete obj[key]
    } catch {
      obj[key] = undefined
    }

    if (out !== undefined) {
      return out
    }
  }

  return default_
}

function PromiseController() {
  const self = this
  const promise = new Promise((resolve) => {
    self.resolve = resolve
  })

  self.then = promise.then.bind(promise)
}
