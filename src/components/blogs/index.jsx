// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:1729/blogs')
            .then(response => setBlogs(response.data))
            .catch(error => console.error('Error fetching blogs:', error));
    }, []);
    

    return (
        <div className="blog-list">
            {blogs.map(blog => (
                <Link key={blog._id} className="blog" to={`content/${blog._id}`}>
                    <div className="timg">
                        <img className='img' src={blog.imagepath} alt={blog.title} />
                        <p className='title'>{blog.title}</p>
                    </div>
                    <div className="cont">
                        <p className='sub'>{blog.subject}</p>
                    </div>
                    <div className="btm">
                        <div className="btm-left">
                            <img className='author-img' src={blog.aimage} alt="a img" />
                        </div>
                        <div className="btm-right">
                            <span className="author">{blog.author}</span>
                            <br />
                            <span className='date'>{blog.date}</span>&nbsp;
                            <span className="mx-2 pnt">•</span>&nbsp;
                            <span className="read">{blog.read} read</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default BlogList;
