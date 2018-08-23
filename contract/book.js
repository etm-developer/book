let bignum = require('bignumber')

const VOTE_UNIT = 100000000
const VOTE_CURRENCY = 'XAS'
const COMMENT_REWARD_UNIT = 100000000
const COMMENT_REWARD_CURRENCY = 'XAS'

module.exports = {
  postBook: async function (title, text, unitPrice, sellPrice, capacity) {
    if (!title || !text) {
      return 'Should provide title and text'
    }
    if (!unitPrice) {
      return 'Should provide unit price'
    }
    if (!sellPrice) {
      return 'Should provide sell price'
    }
    if (!capacity) {
      return 'Should provide capacity'
    }
    if (title.length > 256) {
      return 'Invalid title size'
    }
    if (text && text.length > 4096) {
      return 'Text too long'
    }
    //TODO validate unitPrice, sellPrice, capacity be valid number
    // TODO  check if sender have enough money to pay the cost
	// var cost = baseCost + Rate * capacity * unitPrice

    app.sdb.lock('postBook@' + title)
    let exists = await app.model.Book.exists({ title: title })
    if (exists) {
      return 'Title already exists'
    }

    app.sdb.create('Book', {
      title: title,
      text: text || '',
      unitPrice: unitPrice,
      sellPrice: sellPrice,
      capacity: capacity,
      id: app.autoID.increment('book_max_id'),
      tid: this.trs.id,
      ownerId: this.trs.senderId,
      timestamp: this.trs.timestamp,
	  gainWay: 0,
      sellState: 1,
	  sellNumber: 0
    })
  },

  updateBookState: async function (bid, state) {
    if (!bid) {
      return 'Invalid book id'
    }
    if (state !== 0 && state !== 1) {
      return 'Invalid state'
    }

    let book = await app.model.Book.findOne({
      condition: { id: bid }
    })
    if (!book) {
      return 'Book not exists'
    }
	if (book.ownerId !== this.trs.senderId){
	  return 'Can not update other\'s book'	
	}
	if (book.sellState !== state){
		app.sdb.update('Book', { sellState: state }, { id: cid })
	}
  },

  buyBook: async function (bid, amount) {
    if (!bid || !amount) return 'Invalid params'
    app.validate('amount', amount)
	
	app.sdb.lock('buyBook@' + bid)
	let book = await app.model.Book.findOne({
      condition: { id: bid }
    })
    if (!book) return 'Book not found'
	if (book.sellState !== 1){
	  	return 'Book is not on sale'
	}
	if (book.sellNumber + amount > book.capacity){
		return 'Book is not enough'
	}
    let cost = book.sellPrice * amount
    let balance = app.balances.get(this.trs.senderId, VOTE_CURRENCY)
    if (balance.lt(cost)) return 'Insufficient balance'

	let newData = {
		sellNumber: book.sellNumber + amount
	}
	if (sellNumber == book.sellNumber + amount){
		newData.sellState = 0
	}
	
	app.sdb.update('Book', newData, { id: bid })
	app.sdb.create('Book', {
      title: book.title,
      text: book.text,
      unitPrice: book.unitPrice,
      sellPrice: book.sellPrice,
      capacity: amount,
      id: app.autoID.increment('book_max_id'),
      tid: this.trs.id,
      ownerId: this.trs.senderId,
      timestamp: this.trs.timestamp,
	  gainWay: 1,
      sellState: 0,
	  sellNumber: 0
    })

    app.balances.decrease(this.trs.senderId, VOTE_CURRENCY, cost)
    app.balances.increase(book.ownerId, VOTE_CURRENCY, cost)
    // app.feePool.add(VOTE_CURRENCY, extraFee)

	
    // let increment = Number(bAmount.div(VOTE_UNIT).floor().toString())
    // app.sdb.increment('Article', { votes: increment }, { id: aid })
  }
}