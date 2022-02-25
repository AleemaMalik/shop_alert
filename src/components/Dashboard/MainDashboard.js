//import React from 'react'
import { createPriceDropItem, updatePriceDropItem, deletePriceDropItem } from '../../graphql/mutations'
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react'
import { listPriceDropItems, listRestockItems } from '../../graphql/queries';
import { v4 as uuid } from 'uuid';

const initialFormState = { storeName: '', itemName: '', initialPrice: '', currentPrice: '' }


function MainDashboard() {


    //////////////////////////////////////////////////////

    // This initializes the blogs to an empty array. 
    const [priceDropItems, setPriceDropItems] = useState([]);
    const [restockItems, setRestockItems] = useState([]);
    const [formData, setFormData] = useState({});

    // This tells the app to run fetchPriceDropItems everytime MainDashboard.js is rendered
    // Problem: fetchPriceDropItems updates states which renders the page. This will result in infinite loop
    // Soln: Add a second parameter to indicate this should only happen once
    useEffect(() => {
        fetchPriceDropItems();
        fetchRestockItems();
    }, []);
    const fetchPriceDropItems = async () => {
        try {
            // Call the graphQL API to get all price drop items from DynamoDB
            const priceDropData = await API.graphql(graphqlOperation(listPriceDropItems));
            // Extract the items
            const priceDropList = priceDropData.data.listPriceDropItems.items;
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
            console.log('restock list', restockList);
            setRestockItems(restockList)
        } catch (error) {
            console.log('error on fetching price drop items', error);
        }
    };


    const createPDItem = async () => {
        console.log('formData', formData);
        const { storeName, itemName, initialPrice, currentPrice } = formData;
        const createNewPDItem = {
            id: uuid(),
            storeName,
            itemName,
            initialPrice,
            currentPrice
        }
        //need to upload to dynamoDB, graphqlOperations takes query and variable
        await API.graphql(graphqlOperation(createPriceDropItem, { input: createNewPDItem }));

        // if(!formData.storee || !formData.iteme || !formData.currentPricee || !formData.initialPricee)
        // return;
        // const priceDropData = await API.graphql(graphqlOperation(createPriceDropItem, {input: formData}));

        // await API.graphql({ query: createPriceDropItem, variables: { input : formData}});
        // setPriceDropItems([...priceDropItems, formData]);
        // setFormData(initialFormState);  
    };

    // async function deletePDItem({id}){
    //     const newPDItemArray = priceDropItemData.filter(note => note.id !== id);
    //     setPriceDropItemData(newPDItemArray);
    //     await API.graphql({ query: deletePriceDropItem, variables: { input: {id}}});
    // };

    return (

        <div className="App">
            <input
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="Store"
                value={formData.storeName}
            />
            <input
                onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Item name"
                value={formData.itemName}
            />
            <input
                onChange={e => setFormData({ ...formData, initialPrice: e.target.value })}
                placeholder="Start price"
                value={formData.initialPrice}
            />
            <input
                onChange={e => setFormData({ ...formData, currentPrice: e.target.value })}
                placeholder="Current Price"
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



export default MainDashboard;