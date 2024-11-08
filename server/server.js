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
    })
    .catch(err => console.error("Error connecting to MongoDB Atlas:", err));
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

//blogs
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

// Assuming you have already required necessary modules and connected to your MongoDB

app.post('/login', (req, res) => {
    const { mail, password } = req.body;
    User.findOne({ mail })
        .then(user => {
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }
            if (user.password === password) {
                return res.json({ aid: user._id, success: true });
            } else {
                return res.json({ success: false, message: 'Invalid password' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error logging in', error: err });
        });
});


app.post("/createblog", async (req, res) => {
    try {
        const {
            aid,
            title = "Understanding Async/Await in JavaScript",
            imagepath = "/images/a.jpg",
            subject = "new subject",
            description = "new description",
            date = new Date().toISOString().slice(0, 10),
            likes = 100,
            comments = 50
        } = req.body;
        const _id = await getNextSequenceValueB();
        const newBlog = new Blog({
            _id,
            aid,
            title,
            subject,
            description,
            imagepath,
            date,
            likes,
            comments,
        });
        await newBlog.save();

        await User.findByIdAndUpdate(aid, { $inc: { totalposts: 1 }, $push: { blogids: _id } }, { new: true, upsert: true });


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
app.post("/createuser", async (req, res) => {
    try {
        const {
            aimage = "/images/aut.png",
            author = "Your name",
            bio = "Your Bio",
            publication = "Tech Trends",
            category = "Innovation"
        } = req.body;
        const _id = await getNextSequenceValueU();
        // const joinedd = new Date().toISOString().slice(0, 10);
        const newUser = new User({
            _id: _id,
            aimage: aimage,
            author: author,
            bio: bio,
            // joined: joinedd,
            publication: publication,
            category: category
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





// Delete Blog by ID
app.delete('/deleteblog/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).send({ message: 'Blog not found' });
        }

        // Update User's blogids array after blog deletion (if required)
        await User.updateMany(
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
        const blogId = req.params.id;
        const updatedData = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });

        if (!updatedBlog) {
            return res.status(404).send({ message: 'Blog not found' });
        }

        res.status(200).send({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send({ message: 'Error updating blog' });
    }
});


app.get("/", (req, res) => {
    res.send(`Port is Running Succesfully on <b>http://localhost:${port}</b>`);
});
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
