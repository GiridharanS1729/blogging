import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';
import { FaHeart, FaComment } from 'react-icons/fa';

const BlogList = ({ searchQuery }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url =`http://localhost:1729/blogs`;

        axios.get(url)
            .then(response => {
                const data = response.data;
                if (searchQuery) {
                    const filteredBlogs = data.filter(blog =>
                        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setBlogs(filteredBlogs);
                } else {
                    setBlogs(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, [searchQuery]);

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200; 
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    if (loading) {
        return (
            <div className='mab'>
                <div className="blog-list">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="blog-card placeholder">
                            <div className="blog-image"></div>
                            <div className="blog-content">
                                <h2 className="blog-title"></h2>
                                <p className="blog-subject"></p>
                            </div>
                        </div>
                    ))}
                </div>
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
                            <span className="read-time">{calculateReadingTime(blog.description)} min read</span>
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
