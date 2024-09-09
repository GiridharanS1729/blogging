const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 1729;
const dbname = "blog";

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Blogging", { useNewUrlParser: true, useUnifiedTopology: true });

// Counter Schema for Auto-Incrementing _id
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('counter', counterSchema);

// User Schema with Default Values
const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    imagepath: { type: String, required: true },
    description: { type: String, required: true },
    aimage: { type: String, default: "/images/aut.png" },
    subject: { type: String, default: "Master asynchronous operations with async/await." },
    author: { type: String, default: "Giridharan S" },
    bio: { type: String, default: "React enthusiast and Full Stack Developer" },
    followers: { type: String, default: "2544" },
    following: { type: String, default: "1729" },
    publication: { type: String, default: "Tech Trends" },
    totalposts: { type: String, default: "123" },
    read: { type: String, default: "10 min" },
    date: { type: String, default: "2023-05-25" },
    likes: { type: String, default: "15.3K" },
    comments: { type: String, default: "320" },
    quote: { type: String, default: "Happiness is not by chance, but by your own choice." },
    category: { type: String, default: "Innovation" }
});


// Auto-Increment Function
const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
};

const User = mongoose.model(dbname, userSchema, dbname);

app.get("/blogs", (req, res) => {
    User.find().then((data) => res.json(data))
        .catch(err => res.json(err));
});

app.get("/blogs/:id", (req, res) => {
    const { id } = req.params;
    User.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.get("/users", (req, res) => {
    User.find().then((data) => res.json(data))
        .catch(err => res.json(err));
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    User.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});

app.get('/posts/:id', async (req, res) => {
    try {
        const post = await User.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





// Create Post Route
app.post("/createpost", async (req, res) => {
    try {
        const { title, imagepath, description } = req.body;

        // Get auto-incremented _id
        const _id = await getNextSequenceValue("userId");

        const newPost = new User({
            _id,
            title,
            imagepath,
            description
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error while creating post' });
    }
});






app.get('/', (req, res) => {
    res.json("Welcome to Blogging Platform");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});






