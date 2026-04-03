# ja4

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

## Concepts

### JA4 Fingerprint

[JA4](https://github.com/FoxIO-LLC/ja4) is a TLS client fingerprinting method that captures characteristics of a TLS Client Hello message into a compact string. It can be used to identify specific clients, detect malware, or flag unusual TLS behavior without decrypting traffic.

A JA4 fingerprint has three sections separated by underscores: `{sectionA}_{sectionB}_{sectionC}` (e.g. `t13d1516h2_8daaf6152771_02713d6af862`).

### TLS (Transport Layer Security)

TLS is a cryptographic protocol that secures communication over a network. During connection setup, the client sends a **Client Hello** message advertising its supported ciphers, extensions, and protocol versions — this is what JA4 fingerprints.

### TCP, QUIC, and DTLS

These are the transport protocols that can carry a TLS handshake. **TCP** is the traditional transport for TLS. **QUIC** is a UDP-based transport used by HTTP/3 that integrates TLS 1.3 directly. **DTLS** (Datagram TLS) provides TLS-like security over UDP for protocols that need datagram semantics. The first character of a JA4 fingerprint encodes which one was used (`t`, `q`, or `d`).

### SNI (Server Name Indication)

SNI is a TLS extension that lets the client specify which hostname it is trying to reach. This allows a single IP address to host multiple TLS-secured domains. In JA4, `d` means a domain name was present in SNI, while `i` means SNI was not present (often seen when connecting by IP).

### ALPN (Application-Layer Protocol Negotiation)

ALPN is a TLS extension that lets the client and server agree on an application protocol (e.g. `h2` for HTTP/2, `h3` for HTTP/3, or `http/1.1` for HTTP/1.1) during the handshake. JA4 encodes the first and last character of the first ALPN value as a 2-character hint such as `h2` or `h1`, or `00` if no ALPN extension was present.

### Cipher Suites

A cipher suite is a set of cryptographic algorithms that the client supports for key exchange, encryption, and message authentication. The Client Hello lists all cipher suites the client is willing to use. JA4 section B contains a truncated SHA256 hash of the sorted cipher suite values.

### TLS Extensions

TLS extensions allow clients and servers to negotiate additional capabilities beyond the base protocol (e.g. supported groups, key shares, signature algorithms). JA4 section C contains a truncated SHA256 hash of the sorted extension values combined with signature algorithms.

### Signature Algorithms

Signature algorithms specify which cryptographic signing methods the client supports for verifying certificates and handshake messages. They are advertised via a TLS extension and are included in JA4's section C hash alongside other extensions.

### GREASE (Generate Random Extensions And Sustain Extensibility)

[GREASE](https://www.rfc-editor.org/rfc/rfc8701) values are dummy cipher suite and extension identifiers that clients inject into the Client Hello to prevent servers from becoming intolerant of new values. Because GREASE values are random and vary between connections, JA4 excludes them from cipher suite and extension counts to keep fingerprints stable.

## AI Agents

If you use an AI agent, run `npx @tanstack/intent@latest install`

## License

[MIT](LICENSE)
