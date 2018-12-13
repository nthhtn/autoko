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

	async readAsSeller(seller_id) {
		try {
			let aggregate = [];
			const manufacturer_lookup = {
				from: 'car_manufacturer',
				localField: 'manufacturer_id',
				foreignField: '_id',
				as: 'manufacturer'
			};
			aggregate.push({ '$lookup': manufacturer_lookup });
			const manufacturer_unwind = { '$unwind': '$manufacturer' };
			aggregate.push(manufacturer_unwind);
			const model_lookup = {
				from: 'car_model',
				localField: 'model_id',
				foreignField: '_id',
				as: 'model'
			};
			aggregate.push({ '$lookup': model_lookup });
			const model_unwind = { '$unwind': '$model' };
			aggregate.push(model_unwind);
			// const seller_lookup = {
			// 	from: 'user',
			// 	localField: 'seller_id',
			// 	foreignField: '_id',
			// 	as: 'seller'
			// };
			// aggregate.push({ '$lookup': seller_lookup });
			// const seller_unwind = { '$unwind': '$seller' };
			// aggregate.push(seller_unwind);
			const buyer_lookup = {
				from: 'user',
				localField: 'buyer_id',
				foreignField: '_id',
				as: 'buyer'
			};
			aggregate.push({ '$lookup': buyer_lookup });
			const buyer_unwind = {
				'$unwind': {
					path: '$buyer',
					preserveNullAndEmptyArrays: true
				}
			};
			aggregate.push(buyer_unwind);
			aggregate.push({ '$match': { seller_id } });
			const list = await this._db.collection(this._collection).aggregate(aggregate).sort({ date_posted: -1 }).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async readAsBuyer(buyer_id) {
		try {
			let aggregate = [];
			const manufacturer_lookup = {
				from: 'car_manufacturer',
				localField: 'manufacturer_id',
				foreignField: '_id',
				as: 'manufacturer'
			};
			aggregate.push({ '$lookup': manufacturer_lookup });
			const manufacturer_unwind = { '$unwind': '$manufacturer' };
			aggregate.push(manufacturer_unwind);
			const model_lookup = {
				from: 'car_model',
				localField: 'model_id',
				foreignField: '_id',
				as: 'model'
			};
			aggregate.push({ '$lookup': model_lookup });
			const model_unwind = { '$unwind': '$model' };
			aggregate.push(model_unwind);
			const seller_lookup = {
				from: 'user',
				localField: 'seller_id',
				foreignField: '_id',
				as: 'seller'
			};
			aggregate.push({ '$lookup': seller_lookup });
			const seller_unwind = { '$unwind': '$seller' };
			aggregate.push(seller_unwind);
			aggregate.push({ '$match': { buyer_id } });
			const list = await this._db.collection(this._collection).aggregate(aggregate).sort({ date_posted: -1 }).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}


	async queryByFields(fields = {}, sort = { date_posted: -1 }) {
		try {
			const list = await this._db.collection(this._collection).find(fields).sort(sort).toArray();
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

	async lookup(fields = {}, keyword = '', sort = { date_posted: -1 }) {
		try {
			const regex = new RegExp(keyword, 'gi');
			let aggregate = [];
			let match = Object.assign({});
			let match_or = [];
			if (fields.manufacturer_id) {
				match.manufacturer_id = fields.manufacturer_id;
			}
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
			if (fields.model_id) {
				match.model_id = fields.model_id;
			}
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
			if (fields.price) { match.price = fields.price; }
			if (fields.power) { match['model.power'] = fields.power; }
			if (fields.engine) { match['model.engine'] = fields.engine; }
			if (fields.cylinder) { match['model.cylinder'] = fields.cylinder; }
			if (fields.color) { match.color = fields.color; }
			if (fields.fuel) { match.fuel = fields.fuel; }
			if (fields.transmission) { match.transmission = fields.transmission; }
			if (fields.purchase_status) { match.purchase_status = fields.purchase_status; }
			match_or.push({ 'name': { $regex: regex, $options: 'i' } });
			match_or.push({ 'description': { $regex: regex, $options: 'i' } });
			aggregate.push({ '$match': match });
			const list = await this._db.collection(this._collection).aggregate(aggregate).sort(sort).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
