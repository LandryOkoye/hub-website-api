module.exports = {
  apps: [
    {
      name: "blockchainhubafrica-api",
      script: "src/index.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
