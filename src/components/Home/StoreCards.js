import React from 'react';
import { SideBarData } from '../SideBar/SideBarData';
import './StoreCards.css'

function StoreCards() {
  return  (
  <div className="StoreCardsContainer">  
  <div className = "StoreCardsText"> 
     <div className = "StoreCardsTitle">
         Supported stores
     </div>
     
     <div className = "StoreCardsDesc">
         Currently, shopAlert supports product price and stock 
         tracking from Amazon, Costco and Ebay. More stores coming soon...
     </div>
     </div>
     <div className = "StoreCardsInfo">
        {SideBarData.map((val, key) => { 
         return (

          <div className = "cardsRow" key={key}
               onClick={() => {
                        window.open(val.link, "_blank")}
                    }>
              <div id = "cardLogo">{val.image}</div> 
              <div className = "cardInfo">
              
              </div>
          </div>
          
      );
  })}
  </div>


  {/* <u1 className = "NotifBarList">
                  </u1> */}


  </div>
  );
}

export default StoreCards;
