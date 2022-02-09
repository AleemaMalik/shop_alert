import React from 'react';
import { NotifBarData } from './NotifBarData';
import './NotifBar.css'

const NotifBar = () => {
  return (
  <div className="notifBar">   
     
            {NotifBarData.map((val, key) => { 
                return (

                    <div className = "row1" key={key}>
                        <div id = "logo2">{val.img}</div> 
                        <div className = "cardBody">
                        <text> {val.item_name}<br/>
                        Original price {val.initial_price}
                        <br/>Current price </text>
                        <text>{val.current_price}</text>
                        </div>
                    </div>
                );
            })}


            {/* <u1 className = "NotifBarList">
                            </u1> */}
        </div>

  );
  
};

export default NotifBar;
