import {React, useState} from 'react';
import {motion} from 'framer-motion';
import Modal from 'react-modal'
import axios from 'axios'
const HamburgerMenu = ({currentApp, setCurrentApp, user, setUser}) => {
  const [showModal, setShowModal] = useState(false);
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState('');
  const handleSymbolSubmission = () => {
    axios.post(`/users/${user._id}/stocks`, {symbol, shares})
      .then(data => {setUser(data.data); setShowModal(false); });
  }
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

  const whileHover = {outline: 'none', cursor: 'pointer', backgroundColor: '#2f686e'};

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

  <motion.div
    transition={{ duration: 1}}
    initial={{x: -1000}}
    animate={{x: 0}}
    className='menu-div'
  >
    {
      currentApp === 'Stock' ? (
      <>
        {/* <motion.div
          className='menu-div-item'
          style={{marginTop: '70px'}}
          transition={{duration: 0.25}}
          whileHover={{outline: 'none', cursor: 'pointer', backgroundColor: '#2f686e'}}
          onClick={() => {setShowModal(true)}}
        >
          Add to portfolio
        </motion.div> */}
        <motion.div
          className='menu-div-item'
          style={{marginTop: '70px'}}
          transition={{duration: 0.25}}
          whileHover={whileHover}
          // onClick={handleAddList}
        >
          Add portfolio list.
        </motion.div>
        <motion.div
        className='menu-div-item'
        transition={{duration: 0.25}}
        whileHover={whileHover}
        onClick={() => {setCurrentApp('Crypto')}}
      >
        Switch to Crypto Portfolio
      </motion.div>
    </>
    ) : null
  }
    </motion.div>
</>
    )

}

export default HamburgerMenu;