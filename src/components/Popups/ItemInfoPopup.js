import React from 'react'
import itemImage from './images/itemImage.png'
import './ItemInfoPopup.css'

function ItemInfoPopup(props) {
    return (props.triggerInfoPopup) ? (
        <div className="item-info-popup">
            <div className="item-info-popup-content">
                <h3>Item Information</h3>
                <img src={itemImage} alt="Image Unavailable" />
                <h5>Beats Studio3 Wireless Noise Cancelling Over-Ear Headphones</h5>
                <form>
                    <label for="colors">Choose a color:</label>
                    <select name="colors" id="colors">
                        <option>Black-Red</option>
                        <option>White</option>
                        <option>Matte-Black</option>
                    </select>
                    <br/>
                    <input className="item-info-submit" type="submit" value="Submit"/>
                </form>
                <button onClick={() => props.setTriggeritemInfo(false)}>Cancel</button>
            </div>
        </div>
    ) : "";
}

export default ItemInfoPopup
