const IntervalCache = require('./lib/interval-cache')

module.exports = async function () {
  app.logger.info('enter dapp init')

  app.registerContract(1000, 'book.postBook')
  app.registerContract(1001, 'book.updateBookState')
  app.registerContract(1002, 'book.buyBook')

  app.setDefaultFee('10000000', 'XAS')

  app.custom.cache = new IntervalCache(10 * 1000)
}
