const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 1729;
const dbname = "blog";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

app.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const regex = new RegExp(query, 'i'); // Case-insensitive search
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


app.get('/', (req, res) => {
    res.json("Welcome to Blogging Platform");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});







app.post("/createpost", async (req, res) => {
    try {
        const {
            title = "Understanding Async/Await in JavaScript",
            imagepath = "/images/a.jpg",
            description = "Asynchronous programming is a critical aspect of modern web development, allowing developers to execute code without blocking the main thread.\nIn JavaScript, handling asynchronous operations can be challenging, especially when dealing with complex scenarios that involve multiple asynchronous tasks.\nTraditional methods such as callbacks and promises provide a way to manage these operations, but they can lead to complex and difficult-to-maintain code.\nThe `async` and `await` keywords, introduced in ECMAScript 2017 (ES8), offer a more readable and maintainable approach to asynchronous programming.\nBy using `async` functions, you can write code that appears synchronous but is non-blocking, making it easier to understand and debug.\nIn this article, we will delve into the fundamentals of `async` and `await`, exploring their syntax, usage, and best practices.\nWe will start with a basic overview of asynchronous operations and why they are important.\nThen, we will introduce the `async` keyword, which is used to define an asynchronous function.\nAn `async` function always returns a promise, and within this function, you can use the `await` keyword to pause the execution of the function until the promise is resolved.\nThis allows you to write code that is more linear and easier to follow, avoiding the so-called \"callback hell\" that often results from deeply nested callbacks.\nWe will provide practical examples to illustrate how `async` and `await` can be used to handle asynchronous tasks effectively.\nFor instance, we will show how to make HTTP requests using the `fetch` API and how to handle the results with `async`/`await.\nWe will also cover how to handle errors in asynchronous code, using try/catch blocks to catch exceptions and ensure that your code runs smoothly even when unexpected issues arise.\nAdditionally, we will discuss common pitfalls and challenges associated with using `async` and `await`, such as handling multiple asynchronous operations and managing concurrency.\nWe will explore techniques for running multiple promises in parallel and how to use `Promise.all` to aggregate results from multiple asynchronous tasks.\nBy mastering `async` and `await`, you can improve the readability and maintainability of your JavaScript code, making it easier to work with complex asynchronous workflows.\nIn conclusion, `async` and `await` are powerful features that enhance the way you handle asynchronous operations in JavaScript.\nThey offer a more intuitive and less error-prone approach compared to traditional methods, allowing you to write cleaner and more maintainable code.\nWhether you are building web applications, working with APIs, or dealing with any other asynchronous tasks, understanding and utilizing `async` and `await` will greatly benefit your development process.",
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

        // Get auto-incremented _id
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
