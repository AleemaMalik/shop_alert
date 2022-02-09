import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
import { RestockTable } from '../Tables/RestockTable/Restock'
//import './HomePage.css'
import React from 'react';
import './LogIn.css'




export const LogIn = () => {
    return (
        <div className="loginForm">
           
            <div className="loginFormTitle">
            Login</div>

            <form>
                <label className = "loginLabel" for="fname">Username/Email:</label>
                <input className = "loginInput" type="text" id="fname" name="fname" /><br></br>
                <label className = "loginLabel" for="lname">Password:</label>
                <input className = "loginInput" type="password" id="lname" name="lname" /><br></br>
                <div className="signupButton">Submit</div>

                {/* <input type="submit" value="Submit" /> */}
            </form>


        </div>
    )
}
