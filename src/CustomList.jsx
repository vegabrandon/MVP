import {React, useState} from "react";
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import axios from "axios";

const CustomList = ({list, user, setUser, name}) => {
  const [showCryptoEditModal, setShowCryptoEditModal] = useState({});
  const [showStockEditModal, setShowStockEditModal] = useState({});
  const [newStockShareCount, setNewStockShareCount] = useState(0);
  const [newCryptoShareCount, setNewCryptoShareCount] = useState(0);

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
  const handleCryptoEdit = () => {
    axios.put(`/users/${user._id}/crypto/${showCryptoEditModal.symbol}/${newCryptoShareCount}`)
      .then(user => {setUser(user.data); setShowCryptoEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }
  const handleStockEdit = () => {
    axios.put(`/users/${user._id}/stocks/${showStockEditModal.symbol}/${newStockShareCount}`)
      .then(user => {setUser(user.data); setShowStockEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }

  const handleStockRemoval = (symbol) => {
    axios.delete(`/users/${user._id}/stocks/${symbol}`)
      .then(user => {setUser(user.data); setShowStockEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }
  const handleCryptoRemoval = (symbol) => {
    axios.delete(`/users/${user._id}/crypto/${symbol}`)
      .then(user => {setUser(user.data); setShowCryptoEditModal({})})
      .catch(err => console.error('Error deleting', err))
  }

  const portfolioValue = () => {
    var value = 0;
    for (var i = 0; i < list.length; i ++) {
      if (list[i].id !== undefined) {
        value += parseFloat(parseFloat(parseFloat(list[i].quote.USD.price) * parseFloat(list[i].share_count)).toFixed(2))
      } else {
        value += parseFloat(parseFloat(parseFloat(list[i].close) * parseFloat(list[i].share_count)).toFixed(2))
      }
    }
    return value.toFixed(2);
  }



  return (
    <>
    {/* FOR STOCK EDIT */}
    <Modal
      isOpen={showStockEditModal.show}
      onRequestClose={() => {setShowStockEditModal({})}}
      style={stylesShareModal}
      appElement={document.getElementById('App')}
    >
      <h2>Edit Amount of Shares for the Symbol: {showStockEditModal.symbol}</h2>
      <h4>New Share Count</h4>
      <input className='form-control' type="text" onChange={e => setNewStockShareCount(e.target.value)}/>
      <div className='flex-row'>
        <button className='login-form-button' onClick={handleStockEdit}>Submit</button>
        <button className='login-form-button' onClick={() => {setShowStockEditModal({})}}>Close</button>
      </div>
    </Modal>


    {/* FOR CRYPTO EDIT */}
    <Modal
      isOpen={showCryptoEditModal.show}
      onRequestClose={() => {setShowCryptoEditModal({})}}
      style={stylesShareModal}
      appElement={document.getElementById('App')}
    >
      <h2>Edit Amount of Shares for the Symbol: {showCryptoEditModal.symbol}</h2>
      <h4>New Share Count</h4>
      <input className='form-control' type="text" onChange={e => setNewCryptoShareCount(e.target.value)}/>
      <div className='flex-row'>
        <button className='login-form-button' onClick={handleCryptoEdit}>Submit</button>
        <button className='login-form-button' onClick={() => {setShowCryptoEditModal({})}}>Close</button>
      </div>
    </Modal>


      <motion.button
        transition={{duration: 0.25}}
        className="add-share-button"
        whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
        onClick={() => {}}
      >
        Add to list
      </motion.button>


    <div className='flex-col' style={{marginTop: '50px'}}>
        {Array.isArray(list) && list.length > 0 ? (<div><h2 className='h2-val display-2'>{name} Value: ${portfolioValue()}</h2><hr /></div>) : null}
      </div>
    <div className="flex-row">
    <div className='stock flex-row space-evenly'>
      <div className="flex-col space-evenly">
        <div>
          <h3>
            <b>Ticker</b>
          </h3>
        </div>
        {list.map(item => {
          return (
            <div className="stock-ticker">
              <h1 className="stock-symbol">{item.symbol}</h1>
              <h3>{item.name}</h3>
            </div>
          )
         })}
      </div>
      <div className="flex-col space-evenly">
        <div>
          <h3>
            <b>Price</b>
          </h3>
        </div>
        {list.map(item => {
        if (item.id === undefined) {
          //STOCK FORMATTING
          return (<div className="stock-close flex-col center">
          <h3>${parseFloat(item.close).toFixed(2)}</h3>
        </div>)
        } else {
          //CRYPTO FORMATTING
          return (<div className="stock-close flex-col center">
          <h3>${parseFloat(item.quote['USD'].price).toFixed(2)}</h3>
        </div>)
        }
        })}
      </div>
      <div className="flex-col">
        <div>
          <h3>
            <b>% Daily</b>
          </h3>
        </div>
        {list.map(item => {
          if (item.id === undefined) {
            // STOCK FORMATTING
            return (<div className="stock-daily flex-col center">
          <h3>{parseFloat(item.percent_change).toFixed(2)}%</h3>
        </div>)
          } else {
            // CRYPTO FORMATTING
            return (<div className="stock-daily flex-col center">
            <h3>{parseFloat(item.quote['USD'].percent_change_24h).toFixed(2)}%</h3>
          </div>)
          }
      })}
      </div>
      <div className="flex-col">
        <div>
          <h3>
            <b>Amount</b>
          </h3>
        </div>
        {list.map(item =>
          <div className="stock-val flex-col center">
            <h3>
              {item.share_count}
            </h3>
          </div>
        )}
      </div>
      <div className="flex-col">
        <div>
          <h3>
            <b>Value</b>
          </h3>
        </div>
        {list.map(item => {
        if (item.id === undefined) {
          // STOCK FORMATIING
          return (<div className="stock-daily flex-col center">
          <h3>
            ${parseFloat(parseFloat(item.close) * parseFloat(item.share_count)).toFixed(2)}
          </h3>
          </div>)
        } else {
          // CRYPTO FORMATTING
          return (<div className="stock-daily flex-col center">
              <h3>
                ${parseFloat(parseFloat(item.quote['USD'].price) * parseFloat(item.share_count)).toFixed(2)}
              </h3>
          </div>)
        }
        })}
      </div>
      <div className="flex-col">
        <div>
          <button className='stock-button'><i class="fa-solid fa-rotate-right"></i></button>

        </div>
        {list.map(item =>{
          if (item.id === undefined) {
          return (<div className="flex-col space-evenly stock-buttons">
            <motion.button
              className="stock-button"
              onClick={() => {setShowStockEditModal({symbol: item.symbol, show: true})}}
              transition={{duration: 0.25}}
              whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
            >
              Edit
            </motion.button>
            <motion.button
              className="stock-button"
              onClick={() => {handleStockRemoval(item.symbol)}}
            >
              Remove
            </motion.button>
        </div>)
        } else {
          return (
            <div className="flex-col space-evenly stock-buttons">
              <motion.button
                className="stock-button"
                onClick={() => {setShowCryptoEditModal({symbol: item.symbol, show: true})}}
                transition={{duration: 0.25}}
                whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
              >
                Edit
              </motion.button>
              <motion.button
                className="stock-button"
                onClick={() => {handleCryptoRemoval(item.symbol)}}
              >
                Remove
              </motion.button>
          </div>
          )
        }
        }
        )}
      </div>


    </div>
  </div>
  </>
  )
}

export default CustomList;