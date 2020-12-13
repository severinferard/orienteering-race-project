const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()
module.exports = router

// Get all schools
router.get('/', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const collection = client.db('orienteering-race-project').collection('schools')
    const list = await collection.find({}).toArray()
    list.forEach((item) => { item.id = item._id })
    res.send(list)
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }
})

// Get Classes of school
router.get('/:school_id', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const collection = client.db('orienteering-race-project').collection('schools')
    const school = await collection.findOne({ _id: mongodb.ObjectID(req.params.school_id) })
    school.id = school._id
    school.classes.forEach(cls => { cls.id = cls._id })
    res.send(school)
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }
})

// Add new school
router.post('/', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const collection = client.db('orienteering-race-project').collection('schools')
    const newSchool = {
      name: req.body.name,
      _id: new mongodb.ObjectID(),
	  city: req.body.city,
	  classes: []
    }
    collection.insertOne(newSchool, (err, re) => {
      if (err) throw err
      console.log('success')
      res.send({ id: newSchool._id })
      client.close()
    })
  } catch (error) {
    console.log(error)
    client.close()
  }
})

// Add new class
router.post('/:school_id', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const collection = client.db('orienteering-race-project').collection('schools')
    const newClass = {
      _id: mongodb.ObjectID(),
      name: req.body.name
    }
    collection.updateOne({ _id: mongodb.ObjectID(req.params.school_id) }, { $push: { classes: newClass } }, (err, re) => {
      if (err) throw err
      console.log('success')
      client.close()
    })
    res.status(200).send({ id: newClass._id })
  } catch (error) {
    console.log(error)
    client.close()
  }
})
