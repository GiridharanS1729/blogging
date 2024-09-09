import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';
import { FaHeart, FaComment } from 'react-icons/fa'; // Font Awesome icons for likes and comments
import x from '../../config';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const { id } = useParams(); // Get the blog ID from the URL params

    useEffect(() => {
        const url = x === 1 ? '/data.json' : `http://localhost:1729/blogs`;

        axios.get(url)
            .then(response => {
                const data = x === 1 ? response.data : response.data;
                if (id) {
                    const filteredBlog = data.find(blog => blog._id === parseInt(id));
                    setBlogs(filteredBlog ? [filteredBlog] : []);
                } else {
                    setBlogs(data);
                }
                setLoading(false); // Data is loaded
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false); // Stop loading even if there's an error
            });
    }, [id]); // Re-fetch when the ID changes

    if (loading) {
        return (
            <div className="blog-list">
                {[...Array(4)].map((_, index) => ( // Generate 4 placeholders
                    <div key={index} className="blog-card placeholder">
                        <div className="blog-image"></div>
                        <div className="blog-content">
                            <h2 className="blog-title"></h2>
                            <p className="blog-subject"></p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (blogs.length === 0) {
        return <div className="no-content">No blogs available at the moment.</div>;
    }

    return (
        <div className="blog-list">
            {blogs.map(blog => (
                <div key={blog._id} className="blog-card">
                    <Link className="blog" to={`content/${blog._id}`}>
                        <div className="blog-image">
                            <img src={blog.imagepath} alt={blog.title} />
                        </div>
                        <div className="blog-content">
                            <h2 className="blog-title">{blog.title}</h2>
                            <p className="blog-subject">{blog.subject}</p>
                            <p className="blog-date">{blog.date}</p>
                        </div>
                    </Link>
                    <div className="blog-footer">
                        <div className="blog-meta">
                            <span className="read-time">{blog.read} read</span>
                            <span className="likes">
                                <FaHeart /> {blog.likes}
                            </span>
                            <span className="comments">
                                <FaComment /> {blog.comments}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogList;
