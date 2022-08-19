export const ORDER_STATUS = {
  '-1': 'Not Triggered',
  '0': 'NEW, In progress',
  '1': 'WAIT, In progress (Partial deal)',
  '2': 'COMPLETE, Completed',
  '3': 'PARTIAL, Completed (Partial deal)',
  '4': 'CANCEL, Cancelled',
  '6': 'Post-only Cancelled',
}

/**
 * axios Request
 */

export interface CreateOrderRequestType {
  action: string // The action type of the order. Range: [BUY, SELL]
  amount: string // The amount of the order for the trading pair. https://www.bitopro.com/ns/fees
  price: string // The price of the order for the trading pair.
  timestamp: number // The client timestamp in millisecond.
  type: string // The order type. Range: [LIMIT, MARKET, STOP_LIMIT]
  stopPrice?: string // The price to trigger stop limit order, only required when type is [STOP_LIMIT].
  condition?: string // The condition to match stop price, only required when type is [STOP_LIMIT].
  timeInForce?: string // Time in force condition for orders. If type is [MARKET], this will always be GTC. Default: GTC, Range: [GTC, POST_ONLY]
  clientId?: number // This information help users distinguish their orders. Range: 1 ~ 2147483647
  percentage?: number // The amount of the sell order which can be percentage of your balance.(e.g 1 mean 1%) Default: 100 ,Range: 1~100
}

export interface CreateBatchOrderRequestType {
  [T: string]: {
    pair: string // The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
    action: string // The action type of the order, should only be BUY or SELL. Range: [BUY, SELL]
    amount: string // The amount of the order for the trading pair. https://www.bitopro.com/ns/fees
    price: string // The price of the order for the trading pair. Range: > 0
    timestamp: number // The client timestamp in millisecond.
    type: string // The order type, should only be [LIMIT], [MARKET].
    timeInForce?: string // Time in force condition for orders. If type is [MARKET], this will always be GTC. Default: GTC, Range: [GTC, POST_ONLY]
    clientId?: number // This information help users distinguish their orders. Range: 1 ~ 2147483647
  }
}

/**
{
  "BTC_USDT": [
    "12234566",
    "12234567"
  ],
  "ETH_USDT": [
    "44566712",
    "24552212"
  ]
}
 */
export interface cancelBatchOrderRequestType {
  [T: string]: string
}

/**
 * axios Response
 */

export interface CurrenciesResponseType {
  data: CurrenciesType[]
}

export interface CurrenciesType {
  currency: string // 'mith'
  deposit: boolean // true
  depositConfirmation: string // '20'
  maxDailyWithdraw: string // '500000'
  maxWithdraw: string // '200000'
  minWithdraw: string // '30'
  withdraw: boolean // true
  withdrawFee: string // '2'
}

export interface LimitationsAndFeesResponseType {
  tradingFeeRate: TradingFeeRateType[]
  orderFeesAndLimitations: OrderFeesAndLimitationsType[]
  restrictionsOfWithdrawalFees: RestrictionsOfWithdrawalFeesType[]
  cryptocurrencyDepositFeeAndConfirmation: CryptocurrencyDepositFeeAndConfirmationType[]
  ttCheckFeesAndLimitationsLevel1: TTCheckFeesAndLimitationsLevelType[]
  ttCheckFeesAndLimitationsLevel2: TTCheckFeesAndLimitationsLevelType[]
}

export interface TradingFeeRateType {
  rank: number // 0
  twdVolumeSymbol: string // '<'
  twdVolume: string // '3000000'
  bitoAmountSymbol: string // '<'
  bitoAmount: string // '7500'
  makerFee: string // '0.001'
  takerFee: string // '0.002'
  makerBitoFee: string // '0.0007'
  takerBitoFee: string // '0.0014'
}

export interface OrderFeesAndLimitationsType {
  pair: string // 'BTC/TWD'
  minimumOrderAmount: string // '0.0025'
  minimumOrderAmountBase: string // 'BTC'
  minimumOrderNumberOfDigits: string // '0'
}

export interface RestrictionsOfWithdrawalFeesType {
  currency: string // 'TWD'
  fee: string // '15'
  minimumTradingAmount: string // '100'
  maximumTradingAmount: string // '1000000'
  dailyCumulativeMaximumAmount: string // '2000000'
  remarks: string // ''
}

export interface CryptocurrencyDepositFeeAndConfirmationType {
  currency: string // 'TWD'
  generalDepositFees: string // '0'
  blockchainConfirmationRequired: string // ''
}

export interface TTCheckFeesAndLimitationsLevelType {
  currency: string // 'TWD'
  redeemDailyCumulativeMaximumAmount: string // ''
  generateMinimumTradingAmount: string // ''
  generateMaximumTradingAmount: string // ''
  generateDailyCumulativeMaximumAmount: string // ''
}

export interface OrderBookResponseType {
  asks: OrderBookType[]
  bids: OrderBookType[]
}

export interface OrderBookType {
  amount: string // '10000000000'
  count: number // 2
  price: string // '100000000'
  total: string // '10000000000'
}

export interface TickersResponseType {
  data: TickersType[]
}

export interface TickersType {
  high24hr: string // '0.03252800'
  isBuyer: boolean // false
  lastPrice: string // '0.03252800'
  low24hr: string // '0.03252800'
  pair: string // 'eth_btc'
  priceChange24hr: string // '0'
  volume24hr: string // '0.00000000'
}

export interface RecentTradesResponseType {
  data: RecentTradesType[]
}

export interface RecentTradesType {
  amount: string // '0.11000000'
  isBuyer: boolean // false
  price: string // '126709.00000000'
  timestamp: number // 1551753875
}

export interface TradingHistoryResponseType {
  data: TradingHistoryType[]
}

export interface TradingHistoryType {
  timestamp: number // 1551052800000
  open: string // '4099.99'
  high: string // '4444.47'
  low: string // '3875.32'
  close: string // '3955.8'
  volume: string // '13.35162928'
}

export interface TradingPairsResponseType {
  data: TradingPairsType[]
}

export interface TradingPairsType {
  base: string // 'xem'
  basePrecision: string // '8'
  maintain: boolean // false
  maxLimitBaseAmount: string // '100000000'
  minLimitBaseAmount: string // '320'
  minMarketBuyQuoteAmount: string // '0.15'
  orderOpenLimit: string // '200'
  pair: string // 'xem_eth'
  quote: string // 'eth'
  quotePrecision: string // '6'
}

export interface AccountsBalanceResponseType {
  data: AccountsBalanceType[]
}

export interface AccountsBalanceType {
  amount: string // '10001'
  available: string // '1.0'
  currency: string // 'bito'
  stake: string // '10000'
  tradable: boolean // true
}

export interface OrdersResponseType {
  data: OrdersType[]
}

export interface OrdersType {
  action: string // 'BUY'
  avgExecutionPrice: string // '0'
  bitoFee: string // '0'
  executedAmount: string // '0'
  fee: string // '0'
  feeSymbol: string // 'bito'
  id: string // '887521192'
  originalAmount: string // '1000'
  pair: string // 'bito_eth'
  price: string // '0.005'
  remainingAmount: string // '1000'
  seq: string // 'BITOETH8913789893'
  status: number // 0
  createdTimestamp: number // 1570591525592
  updatedTimestamp: number // 1570601523551
  total: string // '0'
  type: string // 'LIMIT'
  timeInForce: string // 'GTC'
  clientId: number // 123
}

export interface TradeListResponseType {
  data: TradeType[]
}

export interface TradeType {
  tradeId: string // '3109362209'
  orderId: string // '7977988235'
  price: string // '530'
  action: string // 'SELL'
  baseAmount: string // '600'
  quoteAmount: string // '318000'
  fee: string // '95.4'
  feeSymbol: string // 'ETH'
  isTaker: boolean // false
  timestamp?: number // 1628054591943, deprecated, using createdTimestamp
  createdTimestamp: number // 1628054591943
}

export interface CancelOrdersResponseType {
  data: CancelOrdersType
}

/**
{
  "BTC_USDT": [
    "12234566", // cancelled orders
    "12234567"
  ],
  "ETH_USDT": [
    "44566712",
    "24552212"
  ]
}
*/
export interface CancelOrdersType {
  [T: string]: string[]
}

export interface CreateOrderResponseType {
  orderId: number // 1234567890
  action: string // 'BUY'
  amount: string // '250'
  price: string // '0.000075'
  timestamp: number // 1504262258000
  timeInForce: string // 'POST_ONLY'
  clientId: number // 12345
}

export interface CreateBatchOrderResponseType {
  data: CreateBatchOrderType[]
}

export interface CreateBatchOrderType {
  orderId: number // 1234567890
  action: string // 'BUY'
  price: string // '210000'
  amount: string // '1'
  timestamp: 1504262258000
  timeInForce: string // 'GTC'
  clientId: number // 123
}

/**
 * wss Response
 */
export interface WssOrderBookType {
  event: string
  pair: string
  timestamp: number
  datetime: string
  bids: Array<{
    price: string
    amount: string
    count: number
    total: string
  }>
  asks: Array<{
    price: string
    amount: string
    count: number
    total: string
  }>
}

export interface WssTickerType {
  event: string
  pair: string
  isBuyer: boolean
  priceChange24hr: string
  volume24hr: string
  high24hr: string
  low24hr: string
  timestamp: number
  datetime: string
}

export interface WssTradeType {
  event: string
  pair: string
  timestamp: number
  datetime: string
  data: Array<{
    timestamp: number
    price: string
    amount: string
    isBuyer: boolean
  }>
}

export interface WssActiveOrdersType {
  event: string
  timestamp: number
  datetime: string
  data: {
    [T: string]: Array<{
      id: string // '8917255503'
      pair: string // 'sol_usdt'
      price: string // '107'
      avgExecutionPrice: string // '0'
      action: string // 'SELL', [BUY, SELL]
      type: string // 'LIMIT'
      timestamp: number // 1639386803663
      updatedTimestamp: number // 1639386803663
      createdTimestamp: number // 1639386803663
      status: number // 0, see ORDER_STATUS https://github.com/bitoex/bitopro-offical-api-docs/blob/master/v3-1/rest-1/rest.md#order-status
      originalAmount: string // '0.02'
      remainingAmount: string // '0.02'
      executedAmount: string // '0'
      fee: string // '0'
      feeSymbol: string // 'usdt'
      bitoFee: string // '0', bito currency fee
      total: string // '0'
      seq: string // 'SOLUSDT3273528249'
      timeInForce: string // 'GTC'
    }>}
}

export interface WssAccountBalanceType {
  event: string
  timestamp: number
  datetime: string
  data: {
    [T: string]: Array<{
      currency: string //  'ADA', uppercase string
      amount: string //  '999999999999.99999999', Total amount
      available: string //  '999999999999.99999999'
      stake: string //  '0'
      tradable: boolean // true
    }>}
}
