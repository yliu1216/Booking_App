import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div className="mt-4 grow fixed bottom-0 w-full text-center" style={{ textAlign: 'center' }}>
      <p>&copy;{year}</p>
    </div>
  );
};

export default Footer;