import {React, useState} from "react";
import Modal from 'react-modal';
import axios from 'axios'
import CryptoList from './CryptoList.jsx'
import { motion } from 'framer-motion'
const CryptoApp = ({user, setUser}) => {
  const [showEditModal, setShowEditModal] = useState({});
  const [newShareCount, setNewShareCount] = useState(0);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [cryptoSymbol, setCryptoSymbol] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('');

  const portfolioValue = () => {
    var value = 0;
    for (var i = 0; i < user.crypto.length; i ++) {
      value += parseFloat(parseFloat(parseFloat(user.crypto[i].quote.USD.price) * parseFloat(user.crypto[i].share_count)).toFixed(2))
    }
    return value.toFixed(2);
  }

  const stylesShareModal = {
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

  const openModal = (cryptoSymbol) => {
    setShowEditModal({
      show: true,
      symbol: cryptoSymbol
    })
  }

  const handleRemoval = (symbol) => {
    axios.delete(`/users/${user._id}/crypto/${symbol}`)
      .then(user => {setUser(user.data); setShowEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }

  const handleEdit = () => {
    axios.put(`/users/${user._id}/crypto/${showEditModal.symbol}/${newShareCount}`)
      .then(user => {setUser(user.data); setShowEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }
  const handleCryptoSubmission = () => {
    axios.post(`/users/${user._id}/crypto`, {symbol: cryptoSymbol, shares: cryptoAmount})
      .then(data => {setUser(data.data); setShowCryptoModal(false);})
      .catch(err => console.error(err));
  }

  return (
    <>
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

      <Modal
        isOpen={showCryptoModal}
        onRequestClose={(e) => {setShowCryptoModal(false)}}
        appElement={document.getElementById('App')}
        style={stylesShareModal}
      >

        <h2>Add to your crypto portfolio</h2>

        <h4>Crypto Symbol</h4>
        <input className='form-control' type="text" onChange={e => setCryptoSymbol(e.target.value)}/>

        <h4># of Shares</h4>
        <input className='form-control' type="text" onChange={e => setCryptoAmount(e.target.value)} />
        <div className='flex-row'>
          <button className='login-form-button' onClick={handleCryptoSubmission}>Submit</button>
          <button className='login-form-button' onClick={() => {setShowCryptoModal(false)}}>Close</button>
        </div>
      </Modal>
      <motion.button
        transition={{duration: 0.25}}
        className="add-share-button"
        whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
        onClick={() => {setShowCryptoModal(true)}}
      >
        Add to portfolio
      </motion.button>
      <div className='flex-col' style={{marginTop: '50px'}}>

        {
        user && user.crypto && user.crypto.length > 0 ? (
        <div>
          <h2 className='h2-val display-2'>
            Portfolio Value: ${portfolioValue()}
          </h2>
          <hr />
        </div>
        ) : null
        }



      </div>

      {user.crypto.length > 0 ? (
        <>
          <center>
            <CryptoList openModal={openModal} handleRemoval={handleRemoval} cryptos={user.crypto} />
          </center>
        </>
      ) :(
        <h3 className='h3-add'>Add some crypto and see them here!</h3>
      )}
    </>

  );
}
export default CryptoApp;