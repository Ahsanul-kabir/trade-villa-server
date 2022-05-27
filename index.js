const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vl9uy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('tradeVilla').collection('products');
        const ordersCollection = client.db('tradeVilla').collection('orders');

        // all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // get a product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query)
            res.send(result);
        })

        //  Add a new Order
        app.post('/addOrder', async (req, res) => {
            const newProduct = req.body;
            const result = await ordersCollection.insertOne(newProduct);
            res.send(result);
        })

        // my orders
        app.get('/myOrders/:email', async (req, res) => {
            const query = { email: req.params.email };
            const cursor = ordersCollection.find(query);
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Doctor Uncle!')
})

app.listen(port, () => {
    console.log(`Doctors App listening on port ${port}`)
})