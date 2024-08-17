import path from "path";
import { UserConfig, ConfigEnv } from "vite";
import reactSWC from "@vitejs/plugin-react-swc";
// import { fontInjector } from "../plugin/client";

export default async function (param: ConfigEnv): Promise<UserConfig> {
  const { loadEnv } = await import("vite");

  const pckge = process.env.PACKAGE;
  console.log("Client Builder Package: ", pckge);

  const root = path.resolve(__dirname, "../../");
  const viteMode = param.mode || "production";
  const envDir = `${process.cwd()}/config/env/${pckge}`;
  const envObj = loadEnv(viteMode, envDir, "");
  const isProduction = param.mode === "production";

  const reformEnvObj: Record<string, string> = {};
  for (const key in envObj) {
    const index = `process.env.${key}`;
    const isAllowedKey = key.includes("VITE_") || key.includes("APP_ENV");

    if (!reformEnvObj[index] && isAllowedKey) {
      reformEnvObj[index] = JSON.stringify(envObj[key]);
    }
  }

  return {
    root: `${root}/src/packages/${pckge}/client`,
    base: "/",
    publicDir: `src/packages/${pckge}/client/public`,
    envDir: envDir,
    envPrefix: "VITE_",
    mode: viteMode,
    clearScreen: false,
    resolve: {
      alias: {
        "~": `${root}/src`,
      },
    },
    plugins: [
      reactSWC(),
      //   fontInjector({
      //     cdnFontList: [
      //       "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Light.ttf",
      //       "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Regular.ttf",
      //       "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Semibold.ttf",
      //       "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Bold.ttf",
      //       "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Extrabld.ttf",
      //     ],
      //   }),
    ],
    json: {
      stringify: true,
    },
    build: {
      outDir: `${root}/dist/${pckge}/client`,
      cssCodeSplit: true,
      sourcemap: isProduction ? false : true,
      minify: isProduction ? true : false,
      manifest: true,
      cssMinify: "esbuild",
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      emptyOutDir: true,
      write: true,
      rollupOptions: {
        input: `src/packages/${pckge}/client/index.html`,
        output: {
          assetFileNames: "assets/[name].[hash][extname]",
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          sourcemap: isProduction ? false : true,
          manualChunks: (id) => {
            /**
             * Notes:
             * If you want to optimize it
             * Need to mapping the peer dependencies
             * */
            if (
              id.includes("/node_modules/react-router-dom") ||
              id.includes("/node_modules/@remix-run") ||
              id.includes("/node_modules/react-router") ||
              id.includes("/node_modules/react") ||
              id.includes("/node_modules/react-dom") ||
              id.includes("/node_modules/redux") ||
              id.includes("/node_modules/@rematch")
            ) {
              return "@vendor-core";
            }
          },
        },
      },
    },
    server: {
      port: parseInt(envObj.PORT) + 1,
      open: true,
      proxy: {
        "/api": {
          secure: false,
          target: `http://localhost:${envObj.PORT}`,
        },
      },
    },
    define: reformEnvObj,
    preview: {
      port: parseInt(envObj.PORT) + 1,
      open: true,
      proxy: {
        "/api": {
          secure: false,
          target: `http://localhost:${envObj.PORT}`,
        },
      },
    },
  };
}
