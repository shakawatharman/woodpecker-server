const express = require("express");

const app = express();

const cors = require("cors");

const port = process.env.PORT || 5000;

const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

app.use(cors());

app.use(express.json());

const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a0htp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("woodpecker");
    const productsCollection = database.collection("products");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      console.log("hitting the post", req.body);
      res.json(result);
    });

    app.get("/products", async (req, res) => {
      const productsData = await productsCollection.find({}).toArray();
      console.log(productsData);
      res.json(productsData);
    });

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewsCollection.insertOne(newReview);
      res.json(result);
    });

    app.get("/reviews", async (req, res) => {
      const reviewsData = await reviewsCollection.find({}).toArray();
      res.json(reviewsData);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("hitting the post", req.body);
      res.json(result);
    });

    app.get("/users", async (req, res) => {
      const usersData = await usersCollection.find({}).toArray();
      res.json(usersData);
    });
// all users orders 
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const ordersData = await ordersCollection.find({}).toArray();
      res.json(ordersData);
    });

    // GET Single User Orders
    app.get("/myOrders/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

     // Checking is user are Admin
     app.get("/users/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin });
      });

          // Update User Order Status
          app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(updatedStatus);
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            ordersCollection
              .updateOne(filter, {
                $set: { status: updatedStatus.status },
              })
              .then((result) => {
                res.send(result);
              });
          });

          //delete order by
          app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
      
           
      
            res.json(result);
          });
          //delete product by
          app.delete("/deleteProduct/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
      
           
      
            res.json(result);
          });

          // make an user admin and
          app.put("/updateRole/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(updatedStatus);
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            usersCollection
              .updateOne(filter, {
                $set: { role: updatedStatus.role },
              })
              .then((result) => {
                res.send(result);
              });
          });


    console.log("connected");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("server is running");
  res.send("Hello People");
});

app.listen(port, () => {
  console.log("listening to the port", port);
});
