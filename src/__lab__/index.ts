import Route from '@/index'

const router = Route<[1, 2, 3]>()
  .catch(
    (next, err) => {
      console.log('Error: 1')
      console.error(err.message)
      return next()
    },

    async (next, err, ...args) => {
      console.log('Error: 2')
      console.error(err.message, args)
      return 'OUTPUT: ' + err.message
    }
  )
  .use(
    (next, ...args) => {
      console.log('Middleware 1')
      return next()
    },
    (next, ...args) => {
      console.log('Middleware 2')
      return next()
    }
  )

const childRouter = router.clone()

const finalHandler = childRouter(
  (next, ...args) => {
    console.log('First handler')
    console.log(args)
    return next(new Error('BOOM'))
  },
  (next, ...args) => {
    console.log('Second handler')
    console.log(args)

    throw new Error('Super error')
    return "HELLO IT's working!"
  }
)

finalHandler(1, 2, 3).then(console.log)
