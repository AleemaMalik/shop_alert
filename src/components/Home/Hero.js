import React from 'react';
import {Link} from 'react-router-dom'
import { TopBarBtn } from '../TopBar/TopBarBtn';
import './Hero.css'
import { ReactComponent as Logo} from '../../assets/undraw_add_to_cart_re_wrdo.svg';


function Hero() {
  return (
    <>
      <div className="homePage">
          
          <div className = "homeLeftContainer">
              <div className = "homeHeader">
                  GET NOTIFIED
              </div>
              <div className = "homeHeaderDesc">
              Track your top finds from your favourite stores.
              </div>
              <div className = 'Description'>
              Be the first to get notified about latest price changes and stock availability. Sign up now to start tracking.
              </div>
              <Link to ='shopAlert/signup' className="HeroBtn">Sign up</Link>
          </div>
          <div className = "HomerightContainer">
          <Logo></Logo>

          </div>
          </div>
    </>
  );
}

export default Hero;

// function Hero(
//     lightBg, topLine, lightText, lightTextDesc,
//     headline, description, buttonLabel,
//     img, alt, imgStart
// ) {
//   return <>
//     <div className = {lightBg ? 'home__hero' : 'home__hero darkBg'}>
//     <div className = "heroContainer">
//         <div ClassName = "row home_hero-row"
//         style={{display:'flex', 
//         flexDirection:imgStart === 'start'? 'row-reverse':'row'}}
//         >
//             <div className="heroCol">
//                 <div className = "home_hero-text-wrapper">
//                     <div className = "top-line">{topLine}
//                     </div>
//                     <h1 className={lightText? 'heading':'heading dark'}>{headline}</h1>
//                     <p className = {lightTextDesc ? 'home_hero-subtitle': 'home_hero-subtitle dark'}>{description}</p>
//                     <Link to ='shopAlert/signup'>
//                         <TopBarBtn  buttonColor = 'white'>{buttonLabel}</TopBarBtn>
//                     </Link>
//                 </div>
//             </div>
//         <div  className = 'heroCol'>
//             <div className = "home_hero-img-wrapper">
//                 <img src={img} alt ={alt} className = "img.home_hero-img"/>
//             </div>

//         </div>

//         </div>
//     </div>
//     </div>


//   </>;
// }

// export default Hero;
