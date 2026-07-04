import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'config.js');

const defaultConfig = `// For advanced configuration, edit \`constants.js\`.
const config = Object.freeze({
  defaultModel: 'gemini-flash-lite-latest',
  nanoBananaModel: 'gemini-2.5-flash-image',
  enableNanoBananaMode: false,

  // Lower retries to save quota
  maxGenerationAttempts: 2,

  defaultResponseFormat: 'Embedded',
  defaultResponseActionButtons: true,
  hexColour: '#505050',

  workInDMs: true,
  shouldDisplayPersonalityButtons: true,
  enableGeminiApiLogging: false,
  SEND_RETRY_ERRORS_TO_DISCORD: true,

  defaultPersonality:
    "You are Gemini, a large language model trained by Google.",

  activities: [
    { name: 'With Code', type: 'Playing' },
    { name: 'Something', type: 'Listening' },
    { name: 'You', type: 'Watching' },
  ],

  defaultServerSettings: {
    serverChatHistory: false,
    customServerPersonality: false,
    settingsSaveButton: 'decide',
    responseStyle: 'decide',
  },

  defaultChannelSettings: {
    alwaysRespond: false,
    channelWideChatHistory: false,
    customChannelPersonality: false,
    settingsSaveButton: 'decide',
    responseStyle: 'decide',
  },

  defaultGeminiToolPreferences: {
    googleSearch: false,
    urlContext: false,
    codeExecution: false,
  },

  // Smaller context = lower token usage
  chatHistoryLimits: {
    users: 3,
    servers: 3,
    channels: 3,
  },

  recentChannelMessagesLimit: 3,
});

export default config;
`;

if (!fs.existsSync(configPath)) {
  console.log('config.js not found. Creating default configuration...');
  fs.writeFileSync(configPath, defaultConfig);
  console.log('Default config.js created.');
}

// Dynamically import the main application entry point
await import('./src/startup/main.js');
