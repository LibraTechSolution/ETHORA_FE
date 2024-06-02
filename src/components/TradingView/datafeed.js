import { subscribeOnStream, unsubscribeFromStream } from './streaming.js'

const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

export const marketsForChart = {
  "BTCUSD": {
    category: 'Crypto',
    tv_id: 'BTCUSD',
    pair: 'BTC-USD',
    price_precision: 100,
    token0: 'BTC',
    token1: 'USD',
    full_name: 'Bitcoin',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/btc.svg',
    pythId:
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    pythGroup: 'Crypto',
  },
  "ETHUSD": {
    category: 'Crypto',
    tv_id: 'ETHUSD',
    pair: 'ETH-USD',
    price_precision: 100,
    token0: 'ETH',
    token1: 'USD',
    full_name: 'Ethereum',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/btc.svg',
    pythId:
      '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    pythGroup: 'Crypto',
  },
  "EURUSD": {
    category: 'Forex',
    tv_id: 'EURUSD',
    pair: 'EUR-USD',
    price_precision: 1000000,
    token0: 'EUR',
    token1: 'USD',
    full_name: 'Euro',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/euro.png',
    pythId:
      '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b',
    pythGroup: 'FX',
  },
  "GBPUSD": {
    category: 'Forex',
    tv_id: 'GBPUSD',
    pair: 'GBP-USD',
    price_precision: 1000000,
    token0: 'GBP',
    token1: 'USD',
    full_name: 'Pound',
    img: 'https://cdn.buffer.finance/Buffer-Media/main/GBP.png',
    pythId:
      '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1',
    pythGroup: 'FX',
  },
  "SOLUSD": {
    category: 'Crypto',
    tv_id: 'SOLUSD',
    pair: 'SOL-USD',
    price_precision: 1000,
    token0: 'SOL',
    token1: 'USD',
    full_name: 'Solana',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/sol.svg',
    pythId:
      '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    pythGroup: 'Crypto',
  },
  "LINKUSD": {
    category: 'Crypto',
    tv_id: 'LINKUSD',
    pair: 'LINK-USD',
    price_precision: 10000,
    token0: 'LINK',
    token1: 'USD',
    full_name: 'Chainlink',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/link.svg',
    pythId:
      '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
    pythGroup: 'Crypto',
  },
  "XAUUSD": {
    category: 'Commodity',
    tv_id: 'XAUUSD',
    pair: 'XAU-USD',
    price_precision: 100,
    token0: 'XAU',
    token1: 'USD',
    full_name: 'Gold',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/xau.svg',
    pythId:
      '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2',
    pythGroup: 'Metal',
  },
  "XAGUSD": {
    category: 'Commodity',
    tv_id: 'XAGUSD',
    pair: 'XAG-USD',
    price_precision: 1000,
    token0: 'XAG',
    token1: 'USD',
    full_name: 'Silver',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/xag.svg',
    pythId:
      '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e',
    pythGroup: 'Metal',
  },
  "ARBUSD": {
    category: 'Crypto',
    tv_id: 'ARBUSD',
    pair: 'ARB-USD',
    price_precision: 10000,
    token0: 'ARB',
    token1: 'USD',
    full_name: 'Arbitrum',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/arb.svg',
    pythId:
      '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
    pythGroup: 'Crypto',
  },
  "BNBUSD": {
    category: 'Crypto',
    tv_id: 'BNBUSD',
    pair: 'BNB-USD',
    price_precision: 100,
    token0: 'BNB',
    token1: 'USD',
    full_name: 'Binance Coin',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/bnb.svg',
    pythId:
      '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
    pythGroup: 'Crypto',
  },
  "XRPUSD": {
    category: 'Crypto',
    tv_id: 'XRPUSD',
    pair: 'XRP-USD',
    price_precision: 100000,
    token0: 'XRP',
    token1: 'USD',
    full_name: 'Ripple',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/xrp.svg',
    pythId:
      '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
    pythGroup: 'Crypto',
  },
  "TONUSD": {
    category: 'Crypto',
    tv_id: 'TONUSD',
    pair: 'TON-USD',
    price_precision: 10000,
    token0: 'TON',
    token1: 'USD',
    full_name: 'TON',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/ton.svg',
    pythId:
      '0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026',
    pythGroup: 'Crypto',
  },
};

const datafeed = {
  onReady: (callback) => {
    console.log('[onReady]: Method call')
    fetch(`${API_ENDPOINT}/config`).then((response) => {
      response.json().then((configurationData) => {
        setTimeout(() => callback(configurationData))
      })
    })
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('[searchSymbols]: Method call')
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        console.log(data)
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName)
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          console.log('symbolInfo', symbolInfo)
          const pricescale = marketsForChart[symbolInfo.name].price_precision
          onSymbolResolvedCallback({...symbolInfo, pricescale}) // config number of decimals
        })
        .catch((error) => {
          console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
          onResolveErrorCallback('Cannot resolve symbol')
          return
        })
    })
  },
  getBars: (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to)
    fetch(
      `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${periodParams.from}&to=${periodParams.to}&resolution=${resolution}`
    ).then((response) => {
      response
        .json()
        .then((data) => {
          if (data.t.length === 0) {
            onHistoryCallback([], { noData: true })
            return
          }
          const bars = []
          for (let i = 0; i < data.t.length; ++i) {
            bars.push({
              time: data.t[i] * 1000,
              low: data.l[i],
              high: data.h[i],
              open: data.o[i],
              close: data.c[i],
            })
          }
          if (firstDataRequest) {
            lastBarsCache.set(symbolInfo.ticker, {
              ...bars[bars.length - 1],
            })
          }
          onHistoryCallback(bars, { noData: false })
        })
        .catch((error) => {
          console.log('[getBars]: Get error', error)
          onErrorCallback(error)
        })
    })
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      '[subscribeBars]: Method call with subscriberUID:',
      subscriberUID
    )
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.ticker)
    )
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID
    )
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed
