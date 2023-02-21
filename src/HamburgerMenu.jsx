import {React, useState} from 'react';
import {motion} from 'framer-motion';
import Modal from 'react-modal'
import axios from 'axios'
const HamburgerMenu = ({currentApp, setCurrentApp, user, setUser}) => {
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState('')
  const [portfolioList, setPortfolioList] = useState([]);

  const stylesShareModal = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      zIndex: 12,
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

  const removeTimestamp = (ts) => {
    var copiedList = JSON.parse(JSON.stringify(portfolioList));
    for (var i = 0; i < copiedList.length; i ++) {
      if (copiedList[i] === ts) {
        copiedList.splice(i, 1);
        break;
      }
    }
    return copiedList;
  }

  const handleOnChangeCheck = (e) => {
    var timestamp = e.target.id;
    if (e.target.checked) {
      setPortfolioList([...portfolioList, e.target.id])
    } else {
      setPortfolioList(removeTimestamp(timestamp))
    }
  }

  const handleListSubmission = (e) => {
    e.preventDefault();
    axios.post(`/users/${user._id}/lists/new`, { name: newListName, timestamps: portfolioList})
      .then(user => {setUser(user.data); setShowListModal(false); setNewListName(''); setPortfolioList([])})
  }



  const whileHover = {outline: 'none', cursor: 'pointer', backgroundColor: '#2f686e'};

return (
<>
  {/* ADD LIST MODAL */}
  <Modal
      isOpen={showListModal}
      style={stylesShareModal}
      appElement={document.getElementById('App')}
    >
      <h2>Add a New List</h2>
      <h4>New List Name</h4>
      <input className='form-control' type="text" onChange={e => setNewListName(e.target.value)}/>


      <div className="flex-row space-evenly">

        <div className="flex-col">
          <div><h4>Crypto:</h4></div>
          {user.crypto.map(cryp => (
            <div className='flex-row'>
              <input type="checkbox" id={cryp.timestamp} name={cryp.timestamp} value={cryp.timestamp} onChange={handleOnChangeCheck}/>
              <label htmlFor={cryp.timestamp}>&nbsp;{cryp.symbol} - ${parseFloat(parseFloat(cryp.quote['USD'].price) * parseFloat(cryp.share_count)).toFixed(2)}</label>
            </div>
          ))}
        </div>
        <div className="flex-col">
          <div><h4>Stocks:</h4></div>

          {user.stocks.map(stock => (
            <div className='flex-row'>
              <input type="checkbox" id={stock.timestamp} name={stock.timestamp} value={stock.timestamp} onChange={handleOnChangeCheck}/>
              <label htmlFor={stock.timestamp}>&nbsp;{stock.symbol} - ${parseFloat(parseFloat(stock.close) * parseFloat(stock.share_count)).toFixed(2)}</label>
            </div>

          ))}

        </div>

      </div>

      <div className='flex-row'>
        <button className='login-form-button' onClick={handleListSubmission}>Submit</button>
        <button className='login-form-button' onClick={() => {setShowListModal(false)}}>Close</button>
      </div>


    </Modal>

  <motion.div
    transition={{ duration: 0.5}}
    initial={{x: -1000}}
    animate={{x: 0}}
    className='menu-div'
  >
    {
      currentApp === 'Stock' ? (
        <div
          className='menu-div-item-selected'
        >
        Stock Portfolio
        </div>
      ) : (
        <motion.div
        className='menu-div-item'
        whileHover={whileHover}
        onClick={() => {setCurrentApp('Stock')}}
      >
      Stock Portfolio
        </motion.div>
      )
    }
    {
      currentApp === 'Crypto' ? (
        <div
          className='menu-div-item-selected'
        >
          Crypto Portfolio
        </div>
      ) : (
        <motion.div
          className='menu-div-item'
          onClick={() => {setCurrentApp('Crypto')}}
          whileHover={whileHover}
        >
          Crypto Portfolio
        </motion.div>
      )
    }
    <motion.div
          className='menu-div-item'
          transition={{duration: 0.25}}
          whileHover={whileHover}
          onClick={(e) => setShowListModal(true)}
        >
          Add Portfolio List
    </motion.div>
    {
      user && user.lists && user.lists.length > 0 ? (
        user.lists.map((obj) => {
          console.log('TRUEEEEE')
          if (currentApp === obj.name) {
            return (
              <div
                className='menu-div-item-selected'
              >
                {obj.name}
              </div>
              )
          } else {
            return (
              <motion.div
                className='menu-div-item'
                transition={{duration: 0.25}}
                whileHover={whileHover}
                onClick={() => {setCurrentApp(obj.name)}}
              >
                {obj.name}
              </motion.div>
              )
          }
          })
      ) : console.log('FALSEEEEE')
    }

    </motion.div>
</>
    )

}

export default HamburgerMenu;