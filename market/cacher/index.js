
module.exports = {
	create: ({
		fs,
		path,
		Buffer,
		walkdir,
		_get,
		_set,
		rootKey = '_data',
		cacheDir = 'cache'
	} = {}) => {
		const r = v => Promise.resolve(v)
		const clearInMem = () => _set(rootKey)({})({})
		const clear = () => {
			clearInMem()
			return fs.emptyDir(cacheDir)
		}
		const cache = clearInMem()
		const getRoot = () => _get(rootKey)(cache)
		const get = key => r(key ? _get(key)(getRoot()) : getRoot())
		const set = key => value => {
			cache[rootKey] = _set(key)(value)(getRoot())
			const buf = Buffer.from(JSON.stringify(value, null, '\t'))
			fs.ensureDir(cacheDir)
			return fs.writeFile(`${cacheDir}/${key}.json`, new Uint8Array(buf))
				.then(() => key)
		}
		const list = key => r(Object.keys(get(key)))
		const load = () => fs.ensureDir(cacheDir)
			.then(() => walkdir.async(cacheDir))
			.then(files => Promise.all(files.map(file => fs.readFile(file, 'utf8')
				.then(JSON.parse)
				.then(obj => {
					const res = {}
					res[path.basename(file).replace('.json', '')] = obj
					return res
				}))))
			.then(objs => objs.reduce((c, obj) => ({ ...c, ...obj }), {}))
			.then(c => Object.keys(c).forEach(key =>
				cache[rootKey] = _set(key)(c[key])(getRoot())))
			.then(() => ({ list, get, set, clear }))
		return { load }
	}
}
