# @hckhanh/ja4

Parse [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects.

## Install

```sh
# npm
npm install @hckhanh/ja4

# JSR
npx jsr add @hckhanh/ja4
```

## Usage

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");

console.log(result.sectionA.protocol); // "TCP"
console.log(result.sectionA.tlsVersion); // "1.3"
console.log(result.sectionA.sni); // "domain"
console.log(result.sectionA.cipherSuiteCount); // 15
console.log(result.sectionA.extensionCount); // 16
console.log(result.sectionA.alpn); // "h2"
console.log(result.cipherSuiteHash); // "8daaf6152771"
console.log(result.extensionHash); // "02713d6af862"
```

## API

### `parseJA4(fingerprint: string): JA4Fingerprint`

Parses a JA4 fingerprint string in the format `{sectionA}_{sectionB}_{sectionC}` and returns a structured object. Throws `JA4ParseError` if the input is invalid.

### `JA4Fingerprint`

| Property          | Type          | Description                                                    |
| ----------------- | ------------- | -------------------------------------------------------------- |
| `raw`             | `string`      | The original fingerprint string                                |
| `sectionA`        | `JA4SectionA` | Parsed human-readable section                                  |
| `cipherSuiteHash` | `string`      | 12-char truncated SHA256 hash of sorted cipher suites          |
| `extensionHash`   | `string`      | 12-char truncated SHA256 hash of sorted extensions + sig algos |

### `JA4SectionA`

| Property           | Type     | Description                                                |
| ------------------ | -------- | ---------------------------------------------------------- |
| `raw`              | `string` | Raw section a string (e.g. `"t13d1516h2"`)                 |
| `protocol`         | `string` | Transport protocol: `"TCP"`, `"QUIC"`, or `"DTLS"`         |
| `tlsVersion`       | `string` | TLS version: `"1.0"`, `"1.1"`, `"1.2"`, or `"1.3"`         |
| `sni`              | `string` | `"domain"` (SNI present) or `"ip"`                         |
| `cipherSuiteCount` | `number` | Number of cipher suites (excluding GREASE)                 |
| `extensionCount`   | `number` | Number of extensions (excluding GREASE)                    |
| `alpn`             | `string` | First ALPN value hint (first+last char), or `"00"` if none |

### `JA4ParseError`

Extends `Error`. Thrown when the fingerprint string is malformed or contains invalid values.

```ts
import { JA4ParseError, parseJA4 } from "@hckhanh/ja4";

try {
  parseJA4("invalid");
} catch (error) {
  if (error instanceof JA4ParseError) {
    console.error(error.message);
  }
}
```

## License

[MIT](LICENSE)
