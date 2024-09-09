import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let posts = [
  {
    id: 1,
    title: "Exploring JavaScript ES6 Features",
    date: "2024-08-09",
    time: "10:00 AM",
    body: "JavaScript ES6 introduced many new features, such as let and const, arrow functions, template literals, and more. These features help developers write cleaner and more efficient code."
  },
  {
    id: 2,
    title: "Understanding React Components",
    date: "2024-08-08",
    time: "02:30 PM",
    body: "React components are the building blocks of any React application. In this post, we'll dive into functional and class components, and how to manage state within them."
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    date: "2024-08-07",
    time: "09:15 AM",
    body: "CSS Grid and Flexbox are powerful layout systems in CSS. While both are used to create responsive layouts, they have different use cases and capabilities. Let's explore when to use each."
  },
  {
    id: 4,
    title: "Introduction to Node.js",
    date: "2024-08-06",
    time: "04:45 PM",
    body: "Node.js is a JavaScript runtime built on Chrome's V8 engine, allowing developers to use JavaScript on the server-side. This post covers the basics of Node.js and its use cases."
  },
  {
    id: 5,
    title: "Getting Started with MongoDB",
    date: "2024-08-05",
    time: "11:00 AM",
    body: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. In this post, we'll discuss how to set up a MongoDB database and perform basic CRUD operations."
  }
];


app.get('/posts', (req, res) => {
  res.json([...posts].reverse());
});

app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

app.post("/createpost",(req,res)=>{
  try{
    
  const id = posts[posts.length-1].id + 1;
  const {title,date,time,body} = req.body;
  const content = {id,title,date,time,body};
  posts.push(content);
  console.log(posts)
  }
  catch(e){
    console.log(e);
  }
})

app.delete('/posts/:id', (req, res) => {
  const  id  =parseInt(req.params.id,10); 
  console.log(id);
  const intialLength = posts.length;
 posts = posts.filter(p => p.id !== id);
 console.log(posts);
  if (posts.length < intialLength ) {
    res.status(200).send("Deleted SuccesFully");
  } else {
    res.status(404).send(`Does'nt Deleted !`);
  }
});


app.patch('/posts/:id',(req,res)=>{
  try{
  const id = parseInt(req.params.id);
  const {title , body } = req.body;
  let postFound = false;
    posts = posts.map(post => {
      if (post.id === id) {
        postFound = true;
        return { ...post, title: title || post.title, body: body || post.body };
      }
      return post;
    });

    if (postFound) {
      res.status(200).json({ message: 'Post updated successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'An error occurred while updating the post' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
