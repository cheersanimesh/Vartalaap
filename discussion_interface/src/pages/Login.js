import { Button } from '@material-ui/core'
import React from 'react'
import { auth, provider} from '../firebase';
import '../styles/Login.css'
import VartalaapLogo from '../images/VartalaapLogo.png'

const Login = () => {
    
    const signIn = () =>{  
        // sign in user 
        auth.signInWithPopup(provider).catch((err) =>{
            alert(err.message)
        })
    }
    return (
        <div className="cont">
            <div className = "login">
                <div className = "login__vartalaap">
                    <img 
                        src = {VartalaapLogo}
                        alt = "Vartalaap logo"
                    />
                    <h1>Vartalaap</h1>
                    <Button className = "login__button" onClick = {signIn} >Sign In</Button>
                </div>
            </div>
        </div>
    )
}

export default Login
