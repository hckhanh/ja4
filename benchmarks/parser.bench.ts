import { afterAll, bench, describe, expect } from "vitest";
import { parseJA4 } from "../src/index.ts";

const reference = "t13d1516h2_8daaf6152771_02713d6af862";
const protocols = ["t", "q", "d"].map((protocol) => protocol + reference.slice(1));
const versions = ["10", "11", "12", "13"].map((version) => `t${version}${reference.slice(3)}`);
const batch = Array.from({ length: 100 }, (_, index) => {
  const count = String(index).padStart(2, "0");
  return `t13d${count}${count}h2_8daaf6152771_02713d6af862`;
});
let consumed = 0;

describe("parseJA4", () => {
  bench("reference fingerprint", () => {
    consumed = parseJA4(reference).sectionA.cipherSuiteCount;
  });

  bench("all protocols", () => {
    for (const fingerprint of protocols) {
      consumed += parseJA4(fingerprint).sectionA.protocol.length;
    }
  });

  bench("all TLS versions", () => {
    for (const fingerprint of versions) {
      consumed += parseJA4(fingerprint).sectionA.tlsVersion.length;
    }
  });

  bench("100 distinct fingerprints", () => {
    for (const fingerprint of batch) {
      consumed += parseJA4(fingerprint).sectionA.cipherSuiteCount;
    }
  });
});

afterAll(() => {
  expect(consumed).toBeGreaterThan(0);
});
