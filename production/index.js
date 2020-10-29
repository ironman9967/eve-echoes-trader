
module.exports = {
	create: ({
		productionData
	} = {}) => {
		return {
			productionData,
			production: productionData.map(({
				requirements,
				products,
				...data
			}, i) => ({
				id: i,
				requirements: requirements.map((data, i) => ({id: i, ...data })),
				products: products.map((data, i) => ({id: i, ...data })),
				...data
			}))
		}
	}
}
