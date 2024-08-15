import React from 'react';
import './add.css';

export default function AddPost() {
    return (
        <div className="addcontainer">
            <h1>Add Post</h1>
            <div className="main">
                <div className="form-group">
                    <div className="title w">
                        <input type="text" className="form-control title-input" id="title" placeholder="Enter title" />
                    </div>
                    <div className="subject w">
                        <input type="text" className="form-control subject-input" id="subject" placeholder="Enter subject" />
                    </div>
                    <div className="description w">
                        <div className="image w">
                            <label htmlFor="image" className="image-label">
                                <img src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-plus-icon-png-image_1025536.jpg" alt="Add" className="plus-icon" />
                            </label>
                            <input type="file" name="image" id="image" className="image-input" />
                        </div>
                        <textarea className="form-control description-input" id="description" rows="5" placeholder="Enter Description"></textarea>
                    </div>
                    <input type="submit" value="Publish" className='publish'/>
                </div>
            </div>
        </div>
    );
}
