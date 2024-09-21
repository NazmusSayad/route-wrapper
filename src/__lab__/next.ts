import RouteWrapper from '..'

const route = RouteWrapper<[]>(
  (exception) => {
    console.clear()
    console.log({ exception })
  },

  (data) => {
    console.log({ data })
  }
)

const router = route(
  () => {
    // throw 'Middleware 2'
    console.log('Middleware 1')
  },
  async () => {
    throw Promise.resolve('Middleware 2')

    // throw new Error('Middleware 2')
    // throw 'Middleware final'
  }
)

router()
