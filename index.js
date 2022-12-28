const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.01t3jpf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const allPostCollection = client.db('Message-book').collection('allPost');
        const allUsersCollection = client.db('Message-book').collection('users');

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

        app.put('/allPosts/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const oldPost = req.body;
            console.log(oldPost);
            const option = { upsert: true };
            const updatelove = {
                $set: {
                    post: oldPost.post,
                    title: oldPost.title,
                    email: oldPost.email,
                    img: oldPost.img,
                    love: oldPost.love

                }
            }
            const result = await allPostCollection.updateOne(unique, updatelove, option);
            res.send(result);
        })

        //User information -----------
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await allUsersCollection.insertOne(user)
            res.send(result);

        })

        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await allUsersCollection.findOne(query)
            res.send(user)
        })



        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const oldUser = req.body;
            const option = { upsert: true };
            const updateuserInfo = {
                $set: {
                    name: oldUser.name,
                    email: oldUser.email,
                    university: oldUser.university,
                    address: oldUser.address

                }
            }
            const result = await allUsersCollection.updateOne(unique, updateuserInfo, option);
            res.send(result);
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