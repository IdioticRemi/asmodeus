/* eslint-disable @typescript-eslint/no-use-before-define */
// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
import { Provider, ProviderStore, util } from 'klasa';
import { MongoClient } from 'mongodb';

const { mergeDefault, mergeObjects, isObject } = util;

export default class extends Provider {

	public constructor(store: ProviderStore, file: string[], directory: string, public db: any) {
		super(store, file, directory);
	}

	public get exec() {
		return this.db;
	}

	// Table methods

	public async init() {
		const connection = mergeDefault({
			host: 'localhost',
			port: 27017,
			db: 'klasa',
			options: {}
		}, this.client.options.providers.mongodb);

		// If full connection string is provided, use that, otherwise fall back to individual parameters
		const connectionString = this.client.options.providers.mongodb.connectionString || `mongodb://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.db}`;

		const mongoClient = await MongoClient.connect(
			connectionString,
			mergeObjects(connection.options, { useNewUrlParser: true, useUnifiedTopology: true })
		);

		// @ts-ignore
		this.db = mongoClient.db(connection.db);

		this.client.console.debug('Connected to MongoDB!');
	}

	public hasTable(table: any) {
		return this.db.listCollections().toArray().then((collections: any[]) => collections.some((col: { name: any }) => col.name === table));
	}

	public createTable(table: any) {
		return this.db.createCollection(table);
	}

	public deleteTable(table: any) {
		return this.db.dropCollection(table);
	}

	// Document methods

	public getAll(table: any, filter = []) {
		if (filter.length) return this.db.collection(table).find({ id: { $in: filter } }, { _id: 0 }).toArray();
		return this.db.collection(table).find({}, { _id: 0 }).toArray();
	}

	public getKeys(table: any) {
		return this.db.collection(table).find({}, { id: 1, _id: 0 }).toArray();
	}

	public get(table: any, id: any) {
		return this.db.collection(table).findOne(resolveQuery(id));
	}

	public has(table: any, id: any) {
		return this.get(table, id).then(Boolean);
	}

	public getRandom(table: any) {
		return this.db.collection(table).aggregate({ $sample: { size: 1 } });
	}

	public create(table: any, id: any, doc = {}) {
		return this.db.collection(table).insertOne(mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)));
	}

	public delete(table: any, id: any) {
		return this.db.collection(table).deleteOne(resolveQuery(id));
	}

	public update(table: any, id: any, doc: any) {
		return this.db.collection(table).updateOne(resolveQuery(id), { $set: isObject(doc) ? flatten(doc) : this.parseUpdateInput(doc) });
	}

	public replace(table: any, id: any, doc: any) {
		return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc));
	}

}

const resolveQuery = (query: any) => isObject(query) ? query : { id: query };

function flatten(obj: any, path = '') {
	let output = {};
	for (const [key, value] of Object.entries(obj)) {
		if (isObject(value)) output = Object.assign(output, flatten(value, path ? `${path}.${key}` : key));
		// @ts-ignore
		else output[path ? `${path}.${key}` : key] = value;
	}
	return output;
}
