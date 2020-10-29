
module.exports = {
	create: ({
		fs,
		fetch,
		MiniSearch,
		ageInHours = 1,
		EEM_STATS_CSV_ENDPOINT = 'https://api.eve-echoes-market.com/market-stats/stats.csv',
		CACHE_FILE_NAME = 'eem-items.json'
	} = {}) => {
		let inMemCache = void 0
		const fetchData = () => fetch(EEM_STATS_CSV_ENDPOINT)
			.then(res => res.text())
			.then(csv => csv.split('\r\n').slice(0, -1))
			.then(lines => lines.map(line => line.split(',')))
			.then(([ headings, ...itemArrays ]) => itemArrays.map((itemArray, id) => ({
				id,
				...headings.reduce((res, heading, i) => {
					res[heading] = itemArray[i]
					return res
				}, {})
			})))
			.then(items => ({
				meta: {
					age: items.reduce((timestamp, { time }) =>
						timestamp < new Date(time).getTime()
							? new Date(time).getTime()
							: timestamp, Date.now())
				},
				items: items.map(({ time, sell, buy, lowest_sell, highest_buy, ...item }) => ({
					time: time != 'null' && time != '' ? new Date(time) : null,
					sell: sell != 'null' && sell != '' ? parseFloat(sell) : null,
					buy: buy != 'null' && buy != '' ? parseFloat(buy) : null,
					lowest_sell: lowest_sell != 'null' && lowest_sell != '' ? parseFloat(lowest_sell) : null,
					highest_buy: highest_buy != 'null' && highest_buy != '' ? parseFloat(highest_buy) : null,
					...item
				}))
			}))

		const getData = (force = false) => {
			const updateCache = () => fetchData()
				.then(({ meta, ...res }) => fs.writeFile(CACHE_FILE_NAME, new Uint8Array(Buffer.from(JSON.stringify({
						meta: {
							updated: Date.now(),
							...meta
						},
						...res
					}, null, '\t'))))
					.then(() => {
						inMemCache = void 0
						return res
					}))
				.catch(err => {
					if (err.code == 'ENOTFOUND') {
						// console.warn('*** UPDATE CACHE ATTEMPT FAILED - NO INTERNET CONNECTION - USING CACHE ***')
					}
					else {
						console.error(err)
						process.exit(1)
					}
				})
			const getCache = () => fs.readFile(CACHE_FILE_NAME, 'utf8').then(JSON.parse)
				.then(cache => {
					inMemCache = cache
					return cache
				})
			return inMemCache
				? Promise.resolve(inMemCache)
				: fs.stat(CACHE_FILE_NAME)
					.catch(err => {
						if (err.code != 'ENOENT') {
							console.error(err)
							process.exit(1)
						}
						return void 0
					})
					.then(stats => stats == void 0 || force
						? updateCache()
						: getCache()
						.then(res => Date.now() - res.meta.updated >= ageInHours * 60 * 60 * 1000
							? updateCache()
							: res))
					.then(res => res ? res : getCache())
		}
		const searchMkt = (term, force) => getData(force)
			.then(({ meta, items }) => {
				const ms = new MiniSearch({
					fields: [ 'name' ],
					storeFields: [ 'name' ]
				})
				ms.addAll(items)
				return ms.search(ms.autoSuggest(term)[0].suggestion)
			})
		const getMktItem = (itemId, force) => getData(force)
			.then(({ items }) => items.find(({ id }) => id == itemId))
		const feelingLuckyMkt = (term, force) => searchMkt(term, force)
			.then(([ res ]) => getMktItem(res.id))
		return {
			load: () => getData().then(() => ({
				getMktItem,
				searchMkt,
				feelingLuckyMkt,
				priceMktItem: (term, force) => feelingLuckyMkt(term, force)
					.then(({ sell }) => sell)
			}))
		}
	}
}
