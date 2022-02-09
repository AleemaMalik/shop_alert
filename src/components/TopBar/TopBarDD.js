import React, {useState} from 'react';
import {StoreList} from './StoreList'
import { Link } from 'react-router-dom'
import './TopBarDD.css'

function TopBarDD(){
    const [searchTerm, setSearchTerm]  = useState("");
    return (
        <div className="NotificationBar">
            
            <div className = "NotifSearchBar">
            <input type = "text"  placeholder="Find store.." 
            onChange={event => {setSearchTerm(event.target.value);}}/>
            </div>

            <u1 className = "SideBarList">
            {StoreList.filter((val=>{
                if(searchTerm == ""){
                    return val
                }else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())){
                    return val
                }

            }
            )).map((val, key) => { 
                return (
                    <li className = "row" key={key}
                    onClick={() => {
                        window.open(val.link, "_blank")}
                    }>
                    <div id = "logo">{val.image}</div> 
                    </li>
                );
            })}
            </u1>
         
        </div>
    )
    
}

//     const [click, setClick] = useState(false)

//     const handleClick = ()=> setClick(!click)
//     return(
//     <div>
//         <ul 
//         onClick={handleClick}
//         className = {click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
//             {StoreList.map((item, index) =>{
//                 return(
//                     <li key={index}>
//                         <Link 
//                         className={item.title} 
//                         to={item.link} 
//                         onClick={()=>setClick(false)}
//                         >
//                             {item.image}
//                         </Link>
//                     </li>
//                 );
//             })}
//         </ul>
//         </div>
//     );
// }
export default TopBarDD;