import React, { useEffect } from 'react';
import { initLenis } from './lib/lenis.js';
import BootIntro from './components/BootIntro.jsx';
import Nav from './components/Nav.jsx';
import StatusPill from './components/StatusPill.jsx';
import Rail from './components/Rail.jsx';
import Hero from './components/Hero.jsx';
import Story from './components/Story.jsx';
import Stack from './components/Stack.jsx';
import Work from './components/Work.jsx';
import Lab from './components/Lab.jsx';
import Recette from './components/Recette.jsx';
import Arcade from './components/Arcade.jsx';
import Contact from './components/Contact.jsx';
import Terminal from './components/Terminal.jsx';

// "The Living System" — one continuous pipeline threads the page:
// 00 INIT → 01 INGEST → 02 TRAIN → 03 SERVE → 04 OBSERVE → 05 SCALE →
// 06 COOLDOWN → 07 CONNECT. The Rail draws it; sections are its stages.
const App = () => {
  useEffect(() => { initLenis(); }, []);

  return (
    <div id="top" style={{ position: 'relative' }}>
      <BootIntro />
      <Nav />
      <Rail />
      <Hero />
      <Story />
      <Stack />
      <Work />
      <Lab />
      <Recette />
      <Arcade />
      <Contact />
      <StatusPill />
      <Terminal />
    </div>
  );
};

export default App;
