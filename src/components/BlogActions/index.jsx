import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogActions.css';

export default function BlogActions({ blog, user, onDelete }) {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null); 

    const toggleOptions = () => setShowOptions(!showOptions);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the blog!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:1729/deleteblog/${blog._id}`)
                    .then(() => {
                        onDelete(blog._id);
                        Swal.fire('Deleted!', 'The blog has been deleted.', 'success');
                    })
                    .catch(error => console.error('Error deleting blog:', error));
            }
        });
    };

    const handleEdit = () => {
        navigate('/updateblog', { state: { blog } });
    };

    if (!blog || !user || blog.aid !== user._id) return null;

    return (
        <div className="blog-actions-container" ref={optionsRef}>
            <span className="blog-actions-options-icon" onClick={toggleOptions}>⁝</span>
            <div className={`blog-actions-options-menu ${showOptions ? 'show' : ''}`}>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}
