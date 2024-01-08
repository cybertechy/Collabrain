import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SelectPic from '../assets/pics/select.png';
import SelectedPic from '../assets/pics/selected.png';

export default function NavLink({ to, text, imgSrc, selectedImgSrc }) {
  const location = useLocation();
  const isSelected = location.pathname === to;

  return (
    <Link to={to} className={`nav-link ${isSelected ? 'selected' : ''}`}>
      <img
        src={isSelected ? selectedImgSrc : imgSrc}
        alt={text}
        className="navlink-icon"
      />
      <p className={`nav-text ${isSelected ? 'selected-text' : ''}`}>{text}</p>
      <img
        src={isSelected ? SelectedPic : SelectPic}
        alt="select"
        className="arrow"
      />
    </Link>
  );
}
