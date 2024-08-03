// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 1729;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Blogging");

const userSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    description: { type: String, required: true },
});
const user = mongoose.model("blogs", userSchema, "blogs");
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
app.get('/', (req, res) => {
    res.json("Welcome to visitor management system");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})