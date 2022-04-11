import React, { useState, useEffect } from "react";
import itemImage from "./images/itemImage.png";
import "./ItemInfoPopup.css";
import { createPriceDropItem, updatePriceDropItem, deletePriceDropItem } from "../../graphql/mutations";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import WebScraper from "../WebScraper/WebScraper";
import { v4 as uuid } from "uuid";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "../Authentication/UserPool";
import { Auth } from "aws-amplify";
function ItemInfoPopup(props) {
  console.log(props.itemInfo);
  
  const createPDItem = async (props) => {
    // Get the logged in user
    Auth.currentAuthenticatedUser().then(console.log);
    const { attributes } = await Auth.currentAuthenticatedUser();
    console.log(attributes.email)

    // Refactor the storeName that is saved in the prop
    let storeName = ""
    switch(props.itemInfo.site) {
      case "amazon.ca":
        storeName = "Amazon"
        break;
      case "ebay.ca":
        storeName = "Ebay"
        break;
      case "walmart.ca":
        storeName = "Walmart"
        break;
      default:
        storeName = "Amazon"
    }

    // Create a tabel item
      const createNewPDItem = {
          id: uuid(),
          username: attributes.email,
          itemURL:  props.itemInfo.URL,
          storeName: storeName,
          itemName: props.itemInfo.name,
          initialPrice: props.itemInfo.price.amount,
          currentPrice: props.itemInfo.price.amount,
      };
      console.log(createNewPDItem)

      // Need to upload to dynamoDB, graphqlOperations takes query and variable
      try{
        await API.graphql(graphqlOperation(createPriceDropItem, { input: createNewPDItem }));
      } catch(error) {
        console.log("error on creating price drop items", error);
      }
    };
  
  function submitHandler(Event) {
    Event.preventDefault()
    createPDItem(props)
    setTimeout(function() {
      window.location.reload()
    }, 300);
  }

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
          {/* <button onClick={(e) => {this.clickMe(e, someParameter);}}>Click Me!</button> */}
          {/* <button onClick={submitHandler}> Create Item</button> */}
          <input className="item-info-submit" type="submit" value="Submit" onClick={submitHandler}/>
        </form>
        <button onClick={() => props.setTriggeritemInfo(false)}>Cancel</button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ItemInfoPopup;
