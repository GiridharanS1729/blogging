import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './cont.css';
import { prt } from '../../utils/prt';


function ContentPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [user, setUser] = useState(null);
    const [aid, setAid] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${prt}/blogs/${id}`)
            .then(response => {
                setBlog(response.data);
                setAid(response.data.aid);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`${prt}/users/${aid}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [aid]);

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    if (loading) {
        return (
            <>
                {[...Array(1)].map((_, index) => (
                <div key={index} className='c-main'>
                    <h2 className='c-tit'></h2>
                    <h3 className="c-sub"></h3>
                    <div className="c-btm">
                        <div className="c-btm-left">
                            <img className='c-author-img' alt="" />
                        </div>
                        <Link className='c-link btm-right'>
                            <span className="c-author"></span>
                            <span className='c-date'></span>
                            <span className="c-mx-2 pnt"></span>
                            <span className="c-read"></span>
                        </Link>
                    </div>
                    <img alt="" className="c-img" />
                    <div className='c-des'></div>
                </div>
            ))}
            </>
        );
    }


    return (
        <div>
            {blog ? (
                <div key={blog._id} className='main'>
                    <h2 className='tit' title='title'>{blog.title}</h2>
                    <h3 className="sub" title='subject'>{blog.subject}</h3>
                    <br />
                    <div className="btm">
                        <div className="btm-left">
                            <img className='author-img' src={user ? user.aimage : '/images/users/aut.png'} alt="a img" />
                        </div>
                        <Link key={blog._id} to={`/users/${blog.aid}`} className='link btm-right'>
                            <span className="author">{user ? user.author : 'Loading...'}</span>
                            <br />
                            <span className='date'>{new Date(blog.date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}    </span>&nbsp;
                            <span className="mx-2 pnt">•</span>&nbsp;
                            <span className="read">{calculateReadingTime(blog.description)} min read</span>
                        </Link>
                    </div>
                    <img src={blog.imagepath} alt={blog.title} className="img" />
                    <div className='des' dangerouslySetInnerHTML={{ __html: blog.description.replace(/\n/g, '<br><br>') }}></div>
                </div>
            ) : (
                <p>No blog found with the given ID</p>
            )}
        </div>
    );
}

export default ContentPage;
