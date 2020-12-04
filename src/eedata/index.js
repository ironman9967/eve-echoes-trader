
module.exports = {
	create: ({
		mongodb: { MongoClient },
		mongoUser,
		mongoPwd,
		mongoDbName,
		port = 27017,
		delay = 5000
	} = {}) => ({
		load: () => new Promise(resolve => setTimeout(resolve, delay))
			.then(() => MongoClient.connect(`mongodb://`
				+ `${mongoUser}:${mongoPwd}`
				+ `@eedata:${port}`
				+ `/${mongoDbName}`
				+ `?authSource=admin`, { poolSize: 1 }))
			.then(client => ({
				getDb: () => Promise.resolve(client.db(mongoDbName))
			}))
			.catch(err => {
				console.error(err)
				throw err
			})
	})
}
