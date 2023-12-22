const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser')
require("dotenv").config()

// const user = []

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.otazdf5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




const db = client.db("taskDB");
const taskCollection = db.collection("userTasks");


// Create a MongoClient with a MongoClientOptions object to set the Stable API version






app.use(cors())
app.use(express.json());


const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log()

  if (!token) {
    return res.status(401).send({ error: "not authorized!" });
  } else {
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: "unauthorized" })
      }
      console.log(decoded.email);
      console.log(req.query.email);

      if (decoded.email === req.query.email) {
        req.user = decoded;
        next();

      } else {
        return res.status(403).send({ error: "forbidden!" })
      }
    })
  }
}




// created api to get product data by id
app.post("/task", async (req, res) => {
  const postData = req.body;

  const result = await taskCollection.insertOne(postData);
    res.status(200).send(result);
  
})

// created api to get product data by id
app.put("/task/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.query.email

  const filter = {_id: new ObjectId(id), email: email};

  const option = {
    upsert: true
  }

  const updatedDoc = {
    $set: req.body
  }

  const result = await taskCollection.updateOne(filter, updatedDoc, option);
    res.status(200).send(result);
  
})

// created api to get product data by id
app.patch("/task/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.query.email

  const filter = {_id: new ObjectId(id), email: email};

  const option = {
    upsert: true
  }

  const updatedDoc = {
    $set: req.body
  }

  const result = await taskCollection.updateOne(filter, updatedDoc, option);
    res.status(200).send(result);
  
})


// created api to get product data by id
app.get("/task", async (req, res) => {
  const status = req.query.status;
  const email = req.query?.email;

  console.log(status, email)

  const filter = (status && email) ? {status: status, email: email} : {email: email};

  const taskData = await taskCollection.find(filter).toArray();
    res.status(200).send(taskData);
  
})

// created api to get product data by id
app.get("/task/:id", async (req, res) => {
  const id = req.params.id;

  console.log(id)

  const filter =  {_id: new ObjectId(id)} 

  const taskData = await taskCollection.findOne(filter);
    res.status(200).send(taskData);
  
})

app.delete("/task/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.query.email
  const filter =  {_id: new ObjectId(id), email: email} 

  const result = await taskCollection.deleteOne(filter);
    res.status(200).send(result);

})

app.listen(port, () => {
  console.log(`server listening on ${port}`)
})
