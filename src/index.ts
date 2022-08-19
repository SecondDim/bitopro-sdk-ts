import { BitoProRestful, BitoProWss } from './bitopro'

const apiKey = process.env.BITOPRO_API_KEY
const apiSecret = process.env.BITOPRO_API_SECRET
const email = process.env.BITOPRO_EMAIL

const bitoproRestful = new BitoProRestful(apiKey, apiSecret, email)

const main = async (): Promise<void> => {
  const data = await bitoproRestful.getAccountsBalance()
  console.log(data)
}

main().catch((err: Error) => {
  console.error(err.message)
  process.exit(255)
})

const bitoproWss = new BitoProWss(apiKey, apiSecret, email, { host: '172.28.240.1', port: 8080 })

const ws = bitoproWss.listenerAccountBalance()

ws.on('message', function (data: string) {
  console.log(JSON.parse(data))
})
