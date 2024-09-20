import Route from '@/index'

const router = Route<[1, 2, 3]>(
  (err) => {
    console.log('Error: 1')
    return err.message
  },
  (res) => {
    console.log({ res })
    return res
  }
).use(
  (next, ...args) => {
    console.log('Middleware 1')
    return next()
  },
  (next, ...args) => {
    console.log('Middleware 2')
    return next()
  }
)

const childRouter = router.create()

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
