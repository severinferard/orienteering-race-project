const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
module.exports = router;

// Get Posts
router.get("/", async (req, res) => {
  const sessions = await loadRunsCollection();
  res.send(await sessions.find({}).toArray());
});

router.get("/:session_id", async (req, res) => {
  const sessions = await loadRunsCollection();
  res.send(await sessions.findOne({ sessionId: req.params.session_id }));
});

router.put("/:session_id", async (req, res) => {
  try {
    const sessions = await loadRunsCollection();
    const myquery = { sessionId: req.params.session_id };
    const data = {
      _id: req.body._id,
      id: req.body.id,
      name: "",
      coords: req.body.coords,
    };
    const action = { $set: { "beacons.$[beacon]": data } };
    const options = { arrayFilters: [{ "beacon._id": data._id }] };
    sessions.updateOne(myquery, action, options, (err, res) => {
      if (err) throw err;
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/:session_id", async (req, res) => {
  try {
    const sessions = await loadRunsCollection();
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
  }
});

router.delete("/:session_id", async (req, res) => {
  try {
    const sessions = await loadRunsCollection();
    const myquery = { sessionId: req.params.session_id };
    const data = { _id: req.body._id };
    const action = {$pull: {beacons: { _id: data._id }}};
    sessions.updateOne(myquery, action, (err, res) => {
      if (err) throw err;
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

async function loadRunsCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  return client.db("orienteering-race-project").collection("sessions");
}

