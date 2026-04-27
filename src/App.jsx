import React from 'react';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Work from './components/Work.jsx';
import Playground from './components/Playground.jsx';
import Stack from './components/Stack.jsx';
import Contact from './components/Contact.jsx';
import Terminal from './components/Terminal.jsx';

// Single-page editorial portfolio. Anchor-based nav between sections.
const App = () => (
  <div id="top">
    <Cursor />
    <Nav />
    <Hero />
    <About />
    <Work />
    <Playground />
    <Stack />
    <Contact />
    <Terminal />
  </div>
);

export default App;
