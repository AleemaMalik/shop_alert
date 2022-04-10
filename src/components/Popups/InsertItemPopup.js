import React from "react";
import "./InsertItemPopup.css";
import { useState, useEffect } from "react";
import { SideBarData } from "../SideBar/SideBarData";
// import {ScraperData} from './ScraperData'

function InsertItemPopup(props) {
  //state variable for the entered URL
  const [enteredURL, updateEnteredURL] = useState("");

  //declaring array in state indicating state of each checkbox
  const [checkedState, setCheckedState] = useState(new Array(SideBarData.length).fill(false));

  //state variable for the entered search string in search bar
  const [enteredSearchString, updateEnteredSearchString] = useState("");

  //Logging input to search item in console
  const searchChangeHandler = (Event) => {
    updateEnteredSearchString(Event.target.value);
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  const URLchangeHandler = (Event) => {
    updateEnteredURL(Event.target.value);
  };

  const enterURL = () => {
    props.setTriggerItemInfo(true);
    props.setTriggerItemURL(enteredURL);
  };

  const enterSearchValues = () => {
    props.setTriggerItemSearchResult(true);

    //the default site is amazon
    let ecommerceSite = "amazon.ca";
    if (checkedState[1]) {
      ecommerceSite = "walmart.ca";
    } else if (checkedState[2]) {
      ecommerceSite = "ebay.ca";
    }

    props.setTriggerSearchValues({
      searchString: enteredSearchString,
      enteredEcommerceSite: ecommerceSite,
    });
  };

  return props.triggerInsertItem ? (
    <div className="insert-item-popup">
      <div className="insert-item-popup-content">
        <h3 className="option-descript">Insert Item URL</h3>
        <input className="url-input" type="url" placeholder="Insert URL..." onChange={URLchangeHandler} />
        <button className="insert-button" onClick={enterURL}>
          Enter
        </button>
        <button className="insert-button" onClick={() => props.setTriggerInsertItem(false)}>
          Cancel
        </button>
        <h3 className="option-descript">Or search for item</h3>
        <div className="store-list">
          {SideBarData.map((value, index) => {
            return (
              <div className="store-option" key={index}>
                <input type="checkbox" id={`custom-checkbox-${index}`} title={value.title} value={value.title} checked={checkedState[index]} onChange={() => handleOnChange(index)} />
                <span className="store-name">{value.title}</span>
                {/* <label htmlFor={`custom-checkbox-${index}`}>{title}</label> */}
              </div>
            );
          })}
        </div>
        <input className="item-input" type="text" placeholder="search item.." onChange={searchChangeHandler} />

        {/* <div className="item-dropdown">
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
            </div> */}

        <button className="insert-button" onClick={enterSearchValues}>
          Enter
        </button>
        {/* <button className ="insert-button2" onClick={() => props.setTriggerSearchResults(true)}>Enter</button> */}
        <button className="insert-button" onClick={() => props.setTriggerInsertItem(false)}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default InsertItemPopup;
