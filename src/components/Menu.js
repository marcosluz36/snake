import React from 'react';
import '../styles/Menu.css';

const Menu = ({ active }) => {
  let menu_list = active ? "menu_hidden" : "menu";
  return (
    <div className={menu_list}>
      Pressione <span>enter</span> para começar<br />
      Use as teclas <span>w a s d</span> para controlar
    </div>
  );
}

export default Menu;