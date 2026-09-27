const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultBrowser: "chrome",
  viewportHeight: 880,
  viewportWidth: 1280,
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--lang=pt-BR");
          launchOptions.preferences.default.intl = {
            ...launchOptions.preferences.default.intl,
            accept_languages: "pt-BR,pt",
          };
        }
        return launchOptions;
      });
    },
  },
  video: true,
  ...(process.env.CYPRESS_PROJECT_ID
    ? { projectId: process.env.CYPRESS_PROJECT_ID }
    : {}),
});
