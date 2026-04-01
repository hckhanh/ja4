import codspeedPlugin from "@codspeed/vitest-plugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [codspeedPlugin()],
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  test: {
    include: ["tests/**/*.test.ts"],
    benchmark: {
      include: ["benchmarks/**/*.bench.ts"],
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
