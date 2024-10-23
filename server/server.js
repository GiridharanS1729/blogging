const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 1729;

app.use(cors());
app.use(express.json());

// Increase the limit for JSON payloads (for large posts or image uploads)
app.use(bodyParser.json({ limit: '10mb' })); // Set it to 10MB (or higher as needed)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const uri = process.env.MONGO_URL || "mongodb://localhost:27017/Blogging";
mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    }
    )
    .catch(err => console.error("Error connecting to MongoDB Atlas:", err));

// Counter Schema for Auto-Incrementing _id

// User Schema
const userSchema = new mongoose.Schema({
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

// Blog Schema
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


// Auto-Increment Function
const getNextSequenceValue = async () => {
    // Fetch all existing blog IDs
    const blogs = await Blog.find({}, { _id: 1 });
    const ids = blogs.map(blog => blog._id);
    
    // Sort IDs to find the next available ID
    ids.sort((a, b) => a - b);

    // Find the next available ID
    let nextId = 1; // Start checking from ID 1
    for (const id of ids) {
        if (id === nextId) {
            nextId++; // Move to the next number if the current ID exists
        } else if (id > nextId) {
            // If there's a gap, return the next available ID
            return nextId;
        }
    }

    return nextId; // If no gaps, return the next ID after the highest
};




// CRUD Operations for Blogs
// Create Blog Post
app.post("/createpost", async (req, res) => {
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

        const _id = await getNextSequenceValue(); // Get the next unique _id

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



// Read All Blog Posts
app.get("/blogs", (req, res) => {
    Blog.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
});

// Read a Single Blog Post by ID
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

// Search Blog Posts
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

// Update Blog Post
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

// Delete Blog Post
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

// CRUD Operations for Users
// Create User (Optional route if needed)
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

        const newUser = new User({
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
// Read All Users
app.get("/users", (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching users', error: err }));
});


// Read a Single User by ID
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching user', error: err }));
});





// Start the Server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
