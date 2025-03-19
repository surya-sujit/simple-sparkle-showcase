
import React, { useEffect, useRef } from 'react';
import '../styles/HelloWorld.css';

const Index = () => {
  const textRef = useRef(null);

  useEffect(() => {
    // Plain JavaScript animation for the text
    const text = textRef.current;
    if (text) {
      setTimeout(() => {
        text.classList.add('visible');
      }, 500);
    }

    // JavaScript to handle the button click
    const handleButtonClick = () => {
      text.classList.toggle('color-shift');
    };

    const button = document.getElementById('hello-button');
    if (button) {
      button.addEventListener('click', handleButtonClick);
    }

    // Cleanup event listener
    return () => {
      if (button) {
        button.removeEventListener('click', handleButtonClick);
      }
    };
  }, []);

  return (
    <div className="hello-container">
      <h1 ref={textRef} className="hello-text">Hello World</h1>
      <button id="hello-button" className="hello-button">Click Me</button>
    </div>
  );
};

export default Index;
