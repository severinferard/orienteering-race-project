const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
module.exports = router;

// Get student data
router.get("/:session_id/:student_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    const session = (await sessions.find({ sessionId: req.params.session_id }).toArray())[0];
    let run = session.runs.filter((run) => run.id === req.params.student_id)[0];
    run.sessionName = session.sessionName;
    run.sessionId = session.sessionId;
    res.send(run);
  } catch (error) {
    res.status(404).send();
  } finally {
    client.close();
  }
});

// Store comment and rating
router.post("/:session_id/:student_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const sessions = client.db("orienteering-race-project").collection("sessions");
    const myquery = { sessionId: req.params.session_id };
    const newvalues = {
      $set: {
        "runs.$[run].comment": req.body.comment,
        "runs.$[run].rating": req.body.rating,
      },
    };
    const options = {
      arrayFilters: [{ "run.id": req.params.student_id }],
    };
    sessions.updateOne(myquery, newvalues, options, (err, res) => {
      if (err) throw err;
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  } finally {
    client.close();
  }
});

async function loadRunsCollection() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client.db("orienteering-race-project").collection("sessions");
}
