
const os = require('os')
const fs = require('fs-extra')
const path = require('path')

const walkdir = require('walkdir')
const fetch = require('node-fetch')
const MiniSearch = require('minisearch')
const mathjs = require('mathjs')
const Hapi = require('@hapi/hapi')

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

const port = 8080

createMarket({ MiniSearch, fetcher, cacher, queue, cacheMaxAge }).load()
.then(market => createServer({ Hapi, port, market }).start())
.then(() => console.log(`http://localhost:${port}/`))
