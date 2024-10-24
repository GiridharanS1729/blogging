const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = 1729;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
const uri = process.env.MONGO_URL || "mongodb://localhost:27017/Blogging";
mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    }
    )
    .catch(err => console.error("Error connecting to MongoDB Atlas:", err));
const userSchema = new mongoose.Schema({
    _id: { type: Number },
    aimage: { type: String, default: "/images/aut.png" },
    author: { type: String, default: "Giridharan S" },
    bio: { type: String, default: "React enthusiast and Full Stack Developer" },
    followers: { type: String, default: "2544" },
    following: { type: String, default: "1729" },
    publication: { type: String, default: "Tech Trends" },
    totalposts: { type: String, default: "123" },
    category: { type: String, default: "Innovation" }
});
const User = mongoose.model('User', userSchema);
const blogSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true, default: "Title of the Blog" },
    imagepath: { type: String, required: true, default: "/images/a.jpg" },
    description: { type: String, required: true, default: "Description of the Blog" },
    subject: { type: String, default: "Master asynchronous operations with async/await." },
    read: { type: String, default: "10 min" },
    date: { type: String, default: "2023-05-25" },
    likes: { type: String, default: "15.3K" },
    comments: { type: String, default: "320" },
    quote: { type: String, default: "Happiness is not by chance, but by your own choice." }
});
const Blog = mongoose.model('Blog', blogSchema);

const getNextSequenceValueB = async () => {
    const blogs = await Blog.find({}, { _id: 1 });
    const ids = blogs.map(blog => blog._id);
    ids.sort((a, b) => a - b);
    let nextId = 1;
    for (const id of ids) {
        if (id === nextId) {
            nextId++;
        } else if (id > nextId) {
            return nextId;
        }
    }
    return nextId;
};
const getNextSequenceValueU = async () => {
    const blogs = await User.find({}, { _id: 1 });
    const ids = blogs.map(blog => blog._id);
    ids.sort((a, b) => a - b);
    let unextId = 1;
    for (const id of ids) {
        if (id === unextId) {
            unextId++;
        } else if (id > unextId) {
            return unextId;
        }
    }
    return unextId;
};
app.post("/createblog", async (req, res) => {
    try {
        const {
            title = "Understanding Async/Await in JavaScript",
            imagepath = "/images/a.jpg",
            description = "Asynchronous programming is a critical aspect...",
            subject = "Master asynchronous operations with async/await.",
            read = "10 min",
            date = "2023-05-25",
            likes = "15.3K",
            comments = "320",
            quote = "Happiness is not by chance, but by your own choice."
        } = req.body;
        const _id = await getNextSequenceValueB();
        const newBlog = new Blog({
            _id,
            title,
            imagepath,
            description,
            subject,
            read,
            date,
            likes,
            comments,
            quote
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error while creating blog post' });
    }
});
app.get("/blogs", (req, res) => {
    Blog.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
});
app.get("/blogs/:id", (req, res) => {
    const { id } = req.params;
    Blog.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});
app.get("/blogs/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const regex = new RegExp(query, 'i');
        const blogs = await Blog.find({
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
app.put("/blogs/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Server error while updating blog post' });
    }
});
app.delete("/blogs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Server error while deleting blog post' });
    }
});
app.post("/users/create", async (req, res) => {
    try {
        const {
            aimage = "/images/aut.png",
            author = "Giridharan S",
            bio = "React enthusiast and Full Stack Developer",
            followers = "2544",
            following = "1729",
            publication = "Tech Trends",
            totalposts = "123",
            category = "Innovation"
        } = req.body;
        const _id = await getNextSequenceValueU();
        const newUser = new User({
            _id,
            aimage,
            author,
            bio,
            followers,
            following,
            publication,
            totalposts,
            category
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
});
app.get("/users", (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching users', error: err }));
});
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    User.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'user not found' });
            }
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});
app.get("/", (req, res) => {
    res.send(`Port is Running Succesfully on <b>http://localhost:${port}</b>`);
});
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
