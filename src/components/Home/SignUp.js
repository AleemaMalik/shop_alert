import { PriceDropTable } from '../Tables/PriceDropTable/PriceDrop'
import { RestockTable } from '../Tables/RestockTable/Restock'
//import './HomePage.css'
import './SignUp.css'
import react from 'react'
import { Link } from 'react-router-dom'
import { signupForm } from './SignupElements'
//import { signupForm,signupBtn,  signupFormTitle, signupFormCtrl, signupLabel, signupInput } from './SignupElements'

export const SignUp = () => {
    // const initialForm = prepareForm(signupForm);
    // const [form, setForm] = useState(initialForm);
    // const onSubmitHandler = ()=> onsubmit(form, () => setForm(initialForm));
    return (
    
        // <signupForm>
        //     <signupFormTitle>Sign up</signupFormTitle>
        //         <signupFormCtrl>
        //             <signupLabel>Email

        //             </signupLabel>
        //             <signupInput/>
        //         </signupFormCtrl>
            
        //     <signupBtn>

        //     </signupBtn>
        // </signupForm>
        <div className = "signupForm">

        
            <div className="signupFormTitle">Sign Up</div>

            <form>
                <label className = "signupLabel" for="fname">First Name:</label>
                <input className = "signupInput" type="text" id="fname" name="fname" /><br></br>

                <label className = "signupLabel" for="fname">Last Name:</label>
                <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

                <label className = "signupLabel" for="fname">Email:</label>
                <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

                <label className = "signupLabel" for="fname">Confirm Email:</label>
                <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>

                <label className = "signupLabel" for="fname">Phone:</label>
                <input className = "signupInput"type="text" id="fname" name="fname" /><br></br>
                
                <label className = "signupLabel" for="lname">Password:</label>
                <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>

                <label className = "signupLabel" for="lname">Confirm Password:</label>
                <input className = "signupInput"type="password" id="lname" name="lname" /><br></br>
                <div className = "signupButton">
                <Link to ='shopAlert/MainDashboard' >Submit</Link>
                </div>
                {/* <input type="submit" value="Create New Account" /> */}
                
            </form>



        </div>
    )
}


