const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 1729;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const uri = process.env.MONGO_URI; //|| "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "Blogging";
let db, usersCollection, blogsCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");
        db = client.db(dbName);
        usersCollection = db.collection("users");
        blogsCollection = db.collection("blogs");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connectToDatabase();

// Helper to handle async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Generalized Sequence Value Finder
const getNextSequenceValue = async (collection) => {
    const docs = await collection.find({}, { projection: { _id: 1 } }).toArray();
    const ids = docs.map(doc => doc._id).sort((a, b) => a - b);
    let nextId = 1;
    for (const id of ids) {
        if (id === nextId) nextId++;
        else if (id > nextId) return nextId;
    }
    return nextId;
};

// User Signup
app.post('/signup', asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) return res.status(400).json({ message: "Mail and password are required" });

    const _id = await getNextSequenceValue(usersCollection);
    const newUser = {
        _id,
        mail,
        password,
        aimage: "/images/aut.png",
        author: "Your name",
        bio: "Your bio",
        joined: new Date().toISOString().slice(0, 10),
        followers: "25",
        following: "10",
        publication: "Tech Trends",
        totalposts: 0,
        category: "Innovation",
        blogids: []
    };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ _id });
}));

// User Login
app.post('/login', asyncHandler(async (req, res) => {
    const { mail, password } = req.body;
    const user = await usersCollection.findOne({ mail });
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.password === password) return res.json({ aid: user._id, success: true });
    res.json({ success: false, message: 'Invalid password' });
}));

// User Update
app.put('/createuser', asyncHandler(async (req, res) => {
    const { _id, author, bio, publication, category, aimage } = req.body;
    if (!Number.isInteger(_id)) return res.status(400).json({ message: "Invalid user ID." });

    const user = await usersCollection.findOne({ _id });
    if (!user) return res.status(404).json({ message: "User not found." });

    const update = {
        author: author || user.author,
        bio: bio || user.bio,
        publication: publication || user.publication,
        category: category || user.category,
        aimage: aimage || user.aimage,
    };
    await usersCollection.updateOne({ _id }, { $set: update });
    res.status(200).json({ message: "User updated successfully" });
}));

// Fetch All Users
app.get("/users", asyncHandler(async (req, res) => {
    const users = await usersCollection.find().toArray();
    res.json(users);
}));

// Fetch Single User by ID
app.get("/users/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await usersCollection.findOne({ _id: parseInt(id) });
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

    const _id = await getNextSequenceValue(blogsCollection);
    const newBlog = {
        _id, aid, title, subject, description, imagepath, date, likes, comments
    };
    await blogsCollection.insertOne(newBlog);

    await usersCollection.updateOne({ _id: aid }, { $inc: { totalposts: 1 }, $push: { blogids: _id } });
    res.status(201).json(newBlog);
}));

// Fetch All Blogs
app.get("/blogs", asyncHandler(async (req, res) => {
    const blogs = await blogsCollection.find().toArray();
    res.json(blogs);
}));

// Fetch Blog by ID
app.get("/blogs/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await blogsCollection.findOne({ _id: parseInt(id) });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
}));

// Blog Search
app.get("/blogs/search", asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    const regex = new RegExp(query, 'i');
    const blogs = await blogsCollection.find({
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }]
    }).toArray();
    res.json(blogs);
}));

// Update Blog by ID
app.put("/blogs/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedBlog = await blogsCollection.findOneAndUpdate(
        { _id: parseInt(id) },
        { $set: req.body },
        { returnDocument: 'after' }
    );
    if (!updatedBlog.value) return res.status(404).json({ message: 'Blog post not found' });
    res.json(updatedBlog.value);
}));

// Delete Blog by ID
app.delete("/blogs/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedBlog = await blogsCollection.findOneAndDelete({ _id: parseInt(id) });
    if (!deletedBlog.value) return res.status(404).json({ message: 'Blog post not found' });

    await usersCollection.updateMany({ blogids: parseInt(id) }, { $pull: { blogids: parseInt(id) } });
    res.status(200).json({ message: 'Blog post deleted successfully' });
}));

// Root Route
app.get("/", (req, res) => {
    res.send(`<h1>Server is running on port <b>${port}</b></h1>`);
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
