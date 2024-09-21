import RouteWrapper from '..'

const route = RouteWrapper<[], Error>(
  (exception) => {
    console.clear()
    console.log({ exception })
  },

  (data) => {
    console.log({ data })
  }
).use(
  () => {
    console.log('Middleware 1')
  },
  async () => {
    console.log('Middleware 2')
  }
)

const router = route(
  () => {
    // throw 'Middleware 2'
    console.log('handler 1')
  },
  async () => {
    // throw new Error('Middleware 2')
    throw Promise.resolve('Middleware 2')
  }
)

router()
