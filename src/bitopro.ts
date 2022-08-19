import {
  AccountsBalanceResponseType,
  AccountsBalanceType,
  CancelOrdersResponseType,
  CancelOrdersType,
  CreateBatchOrderRequestType,
  CreateBatchOrderResponseType,
  CreateBatchOrderType,
  CreateOrderRequestType,
  CreateOrderResponseType,
  CurrenciesResponseType,
  CurrenciesType,
  LimitationsAndFeesResponseType,
  OrderBookResponseType,
  OrdersResponseType,
  OrdersType,
  RecentTradesResponseType,
  RecentTradesType,
  TickersResponseType,
  TickersType,
  TradeListResponseType,
  TradeType,
  TradingHistoryResponseType,
  TradingHistoryType,
  TradingPairsResponseType,
  TradingPairsType,
  cancelBatchOrderRequestType,
} from './bitopro.type'
import axios, { AxiosRequestConfig } from 'axios'

import { SocksProxyAgent } from 'socks-proxy-agent'
import WebSocket from 'ws'
import crypto from 'crypto'

abstract class BitoPro {
  protected readonly authMode: boolean = false
  protected readonly apiKey: string
  protected readonly apiSecret: string
  protected readonly email: string
  protected readonly sdk: string

  protected readonly headers: {
    'X-BITOPRO-APIKEY'?: string
    'X-BITOPRO-PAYLOAD'?: string
    'X-BITOPRO-SIGNATURE'?: string
    'X-BITOPRO-API': string
  }

  protected proxy?: { host: string, port: number }

  constructor (apiKey?: string, apiSecret?: string, email?: string, proxy?: { host: string, port: number }) {
    this.apiKey = apiKey ?? ''
    this.apiSecret = apiSecret ?? ''
    this.email = email ?? ''

    if (apiKey !== '' && apiSecret !== '' && email !== '') {
      this.authMode = true
    }

    this.sdk = 'hello bitopro'
    this.headers = { 'X-BITOPRO-API': this.sdk }

    this.proxy = proxy
  }

  protected encodePayload (body: object): string {
    return Buffer.from(JSON.stringify(body)).toString('base64')
  }

  protected getSignature (payload: string): string {
    return crypto
      .createHmac('sha384', this.apiSecret)
      .update(payload)
      .digest('hex')
  }

  protected getAuthHeader (body?: object): { 'X-BITOPRO-APIKEY': string, 'X-BITOPRO-PAYLOAD': string, 'X-BITOPRO-SIGNATURE': string } {
    const _body = body === undefined ? { identity: this.email, nonce: Date.now() } : body

    const payload = this.encodePayload(_body)
    const signature = this.getSignature(payload)
    return {
      'X-BITOPRO-APIKEY': this.apiKey,
      'X-BITOPRO-PAYLOAD': payload,
      'X-BITOPRO-SIGNATURE': signature,
    }
  }
}

class BitoProRestful extends BitoPro {
  private readonly orderSides: string[] = ['sell', 'buy']
  private readonly orderTypes: string[] = ['market', 'limit']
  private readonly baseUrl: string = 'https://api.bitopro.com/v3'
  private readonly mobileBaseUrl: string = 'https://mobile-api.bitopro.com/v3'

  private async axiosGet<T>(path: string, headers: object = {}, params?: object): Promise<T> {
    const options: AxiosRequestConfig = {
      headers: { ...this.headers, ...headers },
      params,
    }

    try {
      const res = await axios.get<T>(`${this.baseUrl}${path}`, options)
      if (res.data !== undefined) return res.data
      throw new Error('axios response data undefined')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response !== undefined)) {
        console.error(`${error.name}: ${error.response.status} ${JSON.stringify(error.response.data, null, 2)}`)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  private async axiosPost<T>(path: string, headers: object, body: object): Promise<T> {
    const options: AxiosRequestConfig = {
      headers: { ...this.headers, ...headers },
    }

    try {
      const res = await axios.post<T>(`${this.baseUrl}${path}`, body, options)
      if (res.data !== undefined) return res.data
      throw new Error('axios response data undefined')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response !== undefined)) {
        console.error(`${error.name}: ${error.response.status} ${JSON.stringify(error.response.data, null, 2)}`)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  private async axiosPut<T>(path: string, headers: object, body: object): Promise<T> {
    const options: AxiosRequestConfig = {
      headers: { ...this.headers, ...headers },
    }

    try {
      const res = await axios.put<T>(`${this.baseUrl}${path}`, body, options)
      if (res.data !== undefined) return res.data
      throw new Error('axios response data undefined')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response !== undefined)) {
        console.error(`${error.name}: ${error.response.status} ${JSON.stringify(error.response.data, null, 2)}`)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  private async axiosDelete<T>(path: string, headers: object = {}): Promise<T> {
    const options: AxiosRequestConfig = {
      headers: { ...this.headers, ...headers },
    }

    try {
      const res = await axios.delete<T>(`${this.baseUrl}${path}`, options)
      if (res.data !== undefined) return res.data
      throw new Error('axios response data undefined')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response !== undefined)) {
        console.error(`${error.name}: ${error.response.status} ${JSON.stringify(error.response.data, null, 2)}`)
      } else {
        console.error(error)
      }
      throw error
    }
  }

  /**
   * ---------- Non-authentication Function (get) ----------
   */

  /**
   * Get the list of currencies available and information for each currency
   * @returns Currencies[]
   */
  public async getCurrencies (): Promise<CurrenciesType[]> {
    const res = await this.axiosGet<CurrenciesResponseType>('/provisioning/currencies')
    return res.data
  }

  /**
   * Get VIP trading fee rate, order fees and limitations, Restrictions of withdrawal fees,
   * The cryptocurrency deposit fee and blockchain confirmation required for crediting,
   * TTCheck fees and limitations
   * @returns tradingFeeRate[]
   */
  public async getLimitationsAndFees (): Promise<LimitationsAndFeesResponseType> {
    const res = await this.axiosGet<LimitationsAndFeesResponseType>('/provisioning/limitations-and-fees')
    return res
  }

  /**
   * Get the full order book of the specific pair
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param limit The limit for the response. default: 5, Range: [1, 5, 10, 20]
   * @param scale The scale for the response. default: 0
   * @returns OrderBookResponseType
   */
  public async getOrderBook (pair: string, limit: 1 | 5 | 10 | 20 = 5, scale: number = 0): Promise<OrderBookResponseType> {
    const params = `limit=${limit}&scale=${scale}`
    const res = await this.axiosGet<OrderBookResponseType>(`/order-book/${pair}?${params}`)
    return res
  }

  /**
   * The ticker is a high level overview of the state of the market.
   * It shows you the current best bid and ask, as well as the last trade price.
   * It also includes information such as daily volume and how much the price has moved over the last day
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns TickersType[]
   */
  public async getTickers (pair: string): Promise<TickersType[]> {
    const res = await this.axiosGet<TickersResponseType>(`/tickers/${pair}`)
    return res.data
  }

  /**
   * Get a list of the most recent trades for the given symbol
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns RecentTradesType[]
   */
  public async getRecentTrades (pair: string): Promise<RecentTradesType[]> {
    const res = await this.axiosGet<RecentTradesResponseType>(`/trades/${pair}`)
    return res.data
  }

  /**
   * Get open, high, low, close data in a period. the data of candlestick chart
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param resolution Time frame of the candlestick chart. Example: 1h. Range: [1m, 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1d, 1w, 1M]
   * @param from Start time in unix timestamp. Example: 1550822974
   * @param to End time in unix timestamp. Example: 1566375034
   * @returns TradingHistoryType[]
   */
  public async getTradingHistory (pair: string, resolution: string, from: string, to: string): Promise<TradingHistoryType[]> {
    const params = `resolution=${resolution}&from=${from}&to=${to}`
    const res = await this.axiosGet<TradingHistoryResponseType>(`/trading-history/${pair}?${params}`)
    return res.data
  }

  /**
   * Get a list of pairs available for trade
   * @returns TradingPairsType[]
   */
  public async getTradingPairs (): Promise<TradingPairsType[]> {
    const res = await this.axiosGet<TradingPairsResponseType>('/provisioning/trading-pairs')
    return res.data
  }

  /**
   * ---------- Authentication Function (get, post, delete) ----------
   */

  /**
   * Get the account balance
   * @returns AccountsBalanceType[]
   */
  public async getAccountsBalance (): Promise<AccountsBalanceType[]> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosGet<AccountsBalanceResponseType>('/accounts/balance', header)

    return res.data
  }

  /**
   * Get all orders.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param params
   * @returns OrdersType[] | null
   */
  public async getAllOrders (pair: string, params?: {
    startTimestamp?: number // default: (90 days)
    endTimestamp?: number // default: (current timestamp)
    statusKind?: string // default: ALL, range: [OPEN, DONE, ALL]
    status?: number
    orderId?: string
    limit?: number // default: 100, range: 1 ~ 1000
    clientId?: number // range: 1 ~ 2147483647
  }): Promise<OrdersType[] | null> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosGet<OrdersResponseType>(`/orders/all/${pair}`, header, params)

    return res.data
  }

  /**
   * Get an order.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param orderId
   * @returns OrdersType
   */
  public async getOrder (pair: string, orderId: string): Promise<OrdersType> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosGet<OrdersType>(`/orders/${pair}/${orderId}`, header)

    return res
  }

  /**
   * Get trade list.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param params
   * @returns TradeType[] | null
   */
  public async getTradeList (pair: string, params?: {
    startTimestamp?: number // default: (90 days)
    endTimestamp?: number // default: (current timestamp)
    orderId?: string
    tradeId?: string
    limit?: number // default: 100, range: 1 ~ 1000
  }): Promise<TradeType[] | null> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosGet<TradeListResponseType>(`/orders/trades/${pair}`, header, params)

    return res.data
  }

  /**
   * Cancel all orders. If you send a request to /orders/all API. It will cancel all your active orders of all pairs.
   * ! Rate limit: Allow 1 requests per second per IP.
   * @param pair Default: all. The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns CancelOrdersType | null
   */
  public async cancelOrders (pair: string = 'all'): Promise<CancelOrdersType | null> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosDelete<CancelOrdersResponseType>(`/orders/${pair}`, header)

    return res.data
  }

  /**
   * Cancel an order
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param orderId The id of the order.
   * @returns CancelOrdersType
   */
  public async cancelOrder (pair: string, orderId: string): Promise<CancelOrdersType> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader()
    const res = await this.axiosDelete<CancelOrdersType>(`/orders/${pair}/${orderId}`, header)

    return res
  }

  /**
   * Send a json format request to cancel multiple orders at a time.
   * ! Rate limit: Allow 1 requests per second per IP.
   * @param body cancelBatchOrderRequestType
   * @returns CancelOrdersType
   */
  public async cancelBatchOrders (body: cancelBatchOrderRequestType): Promise<CancelOrdersType> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader(body)
    const res = await this.axiosPut<CancelOrdersResponseType>('/orders', header, body)

    return res.data
  }

  /**
   * Create an order
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @param body
   * @returns CreateOrderResponseType
   */
  public async createOrder (pair: string, body: CreateOrderRequestType): Promise<CreateOrderResponseType> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader(body)
    const res = await this.axiosPost<CreateOrderResponseType>(`/orders/${pair}`, header, body)

    return res
  }

  /**
   * Create batch limit/market orders. Up to 10 limit/market orders can be created at a time.
   * @param body CreateBatchOrderRequestType
   * @returns CreateBatchOrderType[]
   */
  public async createBatchOrder (body: CreateBatchOrderRequestType): Promise<CreateBatchOrderType[]> {
    if (!this.authMode) throw new Error('Please setting authentication data.(apiKey, apiSecret, email)')

    const header = this.getAuthHeader(body)
    const res = await this.axiosPost<CreateBatchOrderResponseType>('/orders/batch', header, body)

    return res.data
  }
}

class BitoProWss extends BitoPro {
  private readonly wsBaseUrl: string = 'wss://stream.bitopro.com:9443/ws/v1'

  private getWebSocket (url: string, auth: boolean = false): WebSocket {
    const options: {[T: string]: any} = {}

    options.headers = this.headers

    if (auth) {
      options.headers = { ...options.headers, ...this.getAuthHeader() }
    }

    if (this.proxy !== undefined) {
      options.agent = new SocksProxyAgent(`socks://${this.proxy.host}:${this.proxy.port}`)
    }

    return new WebSocket(url, options)
  }

  private initWs (ws: WebSocket, id: string): void {
    ws.on('open', function () {
      console.info(`[WebSocket(open)<${id}>]`)
    })

    ws.on('error', function (err: Error) {
      console.error(`[WebSocket(error)<${id}>] ${err.name}: ${err.message}`)
    })

    ws.on('close', function () {
      console.info(`[WebSocket(close)<${id}>]`)
    })
  }

  /**
   * ---------- Non-authentication Function ----------
   */

  /**
   * Order book pushed all data every second when updated. You can specifiy one or more pairs and the default limit is 5.
   * Valid limit values are 1, 5, 10 or 20.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerOrderBook (pair: string, limit: '1' | '5' | '10' | '20' = '5'): WebSocket {
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/order-books/${pair}:${limit}`)
    this.initWs(ws, 'OrderBook')
    return ws
  }

  /**
   * Order book pushed all data every second when updated. You can specifiy one or more pairs and the default limit is 5.
   * Valid limit values are 1, 5, 10 or 20.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerOrderBooks (pairs: string[], limit: '1' | '5' | '10' | '20' = '5'): WebSocket {
    const params = pairs.reduce((prev, curr) => { return `${prev},${curr}:${limit}` })
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/order-books?pairs=${params}`)
    this.initWs(ws, 'OrderBooks')
    return ws
  }

  /**
   * Ticker pushed 24hr rollwing window statistics when updated.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerTicker (pair: string): WebSocket {
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/tickers/${pair}`)
    this.initWs(ws, 'ticker')
    return ws
  }

  /**
   * Ticker pushed 24hr rollwing window statistics when updated.
   * @param pairs[] The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerTickers (pairs: string[]): WebSocket {
    const params = pairs.reduce((prev, curr) => { return `${prev},${curr}` })
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/tickers?pairs=${params}`)
    this.initWs(ws, 'Tickers')
    return ws
  }

  /**
   * Trade pushed full data when updated.
   * @param pair The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerTrade (pair: string): WebSocket {
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/trades/${pair}`)
    this.initWs(ws, 'Trade')
    return ws
  }

  /**
   * Trade pushed full data when updated.
   * @param pairs[] The trading pair in format. ${BASE}_$ https://www.bitopro.com/fees
   * @returns
   */
  public listenerTrades (pairs: string[]): WebSocket {
    const params = pairs.reduce((prev, curr) => { return `${prev},${curr}` })
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/trades?pairs=${params}`)
    this.initWs(ws, 'Trades')
    return ws
  }

  /**
   * ---------- Authentication Function ----------
   */

  /**
   * This channel push message with active orders.
   * You will receive active orders from all trading pairs when you build a websocket connection at first.
   * After that, websocket server only push the updated active orders from single trading pair.
   * @returns
   */
  public listenerActiveOrders (): WebSocket {
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/auth/orders`, true)
    this.initWs(ws, 'ActiveOrders')
    return ws
  }

  /**
   * This channel push message with account balance.
   * @returns
   */
  public listenerAccountBalance (): WebSocket {
    const ws = this.getWebSocket(`${this.wsBaseUrl}/pub/auth/account-balance`, true)
    this.initWs(ws, 'AccountBalance')
    return ws
  }
}

export { BitoProRestful, BitoProWss }
