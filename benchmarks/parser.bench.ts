import { withCodSpeed } from "@codspeed/tinybench-plugin";
import { Bench } from "tinybench";
import { parseJA4 } from "../src/index.ts";

const VALID_FINGERPRINTS = [
  "t13d1516h2_8daaf6152771_02713d6af862",
  "q13d1516h2_8daaf6152771_02713d6af862",
  "d13d1516h2_8daaf6152771_02713d6af862",
  "t12d1516h2_8daaf6152771_02713d6af862",
  "t13i1516h2_8daaf6152771_02713d6af862",
  "t13d0000h2_8daaf6152771_02713d6af862",
  "t13d9999h2_8daaf6152771_02713d6af862",
  "t13d151600_8daaf6152771_02713d6af862",
];

const bench = withCodSpeed(new Bench());

bench
  .add("parseJA4 - reference fingerprint", () => {
    parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
  })
  .add("parseJA4 - all protocols", () => {
    parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
    parseJA4("q13d1516h2_8daaf6152771_02713d6af862");
    parseJA4("d13d1516h2_8daaf6152771_02713d6af862");
  })
  .add("parseJA4 - all TLS versions", () => {
    parseJA4("t10d1516h2_8daaf6152771_02713d6af862");
    parseJA4("t11d1516h2_8daaf6152771_02713d6af862");
    parseJA4("t12d1516h2_8daaf6152771_02713d6af862");
    parseJA4("t13d1516h2_8daaf6152771_02713d6af862");
  })
  .add("parseJA4 - batch of fingerprints", () => {
    for (const fp of VALID_FINGERPRINTS) {
      parseJA4(fp);
    }
  });

await bench.run();

console.table(bench.table());
