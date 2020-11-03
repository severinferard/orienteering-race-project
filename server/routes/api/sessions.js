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
  res.send(
    (await sessions.find({ sessionId: req.params.session_id }).toArray())[0]
  );
});

router.put("/:session_id", async (req, res) => {
  try {
    const sessions = await loadRunsCollection();
    const myquery = { sessionId: req.params.session_id };
    const value = {
      _id: req.body._id,
      id: req.body.id,
      name: "",
      coords: req.body.coords,
    };
    updateBeacon(sessions, myquery, value);
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
    const value = {
      _id: req.body._id,
      id: req.body.id,
      name: "",
      coords: req.body.coords,
    };
    addBeacon(sessions, myquery, value);
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
    const value = { _id: req.body._id };
    console.log("value", req.body);
    deleteBeacon(sessions, myquery, value);
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

function updateBeacon(sessions, myquery, data) {
  console.log("update", data);
  const action = {
    $set: { "beacons.$[beacon]": data },
  };
  const options = { arrayFilters: [{ "beacon._id": data._id }] };
  sessions.updateOne(myquery, action, options, (err, res) => {
    if (err) throw err;
    console.log("ok");
  });
}

function deleteBeacon(sessions, myquery, data) {
  console.log("delete", data);
  const action = {
    $pull: {
      beacons: { _id: data._id },
    },
  };
  sessions.updateOne(myquery, action, (err, res) => {
    if (err) throw err;
    console.log("ok");
  });
}

function addBeacon(sessions, myquery, data) {
  console.log("add", data);
  const action = {
    $push: {
      beacons: data,
    },
  };
  sessions.updateOne(myquery, action, (err, res) => {
    if (err) throw err;
    console.log("ok");
  });
}
