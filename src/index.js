#!/usr/bin/env node

const { name: appName, version } = require('../package.json')

const os = require('os')
const fs = require('fs-extra')
const path = require('path')

const cli = require('cli')
const walkdir = require('walkdir')
const fetch = require('node-fetch')
const MiniSearch = require('minisearch')
const mathjs = require('mathjs')
const Hapi = require('@hapi/hapi')
const MongoClient = require('mongodb').MongoClient

const _get = require('lodash/fp/get')
const _set = require('lodash/fp/set')

const asyncQueue = require('async/queue')

const { create: createMarket } = require('./market')
const { create: createCacher } = require('./market/cacher')
const { create: createFetcher } = require('./market/fetcher')
const { create: createServer } = require('./server')

const cacheMaxAge = 1 * 60 * 60 * 1000

const fetcher = createFetcher({
	fetch,
	eemCsvUrl: 'https://api.eve-echoes-market.com/market-stats/stats.csv',
	eemItemUrl: 'https://api.eve-echoes-market.com/market-stats'
})
const cacher = createCacher({ fs, path, Buffer, walkdir, _get, _set })

const createQueue = ({ asyncQueue } = {}) =>
	asyncQueue((prom, done, ...args) => prom().then(done), os.cpus().length - 1)
const queue = createQueue({ asyncQueue })

cli.enable('version')
cli.enable('status')
cli.setApp(appName, version)
cli.parse({
	port: [ 'p', "Port for the 'serve' command", 'int', 8080 ],
	'use-json': [ 'j', "Output JSON", 'bool' ],
	term: [ 't', "Term for the 'item-search' command", 'string' ],
	itemid: [ 'i', "Item ID for the 'item-by-id' command", 'string' ],
	name: [ 'n', "Name for the 'item-by-name' command", 'string' ]
}, [ 'serve', 'item-search', 'item-names', 'item-by-id', 'item-by-name' ])

cli.main((args, {
	port,
	'use-json': useJson,
	term,
	itemid,
	name
}) => {
	cli.debug(`${appName} v${version}`)
	const {
		MONGO_INITDB_ROOT_USERNAME: mongoUser,
		MONGO_INITDB_ROOT_PASSWORD: mongoPwd
	} = process.env
	const close = (code, client) => Promise.resolve(client
		? client.close()
		: void 0).then(() => code)

	// const uri = `mongodb+srv://${mongoUser}:${mongoPwd}@localhost:27017?retryWrites=true&w=majority`
	// const uri = `mongodb://${mongoUser}:${mongoPwd}@lednet:27017/eetdata?authSource=admin`
	const uri = `mongodb://lednet:27017`

	console.log(uri)

	MongoClient.connect(uri)
		.then(client => {
			console.log('connected')
			return close(0, client)
		})
		.catch((err, ...args) => {
			console.error(err)
			return close(1)
		})
		.then((code = 0) => process.exit(code))

	// cli.debug('loading market...')
	// const started = Date.now()
	// createMarket({ MiniSearch, fetcher, cacher, queue, cacheMaxAge }).load()
	// .then(market => {
	// 	cli.debug(`market loaded (${Date.now() - started}ms)`)
	// 	switch (cli.command) {
	// 		case 'serve':
	// 			createServer({ Hapi, port, market }).start()
	// 				.then(() => cli.info(`server up at http://localhost:${port}/`))
	// 			break
	// 		case 'item-search':
	// 			market.search(term)
	// 				.then(res => console.log(useJson ? JSON.stringify(res) : res))
	// 			break
	// 		case 'item-names':
	// 			market.getItemNames()
	// 				.then(res => console.log(useJson ? JSON.stringify(res) : res))
	// 			break
	// 		case 'item-by-id':
	// 			market.getItemByItemId(itemid)
	// 				.then(res => console.log(useJson ? JSON.stringify(res) : res))
	// 			break
	// 		case 'item-by-name':
	// 			market.getItem(name)
	// 				.then(res => console.log(useJson ? JSON.stringify(res) : res))
	// 			break
	// 	}
	// })
})
