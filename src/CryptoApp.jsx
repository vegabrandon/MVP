import React from "react";
import Modal from 'react-modal';

const CryptoApp = () => {
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
      <div className='flex-col' style={{marginTop: '50px'}}>

        {console.log('USER CONSOLE LOGS', user)}
        {user && user.stocks && user.stocks.length > 0 ? (<div><h2 className='h2-val display-2'>Portfolio Value: ${portfolioValue()}</h2><hr /></div>) : null}



      </div>

      {user.stocks.length > 0 ? (
        <>
          <center>
            <StockList openModal={openModal} handleRemoval={handleRemoval} stocks={user.stocks} />
          </center>
        </>
      ) :(
        <h3 className='h3-add'>Add some stocks and see them here!</h3>
      )}
    </>

  );
}
export default CryptoApp;