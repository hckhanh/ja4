import { describe, expect, test } from "vite-plus/test";
import { JA4ParseError, parseJA4 } from "../src/index.ts";

describe("parseJA4", () => {
  describe("happy path", () => {
    test("parses the reference example", () => {
      const result = parseJA4("t13d1516h2_8daaf6152771_02713d6af862");

      expect(result.raw).toBe("t13d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.raw).toBe("t13d1516h2");
      expect(result.sectionA.protocol).toBe("TCP");
      expect(result.sectionA.tlsVersion).toBe("1.3");
      expect(result.sectionA.sni).toBe("domain");
      expect(result.sectionA.cipherSuiteCount).toBe(15);
      expect(result.sectionA.extensionCount).toBe(16);
      expect(result.sectionA.alpn).toBe("h2");
      expect(result.cipherSuiteHash).toBe("8daaf6152771");
      expect(result.extensionHash).toBe("02713d6af862");
    });

    test("parses QUIC protocol", () => {
      const result = parseJA4("q13d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.protocol).toBe("QUIC");
    });

    test("parses DTLS protocol", () => {
      const result = parseJA4("d13d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.protocol).toBe("DTLS");
    });

    test("parses TLS 1.2", () => {
      const result = parseJA4("t12d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.tlsVersion).toBe("1.2");
    });

    test("parses TLS 1.1", () => {
      const result = parseJA4("t11d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.tlsVersion).toBe("1.1");
    });

    test("parses TLS 1.0", () => {
      const result = parseJA4("t10d1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.tlsVersion).toBe("1.0");
    });

    test("parses IP (no SNI)", () => {
      const result = parseJA4("t13i1516h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.sni).toBe("ip");
    });

    test("parses ALPN 00 (no ALPN)", () => {
      const result = parseJA4("t13d151600_8daaf6152771_02713d6af862");
      expect(result.sectionA.alpn).toBe("00");
    });

    test("parses zero cipher suites and extensions", () => {
      const result = parseJA4("t13d0000h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.cipherSuiteCount).toBe(0);
      expect(result.sectionA.extensionCount).toBe(0);
    });

    test("parses high cipher suite and extension counts", () => {
      const result = parseJA4("t13d9999h2_8daaf6152771_02713d6af862");
      expect(result.sectionA.cipherSuiteCount).toBe(99);
      expect(result.sectionA.extensionCount).toBe(99);
    });
  });

  describe("validation errors", () => {
    test("throws on empty string", () => {
      expect(() => parseJA4("")).toThrow(JA4ParseError);
      expect(() => parseJA4("")).toThrow("non-empty string");
    });

    test("throws on non-string input", () => {
      // @ts-expect-error testing runtime guard
      expect(() => parseJA4(123)).toThrow(JA4ParseError);
      // @ts-expect-error testing runtime guard
      expect(() => parseJA4(null)).toThrow(JA4ParseError);
    });

    test("throws on wrong number of parts", () => {
      expect(() => parseJA4("t13d1516h2")).toThrow("3 sections");
      expect(() => parseJA4("t13d1516h2_8daaf6152771")).toThrow("3 sections");
      expect(() => parseJA4("t13d1516h2_8daaf6152771_02713d6af862_extra")).toThrow("3 sections");
    });

    test("throws on wrong section a length", () => {
      expect(() => parseJA4("t13d151h2_8daaf6152771_02713d6af862")).toThrow("10 characters");
      expect(() => parseJA4("t13d15160h2_8daaf6152771_02713d6af862")).toThrow("10 characters");
    });

    test("throws on invalid protocol", () => {
      expect(() => parseJA4("x13d1516h2_8daaf6152771_02713d6af862")).toThrow(
        'Invalid protocol "x"',
      );
    });

    test("throws on invalid TLS version", () => {
      expect(() => parseJA4("t14d1516h2_8daaf6152771_02713d6af862")).toThrow(
        'Invalid TLS version "14"',
      );
    });

    test("throws on invalid SNI", () => {
      expect(() => parseJA4("t13x1516h2_8daaf6152771_02713d6af862")).toThrow('Invalid SNI "x"');
    });

    test("throws on non-numeric cipher suite count", () => {
      expect(() => parseJA4("t13daa16h2_8daaf6152771_02713d6af862")).toThrow("cipher suite count");
    });

    test("throws on non-numeric extension count", () => {
      expect(() => parseJA4("t13d15bbh2_8daaf6152771_02713d6af862")).toThrow("extension count");
    });

    test("throws on invalid ALPN", () => {
      expect(() => parseJA4("t13d1516H2_8daaf6152771_02713d6af862")).toThrow("ALPN");
    });

    test("throws on invalid section b (not 12 hex chars)", () => {
      expect(() => parseJA4("t13d1516h2_8daaf615277_02713d6af862")).toThrow("Section b");
      expect(() => parseJA4("t13d1516h2_8daaf61527710_02713d6af862")).toThrow("Section b");
      expect(() => parseJA4("t13d1516h2_XDAAF6152771_02713d6af862")).toThrow("Section b");
    });

    test("throws on invalid section c (not 12 hex chars)", () => {
      expect(() => parseJA4("t13d1516h2_8daaf6152771_02713d6af86")).toThrow("Section c");
      expect(() => parseJA4("t13d1516h2_8daaf6152771_02713d6af8620")).toThrow("Section c");
    });
  });
});
