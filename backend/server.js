const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 1729;
const dbname = "blog";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB Atlas successfully"))
    .catch(err => console.error("Error connecting to MongoDB Atlas:", err));

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

// CRUD Operations
// Create Post
app.post("/createpost", async (req, res) => {
    try {
        const {
            title = "Understanding Async/Await in JavaScript",
            imagepath = "/images/a.jpg",
            description = "Asynchronous programming is a critical aspect...",
            aimage = "/images/aut.png",
            subject = "Master asynchronous operations with async/await.",
            author = "Giridharan S",
            bio = "React enthusiast and Full Stack Developer",
            followers = "2544",
            following = "1729",
            publication = "Tech Trends",
            totalposts = "123",
            read = "10 min",
            date = "2023-05-25",
            likes = "15.3K",
            comments = "320",
            quote = "Happiness is not by chance, but by your own choice.",
            category = "Innovation"
        } = req.body;

        const _id = await getNextSequenceValue("userId");

        const newPost = new User({
            _id,
            title,
            imagepath,
            description,
            aimage,
            subject,
            author,
            bio,
            followers,
            following,
            publication,
            totalposts,
            read,
            date,
            likes,
            comments,
            quote,
            category
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error while creating post' });
    }
});

// Read All Posts
app.get("/blogs", (req, res) => {
    User.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
});

// Read a Single Post by ID
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

// Search Posts
app.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regex = new RegExp(query, 'i');
        const blogs = await User.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });
        res.json(blogs);
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Server error while searching blogs' });
    }
});

// Update a Post
app.put("/blogs/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedPost = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error while updating post' });
    }
});

// Delete a Post
app.delete("/blogs/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await User.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
});

// Welcome Route
app.get('/', (req, res) => {
    res.json("Welcome to Blogging Platform");
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
