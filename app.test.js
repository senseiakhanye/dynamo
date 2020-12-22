const request = require('supertest');
const { clearAll, addIngredient, getIngredients } = require('./database/db');
const app = require('./app');

const testDb = "myshop-test";

describe("ingredient db test", () => {
    beforeEach(async (done) => {
        await clearAll(testDb);
        done();
    });

    it("Should store a client", async (done) => {
        const sampleIngredient = {
            title: "test",
            amount: 10
        }
        const ingridient = await addIngredient(testDb, sampleIngredient);
        expect(ingridient).toBeTruthy();
        done();
    });

    it("should return two objects", async (done) => {
        const sampleIngredient = {
            title: "test",
            amount: 10
        }
        const sampleIngredient1 = {
            title: "test",
            amount: 10
        }
        await addIngredient(testDb, sampleIngredient);
        await addIngredient(testDb, sampleIngredient1);
        const ingridients = await getIngredients(testDb);
        const ingridientsArry = await ingridients.toArray();
        expect(ingridientsArry).toHaveLength(2);
        done();
    });
});

describe("ingridient api", () => {
    beforeEach(async (done) => {
        await clearAll("myshop")
        done();
    });

    afterAll(async (done) => {
        await clearAll("myshop");
        done();
    });

    it("Should store a client via api", async (done) => {
        const sampleIngredient = {
            title: "test",
            amount: 10
        }
        const response = await request(app)
            .post("/ingredient")
            .send(sampleIngredient)
            .expect(201);
        expect(response.body).toMatchObject({title: "test", amount: 10, _id: expect.any(String)});
        done();
    });

    it("should return two objects via api", async (done) => {
        const sampleIngredient = {
            title: "test",
            amount: 10
        }
        const sampleIngredient1 = {
            title: "test",
            amount: 10
        }
        await addIngredient("myshop", sampleIngredient);
        await addIngredient("myshop", sampleIngredient1);
        const response = await request(app)
            .get("/ingredients")
            .send()
            .expect(200);
        expect(response.body).toHaveLength(2);
        done();
    });

    it("should delete item by id", async (done) => {
        const sampleIngredient = {
            title: "test",
            amount: 10
        }
        const sampleIngredient1 = {
            title: "test",
            amount: 10
        }
        await addIngredient("myshop", sampleIngredient1);
        const ingredient = await addIngredient("myshop", sampleIngredient);
        const response = await request(app)
            .delete(`/ingredient/${sampleIngredient._id}`)
            .send()
            .expect(200);
        expect(response.body.ok).toEqual(1);
        expect(response.body.value).toMatchObject({title: "test", amount: 10, _id: ingredient.ops[0]._id.toString()});
        const ingredientsResponse = await request(app)
            .get(`/ingredients`)
            .send()
            .expect(200);
        expect(ingredientsResponse.body).toHaveLength(1);
        done();
    });
});