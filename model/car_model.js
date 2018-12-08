export default class ModelModel {

	constructor(db) {
		this._db = db;
		this._collection = 'car_model';
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

	async queryByFields(fields) {
		try {
			const list = await this._db.collection(this._collection).find(fields).toArray();
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
