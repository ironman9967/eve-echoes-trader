
module.exports = {
	create: ({
		Hapi,
		port,
		market: { search, getItem, getItemNames, getItemByItemId }
	} = {}) => {
		const server = Hapi.server({ port })
		server.route({
			method: 'GET',
			path: '/item/search',
			handler: (req, h) => {
				const term = req.query.term
				return !term
					? h.response({ msg: 'term is required' }).code(400)
					: search(term).then(item => item
						? h.response(item)
						: h.response({ msg: 'no match' }))
			}
		})
		server.route({
			method: 'GET',
			path: '/item/names',
			handler: () => getItemNames()
		})
		server.route({
			method: 'GET',
			path: '/item/{itemId}',
			handler: (req, h) => getItemByItemId(req.params.itemId)
				.then(item => item
					? h.response(item)
					: h.response({ msg: 'no match' }))
		})
		server.route({
			method: 'GET',
			path: '/item',
			handler: (req, h) => {
				const name = req.query.name
				return !name
					? h.response({ msg: 'name is required' }).code(400)
					: getItem(name).then(item => item
						? h.response(item)
						: h.response({ msg: 'no match' }))
			}
		})
		return { start: () => server.start() }
	}
}
