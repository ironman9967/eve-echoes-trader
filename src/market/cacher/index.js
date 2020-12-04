
const getDbColl = ({ getDb }) => name => getDb()
	.then(db => db.collection(name))

const dbActions = dbConn => {
	const getColl = getDbColl(dbConn)
	const createProp = name => getColl(name)
		.then(coll => ({
			getMany: filter => new Promise(resolve => {
				const res = []
				const cur = coll.find(filter)
				cur.on('data', record => res.push(record))
				cur.once('end', () => {
					cur.removeAllListeners('data')
					resolve(res)
				})
			}),
			get: filter => coll.findOne(filter),
			set: v => coll.deleteOne(v)
				.then(() => coll.updateOne(v, {
					$set: v
				}, { upsert: true }))
		}))
	return createProp('itemHeadsMeta')
		.then(({ get, set }) => ({
			getItemHeadsMeta: get,
			setItemHeadsMeta: set
		}))
		.then(methods => createProp('itemHeads')
			.then(({ getMany, get, set }) => ({
				...methods,
				getManyItemHeads: getMany,
				getItemHead: get,
				setItemHead: set
			})))
		.then(methods => createProp('itemStatsMeta')
			.then(({ getMany, get, set }) => ({
				...methods,
				getManyItemStatsMeta: getMany,
				getItemStatsMeta: get,
				setItemStatsMeta: set
			})))
		.then(methods => createProp('itemStats')
			.then(({ getMany, get, set }) => ({
				...methods,
				getManyItemStats: getMany,
				getItemStats: get,
				setItemStats: set
			})))
}

module.exports = {
	create: ({ eedata } = {}) => ({
		load: () => eedata.load().then(dbActions)
	})
}
