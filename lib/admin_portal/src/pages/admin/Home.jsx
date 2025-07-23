import React from 'react';
import Hero from '../../components/Hero';
import About from './About';
import Features from './Features';
import Team from './Team';
import Contact from './Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Team />
      <Contact />
    </>
  );
};

export default Home;