import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const ACTIVE_MODEL_ID = 'moonshotai/kimi-k3' as const;

// NVIDIA NIM is the only active inference provider while validating Kimi K3.
export const activeAiClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || 'missing-NVIDIA_API_KEY',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  // The generation route owns its recovery passes. Disable hidden SDK retries
  // so each long-running model attempt and its error remain visible.
  maxRetries: 0,
});

// Groq remains in the repository for later, but the UI and server lock it.
export const GROQ_PROVIDER_STATUS = {
  locked: true,
  baseURL: 'https://api.groq.com/openai/v1',
  modelIds: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
} as const;
