import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import StockApp from './StockApp.jsx'
import Login from './Login.jsx'
function App() {
  const [user, setUser] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/session')
      .then(data => {
        if (data.data.length !== 0) {
          setUser(data.data);
        }
      })
  }, [])

  useEffect(() => {console.log(user)}, [user])
  return (
    <div className="App" id='App'>

      {user === '' ? <><h1>Welcome!</h1> <Login setUser={setUser}></Login></> : <><h1>User logged in: {user}</h1><StockApp></StockApp></>}
    </div>
  );
}

export default App;
