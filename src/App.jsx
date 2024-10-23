import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import './App.css';
import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import ContentPage from './components/content';
import Footer from './components/footer';
import Navbar from './components/navbar';
import AllUser from './components/allusers';
import User from './components/users';
import CreatePost from './components/CreatePost';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <Analytics />
      <div className="App">
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route exact path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/about" element={<About />} />
          <Route path="/allusers" element={<AllUser />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/content/:id" element={<ContentPage />} />
          <Route path="/users/:id" element={<User />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
