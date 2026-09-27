const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 880,
  viewportWidth: 1280,
  e2e: {},
  video: true,
  ...(process.env.CYPRESS_PROJECT_ID
    ? { projectId: process.env.CYPRESS_PROJECT_ID }
    : {}),
});
