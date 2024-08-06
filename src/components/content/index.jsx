// src/components/ContentPage/ContentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams ,Link} from 'react-router-dom';
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
                <div key={blog._id} className='main'>
                    <h2 className='tit'>{blog.title}</h2>
                    <h3 className="sub">{blog.subject}</h3>
                    <div className="btm">
                        <div className="btm-left">
                            <img className='author-img' src={blog.aimage} alt="a img" />
                        </div>
                        <Link key={blog._id} to={`/users/${blog._id}`} className='link btm-right'>
                            {/* <div > */}
                                <span className="author">{blog.author}</span>
                                <br />
                                <span className='date'>{blog.date}</span>&nbsp;
                                <span className="mx-2 pnt">•</span>&nbsp;
                                <span className="read">{blog.read} read</span>
                            {/* </div> */}
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
