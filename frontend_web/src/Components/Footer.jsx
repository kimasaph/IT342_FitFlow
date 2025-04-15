import React from "react";

const Footer = () => {
  return (
    <footer className="text-center text-xs text-gray-500 p-6 mt-12 bg-gray-50">
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        <span>About</span>
        <span>Blog</span>
        <span>Careers</span>
        <span>Help</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
      <div className="mb-1">
        FitFlow © {new Date().getFullYear()} &nbsp;·&nbsp; Built for your fitness journey
      </div>
      <div className="text-xs">
        English ⌄
      </div>
    </footer>
  );
};

export default Footer;
