// src/components/ContentPage/ContentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './cont.css';

function ContentPage(props) {
    const { id } = useParams();
    const [blog, setblog] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:1729/blogs/${id}`)
            .then(response => {
                setblog(response.data);
            })
            .catch(error => console.error('Error fetching blog:', error));
    }, [id]);

    return (
        <div>
            {blog ? (
                <div key={blog._id} className='cmain'>
                    <h2 className='ctit'>{blog.title}</h2>
                    <h3 className="csub">{blog.subject}</h3>
                    <div className="cbtm">
                        <div className="cbtm-left">
                            <img className='cauthor-img' src={blog.aimage} alt="a img" />
                        </div>
                        <div className="cbtm-right">
                            <span className="cauthor">{blog.author}</span>
                            <br />
                            <span className='cdate'>{blog.date}</span>&nbsp;
                            <span className="mx-2 pnt">•</span>&nbsp;
                            <span className="cread">{blog.read} read</span>
                        </div>
                    </div>
                    <img src={blog.imagepath} alt={blog.title} className="cimg" />
                    <div className='cdes' dangerouslySetInnerHTML={{ __html: blog.description.replace(/\n/g, '<br><br>') }}></div>
                </div>
            ) : (
                <p>No blog found with the given ID</p>
            )}
            
        </div>
    );
}

export default ContentPage;
