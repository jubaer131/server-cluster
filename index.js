const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://dev-cluster:ZT9daPTbl22pWWvv@cluster0.8dssgfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
   
    const studentCollection = client.db("dev-cluster").collection("students");

    // app.get('/students', async (req, res) => {
    //   const result = await studentCollection.find().toArray();
    //   res.send(result);
    // });


    app.post('/students', async(req,res)=>{
        const addstudents =req.body
        const result = await studentCollection.insertOne(addstudents)
        res.send(result)
      })

      app.get('/students31', async (req, res) => {
        const { search } = req.query; 
        let query = {};
        if (search) {
          query = {
            $or: [
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
            ]
          };
        }
      
      
        const students33 = await studentCollection.find(query).toArray();
        res.send(students33);
      });
      
   
    

    app.delete('/registerdelete/:id',  async(req,res)=>{
        const id = req.params.id 
        console.log(id)
        const query = { _id : new ObjectId (id)}
        const result22 = await studentCollection.deleteOne(query)
        res.send(result22)
      })



      

    // Confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Start the server after the MongoDB connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// Base route
app.get('/', (req, res) => {
  res.send('Hello World!')
});
