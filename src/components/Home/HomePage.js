// import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
// import { RestockTable } from '../Tables/RestockTable/Restock'
import './HomePage.css';
// import amazonUrl from '../../assets/Amazon.png'
// import ebayUrl from '../../assets/Ebay.png'
// import costcoUrl from '../../assets/Costco.png'
// import React, {useState} from 'react';
import React from 'react';
import Hero from './Hero';
import StoreCards from './StoreCards';
import FooterPage from './FooterPage'
import AboutPage from './AboutPage';

const HomePage = () => {

// function HomePage() {
    
    return (
        <div className = "homeContainer">
            
            <Hero/>
            <StoreCards/>
            <AboutPage/>
            <FooterPage/>
            

            

            {/* <h1 className='title'>
                <div>Join the 10,000+ community of shopAlert to get notifications from the top Canadian online retailers</div>
                <img src={amazonUrl} height="25%" width="25%"></img>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <img src={costcoUrl} height="25%" width="25%"></img>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <img src={ebayUrl} height="25%" width="25%"></img>
            </h1> */}
            
            
        </div>
    )
}

export default HomePage