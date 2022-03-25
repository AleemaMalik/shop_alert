import React, {useState, useEffect} from 'react';
import {TopBarBtn} from './TopBarBtn'
import TopBarDD from './TopBarDD'
import StoreList from './StoreList'
import { Link } from 'react-router-dom'
import './TopBar.css'
//import { Button } from 'react-scroll';

// function TopBar() {
const TopBar = ()=>{
    const[click, setClick] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    const handleClick = () => setClick(!click)
    const closeMobileMenu = ()=> setClick(false)

    const onMouseEnter =()=>{
        if(window.innerWidth<1024){
            setDropdown(false)}else{
            setDropdown(true);
        }
    };

    const onMouseLeave =()=>{
        if(window.innerWidth<1024){
            setDropdown(false)}else{
            setDropdown(false);
        }
    };

 
    
    
    
  return <>
    <nav className="header">
        <Link to = "shopAlert/dashboard" className = "headerLogo" onClick={closeMobileMenu}>
            shopAlert
        </Link>
        
        <div className ="headerMenuIcon" onClick={handleClick}  >
            <i className = {click ? 'fas fa-times' : 'fas fa-bars'}  />
        </div>
        <ul className = {click ? 'nav-menu active' : 'nav-menu'}  >
            <li className = 'nav-item'>
                <Link to ="shopAlert/" className='nav-links' onClick={closeMobileMenu}>
                   Home 
                </Link>
            </li>
            <li className = 'nav-item'
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Link to ='/' className='nav-links' onClick={closeMobileMenu}>
                   Stores <i className ='fas fa-caret-down'/>
                </Link>
                {dropdown && <TopBarDD/>}
            </li>

            <li className = 'nav-item'
                
            >
                <Link to ='/' className='nav-links' onClick={closeMobileMenu}>
                   Notifications <i className ='fas fa-caret-down'/>
                </Link>
                
            </li>

            <li className = 'nav-item'>
                
                <Link to ="about" className='nav-links' onClick={closeMobileMenu}>
                   About 
                </Link>
            </li>

            <li className = 'nav-item'>
                <Link to ='contact' className='nav-links' onClick={closeMobileMenu}>
                   Contact 
                </Link>
            </li>
            
            <li className = 'nav-item'>
                <Link to ='shopAlert/login' className='nav-links' onClick={closeMobileMenu}>
                   Login
                </Link>
            </li>
            <li>
                <Link to ='shopAlert/signup' className='signup-mobile' onClick={closeMobileMenu}>
                   Sign up 
                </Link>
            </li>
        </ul>
        <TopBarBtn/>
        

    </nav>


  </>;
};

export default TopBar;



// import {Link} from "react-router-dom"
// import "./TopBar.css"
// import logoUrl from '../../assets/logo.svg'
// const TopBar = () =>{
//   return ( 
//     <div>





//         {/* <div className="header">
//           {/* <img src={logoUrl} alt="shopAlert" /> shopAlert */}
//             <div className = "headerContainer">
//                 <div className = "headerLogo" to="shopAlert/">
//                     {/* shopAlert
//             </div>
//             <li><Link to="shopAlert/about">About</Link></li>
//             <li><Link to="shopAlert/Contact">Contact</Link></li>
//             <li><Link to="shopAlert/signup">Sign Up</Link></li>
//             <li><Link to="shopAlert/login">Login</Link></li>
         
       
//          </div>
//     </div> */} 
//     </div>
    
//   );
// }













// import React from 'react';
// import {FaBars} from 'react-icons/fa'
// import {IoMdNotifications} from 'react-icons/io'
// //import {Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks} from './TopBarElements'
// import {Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks, NavBtn, NavBtnLink} from './TopBarElements'
// import { icons } from 'react-icons/lib';
// const TopBar = () => {
//   return <>
//       <Nav>
//           <NavbarContainer>
//               <NavLogo to = "/">
//                   shopAlert
//               </NavLogo>
//                <MobileIcon>
//                   <FaBars size={0} style={{ fill: 'white' }}/>
                  
//               </MobileIcon>
//               <NavMenu>
//                 <NavItem>
//                     <NavLinks to = "about">
//                         About
//                     </NavLinks>
//                 </NavItem>
//                 <NavItem>
//                     <NavLinks to = "about">
//                         Contact
//                     </NavLinks>
//                 </NavItem>
//                 <NavItem>
//                     <NavLinks to = "/signup">
//                         Sign up
//                     </NavLinks>
//                 </NavItem>
//               </NavMenu>
//                 <NavBtn>
//                     <NavBtnLink to = "/login">
//                      Login
//                     </NavBtnLink>
//                 </NavBtn>

        
//           </NavbarContainer>
//       </Nav>

//   </>;
// };

// export default TopBar;


