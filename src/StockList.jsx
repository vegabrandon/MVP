import React from "react";
import './StockList.css';
import { motion} from 'framer-motion';
const StockList = ({ stocks, handleRemoval, openModal }) => {

  return (
    <div className="flex-row">
      <div className='stock flex-row space-evenly'>
        <div className="flex-col space-evenly">
          <div>
            <h3>
              <b>Ticker</b>
            </h3>
          </div>
          {stocks.map(stock => <div className="stock-ticker">
            <h1 className="stock-symbol">{stock.symbol}</h1>
            <h3>{stock.name}</h3>
          </div>)}
        </div>
        <div className="flex-col space-evenly">
          <div>
            <h3>
              <b>Price</b>
            </h3>
          </div>
          {stocks.map(stock => <div className="stock-close flex-col center">
            <h3>${parseFloat(stock.close).toFixed(2)}</h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <h3>
              <b>% Daily</b>
            </h3>
          </div>
          {stocks.map(stock => <div className="stock-daily flex-col center">
            <h3>{parseFloat(stock.percent_change).toFixed(2)}%</h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <h3>
              <b>Shares</b>
            </h3>
          </div>
          {stocks.map(stock =>
            <div className="stock-val flex-col center">
              <h3>
                {stock.share_count}
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
          {stocks.map(stock => <div className="stock-daily flex-col center">
              <h3>
                ${parseFloat(parseFloat(stock.close) * parseFloat(stock.share_count)).toFixed(2)}
              </h3>
          </div>)}
        </div>
        <div className="flex-col">
          <div>
            <button className='stock-button'><i class="fa-solid fa-rotate-right"></i></button>

          </div>
          {stocks.map(stock =>
            <div className="flex-col space-evenly stock-buttons">
              <motion.button
                className="stock-button"
                onClick={() => {openModal(stock.symbol)}}
                transition={{duration: 0.25}}
                whileHover={{ backgroundColor:'rgba(255, 255, 255, 0.104)', outline: 'none' }}
              >
                Edit
              </motion.button>
              <motion.button
                className="stock-button"
                onClick={() => {handleRemoval(stock.symbol)}}
              >
                Remove
              </motion.button>
          </div>
          )}
        </div>


      </div>
    </div>
  )
}

export default StockList;