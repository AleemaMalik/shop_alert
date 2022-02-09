//rfce short cut command
import react from 'react';
import {SideBarData} from "./SideBarData"
import {useState} from 'react';
import "./SideBar.css"

function SideBar() {
    const [searchTerm, setSearchTerm]  = useState("");
    return (
        <div className="SideBar">
            
            <div className = "SearchBar">
                <button className="SearchButton">
                <i class="bi bi-search"></i>
                </button>
            <input type = "text"  placeholder="Search.." 
            onChange={event => {setSearchTerm(event.target.value);}}/>
            </div>
            <div className="divider">

            </div>

            <u1 className = "SideBarList">
            {SideBarData.filter((val=>{
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
    );
}

export default SideBar