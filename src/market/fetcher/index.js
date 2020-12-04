
module.exports = ({
	create: ({
		fetch,

		eemCsvUrl,
		eemItemUrl
	} = {}) => {
		const fetchItemHeads = max => {
			const stamp = Date.now()
			return fetch(eemCsvUrl)
				.then(res => res.text())
				.then(csv => csv.split('\r\n').slice(0, -1))
				.then(lines => lines.map(line => line.split(',')))
				.then(items => ({
					meta: {
						id: 0,
						lastDownload: {
							stamp,
							duration: Date.now() - stamp
						}
					},
					heads: items.slice(1).slice(0, max).map((itemArr, i) => ({
						id: i,
						itemId: itemArr[0],
						name: itemArr[1]
					}))
				}))
		}
		const fetchItemStats = itemId => {
			const stamp = Date.now()
			return fetch(`${eemItemUrl}/${itemId}`)
				.then(res => res.text())
				.then(text => {
					const sanitize = p => v => v != 'null' && v != '' ? p(v) : null
					const sanitizeDate = v => sanitize(v => v)(v)
					const sanitizeFloat = v => sanitize(v => parseFloat(v))(v)
					try {
						return {
							meta: {
								itemId,
								lastDownload: {
									stamp,
									duration: Date.now() - stamp
								}
							},
							stats: JSON.parse(text).map(({
								time,
								sell,
								buy,
								lowest_sell,
								highest_buy,
								...item
							}) => ({
								itemId,
								time: sanitizeDate(time),
								sell: sanitizeFloat(sell),
								buy: sanitizeFloat(buy),
								lowestSell: sanitizeFloat(lowest_sell),
								highestBuy: sanitizeFloat(highest_buy),
								...item
							}))
						}
					} catch (e) {
						console.log(text)
						throw e
					}
				})
		}
		return {
			fetchItemHeads,
			fetchItemStats
		}
	}
})
