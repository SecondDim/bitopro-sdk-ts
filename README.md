# bitopro-sdk-ts

Non official sdk for [BitoPro](https://www.bitopro.com/) API. use official api-v3 restful api and websocket. support typescript.

official docs: [https://github.com/bitoex/bitopro-offical-api-docs](https://github.com/bitoex/bitopro-offical-api-docs)

## Installation

`npm install bitopro-sdk-ts`

## Getting started

typescript example

```typescript
import { BitoProRestful, BitoProWss } from 'bitopro-sdk-ts'

/*
 * Setting your api key.
 */
const apiKey = process.env.BITOPRO_API_KEY
const apiSecret = process.env.BITOPRO_API_SECRET
const email = process.env.BITOPRO_EMAIL

/*
 * Restful api
 */
const bitoproRestful = new BitoProRestful(apiKey, apiSecret, email)

const main = async (): Promise<void> => {
  const data = await bitoproRestful.getAccountsBalance()
  console.log(data)
}

main().catch((err: Error) => {
  console.error(err.message)
  process.exit(255)
})

/*
 * Websocket
 */
const bitoproWss = new BitoProWss(apiKey, apiSecret, email)

const ws = bitoproWss.listenerAccountBalance()

ws.on('message', function (data: string) {
  console.log(JSON.parse(data))
})

```

## Contributing

Bug reports and pull requests are welcome.

## License

The SDK is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
