import React, { useState, useEffect } from "react";
import itemImage from "./images/itemImage.png";
import "./ItemInfoPopup.css";

// import WebScraper from "../WebScraper/WebScraper";

function ItemInfoPopup(props) {
  console.log(props.itemInfo);
  return props.triggerInfoPopup ? (
    <div className="item-info-popup">
      <div className="item-info-popup-content">
        <h3>Item Information</h3>
        <img src={props.itemInfo.imageURL} alt="Image Unavailable" />
        <h5>
          <a href={props.itemInfo.URL} target="_blank">
            {props.itemInfo.name}
          </a>
        </h5>
        <h3>{props.itemInfo.price.amount + " " + props.itemInfo.price.currency}</h3>
        <form>
          <label for="colors">Choose a color:</label>
          <select name="colors" id="colors">
            <option>Black-Red</option>
            <option>White</option>
            <option>Matte-Black</option>
          </select>
          <br />
          <input className="item-info-submit" type="submit" value="Submit" />
        </form>
        <button onClick={() => props.setTriggeritemInfo(false)}>Cancel</button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ItemInfoPopup;
