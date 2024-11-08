import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import CreateBlog from './components/CreateBlog';
import Logout from './components/logout';
import Settings from './components/settings';
import Signup from './components/signup';
import Login from './components/login';
import BlogUpdate from './components/BlogUpdate';
import CreateUser from './components/CreateUser';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const checkLoginStatus = () => {
    return localStorage.getItem('aid') !== null;
  };

  useEffect(() => {
    setIsLoggedIn(checkLoginStatus());
  }, []);

  return (
    <Router>
      <Analytics />
      <div className="App">
        {isLoggedIn && <Navbar onSearch={handleSearch} />}

        <Routes>
          {/* Disable login/signup when logged in */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isLoggedIn ? <Home searchQuery={searchQuery} /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home searchQuery={searchQuery} /> : <Navigate to="/login" />}
          />
          <Route
            path="/about"
            element={isLoggedIn && <About />}
          />
          <Route
            path="/allusers" element={isLoggedIn && <AllUser />}
          />
          
          <Route
            path="/createuser" element={isLoggedIn && <CreateUser />}
          />

          <Route
            path="/contact" element={isLoggedIn && <Contact />}
          />
          <Route
            path="/createblog" element={isLoggedIn && <CreateBlog />}
          />
          <Route
            path="/updateblog" element={isLoggedIn && <BlogUpdate />}
          />
          <Route
            path="/content/:id" element={isLoggedIn && <ContentPage />}
          />
          <Route
            path="/users/:id" element={isLoggedIn && <User />}
          />
          <Route
            path="/settings" element={isLoggedIn && <Settings />}
          />
          <Route
            path="/logout" element={isLoggedIn ? <Logout /> : <Navigate to="/login" />}
          />

          {/* Redirect any undefined routes */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
          />
        </Routes>
      </div>
      {isLoggedIn && <Footer />}
    </Router>
  );
}

export default App;