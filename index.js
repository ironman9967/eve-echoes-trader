
const fs = require('fs/promises')

const fetch = require('node-fetch')
const MiniSearch = require('minisearch')
const mathjs = require('mathjs')

const productionData = require('./production-data.json')

const { create: createProduction } = require('./production')
const { create: createMarket } = require('./market')
const { create: createIndustry } = require('./industry')

const { production } = createProduction({ productionData })
const marketLoader = createMarket({ fs, fetch, MiniSearch })

marketLoader.load().then(market => {
	const { priceProductionMany } = createIndustry({
		...market,
		production,
		mathjs,
		MiniSearch
	})

	const getReproEff = (basicLvl, advancedLvl, expertLvl) => {
		const { untrained, basic, advanced, expert } = {
			untrained: { base: .3 },
			basic: { base: .1, up: .1 },
			advanced: { base: .1, up: .05 },
			expert: { base: .05, up: .05 },
		}
		const getEff = ({ base, up }, lvl = 0) => {
			if (!up) {
				return base
			}
			else if (lvl > 0) {
				if (lvl > 1) {
					return (lvl - 1) * up + base
				}
				return base
			}
			return 0
		}
		const modifier = 0.3
		return mathjs.round(
			getEff(untrained)
				+ getEff(basic, basicLvl) * modifier
				+ getEff(advanced, advancedLvl) * modifier
				+ getEff(expert, expertLvl) * modifier,
			3)
	}

	const reproEffs = {
		good: getReproEff(5, 4, 0),
		bad: getReproEff(0, 0, 0)
	}

	priceProductionMany([
		{ ore: 'veldspar', reproEff: reproEffs.good },
		{ ore: 'scordite', reproEff: reproEffs.good },
		{ ore: 'pyroxeres', reproEff: reproEffs.good },
		{ ore: 'plagioclase', reproEff: reproEffs.good },
		{ ore: 'omber', reproEff: reproEffs.good },
		{ ore: 'kernite', reproEff: reproEffs.good },
		{ ore: 'jaspet', reproEff: reproEffs.good },
		{ ore: 'hemorphite', reproEff: reproEffs.good },
		{ ore: 'hedbergite', reproEff: reproEffs.good },
		{ ore: 'spodumain', reproEff: reproEffs.good },
		{ ore: 'dark ochre', reproEff: reproEffs.good },
		{ ore: 'gneiss', reproEff: reproEffs.good },
		{ ore: 'crokite', reproEff: reproEffs.good },
		{ ore: 'bistot', reproEff: reproEffs.bad },
		{ ore: 'arkonor', reproEff: reproEffs.bad },
		{ ore: 'mercoxit', reproEff: reproEffs.bad }
	])
	.then(res => res.filter(({ productionWorthy }) => productionWorthy))
	.then(res => res.slice(0, 3))
	.then(res => res.map(({ name, totalProfit }) => ({ name, totalProfit })))
	.then(console.log)
})
