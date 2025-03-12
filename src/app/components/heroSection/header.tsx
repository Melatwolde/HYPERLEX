'use client'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import React, { useState } from 'react';
const Header = ()=>{
    const [clickedItem, setClickedItem] = useState('Home');
    const handleItemClick = (item:string)=>{
        setClickedItem(item);
    }
    return(
        <div className="flex flex-row justify-between items-center w-[500px] h-12 px-8 bg-[#191919] rounded-md text-16 text-neutral-400">
            <div className={`flex flex-row ${clickedItem === 'home' ? 'items-center justify-items-center bg-black rounded-[5px] h-8 p-3' : ''}`} onClick={() => handleItemClick('home')}><HomeRoundedIcon/>Home</div>
            <div className={`flex flex-row ${clickedItem === 'about' ? 'items-center justify-items-center bg-black rounded-[5px] h-8 p-3' : ''}`} onClick={() => handleItemClick('about')}><PersonOutlineRoundedIcon/>About</div>
            <div className={`flex flex-row ${clickedItem === 'work' ? 'items-center justify-items-center bg-black rounded-[5px] h-8 p-3' : ''}`} onClick={() => handleItemClick('work')}><WorkOutlineRoundedIcon/>Work</div>
            <div className={`flex flex-row ${clickedItem === 'contact' ? 'items-center justify-items-center bg-black rounded-[5px] h-8 p-2' : ''}`} onClick={() => handleItemClick('contact')}><ElectricBoltRoundedIcon />Contact</div>
            
        </div>
    )
}
export default Header;