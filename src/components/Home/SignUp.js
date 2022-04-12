// import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
// import { RestockTable } from '../Tables/RestockTable/Restock'
// //import './HomePage.css'
// import './SignUp.css'
// import react from 'react'
// import { Link } from 'react-router-dom'
// import { signupForm } from './SignupElements'
// //import { signupForm,signupBtn,  signupFormTitle, signupFormCtrl, signupLabel, signupInput } from './SignupElements'

// export const SignUp = () => {
//     // const initialForm = prepareForm(signupForm);
//     // const [form, setForm] = useState(initialForm);
//     // const onSubmitHandler = ()=> onsubmit(form, () => setForm(initialForm));
//     return (
    
//         // <signupForm>
//         //     <signupFormTitle>Sign up</signupFormTitle>
//         //         <signupFormCtrl>
//         //             <signupLabel>Email

//         //             </signupLabel>
//         //             <signupInput/>
//         //         </signupFormCtrl>
            
//         //     <signupBtn>

//         //     </signupBtn>
//         // </signupForm>
//         <div className = "signupForm">

        
//             <div className="signupFormTitle">Sign Up</div>

//             <form>
//                 <label className = "signupLabel" for="fname">First Name:</label>
//                 <input className = "signupInput" type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Last Name:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Email:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Confirm Email:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Phone:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>
                
//                 <label className = "signupLabel" for="lname">Password:</label>
//                 <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>

//                 <label className = "signupLabel" for="lname">Confirm Password:</label>
//                 <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>
//                 <div className = "signupButton">
//                 <Link to ='shopAlert/MainDashboard' >Submit</Link>
//                 </div>
//                 {/* <input type="submit" value="Create New Account" /> */}
                
//             </form>



//         </div>
//     )
// }


// import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
// import { RestockTable } from '../Tables/RestockTable/Restock'
// //import './HomePage.css'
// import './SignUp.css'
// import react from 'react'
// import { Link } from 'react-router-dom'
// import { signupForm } from './SignupElements'
// //import { signupForm,signupBtn,  signupFormTitle, signupFormCtrl, signupLabel, signupInput } from './SignupElements'





// export const SignUp = () => {
//     // const initialForm = prepareForm(signupForm);
//     // const [form, setForm] = useState(initialForm);
//     // const onSubmitHandler = ()=> onsubmit(form, () => setForm(initialForm));
//     return (
    
//         // <signupForm>
//         //     <signupFormTitle>Sign up</signupFormTitle>
//         //         <signupFormCtrl>
//         //             <signupLabel>Email

//         //             </signupLabel>
//         //             <signupInput/>
//         //         </signupFormCtrl>
            
//         //     <signupBtn>

//         //     </signupBtn>
//         // </signupForm>
//         <div className = "signupForm">

        
//             <div className="signupFormTitle">Sign Up</div>

//             <form>
//                 <label className = "signupLabel" for="fname">First Name:</label>
//                 <input className = "signupInput" type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Last Name:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Email:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Confirm Email:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

//                 <label className = "signupLabel" for="fname">Phone:</label>
//                 <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>
                
//                 <label className = "signupLabel" for="lname">Password:</label>
//                 <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>

//                 <label className = "signupLabel" for="lname">Confirm Password:</label>
//                 <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>
//                 <div className = "signupButton">
//                 <Link to ='shopAlert/MainDashboard' >Submit</Link>
//                 </div>
//                 {/* <input type="submit" value="Create New Account" /> */}
                
//             </form>



//         </div>
//     )
// }

//import React from 'react'
import {createPriceDropItem, updatePriceDropItem, deletePriceDropItem } from '../../graphql/mutations'
import {createRestockItem, updateRestockItem, deleteRestockItem } from '../../graphql/mutations'

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import {useState, useEffect} from 'react'
import { listPriceDropItems, listRestockItems } from '../../graphql/queries';
import { v4 as uuid} from 'uuid';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

// import  {notifyPriceDrop} from '../Dashboard/MainDashboard.js';
// import  {notifyBackInStock} from '../Dashboard/MainDashboard.js';

const initialFormState = {storeName:'', itemName:'', initialPrice:'', currentPrice:'' }


export const SignUp = () => {


    //////////////////////////////////////////////////////

    // This initializes the blogs to an empty array. 
    const [priceDropItems, setPriceDropItems] = useState([]);
    const [restockItems, setRestockItems] = useState([]);
    const [formData, setFormData] = useState({});
    const [urlPriceDropList, setUrlPricedropList] = useState({})
    const [urlstockList, setUrlStockList] = useState({})



    // This tells the app to run fetchPriceDropItems everytime MainDashboard.js is rendered
    // Problem: fetchPriceDropItems updates states which renders the page. This will result in infinite loop
    // Soln: Add a second parameter to indicate this should only happen once
    useEffect(() => {
        fetchPriceDropItems();
        fetchRestockItems();
    }, []);


    // var timerID = setInterval(function() {
    //     // your code goes here...
    // }, 60 * 1000); 
    
    // clearInterval(timerID); 
    const [notifications, setNotifications] = useState([]);

  const notifyPriceDrop = (prevPrice, newPrice, itemName) => {
    toast("Price Dropped for "+itemName+" from "+prevPrice+" to "+newPrice);
    notifications[notifications.length] = "Price Dropped for "+itemName+" from "+prevPrice+" to "+newPrice;
    setNotifications(notifications);
    console.log(notifications);
  };
  const notifyBackInStock = (itemName) => {
    toast("Item "+itemName+" is back instock");
    notifications[notifications.length] = "Item "+itemName+" is back instock";
    setNotifications(notifications);
    console.log(notifications);
  };
    const fetchPriceDropItems = async () => {
        try {
            // Call the graphQL API to get all price drop items from DynamoDB
            const priceDropData = await API.graphql(graphqlOperation(listPriceDropItems));
            // Extract the items
            const priceDropList = priceDropData.data.listPriceDropItems.items;

            //loop through priceDropList and run scraper 
            for(let i= 0; i<priceDropList.length; i++){
                //insert webscraper run here on priceDropList[i].itemURL
                let current_price = priceDropList[i].currentPrice;
                current_price = current_price.replace("$", "");
                current_price = parseFloat(current_price);
                let initial_price = priceDropList[i].initialPrice;
                let item_url = priceDropList[i].itemURL;
                let id_i = priceDropList[i].id;
                let store_name = priceDropList[i].storeName;
                let item_name = priceDropList[i].itemName;
                if(current_price>0){
                    console.log('New price is cheaper... BUY NOW', current_price);
                    notifyPriceDrop(current_price, 0, item_name);
                    //update
                    let new_price = 0;
                    const updatePDItem = {
                        id: id_i,
                        storeName: store_name, 
                        itemName: item_name, 
                        currentPrice: new_price,
                        initialPrice: current_price
                      };
                      
                    await API.graphql(graphqlOperation(updatePriceDropItem, {input: updatePDItem}));
                }
                else{
                    console.log('price has not dropped', current_price);
                }
            }
            //storing itemURL in array
            // let urlList = priceDropList.map(({currentPrice }) =>  currentPrice)
            // setUrlPricedropList(urlList)

            console.log('price drop item list', priceDropList);
            // Update the priceDropList object
            setPriceDropItems(priceDropList)

        } catch (error) {
            console.log('error on fetching price drop items', error);
        }
    };



    const fetchRestockItems = async () => {
        try {
            const restockData = await API.graphql(graphqlOperation(listRestockItems));
            const restockList = restockData.data.listRestockItems.items;

            //update stock 
            for(let a=0; a<restockList.length; a++){
                //insert webscraper run here on restockList[i].itemURL
                let in_stock = restockList[a].inStock;
                let item_url_restock = restockList[a].itemURL;
                let id_restock = restockList[a].id;
                let store_name_restock = restockList[a].storeName;
                let item_name_restock = restockList[a].itemName;
                //if current stock is false but webscraper result is true then update table
                if(in_stock =='No' ){
                    // if(webscraper stock==true){
                        console.log('Item is in stock');
                        notifyBackInStock(item_name_restock);
                        const updateRItem = {
                        id: id_restock,
                        storeName: store_name_restock, 
                        itemName: item_name_restock, 
                        inStock: 'Yes',
                    };

                        await API.graphql(graphqlOperation(updateRestockItem, {input: updateRItem}));
                // }
                    console.log('Not back in stock!')
                }
            }
        
            console.log('restock item list', restockList);

            setRestockItems(restockList)
        } catch (error) {
            console.log('error on fetching price drop items', error);
        }
    };

   
    const createPDItem = async () => {
        console.log("formData", formData);
        const { storeName, itemName, initialPrice, currentPrice } = formData;
        const createNewPDItem = {
          id: uuid(),
          storeName,
          itemName,
          initialPrice,
          currentPrice,
        };
        //need to upload to dynamoDB, graphqlOperations takes query and variable
        await API.graphql(graphqlOperation(createPriceDropItem, { input: createNewPDItem }));
    }

    return (
        
        <div className = "App">
            <input
            onChange={e => setFormData({...formData, storeName: e.target.value})}
            placeholder ="Store"
            value={formData.storeName}
            />
            <input
            onChange={e => setFormData({...formData, itemName: e.target.value})}
            placeholder ="Item name"
            value={formData.itemName}
            />
            <input
            onChange={e => setFormData({...formData, initialPrice: e.target.value})}
            placeholder ="Start price"
            value={formData.initialPrice}
            />
            <input
            onChange={e => setFormData({...formData, currentPrice: e.target.value})}
            placeholder ="Current Price"
            value={formData.currentPrice}
            />
            <button onClick={createPDItem}> Create Item</button>
            {/* <div style={{marginBottom:30}}>
            {  
            priceDropItemData.map(note => (
                <div key={note.id}>
                    <h2>{note.iteme}</h2>
                    <p>{note.storee}</p>
                    <h5>{note.currentPricee}</h5>
                    <h5>{note.initialPricee}</h5>
                    <button onClick={() => deletePDItem(note)}> Delete Item</button>
                    </div>
            ))
            
            }
          

            </div> */}
            {/* <table>
               <thead>
                   <tr>
                    <th> id</th>
                    <th>store</th>
                    <th>Item</th>
                    <th>initial price</th>
                    <th>current price</th>
                       </tr>
                   </thead> 


                   <tr>

                   </tr>
                
            </table>    */}

        
        </div>
    )
}



// export default SignUp;




