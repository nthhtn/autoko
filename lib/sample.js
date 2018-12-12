import crypto from 'crypto';
import mongodb from 'mongodb';
import mongo_url from '../config/mongo';
import sample from '../config/sample';
import UserModel from '../model/user';
import ManufacturerModel from '../model/car_manufacturer';
import ModelModel from '../model/car_model';

const { MongoClient, ObjectID } = mongodb;

module.exports = async () => {
	try {
		// CONNECT TO DB
		const client_FI = await MongoClient.connect(mongo_url.FI, { useNewUrlParser: true });
		const db_FI = await client_FI.db(mongo_url.FI.split('/')[3]);
		const client_SE = await MongoClient.connect(mongo_url.SE, { useNewUrlParser: true });
		const db_SE = await client_SE.db(mongo_url.SE.split('/')[3]);
		const client_NO = await MongoClient.connect(mongo_url.NO, { useNewUrlParser: true });
		const db_NO = await client_NO.db(mongo_url.NO.split('/')[3]);
		// INIT USER
		const user_list = sample.user_list.map((item) => {
			item._id = new ObjectID().toString();
			const random = Math.floor((Math.random() * 10) + 1);
			// item.type = random % 2 === 0 ? 'registered' : 'guest';
			// if (item.type === 'registered') { item.password = crypto.createHash('md5').update('123456789').digest('hex'); }
			item.type = 'registered';
			item.password = crypto.createHash('md5').update('123456789').digest('hex');
			return item;
		});
		const UserFI = new UserModel(db_FI);
		const UserSE = new UserModel(db_SE);
		const UserNO = new UserModel(db_NO);
		await UserFI.createMany(user_list);
		await UserSE.createMany(user_list);
		await UserNO.createMany(user_list);
		// INIT MANUFACTURER
		const manufacturer_list = sample.manufacturer_list.map((name) => ({
			_id: new ObjectID().toString(),
			name
		}));
		const ManufacturerFI = new ManufacturerModel(db_FI);
		const ManufacturerSE = new ManufacturerModel(db_SE);
		const ManufacturerNO = new ManufacturerModel(db_NO);
		await ManufacturerFI.createMany(manufacturer_list);
		await ManufacturerSE.createMany(manufacturer_list);
		await ManufacturerNO.createMany(manufacturer_list);
		// INIT MODEL
		const ModelFI = new ModelModel(db_FI);
		const ModelSE = new ModelModel(db_SE);
		const ModelNO = new ModelModel(db_NO);
		const { power_list, fuel_list, transmission_list, cylinder_list, engine_list } = sample;
		let model_list = [];
		for (let item of sample.model_list) {
			item._id = new ObjectID().toString();
			const manufacturer = await ManufacturerFI.queryByFields({ name: item.manufacturer });
			item.manufacturer_id = manufacturer[0]._id;
			delete item.manufacturer;
			item.power = power_list[Math.floor(Math.random() * power_list.length)];
			item.fuel = fuel_list[Math.floor(Math.random() * fuel_list.length)];
			item.transmission = transmission_list[Math.floor(Math.random() * transmission_list.length)];
			item.cylinder = cylinder_list[Math.floor(Math.random() * cylinder_list.length)];
			item.engine = engine_list[Math.floor(Math.random() * engine_list.length)];
			model_list.push(item);
		}
		await ModelFI.createMany(model_list);
		await ModelSE.createMany(model_list);
		await ModelNO.createMany(model_list);
		// DONE
		console.log('Sample db initialized!');
	} catch (error) {
		console.log(error);
	}
};
