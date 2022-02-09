import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
import { RestockTable } from '../Tables/RestockTable/Restock'
import './MainDashboard.css'
import InsertItemPopup from "../Popups/InsertItemPopup"
import ItemInfoPopup from '../Popups/ItemInfoPopup'
import { useState } from 'react'
import SideBar from "../SideBar/SideBar"
import NotifBar from '../SideBar/NotifBar'
import TopBar from '../TopBar/TopBar'
function MainDashboard() {
    // state variables for item selection and info popups
    const [insertItemPopup, setinsertItemPopup] = useState(false)
    const [itemInfoPopup, setItemInfoPopup] = useState(false)

    return (
        <div>
  
        <div className ="sideBarRow">

          <NotifBar />   
        <div className='main_dashboard'>
            <h1 align="left" className='user'>
                Hello Bob!
            </h1>
            <div className='table'>
                <p className='table_title'>My Price Drop List
                    <button className='add_item' onClick={() => setinsertItemPopup(true)}>Add Item</button>
                </p>
                <PriceDropTable />
            </div>
            <div className='table'>
                <p className='table_title'>My Restock Watch List
                    <button className='add_item' onClick={() => setinsertItemPopup(true)}>Add Item</button>
                </p>
                <RestockTable />
            </div>
            {/* Item Selection and Info Popups */}
            <InsertItemPopup triggerInsertItem={insertItemPopup} setTriggerInsertItem={setinsertItemPopup} setTriggerItemInfo={setItemInfoPopup}></InsertItemPopup>
            <ItemInfoPopup triggerInfoPopup={itemInfoPopup} setTriggeritemInfo={setItemInfoPopup}></ItemInfoPopup>
        </div>
        </div>
        </div>
    )
}
export default MainDashboard;