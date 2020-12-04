
module.exports = {
	create: ({
		MiniSearch,
		_min,
		_max,
		_mean,
		fetcher: { fetchItemHeads, fetchItemStats },
		cacher: { load: cacherLoad },
		cacheMaxAge
	} = {}) => ({
		load: () => cacherLoad().then(({
			getItemHeadsMeta,
			setItemHeadsMeta,
			getItemHead,
			getManyItemHeads,
			setItemHead,
			getItemStatsMeta,
			getManyItemStatsMeta,
			setItemStatsMeta,
			getItemStats,
			getManyItemStats,
			setItemStats
		}) => fetchItemHeads()
			.then(({ meta, heads }) => setItemHeadsMeta(meta)
				.then(() => heads.map(head => setItemHead(head)))
				.then(proms => Promise.all(proms))
				.then(() => heads))
			.then(itemHeads => {
				const ms = new MiniSearch({
					fields: [ 'name', 'itemId' ],
					storeFields: [ 'name', 'itemId' ]
				})
				ms.addAll(itemHeads)
				const search = term => {
					const autoSuggest = ms.autoSuggest(term)[0]
					return Promise.resolve(autoSuggest
						? ms.search(autoSuggest.suggestion)
						: null)
				}
				const getItemHead = itemHeadId =>
					Promise.resolve(itemHeads.find(({ id }) => id == itemHeadId))
					.then(head => getItemHeadsMeta().then(meta => ({ meta, head })))
				const getItemHeadByItemId = itemIdParam =>
					Promise.resolve(itemHeads.find(({ itemId }) => itemId == itemIdParam))
					.then(head => getItemHeadsMeta().then(meta => ({ meta, head })))
					.catch(err => {
						console.error('getItemHeadByItemId error:', err)
						throw err
					})
				const getItemNames = () =>
					Promise.resolve(itemHeads.map(({ name }) => name))
				const getItem = (id, fullStats) => getItemHead(id)
					.then(({ meta, head: { id, itemId, ...itemHead } }) => ({
						headMeta: meta,
						id,
						itemId,
						...itemHead
					}))
					.then(itemHead => getItemStatsMeta({ itemId: itemHead.itemId })
						.then(itemStatsMeta => itemStatsMeta && Date.now() - itemStatsMeta.lastDownload.stamp <= cacheMaxAge
							? getManyItemStats({ itemId: itemHead.itemId })
								.then(stats => ({
									...itemHead,
									statsMeta: itemStatsMeta,
									stats
								}))
							: fetchItemStats(itemHead.itemId)
								.then(({ meta, stats }) => setItemStatsMeta(meta)
									.then(meta => stats.map(itemStats => setItemStats(itemStats)))
									.then(proms => Promise.all(proms))
									.then(() => getItemStatsMeta(meta))
									.then(statsMeta => ({
										...itemHead,
										statsMeta,
										stats
									})))))
					.then(({ stats, ...item }) => {
						const times = stats.map(({ time }) => time)
						const volumes = stats.map(({ volume }) => volume)
						const sells = stats.map(({ sell }) => sell)
						const lowestSells = stats.map(({ lowestSell }) => lowestSell)
						const highestBuys = stats.map(({ highestBuy }) => highestBuy)
						const buys = stats.map(({ buy }) => buy)
						const res = {
							...item,
							aggregates: {
								time: { min: _min(times), max: _max(times), mean: _mean(times) },
								volume: { min: _min(sells), max: _max(sells), mean: _mean(sells) },
								sell: { min: _min(times), max: _max(times), mean: _mean(times) },
								lowestSell: { min: _min(lowestSells), max: _max(lowestSells), mean: _mean(lowestSells) },
								highestBuy: { min: _min(highestBuys), max: _max(highestBuys), mean: _mean(highestBuys) },
								buy: { min: _min(buys), max: _max(buys), mean: _mean(buys) }
							}
						}
						return fullStats
							? { ...res, stats }
							: res
					})
					.catch(err => {
						console.error('getItem error:', err)
						throw err
					})
				return {
					search,
					getItemNames,
					getItem: (term, fullStats = false) => search(term)
						.then(results => results ? results[0] : null)
						.then(result => result ? getItem(result.id, fullStats) : null),
					getItemByItemId: (itemId, fullStats = false) => getItemHeadByItemId(itemId)
						.then(({ head: { id } }) => getItem(id, fullStats))
				}
			})
		)
	})
}
