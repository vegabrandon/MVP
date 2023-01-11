import React from "react";

const CryptoList = ({cryptos}) => {

  return (
    cryptos.map(crypto => (
      <div className="flex-row">
        <div className="stock flex-row">
          <div>
            <h1 className="stock-symbol">{crypto.symbol}</h1>
            <h3 className="capitalize">{crypto.name}</h3>
          </div>

          <div className="flex-col">
            <h4>Price: {crypto.price}</h4>
            <h4>% Daily Change: {crypto.percent_change_24h}%</h4>
            <h4>Daily Volume: {crypto.volume_24h}</h4>
          </div>

          <div className="flex-col">
            <h4>7d Change: {crypto.percent_change_7d}%</h4>
            <h4>30d Change: {crypto.percent_change_30d}%</h4>
            <h4>90d Change: {crypto.percent_change_90d}%</h4>
          </div>
        </div>

        <div>
          <h4>
            Share Count: {crypto.share_count}
          </h4>
          <h4>Value: {parseFloat(parseFloat(crypto.price) * parseFloat(crypto.share_count)).toFixed(2)}</h4>
        </div>
        <div className="flex-col space-evenly stock-buttons">
          <button className="stock-button">
            Edit
          </button>
          <button className="stock-button">
            Remove
          </button>
        </div>
      </div>
    ))
  )
}

export default CryptoList;