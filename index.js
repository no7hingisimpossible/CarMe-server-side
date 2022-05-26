const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aj1bp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db('carMe').collection('products');
    const profile = client.db('profile').collection('client')
    const reviewCollection = client.db('user').collection('reviews')
    const orderCollection = client.db('order').collection('orders')
    const usersCollection = client.db('carMe').collection('user')

    //   Getting all products
    app.get("/products", async (req, res) => {
      const cursor = await productCollection.find({}).toArray()
      res.send(cursor)

    })

    //  Getting a single product by ID 
    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)

    })

    //   Updating a single product by ID
    app.put("/products/:id", async (req, res) => {
      const { id } = req.params;
      const quantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true }
      const updateQty = {
        $set: {
          quantity: quantity.quantity
        },

      };
      const result = productCollection.updateOne(filter, updateQty, options);
      res.send(result);
    })

    app.post("/profile", async (req, res) => {
      const user = req.body;
      const result = await profile.insertOne(user)
      res.send(result);
    })

    app.post("/review", async (req, res) => {
      const user = req.body;
      const result = await reviewCollection.insertOne(user)
      res.send(result)
    })

    app.get("/review", async (req, res) => {
      const cursor = await reviewCollection.find({}).toArray()
      res.send(cursor)
    })
    app.get("/order", async (req, res) => {
      const cursor = await orderCollection.find({}).toArray()
      res.send(cursor)
    })
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result)
    })
    app.get('/order', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const cursor = orderCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.delete('/order/:id', async (req, res) => {
      const {id} = req.params;
      const query = { _id: ObjectId(id) }
      console.log(id);
      const result = await orderCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/user/:email', async(req, res) => {
      const email = req.params.email; 
      const user = req.body; 
      const filter = {email: email}; 
      const options = { upsert: true}; 
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options); 
      res.send(result)
    })


  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res) => {
  res.send('Hello World')
})
app.listen(port, () => {
  console.log("listening to port", port)
})