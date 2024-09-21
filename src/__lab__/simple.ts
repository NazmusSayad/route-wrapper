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
  (...args) => {
    console.log('Middleware 1')
  },
  (...args) => {
    console.log('Middleware 2')
  }
)

const childRouter = router.create()

const finalHandler = childRouter(
  (...args) => {
    console.log('First handler')
    console.log(args)
  },
  async (...args) => {
    console.log('Second handler')
    console.log(args)

    throw new Error('Super error')
  }
)

finalHandler(1, 2, 3).then(console.log)
