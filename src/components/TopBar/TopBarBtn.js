import React from 'react';
import './TopBarBtn.css'
import {Link } from 'react-router-dom'

export function TopBarBtn(){
    return(
        <>
        <div className="rightHeader">
        <Link to='shopAlert/signup'>
            <button className="SignupBtn">Sign up
            </button>
        </Link>
{/* 
        <Link to='shopAlert/login'>
        <button className="loginBtn">Login
        </button>
        </Link> */}
        </div>
</>
    );
}