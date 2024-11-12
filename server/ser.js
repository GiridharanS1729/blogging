const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 1729;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/Blogging";
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
    _id: { type: Number },
    aimage: { type: String, default: "/images/aut.png" },
    author: { type: String, default: "Your name" },
    mail: { type: String },
    password: { type: String },
    bio: { type: String, default: "Your bio" },
    joined: { type: String, default: new Date().toISOString().slice(0, 10) },
    followers: { type: String, default: "25" },
    following: { type: String, default: "10" },
    publication: { type: String, default: "Tech Trends" },
    totalposts: { type: Number, default: 0 },
    category: { type: String, default: "Innovation" },
    blogids: [{ type: Number, default: [] }]
});
const User = mongoose.model('User', userSchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    aid: { type: Number, ref: 'User' },
    title: { type: String, required: true, default: "Title of the Blog" },
    imagepath: { type: String, required: true, default: "/images/a.jpg" },
    description: { type: String, required: true, default: "Description of the Blog" },
    subject: { type: String, required: true, default: "subject of this blog" },
    date: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
});
const Blog = mongoose.model('Blog', blogSchema);

// Generalized Sequence Value Finder
const getNextSequenceValue = async (Model) => {
    const docs = await Model.find({}, { _id: 1 });
    const ids = docs.map(doc => doc._id).sort((a, b) => a - b);
    let nextId = 1;
    for (const id of ids) {
        if (id === nextId) nextId++;
        else if (id > nextId) return nextId;
    }
    return nextId;
};

// Helper to handle async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// User Signup
app.post('/signup', asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) return res.status(400).json({ message: "Mail and password are required" });

    const _id = await getNextSequenceValue(User);
    const newUser = new User({ _id, mail, password });
    await newUser.save();
    res.status(201).json({ _id });
}));

// User Login
app.post('/login', asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.password === password) return res.json({ aid: user._id, success: true });
    res.json({ success: false, message: 'Invalid password' });
}));

// User Update
app.put('/createuser', asyncHandler(async (req, res) => {
    const { _id, author, bio, publication, category, aimage } = req.body;
    if (!Number.isInteger(_id)) return res.status(400).json({ message: "Invalid user ID." });

    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.author = author || user.author;
    user.bio = bio || user.bio;
    user.publication = publication || user.publication;
    user.category = category || user.category;
    user.aimage = aimage || user.aimage;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
}));

// Fetch All Users
app.get("/users", asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
}));

// Fetch Single User by ID
app.get("/users/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
}));

// Blog Creation
app.post("/createblog", asyncHandler(async (req, res) => {
    const {
        aid, title, imagepath, subject, description,
        date = new Date().toISOString().slice(0, 10),
        likes = 100, comments = 50
    } = req.body;

    const _id = await getNextSequenceValue(Blog);
    const newBlog = new Blog({
        _id, aid, title, subject, description, imagepath, date, likes, comments
    });
    await newBlog.save();

    await User.findByIdAndUpdate(aid, { $inc: { totalposts: 1 }, $push: { blogids: _id } }, { new: true, upsert: true });
    res.status(201).json(newBlog);
}));

// Fetch All Blogs
app.get("/blogs", asyncHandler(async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
}));

// Fetch Blog by ID
app.get("/blogs/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
}));

// Blog Search
app.get("/blogs/search", asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    const regex = new RegExp(query, 'i');
    const blogs = await Blog.find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }]
    });
    res.json(blogs);
}));


// Delete Blog by ID
app.delete('/deleteblog/:id', async (req, res) => {
    try {
        const blogId = parseInt(req.params.id);
        const deletedBlog = await db.db().collection("Blog").findOneAndDelete({ _id: blogId });

        if (!deletedBlog.value) {
            return res.status(404).send({ message: 'Blog not found' });
        }

        // Update User's blogids array after blog deletion (if required)
        await db.db().collection("User").updateMany(
            { blogids: blogId },
            { $pull: { blogids: blogId } }
        );

        res.status(200).send({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).send({ message: 'Error deleting blog' });
    }
});

// Update Blog by ID
app.put('/updateblog/:id', async (req, res) => {
    try {
        const blogId = parseInt(req.params.id);
        const updatedData = req.body;

        const updatedBlog = await db.db().collection("Blog").findOneAndUpdate(
            { _id: blogId },
            { $set: updatedData },
            { returnOriginal: false }
        );

        if (!updatedBlog.value) {
            return res.status(404).send({ message: 'Blog not found' });
        }

        res.status(200).send({ message: 'Blog updated successfully', blog: updatedBlog.value });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send({ message: 'Error updating blog' });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send(`<h1>Server is running on port <b>${port}</b></h1>`);
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
