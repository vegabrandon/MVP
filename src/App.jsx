import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import StockApp from './StockApp.jsx'
import Login from './Login.jsx'
import CryptoApp from './CryptoApp.jsx';
function App() {
  const [user, setUser] = useState({})
  const [checked, setChecked] = useState(false)
  const [currentApp, setCurrentApp] = useState('Stock')
  const handleLogout = () => {
    axios.get('/logout')
      .then(data => {setUser({});})
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

  useEffect(() => {}, [user])
  return (
    <div className="App" id='App'>
      {/* CHECK IF REQUEST FOR USER LOGGED IN IS TRUE */}
      {checked ? (
      <>
        {Object.keys(user).length === 0 ? (
          // IS NOT LOGGED IN
        <div className='home-log-in'>
          <h1>Welcome!</h1>
          <Login setUser={setUser}></Login>
        </div>) : (
          // IS LOGGED IN
        <div className='home-log-in flex-col'>


          <div className='flex-row center' id='logged-in'>
            <h1>Welcome back {user.user}!</h1>
            <button className='logout-button' onClick={handleLogout}>Logout</button>


          </div>
          {currentApp === 'Stock' ? (<StockApp user={user} setUser={setUser} />) : (<CryptoApp />)}

        </div>
        )}
      </>
        )
         : null}
    </div>

  );
}

export default App;
