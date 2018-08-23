let bignum = require('bignumber')

async function getBooks(options) {
  let count = await app.model.Book.count({ sellPrice: 1 })
  let books = await app.model.Book.findAll({
    condition: {
      sellState: options.sellState,
	  ownerId: options.ownerId
    },
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort: { timestamp: -1 }
  })
  return { count: count, books: books }
}

async function getMyBooks(options) {
  let count = await app.model.Book.count({ ownerId: ownerId })
  let articles = await app.model.Book.findAll({
    condition: {
      ownerId: options.ownerId
    },
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort: { timestamp: -1 }
  })
  return { count: count, books: books }
}

async function getPublishedBooks() {
  let count = await app.model.Book.count({ gainWay: 0 })
  let articles = await app.model.Book.findAll({
    condition: {
      gainWay: 0
    },
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort: { timestamp: -1 }
  })
  return { count: count, books: books }
}

app.route.get('/books', async (req) => {
  let query = req.query
  if (!query.sortBy) {
    query.sortBy = 'timestamp'
  }
  let key = ['books', query.sortBy, query.limit, query.offset].join('_')
  if (app.custom.cache.has(key)) {
    return app.custom.cache.get(key)
  }
  let res = getBooks(query)
  app.custom.cache.set(key, res)
  return res
})
