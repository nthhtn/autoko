export default class StockModel {

	constructor(db) {
		this._db = db;
		this._collection = 'car_stock';
	}

	async create(object) {
		try {
			const value = await this._db.collection(this._collection).insertOne(object);
			return Promise.resolve(value);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async read(_id) {
		try {
			const data = await this._db.collection(this._collection).findOne({ _id });
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async update(_id, data) {
		try {
			const result = await this._db.collection(this._collection).findOneAndUpdate({ _id }, { $set: data }, { returnOriginal: false });
			return Promise.resolve(result.value);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async delete(_id) {
		try {
			const result = await this._db.collection(this._collection).findOneAndDelete({ _id });
			return Promise.resolve(result.value);
		} catch (error) {
			return Promise.reject(error);
		}

	}

	async createMany(list) {
		try {
			const value = await this._db.collection(this._collection).insertMany(list);
			return Promise.resolve(value);
		} catch (error) {
			return Promise.reject(error);
		}

	}

	async queryByFields(fields = {}, sort = { date_posted: -1 }, limit = 9, offset = 0) {
		try {
			const list = await this._db.collection(this._collection).find(fields).sort(sort).skip(offset).limit(limit).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async countByFields(fields = {}) {
		try {
			const count = await this._db.collection(this._collection).find(fields).count();
			return Promise.resolve(count);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async lookup(fields = {}, keyword = '', sort = { date_posted: -1 }, limit = 9, offset = 0) {
		try {
			const regex = new RegExp(keyword, 'gi');
			let aggregate = [];
			let match = Object.assign({});
			let match_or = [];
			if (fields.manufacturer_id) {
				match.manufacturer_id = fields.manufacturer_id;
			} else {
				const manufacturer_lookup = {
					from: 'car_manufacturer',
					localField: 'manufacturer_id',
					foreignField: '_id',
					as: 'manufacturer'
				};
				aggregate.push({ '$lookup': manufacturer_lookup });
				const manufacturer_unwind = { '$unwind': '$manufacturer' };
				aggregate.push(manufacturer_unwind);
				match_or.push({ 'manufacturer.name': { $regex: regex, $options: 'i' } });
			}
			if (fields.model_id) {
				match.model_id = fields.model_id;
			} else {
				const model_lookup = {
					from: 'car_model',
					localField: 'model_id',
					foreignField: '_id',
					as: 'model'
				};
				aggregate.push({ '$lookup': model_lookup });
				const model_unwind = { '$unwind': '$model' };
				aggregate.push(model_unwind);
				match_or.push({ 'model.name': { $regex: regex, $options: 'i' } });
			}
			if (fields.price) { match.price = fields.price; }
			if (match_or.length > 0) { match['$or'] = match_or; }
			aggregate.push({ '$match': match });
			const list = await this._db.collection(this._collection).aggregate(aggregate).sort(sort).skip(offset).limit(limit).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
