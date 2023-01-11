import axios from 'axios';
import { React, useState, useEffect } from 'react';
import Modal from 'react-modal';
import './StockApp.css';
import StockList from './StockList.jsx'
const StockApp = ({user, setUser}) => {
  const [showModal, setShowModal] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState('');
  const [showEditModal, setShowEditModal] = useState({});
  const [newShareCount, setNewShareCount] = useState(0);


  const handleRemoval = (symbol) => {
    axios.delete(`/users/${user._id}/stocks/${symbol}`)
      .then(user => {setUser(user.data); setShowEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }

  const handleEdit = () => {
    axios.put(`/users/${user._id}/stocks/${showEditModal.symbol}/${newShareCount}`)
      .then(user => {setUser(user.data); setShowEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }

  const handleSymbolSubmission = () => {
    axios.post(`/users/${user._id}/stocks`, {symbol, shares})
      .then(data => {setUser(data.data); setShowModal(false); });
  }

  const openModal = (stockSymbol) => {
    setShowEditModal({
      show: true,
      symbol: stockSymbol
    })
  }

  const portfolioValue = () => {
    var value = 0;
    for (var i = 0; i < user.stocks.length; i ++) {
      value += parseFloat(parseFloat(parseFloat(user.stocks[i].close) * parseFloat(user.stocks[i].share_count)).toFixed(2))
    }
    return value;
  }

  var stylesShareModal = {
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
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={(e) => {setShowModal(false)}}
        appElement={document.getElementById('App')}
        style={stylesShareModal}
      >
        <h2>Add to your portfolio</h2>

        <h4>Stock Symbol</h4>
        <input className='form-control' type="text" onChange={e => setSymbol(e.target.value)}/>

        <h4># of Shares</h4>
        <input className='form-control' type="text" onChange={e => setShares(e.target.value)} />
        <div className='flex-row'>
          <button className='login-form-button' onClick={handleSymbolSubmission}>Submit</button>
          <button className='login-form-button' onClick={() => {setShowModal(false)}}>Close</button>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal.show}
        onRequestClose={() => {setShowEditModal({})}}
        style={stylesShareModal}
        appElement={document.getElementById('App')}
      >
        <h2>Edit Amount of Shares for the Symbol: {showEditModal.symbol}</h2>
        <h4>New Share Count</h4>
        <input className='form-control' type="text" onChange={e => setNewShareCount(e.target.value)}/>
        <div className='flex-row'>
          <button className='login-form-button' onClick={handleEdit}>Submit</button>
          <button className='login-form-button' onClick={() => {setShowEditModal({})}}>Close</button>
        </div>
      </Modal>
      <div className='flex-row'>
        {console.log('USER CONSOLE LOGS', user)}
        {user && user.stocks && user.stocks.length > 0 ? (<><h2 className='h2-val'>Portfolio Value: {portfolioValue()}</h2></>) : null}<button className='add-share-button' onClick={() => {setShowModal(true)}}>
          Add a share
        </button>
      </div>

      {user.stocks.length > 0 ? (
        <center><StockList openModal={openModal} handleRemoval={handleRemoval} stocks={user.stocks} /></center>
      ) :(<h3 className='h3-add'>Add some stocks and see them here!</h3>)}
    </>

  );
}

export default StockApp;