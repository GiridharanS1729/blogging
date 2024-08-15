import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';
import x from '../../config';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const { id } = useParams(); // Get the blog ID from the URL params

    useEffect(() => {
        const url = x === 1 ? '/data.json' : `http://localhost:1729/blogs`;

        axios.get(url)
            .then(response => {
                const data = x === 1 ? response.data : response.data;
                if (id) {
                    // If an ID is provided, filter the blog with that ID
                    const filteredBlog = data.find(blog => blog._id === parseInt(id));
                    setBlogs(filteredBlog ? [filteredBlog] : []);
                } else {
                    setBlogs(data);
                }
            })
            .catch(error => console.error('Error fetching blogs:', error));
    }, [id]); // Re-fetch when the ID changes

    if (blogs.length === 0) {
        return <div>No blogs available</div>;
    }

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
                    <Link key={blog._id} to={`users/${blog._id}`}>
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
                </Link>
            ))}
        </div>
    );
};

export default BlogList;
