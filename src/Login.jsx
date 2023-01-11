import React, { useState } from 'react';
import './Login.css';
import Modal from 'react-modal';
import axios from 'axios';
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
          <button className='login-form-button' onClick={handleSignupSubmit}>Submit</button>
          <button className='login-form-button' onClick={() => {setShowSignup(false)}}>Close</button>
        </div>
      </Modal>

        <button className='login-button btn' onClick={() => {setShowLogin(true)}}>Login</button>
        <button className='login-button btn' onClick={() => {setShowSignup(true)}}>Signup</button>

    </div>

  )


}




export default Login;