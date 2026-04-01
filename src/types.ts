/** The transport protocol used in the TLS handshake. */
export type Protocol = "TCP" | "QUIC" | "DTLS";

/** TLS version. */
export type TLSVersion = "1.0" | "1.1" | "1.2" | "1.3";

/** Whether SNI (Server Name Indication) was present. */
export type SNI = "domain" | "ip";

/** Parsed human-readable section (JA4_a). */
export interface JA4SectionA {
  /** Raw section a string, e.g. "t13d1516h2" */
  raw: string;
  /** Transport protocol: TCP, QUIC, or DTLS */
  protocol: Protocol;
  /** TLS version: 1.0, 1.1, 1.2, or 1.3 */
  tlsVersion: TLSVersion;
  /** Whether the connection targets a domain (SNI present) or IP */
  sni: SNI;
  /** Number of cipher suites (excluding GREASE) */
  cipherSuiteCount: number;
  /** Number of extensions (excluding GREASE) */
  extensionCount: number;
  /** First ALPN value hint (first+last character), or "00" if no ALPN */
  alpn: string;
}

/** Full parsed JA4 fingerprint. */
export interface JA4Fingerprint {
  /** The original raw JA4 fingerprint string */
  raw: string;
  /** Parsed human-readable section */
  sectionA: JA4SectionA;
  /** 12-char truncated SHA256 hash of sorted cipher suites */
  cipherSuiteHash: string;
  /** 12-char truncated SHA256 hash of sorted extensions + signature algorithms */
  extensionHash: string;
}

/** Error thrown when a JA4 fingerprint string is invalid. */
export class JA4ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JA4ParseError";
  }
}
