import { bench, describe } from "vite-plus/test";
import { parseJA4 } from "../src/index.ts";

describe("parseJA4", () => {
  bench("parse valid fingerprint", () => {
    parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
  });

  bench("parse QUIC fingerprint", () => {
    parseJA4("q13d1516h2_8daaf6152771_02713d6af862");
  });

  bench("parse invalid fingerprint (error path)", () => {
    try {
      parseJA4("invalid");
    } catch {
      // expected
    }
  });
});
