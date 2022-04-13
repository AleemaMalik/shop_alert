import React from "react";
import { defaultSearchResults } from "./ScraperData";
import "./ItemSearchPopup.css";

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

  const itemSelect = (Event) => {
    if (Event.target.className !== "item-name") {
      console.log(Event.target.attributes.itemurl.nodeValue);
      props.setTriggerItemSearchResult(false);
      props.setTriggerItemURL(Event.target.attributes.itemurl.nodeValue);
      props.setTriggerItemInfo(true);
    }
  };

  return props.triggerItemSearchResult ? (
    <div className="item-search1">
      <div className="item-search2">
        <button
          className="insert-button2"
          onClick={() => {
            props.setTriggerItemSearchResult(false);
            props.setTriggerSearchResults(defaultSearchResults);
          }}
        >
          New search
        </button>

        <div className="item-dropdown">
          {props.searchResults.map((val, key) => {
            return (
              <button className="dropdown-row" key={key} onClick={itemSelect} itemurl={val.URL}>
                <div className="image-url">
                  <img style={{ width: 50, height: 50 }} src={val.imageURL} resizeMode="contain" alt="display image" />
                </div>
                <div className="item-properties">
                  <a href={val.URL} target="_blank">
                    <div className="item-name">{val.name}</div>
                  </a>
                  <div className="item-id" itemurl={val.URL}>
                    Product code: {val.productID}
                  </div>
                  <div className="item-price" itemurl={val.URL}>
                    ${val.price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ItemSearchResultPopup;
