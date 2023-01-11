import axios from "axios";
import React from "react";
import './StockList.css';

const StockList = ({ stocks, handleRemoval, openModal }) => {

  return (
    stocks.map(stock => (
      <div className="flex-row">
        <div className="stock flex-row">
          <div>
            <h1 className="stock-symbol">{stock.symbol} - </h1>
            <h3>{stock.name}</h3>
          </div>

          <div className="flex-col">
            <h4>Price: {stock.close}</h4>
            <h4>% Daily Change: {stock.percent_change}%</h4>
            <h4>Daily Volume: {stock.average_volume}</h4>
          </div>

          <div className="flex-col">
            <h4>Yearly:</h4>
            <h4>High: {stock.fifty_two_week.high}</h4>
            <h4>Low: {stock.fifty_two_week.low}</h4>
          </div>
          <div>
            <h4>
              Share Count:<br></br>{stock.share_count}
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

    ))
  )
}

export default StockList;