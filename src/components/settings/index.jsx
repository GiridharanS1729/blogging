// Settings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogActions from '../BlogActions/index';
import './settings.css';
import { prt } from '../../utils/prt';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const aid = parseInt(localStorage.getItem('aid')) || 1;

    useEffect(() => {
        const url = `${prt}/users`;
        axios.get(url)
            .then(response => {
                const data = response.data.find(user => user._id === aid);
                setUser(data);
                // setTimeout(() => setLoading(false), 500);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setLoading(false);
            });

        const blogsUrl = `${prt}/blogs`;
        axios.get(blogsUrl)
            .then(response => {
                const userBlogs = response.data.filter(blog => blog.aid === aid);
                setBlogs(userBlogs);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, []);

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 100;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    if (!user) return <div>User not found</div>;

    if (loading) {
        return (
            <div className="set-skeleton-container">
                <div className="set-skeleton-banner"></div>
                <div className="set-skeleton-header">
                    <div className="set-skeleton-image"></div>
                    <div className="set-skeleton-text set-skeleton-name"></div>
                    <div className="set-skeleton-text set-skeleton-bio"></div>
                    <div className="set-skeleton-info"></div>
                </div>
                <div className="set-skeleton-details">
                    <div className="set-skeleton-detail-item"></div>
                    <div className="set-skeleton-detail-item"></div>
                    <div className="set-skeleton-detail-item"></div>
                </div>
                <div className="set-skeleton-blogs">
                    {Array(3).fill(0).map((_, idx) => (
                        <div className="set-skeleton-blog-card" key={idx}>
                            <div className="set-skeleton-blog-header">
                                <div className="set-skeleton-author-image"></div>
                                <div className="set-skeleton-blog-info">
                                    <div className="set-skeleton-text set-skeleton-title"></div>
                                    <div className="set-skeleton-text set-skeleton-subject"></div>
                                    <div className="set-skeleton-text set-skeleton-date"></div>
                                </div>
                            </div>
                            <div className="set-skeleton-blog-content"></div>
                            <div className="set-skeleton-blog-stats"></div>
                        </div>
                    ))}
                </div>
            </div>

        );
    }
    return (
        <div className="settings-profile-container">
            <div className="settings-profile-banner"></div>
            <div className="settings-profile-header">
                <img src={user.aimage} alt="User" className="settings-profile-image" />
                <h2>{user.author}</h2>
                <p>{user.bio}</p>
                <div className="settings-profile-info">
                    <span className="settings-profile-join">🎂 Joined on {new Date(user.joined).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
            <div className="settings-profile-details">
                <div className="settings-profile-detail-item"><h4>Followers</h4><p>{user.followers}</p></div>
                <div className="settings-profile-detail-item"><h4>Following</h4><p>{user.following}</p></div>
                <div className="settings-profile-detail-item"><h4>Category</h4><p>{user.category}</p></div>
            </div>
            <div className="settings-profile-extras">
                <h2><b>My Blogs</b></h2>
                <div className="settings-profile-blogs-container">
                    {blogs.map(blog => (

                        <div className="blog-card" key={blog._id}>
                            <Link className="blog" to={`../content/${blog._id}`}>
                                <div className="blog-header">
                                    <img src={user.aimage} alt="Author" className="blog-author-image" />
                                    <div className="blog-info">
                                        <h5 className="blog-title">{blog.title}</h5>
                                        <p className="blog-subject">{blog.subject}</p>
                                        <p className="blog-date">{new Date(blog.date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <img src={blog.imagepath} alt={blog.title} className="blog-image" />
                                </div>
                            </Link>
                            <div className="blog-stats">
                                <span className="blog-read">{calculateReadingTime(blog.description)} min read</span>
                                <span className="blog-likes">💖 {blog.likes} Likes</span>
                                <span className="blog-comments">💬 {blog.comments} Comments</span>
                                <BlogActions blog={blog} user={user} onDelete={(deletedId) => setBlogs(blogs.filter(b => b._id !== deletedId))} />

                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
