const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    let list = await sessions.find({}).toArray();
    list.forEach((v) => {
      delete v.runs;
      delete v.geosJon;
    });
    res.send(list);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

router.post("/", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    let newSession = {
      sessionName: req.body.sessionName,
      sessionId: Math.random().toString(36).slice(-5),
      date: req.body.date,
      beacons: [],
      runs: [],
    };
    sessions.insertOne(newSession, (err, res) => {
      if (err) throw err;
      console.log("success");
      client.close();
    });
  } catch (error) {
    console.log(error);
    client.close();
  }
});

router.get("/:session_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    res.send(await sessions.findOne({ sessionId: req.params.session_id }));
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

router.put("/:session_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    const myquery = { sessionId: req.params.session_id };
    const data = {
      _id: req.body._id,
      id: req.body.id,
      name: "",
      coords: req.body.coords,
    };
    console.log("coords", req.body.coords);
    const action = { $set: { "beacons.$[beacon]": data } };
    const options = { arrayFilters: [{ "beacon._id": data._id }] };
    sessions.updateOne(myquery, action, options, (err, res) => {
      if (err) throw err;
      client.close();
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    client.close();
  }
});

router.post("/:session_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    const myquery = { sessionId: req.params.session_id };
    const data = {
      _id: req.body._id,
      id: req.body.id,
      name: "",
      coords: req.body.coords,
    };
    const action = { $push: { beacons: data } };
    sessions.updateOne(myquery, action, (err, res) => {
      if (err) throw err;
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    client.close();
  }
});

router.delete("/:session_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    const myquery = { sessionId: req.params.session_id };
    const data = { _id: req.body._id };
    const action = { $pull: { beacons: { _id: data._id } } };
    sessions.updateOne(myquery, action, (err, res) => {
      if (err) throw err;
      client.close();
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    client.close();
  }
});
