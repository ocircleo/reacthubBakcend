const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
// middlewerer
app.use(cors());
app.use(express.json());
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/?retryWrites=true&w=majority`;
// sort by category
//sort by price
//sort by ratings
//ratings ratingsCount
//ratings shipping

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const chatHub = client.db("reacthub").collection("data");
    // Send a ping to confirm a successful connection
    app.get("/", async (req, res) => {
      res.send(
        `app is running at port-- ${"https://reacthubbackend.vercel.app/"}`
      );
    });
    app.get("/product/:id", async (req, res) => {
      let id = req.params.id;
      const result = await chatHub.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.get("/approximate", async (req, res) => {
      const result = await chatHub.estimatedDocumentCount();
      res.send({ length: result });
    });
    app.get("/range", async (req, res) => {
      const start = parseInt(req.query.start) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort;
      const sortOption = sort ? { [sort]: 1 } : {};
      console.log(sort);
      const result = await chatHub
        .find()
        .sort(sortOption)
        .skip(start)
        .limit(limit)
        .toArray();
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
