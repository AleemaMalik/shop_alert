import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listBlogs } from '../../graphql/queries';
import { useState } from 'react';
import { useEffect } from 'react';
function MainDashboard() {
    // This initializes the blogs to an empty array. 
    const [blogs, setBlogs] = useState([]);

    // This tells the app to run fetchBlogs everytime this is rendered
    // Problem: fetchBlogs updates states which renders the page. This will result in infinite loop
    // Soln: Add a second parameter to indicate this should only happen once
    useEffect(() => {
        fetchBlogs();
    }, []);
    const fetchBlogs = async () => {
        try {
            const blogData = await API.graphql(graphqlOperation(listBlogs));
            const blogList = blogData.data.listBlogs.items;
            console.log('blog list', blogList);
        } catch (error) {
            console.log('error on fetching blogs', error);
        }
    };
    return (
        <div>
        </div>
    )
}
export default MainDashboard;