import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listPriceDropItems, listRestockItems } from '../../graphql/queries';
import { useState } from 'react';
import { useEffect } from 'react';
function MainDashboard() {
    // This initializes the blogs to an empty array. 
    const [priceDropItems, setPriceDropItems] = useState([]);
    const [restockItems, setRestockItems] = useState([]);

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
    // In the return block you need to format the data stored in the useState hooks to populate react tables on the frontend
    return (
        <div>   
            {restockItems[0].itemName}
            {restockItems[0].storeName}
            {restockItems[0].inStock}

            {priceDropItems[0].itemName}
            {priceDropItems[0].storeName}
            {priceDropItems[0].initialPrice}
            {priceDropItems[0].currentPrice}
        </div>
    )
}
export default MainDashboard;