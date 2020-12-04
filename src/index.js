#!/usr/bin/env node

const fs = require('fs')

const { name: appName, version } = require('../package.json')

const cli = require('cli')
const fetch = require('node-fetch')
const MiniSearch = require('minisearch')
const mathjs = require('mathjs')
const Hapi = require('@hapi/hapi')
const mongodb = require('mongodb')

const _min = require('lodash/fp/min')
const _max = require('lodash/fp/max')
const _mean = require('lodash/fp/mean')

const { create: createMarket } = require('./market')
const { create: createCacher } = require('./market/cacher')
const { create: createFetcher } = require('./market/fetcher')
const { create: createServer } = require('./server')
const { create: createEedata } = require('./eedata')

const cacheMaxAge = 1 * 60 * 60 * 1000
const {
	MONGO_INITDB_ROOT_USERNAME: mongoUser,
	MONGO_INITDB_ROOT_PASSWORD: mongoPwd,
	MONGO_INITDB_DATABASE: mongoDbName
} = process.env

const fetcher = createFetcher({
	fetch,
	eemCsvUrl: 'https://api.eve-echoes-market.com/market-stats/stats.csv',
	eemItemUrl: 'https://api.eve-echoes-market.com/market-stats'
})
const eedata = createEedata({ mongodb, mongoUser, mongoPwd, mongoDbName })
const cacher = createCacher({ eedata })

cli.enable('version')
cli.enable('status')
cli.setApp(appName, version)
cli.parse({
	port: [ 'p', "Port for the 'serve' command", 'int', 8080 ],
	'use-json': [ 'j', "Output JSON", 'bool' ],
	term: [ 't', "Term for the 'item-search' command", 'string' ],
	itemid: [ 'i', "Item ID for the 'item-by-*' commands", 'string' ],
	'full-stats': [ 'f', "Return full stats for the 'item-by-id' command", 'bool' ],
	name: [ 'n', "Name for the 'item-by-name' command", 'string' ]
}, [ 'serve', 'item-search', 'item-names', 'item-by-id', 'item-by-name' ])

cli.main((args, {
	port,
	'use-json': useJson,
	term,
	itemid,
	'full-stats': fullStats,
	name
}) => {
	const about = `${appName} v${version}`
	const aboutJson = JSON.stringify({ appName, version, about }, null, '\t')
	cli.debug(about)
	cli.debug('loading market...')
	const started = Date.now()
	createMarket({
		MiniSearch,
		_min,
		_max,
		_mean,
		fetcher,
		cacher,
		cacheMaxAge
	}).load()
	.then(market => {
		cli.debug(`market loaded (${Date.now() - started}ms)`)
		switch (cli.command) {
			case 'serve':
				createServer({
					Hapi,
					port,
					tls: {
						key: fs.readFileSync('/data/cert/privkey.pem'),
						cert: fs.readFileSync('/data/cert/fullchain.pem')
					},
					aboutJson,
					market
				}).start()
					.then(() => cli.info(`server up at http://localhost:${port}/`))
				break
			case 'item-search':
				market.search(term)
					.then(res => console.log(useJson ? JSON.stringify(res) : res))
				break
			case 'item-names':
				market.getItemNames()
					.then(res => console.log(useJson ? JSON.stringify(res) : res))
				break
			case 'item-by-id':
				market.getItemByItemId(itemid)
					.then(res => console.log(useJson ? JSON.stringify(res) : res))
				break
			case 'item-by-name':
				market.getItem(name)
					.then(res => console.log(useJson ? JSON.stringify(res) : res))
				break
		}
	})
})
