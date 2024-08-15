import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import ContentPage from './components/content';
import Footer from './components/footer';
import Header from './components/header';
import AllUser from './components/allusers';
import User from './components/users';
import AddPost from './components/addpost';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/allusers" element={<AllUser />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/content/:id" element={<ContentPage props=":id" />} />
          <Route path="/users/:id" element={<User props=":id" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
