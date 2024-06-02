import useTradeStore from '@/store/useTradeStore';
import useListPairPriceSlow from '@/store/useListPairPriceSlow';
import useListPairPrice from '@/store/useListPairPrice';
import { divide } from '@/utils/operationBigNumber';
  
let socket
let count = 0
const pairPrice = {}

const channelToSubscription = new Map()

export const FEED_IDS = {
  // crypto
  e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43: 'BTCUSD',
  ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace: 'ETHUSD',
  '8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221': 'LINKUSD',
  '8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026': 'TONUSD',
  '3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5': 'ARBUSD',
  ec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8: 'XRPUSD',
  ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d: 'SOLUSD',
  '2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f': 'BNBUSD',
  // BOGEUSD: "",
  // forex
  '765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2': 'XAUUSD',
  f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e: 'XAGUSD',
  a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b: 'EURUSD',
  '84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1': 'GBPUSD',
};

const listIdsForex = ['a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b', '84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1', 'f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e']
const listIdsOther = ['765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2']

const updatePairPriceToMem = (json) => {
  count = count + 1;
  const {
    id,
    price: { price },
  } = json.price_feed;
  pairPrice[FEED_IDS[id]] = listIdsForex.includes(id) ? +divide(price, 5) : listIdsOther.includes(id) ? +divide(price, 3) : +divide(price, 8);

  useListPairPrice.getState().setListPairPrice({ ...pairPrice });

  if (count === 1 || count % 150 === 0) {
    useListPairPriceSlow.getState().setListPairPriceSlow({ ...pairPrice });
  }
};


function handleStreamingData(data) {
  const { id, price: { price: p, publish_time: t } } = data.price_feed;
  
  const tradePrice = listIdsForex.includes(id) ? +divide(p, 5) : listIdsOther.includes(id) ? +divide(p, 3) : +divide(p, 8)
  const tradeTime = t * 1000 // Multiplying by 1000 to get milliseconds

  const channelString = id
  const subscriptionItem = channelToSubscription.get(channelString)

  if (!subscriptionItem) {
    return
  }

  const lastDailyBar = subscriptionItem.lastDailyBar
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time)

  let bar
  if (tradeTime >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
    }
    console.log('[stream] Generate new bar', bar)
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    }
	  useTradeStore.getState().setPrice(tradePrice)
    // console.log('[stream] Update the latest bar by price', tradePrice)
  }

  subscriptionItem.lastDailyBar = bar

  // Send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler) => handler.callback(bar))
  channelToSubscription.set(channelString, subscriptionItem)
}

const configPythId = {
  // crypto
  BTCUSD: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  ETHUSD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  LINKUSD: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  TONUSD: '0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026',
  ARBUSD: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
  XRPUSD: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
  SOLUSD: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  BNBUSD: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  // BOGEUSD: "",
  // forex
  XAUUSD: '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2',
  XAGUSD: '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e',
  EURUSD: '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b',
  GBPUSD: '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1',
}

export function startStreaming() {
  socket = new WebSocket('wss://hermes.pyth.network/ws');
  socket.addEventListener('open', () => {
    const request = {
      type: 'subscribe',
      ids: Object.values(configPythId),
    };
    socket.send(JSON.stringify(request));
  });
  socket.addEventListener('message', (event) => {
    try {
      const json = JSON.parse(event.data);
      if (json.type === 'price_update') {
        handleStreamingData(json);
        updatePairPriceToMem(json)
      }
    } catch (e) {
      console.error(e);
    }
  });
  socket.addEventListener("error", (event) => {
    // (async () => { await sleep(5000); startStreaming() })()
    // onResetCacheNeededCallback(true)
    console.log("WebSocket error: ", event);
    setTimeout(function() {
      startStreaming();
    }, 1000);
  });
  socket.addEventListener("close", (event) => {
    // (async () => { await sleep(5000); startStreaming() })()
    // onResetCacheNeededCallback(true)
    console.log("WebSocket close: ", event);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getNextDailyBarTime(barTime) {
  const date = new Date(barTime * 1000)
  date.setDate(date.getDate() + 1)
  return date.getTime() / 1000
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback,
  lastDailyBar
) {
  const channelString = configPythId[symbolInfo.name].substring(2)
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  }
  let subscriptionItem = channelToSubscription.get(channelString)
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  }
  channelToSubscription.set(channelString, subscriptionItem)
  console.log(
    '[subscribeBars]: Subscribe to streaming. Channel:',
    channelString
  )
  useTradeStore.getState().setPrice(0)
}

export function unsubscribeFromStream(subscriberUID) {
  // Find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    )

    if (handlerIndex !== -1) {
      // Unsubscribe from the channel if it is the last handler
      console.log(
        '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
        channelString
      )
      // socket.close(1000, 'remove');
      channelToSubscription.delete(channelString)
      break
    }
  }
}
