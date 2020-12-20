const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
module.exports = {classes: router, deleteClass};

// Get Classes of school
router.get("/:school_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const collection = client.db("orienteering-race-project").collection("schools");
    const school = await collection.findOne({ _id: mongodb.ObjectID(req.params.school_id) });
    school.id = school._id;
    school.classes.forEach((cls) => {
      cls.id = cls._id;
    });
    res.send(school);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

// Add new class
router.post("/:school_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const collection = client.db("orienteering-race-project").collection("schools");
    const newClass = {
      _id: mongodb.ObjectID(),
      name: req.body.name,
    };
    collection.updateOne({ _id: mongodb.ObjectID(req.params.school_id) }, { $push: { classes: newClass } }, (err, re) => {
      if (err) throw err;
      console.log("New class added succesfully");
      client.close();
    });
    res.status(200).send({ id: newClass._id });
  } catch (error) {
    console.log(error);
    client.close();
  }
});

async function deleteClass(client, class_id) {
  const collection = client.db("orienteering-race-project").collection("schools");
  const sessions = client.db("orienteering-race-project").collection("sessions");
  await sessions.deleteOne({class_id: mongodb.ObjectID(class_id)})
  await collection.updateOne(
    { classes: { $elemMatch: { _id: mongodb.ObjectID(class_id) } } },
    { $pull: { classes: { _id: mongodb.ObjectID(class_id) } } }
  );
}

// Delete class
router.delete("/:class_id", async (req, res) => {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await deleteClass(client, req.params.class_id);
    res.status(200).send();
  } catch (error) {
    console.log(error);
	client.close();
	res.status(500).send();
  }
});

