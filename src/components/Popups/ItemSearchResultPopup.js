import React from 'react'
import {ScraperData} from './ScraperData';
import './ItemSearchPopup.css'



function ItemSearchResultPopup(props) {
  // return(props.triggerSearchResults) ? (
//     return (props.triggerInfoPopup) ? (
//       <div className = 'item-search'>
//       {/* <div className="item-dropdown">
//                 {ScraperData.map((val, key) => { 
//                     return (
//                         <button className = "row" key={key}>
//                             <div className="image-url"><img style={{width:50,height:50}} src={val.imageURL} resizeMode='contain' alt="display image"/></div>                          
//                             <div className = "item-properties">
//                             <div className ="item-name">{val.name}</div>
//                             <div className = "item-id">Product code: {val.productID}</div>
//                             <div className = "item-price">{val.price}</div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div> */}


//       <button onClick={() => props.setTriggeritemInfo(false)}>Cancel</button>
//       </div>
 
//     //   </div>
// ) : "";
return (props.triggerInfoPopup2) ? (
  <div className = "item-search1">
    <div className = "item-search2">
    <button className ='insert-button2' onClick={() => props.setTriggeritemInfo2(false)}>New search</button>

    <div className="item-dropdown">
                {ScraperData.map((val, key) => { 
                    return (
                        <button className = "row" key={key}>
                            <div className="image-url"><img style={{width:50,height:50}} src={val.imageURL} resizeMode='contain' alt="display image"/></div>                          
                            <div className = "item-properties">
                            <div className ="item-name">{val.name}</div>
                            <div className = "item-id">Product code: {val.productID}</div>
                            <div className = "item-price">{val.price}</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            </div>
            </div>
) : "";
}

export default ItemSearchResultPopup;