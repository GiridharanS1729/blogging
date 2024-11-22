import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Blogs.css';
import { FaHeart, FaComment } from 'react-icons/fa';
import BlogActions from '../BlogActions';
import { prt } from '../../utils/prt';


const BlogList = ({ searchQuery }) => {
    const [user, setUser] = useState(null);
    const aid = parseInt(localStorage.getItem('aid')) || 1;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const blogUrl = `${prt}/blogs`;
        axios.get(blogUrl)
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

        const url = `${prt}/users`;
        axios.get(url)
            .then(response => {
                const data = response.data.find(user => user._id === aid);
                setUser(data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [searchQuery]);

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    const handleDelete = (id) => {
        setBlogs(blogs.filter(blog => blog._id !== id));
    };
    const THeight = 15;
    if (loading) {
        return (
            <div className='bl-mab'>
                <div className="bl-blog-list">
                    {[...Array(THeight)].map((_, index) => (
                        <div key={index} className="bl-blog-card placeholder">
                            <div className="bl-blog-image"></div>
                            <div className="bl-blog-content">
                                <h2 className="bl-blog-title"></h2>
                                <p className="bl-blog-subject"></p>
                                <p className="bl-blog-date"></p>
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
                        <BlogActions blog={blog} user={user} onDelete={handleDelete} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogList;