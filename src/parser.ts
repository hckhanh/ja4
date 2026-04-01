import type { JA4Fingerprint, JA4SectionA, Protocol, SNI, TLSVersion } from "./types.ts";
import { JA4ParseError } from "./types.ts";

const PROTOCOL_MAP: Record<string, Protocol> = {
  t: "TCP",
  q: "QUIC",
  d: "DTLS",
};

const TLS_VERSION_MAP: Record<string, TLSVersion> = {
  "10": "1.0",
  "11": "1.1",
  "12": "1.2",
  "13": "1.3",
};

const SNI_MAP: Record<string, SNI> = {
  d: "domain",
  i: "ip",
};

const HEX_HASH_REGEX = /^[0-9a-f]{12}$/;

/**
 * Parse a JA4 TLS fingerprint string into a structured object.
 *
 * @param fingerprint - A JA4 fingerprint string (e.g. "t13d1516h2_8daaf6152771_02713d6af862")
 * @returns Parsed JA4 fingerprint object
 * @throws {JA4ParseError} If the fingerprint string is invalid
 */
export function parseJA4(fingerprint: string): JA4Fingerprint {
  if (typeof fingerprint !== "string" || fingerprint.length === 0) {
    throw new JA4ParseError("Fingerprint must be a non-empty string");
  }

  const parts = fingerprint.split("_");
  if (parts.length !== 3) {
    throw new JA4ParseError(`Expected 3 sections separated by underscores, got ${parts.length}`);
  }

  const [rawA, rawB, rawC] = parts;

  const sectionA = parseSectionA(rawA);

  if (!HEX_HASH_REGEX.test(rawB)) {
    throw new JA4ParseError(`Section b must be 12 lowercase hex characters, got "${rawB}"`);
  }

  if (!HEX_HASH_REGEX.test(rawC)) {
    throw new JA4ParseError(`Section c must be 12 lowercase hex characters, got "${rawC}"`);
  }

  return {
    raw: fingerprint,
    sectionA,
    cipherSuiteHash: rawB,
    extensionHash: rawC,
  };
}

function parseSectionA(raw: string): JA4SectionA {
  if (raw.length !== 10) {
    throw new JA4ParseError(`Section a must be exactly 10 characters, got ${raw.length}`);
  }

  const protocolChar = raw[0];
  const protocol = PROTOCOL_MAP[protocolChar];
  if (!protocol) {
    throw new JA4ParseError(
      `Invalid protocol "${protocolChar}", expected "t" (TCP), "q" (QUIC), or "d" (DTLS)`,
    );
  }

  const versionStr = raw.slice(1, 3);
  const tlsVersion = TLS_VERSION_MAP[versionStr];
  if (!tlsVersion) {
    throw new JA4ParseError(
      `Invalid TLS version "${versionStr}", expected "10", "11", "12", or "13"`,
    );
  }

  const sniChar = raw[3];
  const sni = SNI_MAP[sniChar];
  if (!sni) {
    throw new JA4ParseError(`Invalid SNI "${sniChar}", expected "d" (domain) or "i" (IP)`);
  }

  const cipherCountStr = raw.slice(4, 6);
  if (!/^\d{2}$/.test(cipherCountStr)) {
    throw new JA4ParseError(
      `Invalid cipher suite count "${cipherCountStr}", expected 2-digit number`,
    );
  }

  const extensionCountStr = raw.slice(6, 8);
  if (!/^\d{2}$/.test(extensionCountStr)) {
    throw new JA4ParseError(
      `Invalid extension count "${extensionCountStr}", expected 2-digit number`,
    );
  }

  const alpn = raw.slice(8, 10);
  if (!/^[a-z0-9]{2}$/.test(alpn)) {
    throw new JA4ParseError(`Invalid ALPN "${alpn}", expected 2 alphanumeric characters`);
  }

  return {
    raw,
    protocol,
    tlsVersion,
    sni,
    cipherSuiteCount: parseInt(cipherCountStr, 10),
    extensionCount: parseInt(extensionCountStr, 10),
    alpn,
  };
}
