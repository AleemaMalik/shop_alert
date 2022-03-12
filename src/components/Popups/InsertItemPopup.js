import React from "react";
import "./InsertItemPopup.css";
import WebScraper from "../../webscraper/WebScraper";

function InsertItemPopup(props) {
  let scraper = new WebScraper();
  scraper.getItemsFromSearch("mouse pad", "amazon.ca").then((info) => {
    console.log(info);
  });

  return props.triggerInsertItem ? (
    <div className="insert-item-popup">
      <div className="insert-item-popup-content">
        <h3>Insert Item URL</h3>
        <input type="url" placeholder="Insert URL..." />
        <button onClick={() => props.setTriggerItemInfo(true)}>Enter</button>
        <button onClick={() => props.setTriggerInsertItem(false)}>Cancel</button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default InsertItemPopup;
