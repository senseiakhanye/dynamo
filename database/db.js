const { MongoClient, Cursor, ObjectId } = require('mongodb');
const { connect } = require('mongoose');
const jwt = require('jsonwebtoken');

const uri = "MONGO_URL=mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectDb = async() => {
    await client.connect();
}

connectDb();

const getDb = (db, collectionName) => {
    const database = client.db(db);
    const collection = database.collection(collectionName);
    return collection;
}

const dropDb = async (db) => {
    try {
        const database = client.db(db);
        return await database.dropDatabase(db);
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

const isDbFree = async (db) => {
    try {
        const admin = client.db("test").admin();
        const dbData = await admin.listDatabases();
        return dbData.databases.find(tDb => tDb.name.toLowerCase() == db.toLowerCase()) == null;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

const createDb = async (db) => {
    const collection = getDb(db, "api--key--unique--5578");
    const token = jwt.sign( { db }, process.env.JWT_SECRET );
    return await collection.insertOne( { token });
}

const addIngredient = async(db, ingredient) => {
    const database = client.db(db);
    const collection = database.collection("ingredients");
    const result = await collection.insertOne(ingredient);
    // await client.close();
    return result;
}

const getIngredients = async(db) => {
    // await client.connect();
    const database = client.db(db);
    const collection = database.collection("ingredients");
    const ingridients = collection.find({});
    // await client.close();
    return ingridients;
}

const deleteIngredient = async(db, id) => {
    const database = client.db(db);
    const collection = database.collection("ingredients");
    const deletedIngredient = await collection.findOneAndDelete({ _id: ObjectId(id) });
    return deletedIngredient;
}

const clearAll = async(db) => {
    // await client.connect();
    const database = client.db(db);
    const collection = database.collection("ingredients");
    await collection.deleteMany({});
    // await client.close();
    return true;
}

module.exports = {
    addIngredient,
    getIngredients,
    clearAll,
    deleteIngredient,
    isDbFree,
    createDb,
    dropDb
}