// server.js

const express = require ('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 1729;
const dbname = "blog";
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Blogging");

const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    description: { type: String, required: true },
});

const user = mongoose.model(dbname, userSchema, dbname);
app.get("/blogs", (req, res) => {
    user.find().then((data) => { res.json(data) })
        .catch(err => { res.json(err) });

});

app.get("/blogs/:id", (req, res) => {
    const { id } = req.params;
    user.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.get("/users", (req, res) => {
    user.find().then((data) => { res.json(data) })
        .catch(err => { res.json(err) });

});


app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    user.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'user not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.get('/posts/:id', async (req, res) => {
    try {
        const post = await user.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/', (req, res) => {
    res.json("Welcome to visitor management system");
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})