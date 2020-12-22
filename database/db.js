const { MongoClient, Cursor, ObjectId } = require('mongodb');
const { connect } = require('mongoose');

const uri = "MONGO_URL=mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectDb = async() => {
    await client.connect();
}

connectDb();

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
    deleteIngredient
}