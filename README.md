# ja4

[![CodSpeed](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/hckhanh/ja4?utm_source=badge)

Parse [JA4 TLS fingerprint](https://github.com/FoxIO-LLC/ja4) strings into structured objects.

## Install

```sh
npm install @hckhanh/ja4
```

## Usage

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");

console.log(result.sectionA.protocol); // "TCP"
console.log(result.sectionA.tlsVersion); // "1.3"
console.log(result.cipherSuiteHash); // "8daaf6152771"
console.log(result.extensionHash); // "02713d6af862"
```

## License

[MIT](LICENSE)
