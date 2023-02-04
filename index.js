const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc7bb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("travelUsDb");
    const packageCollection = database.collection("packages");
    const bookingCollection = database.collection("bookings");

    //GET API
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    //GET API for single package
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const foundPackage = await packageCollection.findOne(query);
      res.send(foundPackage);
    });

    //GET API for booking packages for all and single user
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      let orders;
      if (email) {
        const query = { email: email };
        const cursor = bookingCollection.find(query);
        bookings = await cursor.toArray();
      } else {
        const cursor = bookingCollection.find({});
        bookings = await cursor.toArray();
      }
      res.json(bookings);
    });

    //GET API for a single travel package
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bookedPackage = await bookingCollection.findOne(query);
      res.send(bookedPackage);
    });

    //POST API
    app.post("/packages", async (req, res) => {
      const newPackage = req.body;
      // console.log(newPackage);
      const result = await packageCollection.insertOne(newPackage);
      res.json(result);
    });

    //POST API for booked packages
    app.post("/bookings", async (req, res) => {
      const bookedPackage = req.body;
      // console.log(bookedPackage);
      const result = await bookingCollection.insertOne(bookedPackage);
      res.json(result);
    });

    //UPDATE API
    app.put("/bookings/update/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const updatedStatus = req.body.bookingStatus;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          bookingStatus: updatedStatus,
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //DELETE API for delete booked package
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello!! From Travel Us server app");
});

app.listen(port, () => {
  console.log("listening from port :", port);
});
