const express = require('express');
const { addIngredient, getIngredients, deleteIngredient } = require('./database/db');
const { ObjectID } = require("mongodb");


const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

app.get("/ingredients", async(req, res) => {
    try {
        const ingridientsCursor = await getIngredients("myshop");
        const ingridients = await ingridientsCursor.toArray();
        res.send(ingridients);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

app.post("/ingredient", async(req, res) => {
    try {
        const ingredient = await addIngredient("myshop", req.body);
        if (ingredient != null && ingredient.ops != null && ingredient.ops[0] != null) {
            res.status(201).send(ingredient.ops[0]);
        } else {
            throw new Error("Ingridient not stored");
        }
    } catch (error) {
        res.status(500).send();
    }
});

app.delete("/ingredient/:id", async(req, res) => {
    try {
        if (req.params.id == null || !ObjectID.isValid(req.params.id)) {
            return res.status(400).send();
        }
        const deletedRecord = await deleteIngredient("myshop", req.params.id);
        if (deletedRecord == null) {
            return res.status(204).send();
        }
        res.send(deletedRecord);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = app;
