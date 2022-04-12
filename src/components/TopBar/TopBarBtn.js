import React from 'react';
import './TopBarBtn.css'
import { Auth } from 'aws-amplify';
import { LogIn } from "../Home/LogIn";
//https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#re-send-confirmation-code
//https://aws-amplify.github.io/amplify-js/api/classes/authclass.html
// How to get data listening https://docs.amplify.aws/lib/utilities/hub/q/platform/js/#channels
export function TopBarBtn(){
    async function signOut() {
        try {
            await Auth.signOut();
            document.getElementById("loginBtn").style.visibility = "visible";
            document.getElementById("signoutBtn").style.visibility = "hidden";
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return(
          <div className="rightHeader">
          <button onClick={signOut} className="SignoutBtn" id="signoutBtn">Sign out </button>
          </div>
    );
}