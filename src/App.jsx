import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import StockApp from './StockApp.jsx'
import Login from './Login.jsx'
import CryptoApp from './CryptoApp.jsx';
import { motion } from 'framer-motion'
import HamburgerMenu from './HamburgerMenu.jsx';
import CustomList from './CustomList.jsx'

function App() {
  const [user, setUser] = useState({})
  const [checked, setChecked] = useState(false)
  const [currentApp, setCurrentApp] = useState('Stock')
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState({});


  const handleLogout = () => {
    axios.get('/logout')
      .then(data => {setUser({});})
  }
  const returnCustomList = (str) => {
    for (var i = 0; i < user.lists.length; i ++) {
      if (user.lists[i].name === str) {
        return <CustomList list={user.lists[i].list} name={user.lists[i].name} user={user} setUser={setUser} />
      }
    }
  }

  useEffect(() => {
    axios.get('http://localhost:3001/session')
      .then(data => {
        if (data.data.length !== 0) {
          setUser(data.data);
        }
        setChecked(true)
      })
  }, [])

  useEffect(() => {
    if (currentApp !== 'Stock' && currentApp !== 'Crypto' && currentApp.length > 0) {
      setCurrentApp(currentApp)
    }
  }, [user])
  return (
    <div className="App" id='App'>
      {/* CHECK IF REQUEST FOR USER LOGGED IN IS TRUE */}
      {checked ? (
      <>
        {Object.keys(user).length === 0 ? (
          // IS NOT LOGGED IN
        <div className='home-log-in'>
          {console.log('USER',user)}
          <motion.h1
              transition={{type: 'spring', delay: 1, duration: 5}}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
            >
              Welcome!
            </motion.h1>
          <Login setUser={setUser}></Login>
        </div>) : (
          // IS LOGGED IN
          <>
          <div className="menu">
            <button onClick={() => {setMenuOpen(!menuOpen)}} className='menu-button'>{menuOpen ? <i class="fa-solid fa-xmark"></i> : <i class="fa-solid fa-bars"></i>}</button>
            {/* <h6 className='title'>Portfolio App</h6> */}

            {/* HAMBURGER MENU */}
            {
              menuOpen ? <HamburgerMenu user={user} setUser={setUser} setCurrentApp={setCurrentApp} currentApp={currentApp} /> : null
            }

          </div>
        <div className='home-log-in flex-col'>


          <div className='flex-col center' id='logged-in'>
            <motion.h1
              transition={{type: 'spring', stiffness: 500, damping: 50, duration: 2, delay:0.5}}
              initial={{opacity: .5, scale: 0.5, x: -50000}}
              animate={{opacity: 1, scale: 1, x: 0}}
            >
              Welcome!
            </motion.h1>
            <div className='avatar'>
              <i class="fa-solid fa-user"></i>
              <span className='avatar-text'>{user.user}</span>
              <button className='logout-button' onClick={handleLogout}>Logout</button>
            </div>


          </div>

          {currentApp === 'Stock' ? (
          <div>

          <StockApp user={user} setUser={setUser} setCurrentApp={setCurrentApp} />
          </div>
          ) : currentApp === 'Crypto' ? (<CryptoApp user={user} setUser={setUser}/>) : currentApp.length > 0 ? returnCustomList(currentApp) : null}

        </div>
        </>)
        }
      </>
        )
         : null}
    </div>

  );
}

export default App;
