import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";
import path from "path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(1);

const ALIAS_TARGET = path.resolve(process.cwd(), "../src");
console.log("[remotion.config] aliasing @ →", ALIAS_TARGET);

Config.overrideWebpackConfig((current) => {
  const withTailwind = enableTailwind(current);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: {
        ...(withTailwind.resolve?.alias ?? {}),
        // Make @/* resolve to the parent quick-audit src/ so we can import
        // the real components (SmartAssistOption3Sidebar, FormDataBySectionTabs, etc.).
        "@": ALIAS_TARGET,
      },
    },
  };
});
