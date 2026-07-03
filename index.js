import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, 'config.js');

// Configuration: Using gemini-3.5-flash for optimal performance and availability
const defaultConfig = `// For advanced configuration, edit \`constants.js\`.
const config = Object.freeze({
  defaultModel: 'gemini-3.5-flash',
  nanoBananaModel: 'gemini-3.1-flash-image',
  enableNanoBananaMode: false,
  maxGenerationAttempts: 2,
  defaultResponseFormat: 'Embedded',
  defaultResponseActionButtons: true,
  hexColour: '#505050',
  workInDMs: true,
  shouldDisplayPersonalityButtons: true,
  enableGeminiApiLogging: false,
  SEND_RETRY_ERRORS_TO_DISCORD: true,
  defaultPersonality: "You are Gemini, a large language model trained by Google.",
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
    googleSearch: true,
    urlContext: true,
    codeExecution: false,
  },
  chatHistoryLimits: {
    users: 2, // Lowered to conserve API quota
    servers: 2,
    channels: 2,
  },
  recentChannelMessagesLimit: 3,
});

export default config;
`;

// Create config if it doesn't exist
if (!fs.existsSync(configPath)) {
  console.log('config.js not found. Creating optimized default configuration...');
  fs.writeFileSync(configPath, defaultConfig);
  console.log('Default config.js created with gemini-3.5-flash.');
}

// Cooldown logic to prevent 429 Rate Limit errors
const cooldowns = new Map<string, number>();
const COOLDOWN_TIME = 8000; // 8 seconds per user

async function startBot() {
  // Dynamically import the main application entry point
  const { client } = await import('./src/startup/main.js');

  client.on('messageCreate', async (message: any) => {
    if (message.author.bot) return;

    // Cooldown check
    const now = Date.now();
    const lastUsed = cooldowns.get(message.author.id) || 0;

    if (now - lastUsed < COOLDOWN_TIME) {
      // Silently ignore spam to stay under the 20 requests/minute free tier limit
      return;
    }

    cooldowns.set(message.author.id, now);

    // Proceed to your existing message handler logic...
  });
}

startBot().catch((err) => {
  console.error('Failed to start bot:', err);
});
