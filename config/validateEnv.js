const config = require("config");

const REQUIRED_KEYS = [
  { configKey: "mongoURI", envKey: "MONGO_URI" },
  { configKey: "jwtSecret", envKey: "JWT_SECRET" },
];

function readConfigValue(key) {
  if (!config.has(key)) {
    return undefined;
  }

  const value = config.get(key);
  return typeof value === "string" ? value.trim() : value;
}

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function validateRuntimeConfig() {
  const missing = REQUIRED_KEYS.filter(({ configKey }) =>
    isBlank(readConfigValue(configKey))
  );

  if (missing.length > 0) {
    const required = missing.map(({ envKey }) => envKey).join(", ");
    throw new Error(
      `Missing required configuration: ${required}. Set them in your environment or .env file.`
    );
  }

  const githubClientId = readConfigValue("githubClientId");
  const githubSecret = readConfigValue("githubSecret");
  const hasGithubClientId = !isBlank(githubClientId);
  const hasGithubSecret = !isBlank(githubSecret);

  if (hasGithubClientId !== hasGithubSecret) {
    throw new Error(
      "GitHub configuration is incomplete. Set both GITHUB_CLIENT_ID and GITHUB_SECRET, or leave both empty."
    );
  }
}

module.exports = validateRuntimeConfig;
