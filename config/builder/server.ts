import path from "path";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const pckge = process.env.PACKAGE;
  const root = path.resolve(__dirname, "../../");

  console.log("Server Builder Package: ", pckge);

  return {
    entry: [`${root}/src/packages/${pckge}/server/index.ts`],
    outDir: `${root}/dist/${pckge}/server`,
    platform: "node",
    format: "cjs",
    publicDir: `${root}/src/packages/${pckge}/server/resources`,
    treeshake: true,
    minify: true,
    sourcemap: true,
    clean: true,
    skipNodeModulesBundle: true,
    silent: false,
  };
});
