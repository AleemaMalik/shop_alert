import {Link} from "react-router-dom"
import "./HeaderBar.css"
import logoUrl from '../../assets/logo.svg'
function Header(){
  const[isOpen, setOpen] = useState(false);
  return (
    <div>
        <div className="header">
          {/* <img src={logoUrl} alt="shopAlert" /> shopAlert */}
          <headerLogo>
            <li><Link to="shopAlert/">shopAlert</Link></li>
            </headerLogo>
            <NavMenu>
            <li><Link to="shopAlert/dashboard">My Dashboard</Link></li>
            <li><Link to="shopAlert/signup">Sign Up</Link></li>
            <li><Link to="shopAlert/login">Login</Link></li>
            </NavMenu>
        </div>
    </div>
  );
}
// export default Header
// import React from 'react';
// import './HeaderBar.css';
// import logoUrl from '../../assets/logo.svg'
// import {Link} from "react-router-dom"
// export const Header = () => (
//   <div className="header">
//     <img src={logoUrl} alt="shopAlert" /> shopAlert
//     <div class="button">
     
//     <a href="http://localhost:3000/shopAlert/signup" target="_parent"><button type="submit" name="signup">
//         Sign Up
//       </button></a>
//       <a href="http://localhost:3000/shopAlert/login" target="_parent"><button type="submit" name="login">
//         Log In
//       </button></a>
//     </div>

//   </div>
// )
export default Header;
