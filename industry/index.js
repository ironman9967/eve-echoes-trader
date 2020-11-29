
module.exports = {
	create: ({
		mathjs,
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
			.then(([ res ]) => production.find(({ name }) => name == res.name))

		const getProduction = (term, force) => feelingLuckyMkt(term, force)
			.then(item => feelingLuckyProduction(term)
				.then(itemProduction => ({
					item,
					itemProduction
				})))

		const priceProductionType = (type, itemProduction, modifier = 1) => Promise.all(
			itemProduction[type].map(({ name, amount }) =>
				feelingLuckyMkt(name).then(item => {
					if (item == null) {
						throw new Error(`item not found: ${name}`)
					}
					const unmodifiedAmount = mathjs.round(amount, 3)
					const unmodifiedValue = mathjs.chain(item.sell)
						.multiply(unmodifiedAmount)
						.round(3)
						.value
					return {
						item,
						unmodifiedAmount,
						amount: mathjs.chain(unmodifiedAmount)
							.multiply(modifier)
							.floor()
							.value,
						unmodifiedValue,
						value: mathjs.chain(unmodifiedValue)
							.multiply(modifier)
							.floor()
							.value,
					}
				})))
			.then(itemized => ({
				production: itemProduction,
				itemized,
				modifier,
				sum: itemized.reduce((total, { value }) => mathjs.add(total, value), 0)
					+ itemProduction.baseCost
			}))
		const priceProduction = (itemName, modifier) => getProduction(itemName)
			.then(({ item, itemProduction }) => priceProductionType('requirements', itemProduction)
				.then(requirementsCost => priceProductionType('products', itemProduction, modifier)
					.then(productsValue => ({
						productsValue,
						requirementsCost
					}))))
		return {
			getProduction,
			priceProduction,
			priceProductionMany: arr => Promise.all(arr.map(({
					ore,
					reproEff
				}) => priceProduction(ore, reproEff)
				.then(({
					productsValue: { sum: totalProductionValue, production: { name }, modifier },
					requirementsCost: { sum: totalRequirementsCost }
				}) => ({
					name,
					modifier,
					totalProductionValue,
					totalRequirementsCost,
					totalProfit: mathjs.subtract(totalProductionValue, totalRequirementsCost),
					productionWorthy: totalProductionValue > totalRequirementsCost
				})))
			).then(prices => prices.sort((
				{ totalProfit: totalProfitA }, { totalProfit: totalProfitB }
			) => totalProfitA > totalProfitB ? -1 : totalProfitA == totalProfitB ? 0 : 1))
		}
	}
}
