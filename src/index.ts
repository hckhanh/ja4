/**
 * Parse JA4 TLS fingerprint strings into structured objects.
 *
 * @module
 *
 * @example
 * ```ts
 * import { parseJA4 } from "@hckhanh/ja4";
 *
 * const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
 *
 * console.log(result.sectionA.protocol); // "TCP"
 * console.log(result.sectionA.tlsVersion); // "1.3"
 * console.log(result.cipherSuiteHash); // "8daaf6152771"
 * console.log(result.extensionHash); // "02713d6af862"
 * ```
 */

export { parseJA4 } from "./parser.ts";
export { JA4ParseError } from "./types.ts";
export type { JA4Fingerprint, JA4SectionA, Protocol, TLSVersion, SNI } from "./types.ts";
