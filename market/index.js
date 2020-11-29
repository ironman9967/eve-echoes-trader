
module.exports = {
	create: ({
		MiniSearch,
		fetcher: { fetchItemHeads, fetchItemStats },
		cacher: { load: cacherLoad },
		queue: { push: addTask },
		cacheMaxAge
	} = {}) => ({
		load: () => cacherLoad().then(({
			get: cacherGet,
			set: cacherSet,
			clear: cacherClear,
			list: cacherList
		}) => fetchItemHeads()
			.then(cacherSet('itemHeadData'))
			.then(() => cacherGet('itemHeadData.heads'))
			.then(itemHeads => {
				const ms = new MiniSearch({
					fields: [ 'name' ],
					storeFields: [ 'name' ]
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
					.then(head => cacherGet('itemHeadData.meta')
						.then(meta => ({ meta, head })))
				const getItemNames = () =>
					Promise.resolve(itemHeads.map(({ name }) => name))
				return {
					getItemNames,
					getItem: term => search(term)
						.then(results => results ? results[0] : null)
						.then(result => result
							? getItemHead(result.id)
								.then(({ meta, head: { id, itemId, ...itemHead } }) => ({
									meta,
									id,
									itemId,
									getItemIdStr: () => `i${itemId}`,
									...itemHead
								}))
								.then(item => cacherGet(item.getItemIdStr())
									.then(stats => stats && Date.now() - stats.meta.lastDownload.stamp <= cacheMaxAge
										? { ...item, stats }
										: addTask(() => fetchItemStats(item.itemId)
												.then(stats => cacherSet(item.getItemIdStr())(stats)))
										.then(() => cacherGet(item.getItemIdStr()))
										.then(stats => ({ ...item, stats }))))
							: null)
				}
			})
		)
	})
}
