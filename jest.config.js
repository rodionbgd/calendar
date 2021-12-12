module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "\\.(scss|css)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
};
