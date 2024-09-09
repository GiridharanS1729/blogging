import React from 'react';
import BlogList from '../blogs/index';

export default function Home({ searchQuery }) {
    return (
        <div>
            <BlogList searchQuery={searchQuery} />
        </div>
    );
}
