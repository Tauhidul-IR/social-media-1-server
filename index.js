const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.01t3jpf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allPostCollection = client.db('Message-book').collection('allPost');

        app.get('/allPosts', async (req, res) => {
            const query = {}
            const options = await allPostCollection.find(query).toArray()
            res.send(options);
        })

        app.post('/addPost', async (req, res) => {
            const post = req.body
            const result = await allPostCollection.insertOne(post)
            res.send(result)
        })



    }
    finally {

    }

}
run().catch(error => console.log(error))




app.get('/', async (req, res) => {
    res.send('Message book server is running')
})
app.listen(port, () => {
    console.log(`Message book server running on port ${port}`);
})