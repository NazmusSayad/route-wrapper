import { ErrorManager } from 'req-error'
import createRouter from './createRouter'

export * from 'req-error'
export * from './createRouter'

export default (() => {
  const errorManager = new ErrorManager()
  return createRouter({
    errorHandler(err, req, res) {
      const [message, statusCode] = errorManager.getErrorInfo(err)
      const status = statusCode < 500 ? 'fail' : 'error'
      res.status(statusCode).json({ status, message })
    },
  })
})()
