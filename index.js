const express = require('express');

const app = express();

const cors = require('cors');

const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors());

app.use(express.json());

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a0htp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try{
        await client.connect();
        const database = client.db("woodpecker")
        const productsCollection = database.collection("products")
        const reviewsCollection = database.collection("reviews")

        app.get('/products',async(req,res)=>{
            const productsData = await productsCollection.find({}).toArray();
            console.log(productsData);
            res.json(productsData);
        })

        app.get('/reviews',async(req,res)=>{
            const reviewsData = await reviewsCollection.find({}).toArray();
            res.json(reviewsData);
        })

        app.post('/products',async(req,res)=>{
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct)
            console.log('hitting the post',req.body)
            res.json(result)
        })

        app.post('/reviews',async(req,res)=>{
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview)
            res.json(result)
        })

        console.log('connected')
    }

    finally{
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/',(req,res)=>{
    console.log('server is running')
    res.send('matha thik nai')
})

app.listen(port,()=>{
    console.log('listening to the port', port)
})