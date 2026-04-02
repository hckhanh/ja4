---
name: ja4-parsing
description: >
  Parse JA4 TLS fingerprint strings into structured objects with parseJA4().
  Covers JA4Fingerprint, JA4SectionA, JA4ParseError types, fingerprint format
  (sectionA_sectionB_sectionC), protocol/TLS version/SNI/ALPN field access,
  and error handling. Use when working with JA4 network fingerprints, TLS
  client fingerprinting, or security-related fingerprint analysis.
type: core
library: "@hckhanh/ja4"
library_version: "0.1.2"
sources:
  - "hckhanh/ja4:src/parser.ts"
  - "hckhanh/ja4:src/types.ts"
  - "hckhanh/ja4:README.md"
---

# @hckhanh/ja4 — JA4 Fingerprint Parsing

Parse JA4 TLS fingerprint strings into structured, typed objects. A JA4
fingerprint has the format `{sectionA}_{sectionB}_{sectionC}` where section A
is a 10-character human-readable descriptor and sections B/C are 12-character
truncated SHA256 hashes.

## Setup

```ts
import { parseJA4 } from "@hckhanh/ja4";
import type { JA4Fingerprint } from "@hckhanh/ja4";

const fingerprint: JA4Fingerprint = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
```

## Core Patterns

### Parse and access section A fields

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");

result.sectionA.protocol; // "TCP" — also "QUIC" or "DTLS"
result.sectionA.tlsVersion; // "1.3" — also "1.0", "1.1", "1.2"
result.sectionA.sni; // "domain" — also "ip"
result.sectionA.cipherSuiteCount; // 15
result.sectionA.extensionCount; // 16
result.sectionA.alpn; // "h2" — or "00" if no ALPN
```

### Access hash sections

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("q12i0307h2_4a6a6e5c2b43_3b5074e07a6c");

result.cipherSuiteHash; // "4a6a6e5c2b43" — 12-char hex
result.extensionHash; // "3b5074e07a6c" — 12-char hex
result.raw; // "q12i0307h2_4a6a6e5c2b43_3b5074e07a6c"
result.sectionA.raw; // "q12i0307h2"
```

### Handle invalid fingerprints

```ts
import { JA4ParseError, parseJA4 } from "@hckhanh/ja4";

try {
  parseJA4(userInput);
} catch (error) {
  if (error instanceof JA4ParseError) {
    console.error("Invalid JA4 fingerprint:", error.message);
  }
}
```

### Type-safe imports

```ts
import { JA4ParseError, parseJA4 } from "@hckhanh/ja4";
import type { JA4Fingerprint, JA4SectionA, Protocol, SNI, TLSVersion } from "@hckhanh/ja4";
```

## Common Mistakes

### HIGH Forgetting to catch JA4ParseError on untrusted input

Wrong:

```ts
import { parseJA4 } from "@hckhanh/ja4";

function handleFingerprint(input: string) {
  const result = parseJA4(input);
  return result.sectionA.protocol;
}
```

Correct:

```ts
import { JA4ParseError, parseJA4 } from "@hckhanh/ja4";

function handleFingerprint(input: string) {
  try {
    const result = parseJA4(input);
    return result.sectionA.protocol;
  } catch (error) {
    if (error instanceof JA4ParseError) {
      return null;
    }
    throw error;
  }
}
```

`parseJA4` throws `JA4ParseError` for any malformed input. Unhandled, this crashes the caller. Always wrap in try/catch when the input source is untrusted.

Source: hckhanh/ja4:src/parser.ts

### MEDIUM Treating cipherSuiteCount and extensionCount as strings

Wrong:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
if (result.sectionA.cipherSuiteCount === "15") {
  // never true — cipherSuiteCount is a number
}
```

Correct:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
if (result.sectionA.cipherSuiteCount === 15) {
  // works correctly
}
```

`cipherSuiteCount` and `extensionCount` are parsed as `number`, not strings. Comparing with a string silently fails the equality check.

Source: hckhanh/ja4:src/types.ts

### MEDIUM Confusing the raw fingerprint string with section hashes

Wrong:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
const hash = result.raw; // full string, not a hash
```

Correct:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
const cipherHash = result.cipherSuiteHash; // "8daaf6152771"
const extensionHash = result.extensionHash; // "02713d6af862"
```

`raw` is the original full fingerprint string. The individual hash sections are `cipherSuiteHash` (section B) and `extensionHash` (section C), each a 12-character lowercase hex string.

Source: hckhanh/ja4:src/types.ts

### MEDIUM Using wrong SNI string values in comparisons

Wrong:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
if (result.sectionA.sni === "d") {
  // never true — sni is "domain", not "d"
}
```

Correct:

```ts
import { parseJA4 } from "@hckhanh/ja4";

const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
if (result.sectionA.sni === "domain") {
  // correct — values are "domain" or "ip"
}
```

The parser expands the raw single-character SNI indicator (`d`/`i`) into full strings (`"domain"`/`"ip"`). Similarly, protocol is expanded from `t`/`q`/`d` to `"TCP"`/`"QUIC"`/`"DTLS"`.

Source: hckhanh/ja4:src/parser.ts
