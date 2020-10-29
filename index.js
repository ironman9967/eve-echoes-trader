
const fs = require('fs/promises')

const fetch = require('node-fetch')
const MiniSearch = require('minisearch')

const productionData = require('./production-data.json')

const { create: createProduction } = require('./production')
const { create: createMarket } = require('./market')
const { create: createIndustry } = require('./industry')

const { production } = createProduction({ productionData })

const { getProduction, priceProduction } = createIndustry({
	...createMarket({
		fs,
		fetch,
		MiniSearch
	}),
	production,
	MiniSearch
})

getProduction('veld').then(console.log)

// priceProduction('veldspar', 1.525)
// .then(({
// 	productsValue: { sum: totalProductionValue },
// 	requirementsCost: { sum: totalRequirementsCost }
// }) => console.log({
// 	totalProductionValue,
// 	totalRequirementsCost,
// 	shouldProduce: totalProductionValue > totalRequirementsCost
// }))
