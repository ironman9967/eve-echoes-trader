
module.exports = {
	create: ({
		Hapi,
		port,
		tls,
		aboutJson,
		market: { search, getItem, getItemNames, getItemByItemId }
	} = {}) => {
		const server = Hapi.server({ port, tls })
		server.route({
			method: 'GET',
			path: '/api/about',
			handler: (req, h) => h.response(aboutJson)
		})
		server.route({
			method: 'GET',
			path: '/api/item/search',
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
			path: '/api/item/names',
			handler: () => getItemNames()
		})
		server.route({
			method: 'GET',
			path: '/api/item/{itemId}',
			handler: (req, h) => getItemByItemId(req.params.itemId)
				.then(item => item
					? h.response(item)
					: h.response({ msg: 'no match' }))
		})
		server.route({
			method: 'GET',
			path: '/api/item/{itemId}/stats',
			handler: (req, h) => getItemByItemId(req.params.itemId, true)
				.then(item => item
					? h.response(item)
					: h.response({ msg: 'no match' }))
		})
		server.route({
			method: 'GET',
			path: '/api/item',
			handler: (req, h) => {
				const name = req.query.name
				return !name
					? h.response({ msg: 'name is required' }).code(400)
					: getItem(name).then(item => item
						? h.response(item)
						: h.response({ msg: 'no match' }))
			}
		})
		server.route({
			method: '*',
			path: '/{p*}',
			handler: (req, h) => h.response().code(404)
		})
		return { start: () => server.start() }
	}
}
