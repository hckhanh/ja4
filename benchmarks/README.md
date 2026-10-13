# Performance benchmarks

The maintained suite is `benchmarks/parser.bench.ts`.
The suite covers a reference fingerprint, every supported protocol and TLS
version, and 100 distinct cipher/extension count pairs. Fixtures are prepared
outside timing; callbacks consume parsed fields. Assertions run after timing.

## Matching vn-number's CodSpeed toolchain

- Node 24.21.0 and Vitest 4.1.11.
- `@codspeed/vitest-plugin` 6.0.0-beta.2, selected for Node 24 support.
- Vite+ 0.2.9, retaining the existing test and build setup.
- CodSpeed action 5.4.2 with runner **5.4.0**, cycle estimation enabled, and
  allocation costs included.

The dedicated workflow measures simulation and walltime on Ubuntu 24.04.
Manual dispatch and reusable workflow calls can select either instrument.
Run locally only through an authenticated CodSpeed CLI:

```sh
codspeed run -m simulation -- pnpm bench
codspeed run -m walltime -- pnpm bench
```

Runner 5 scores are not comparable with the previous runner 4 results. The
migration commit establishes a fresh baseline with unchanged production source.
Compare only matching benchmark URIs, input values, batch sizes, dependency
versions, Node versions and instrument settings. Check CPU metadata and variance
before accepting walltime changes from hosted runners. A NEW/SKIPPED-only report
is not evidence of a speed improvement.

Keep fixture creation outside timing unless it is the stated workload. Do not
change the harness between baseline and candidate measurements. Retain a change
only after correctness tests pass and CodSpeed walltime confirms the benefit.
Benchmark tooling is excluded from published packages.
