import React, { useState } from 'react';
import './Login.css';
import Modal from 'react-modal';
import axios from 'axios';
import {motion} from 'framer-motion'
const Login = ({setUser}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLoginSubmit = () => {
    axios.post('/login', {username: loginUsername, password: loginPassword})
      .then(data => {
        setUser(data.data)
        setShowLogin(false);
        setShowError(false);
      })
      .catch(err => {
        setShowError(true);
      })
  }

  const handleSignupSubmit = () => {
    axios.post('/signup', {username: signupUsername, password: signupPassword})
      .then(data => {
        setUser(data.data);
        setShowSignup(false)
      })
  }


  var stylesLogin = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    },
    content: {
      position: "absolute",
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      borderRadius: '20px',
      margin: "auto",
      width: "70vw",
      maxWidth: '480px',
      bottom: "45vh",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      outline: "none",
      padding: "20px",

    }
  };


  return (
    <div className='login'>

      {/* LOGIN MODAL */}
      <Modal
        isOpen={showLogin}
        onRequestClose={() => {setShowLogin(false)}}
        style={stylesLogin}
        appElement={document.getElementById('App')}
      >
        <h2>Login</h2>
        <h4>Username</h4>
        <input className='form-control' type="text" onChange={e => setLoginUsername(e.target.value)}/>
        <h4>Password</h4>
        <input className='form-control' type="text" onChange={e => setLoginPassword(e.target.value)} />
        {showError ? (<small className='form-text text-danger'>
          Login information incorrect.
        </small>) : null}
        <div className='flex-row'>
          <button className='login-form-button' onClick={handleLoginSubmit}>Submit</button>
          <button className='login-form-button' onClick={() => {setShowLogin(false)}}>Close</button>
        </div>
      </Modal>

      {/* SIGNUP MODAL */}
      <Modal
        isOpen={showSignup}
        onRequestClose={() => {setShowSignup(false)}}
        style={stylesLogin}
        appElement={document.getElementById('App')}
      >
        <h2>Signup</h2>
        <h4>Username</h4>
        <input className='form-control' type="text" onChange={e => setSignupUsername(e.target.value)}/>
        <h4>Password</h4>
        <input className='form-control' type="text" onChange={e => setSignupPassword(e.target.value)} />
        <div className='flex-row'>
          <button className='stock-button login-form-button' onClick={handleSignupSubmit}>Submit</button>
          <button className='stock-button login-form-button' onClick={() => {setShowSignup(false)}}>Close</button>
        </div>
      </Modal>

        <motion.button
          className='login-button'
          onClick={() => {setShowLogin(true)}}
          // transition={{duration: 0.2}}
          transition={{type: 'spring', delay: 1, duration: 2}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          whileHover={{outline: 'none', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.104)', fontWeight: 'bolder'}}
        >
          Login
        </motion.button>

        <motion.button
          className='login-button'
          onClick={() => {setShowSignup(true)}}
          // transition={{duration: 0.2}}
          transition={{type: 'spring', delay: 1, duration: 2}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          whileHover={{outline: 'none', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.104)', fontWeight: 'bolder'}}
        >
          Signup
        </motion.button>

    </div>

  )


}




export default Login;