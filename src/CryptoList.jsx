import React from "react";
import { motion } from 'framer-motion';

const CryptoList = ({cryptos, handleRemoval, openModal}) => {
  console.log('')
  return (
    <div className="flex-row">
      <div className='stock flex-row space-evenly'>
        <div className="flex-col space-evenly">
          <div>
            <h3>
              <b>Ticker</b>
            </h3>
          </div>
          {cryptos.map(crypto => <div className="stock-ticker">
            <h1 className="stock-symbol">{crypto.symbol}</h1>
            <h3>{crypto.name}</h3>
          </div>)}
        </div>
        <div className="flex-col space-evenly">
          <div>
            <h3>
              <b>Price</b>
            </h3>
          </div>
          {cryptos.map(crypto => <div className="stock-close flex-col center">
            <h3>${parseFloat(crypto.quote['USD'].price).toFixed(2)}</h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <h3>
              <b>% Daily</b>
            </h3>
          </div>
          {cryptos.map(crypto => <div className="stock-daily flex-col center">
            <h3>{parseFloat(crypto.quote['USD'].percent_change_24h).toFixed(2)}%</h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <h3>
              <b>Amount</b>
            </h3>
          </div>
          {cryptos.map(crypto =>
            <div className="stock-val flex-col center">
              <h3>
                {crypto.share_count}
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
          {cryptos.map(crypto => <div className="stock-daily flex-col center">
              <h3>
                ${parseFloat(parseFloat(crypto.quote['USD'].price) * parseFloat(crypto.share_count)).toFixed(2)}
              </h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <button className='stock-button'><i class="fa-solid fa-rotate-right"></i></button>

          </div>
          {cryptos.map(crypto =>
            <div className="flex-col space-evenly stock-buttons">
              <motion.button
                className="stock-button"
                onClick={() => {openModal(crypto.symbol)}}
                transition={{duration: 0.25}}
                whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
              >
                Edit
              </motion.button>
              <motion.button
                className="stock-button"
                onClick={() => {handleRemoval(crypto.symbol)}}
              >
                Remove
              </motion.button>
          </div>
          )}
        </div>


      </div>
    {/* {stocks.map(stock => (
      <div className="flex-row">
        <div className="stock flex-row">
          <div>
            <h1 className="stock-symbol">{stock.symbol}</h1>
            <h3>{stock.name}</h3>
          </div>

          <div className="flex-col center">
            <h3>${stock.close}</h3>
          </div>

          <div className="flex-col center">
            <h3>{stock.percent_change}%</h3>
          </div>
          <div className="center">
            <h4>
              {stock.share_count}
            </h4>
            <h4>Value: {parseFloat(parseFloat(stock.close) * parseFloat(stock.share_count)).toFixed(2)}</h4>
          </div>
          <div className="flex-col space-evenly stock-buttons">
          <button className="stock-button" onClick={() => {openModal(stock.symbol)}}>
            Edit
          </button>
          <button className="stock-button" onClick={() => {handleRemoval(stock.symbol)}}>
            Remove
          </button>
        </div>
        </div>
      </div>

    ))} */}
    </div>
  )
}

export default CryptoList;