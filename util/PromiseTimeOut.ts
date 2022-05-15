export function PromiseTimeout<T>(promise: Promise<T>, timeoutMillis: number, errorMessage?: string): Promise<T> {
  let timer
  return Promise.race([
    promise,
    new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        reject(new Error('promise代理超时 ' + errorMessage))
      }, timeoutMillis)
    })
  ]).then(
    function (v) {
      clearTimeout(timer)
      return v
    },
    function (err) {
      clearTimeout(timer)
      throw err
    }
  ) as any
}
