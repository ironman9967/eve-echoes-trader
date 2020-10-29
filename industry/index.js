
module.exports = {
	create: ({
		MiniSearch,
		production,
		feelingLuckyMkt
	} = {}) => {
		const searchProduction = term => {
			const ms = new MiniSearch({
				fields: [ 'name' ],
				storeFields: [ 'name' ]
			})
			ms.addAll(production)
			return Promise.resolve(ms.search(ms.autoSuggest(term)[0].suggestion))
		}
		const feelingLuckyProduction = term => searchProduction(term)
		.then(([ res ]) => {
			console.log(res)
			process.exit(0)
		})
			.then(([ res ]) => production.find(({ name }) => name == item.name))

		const getProduction = (term, force) => feelingLuckyMkt(term, force)
			.then(item => feelingLuckyProduction(term)
				.then(x => {
					console.log(x)
					process.exit(0)
				}))
				// .then(itemProduction => ({
				// 	item,
				// 	itemProduction
				// })))

		const priceProductionType = (type, itemProduction, modifier = 1) => Promise.all(
			itemProduction[type].map(({ name, amount }) =>
				feelingLuckyMkt(name).then(item => ({
					item,
					amount,
					value: item.sell * amount * modifier
				}))))
			.then(itemized => ({
				production: itemProduction,
				itemized,
				sum: itemized.reduce((total, { value }) => total + value, 0)
					+ itemProduction.baseCost
			}))
		return {
			getProduction,
			priceProduction: (itemName, modifier) => getProduction(itemName)

.then(x => {
	console.log(x)
	process.exit(0)
})

				// .then(({ item, itemProduction }) => priceProductionType('requirements', itemProduction)
				// 	.then(requirementsCost => priceProductionType('products', itemProduction, modifier)
				// 		.then(productsValue => ({
				// 			productsValue,
				// 			requirementsCost
				// 		}))))
		}
	}
}
