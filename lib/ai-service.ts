/**
 * Service de gestion multi-providers IA avec fallback automatique
 * Supporte : OpenAI, Claude (Anthropic), Gemini (Google)
 */

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';  // 🆕 GROQ

// Types
export type AIProvider = 'openai' | 'claude' | 'gemini' | 'groq'; // 🆕 GROQ

export interface AIConfig {
    provider: AIProvider;
    model: string;
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
}

export interface AIResponse {
    content: string;
    provider: AIProvider;
    model: string;
    tokensUsed?: number;
    cost?: number;
    executionTime: number;
}

export interface AIError {
    provider: AIProvider;
    error: string;
    code?: string;
    retryable: boolean;
}

// Configuration des providers
const PROVIDER_CONFIG = {
    openai: {
        defaultModel: 'gpt-4',
        fallbackModel: 'gpt-3.5-turbo',
        maxRetries: 3,
        timeout: 30000,
    },
    claude: {
        defaultModel: 'claude-3-5-sonnet-20241022',
        fallbackModel: 'claude-3-haiku-20240307',
        maxRetries: 3,
        timeout: 30000,
    },
    gemini: {
        defaultModel: 'gemini-1.5-pro',
        fallbackModel: 'gemini-1.5-flash',
        maxRetries: 3,
        timeout: 30000,
    },
    groq: {  // 🆕 GROQ
        defaultModel: 'llama-3.3-70b-versatile',
        fallbackModel: 'mixtral-8x7b-32768',
        maxRetries: 3,
        timeout: 30000,
    },
};

// Ordre de priorité des providers (fallback automatique)
const PROVIDER_PRIORITY: AIProvider[] = ['groq', 'gemini', 'claude', 'openai']; // Groq en premier (GRATUIT!)

/**
 * Service principal de gestion IA
 */
export class AIService {
    private openaiClient: OpenAI | null = null;
    private claudeClient: Anthropic | null = null;
    private geminiClient: GoogleGenerativeAI | null = null;
    private groqClient: Groq | null = null;  // 🆕 GROQ

    constructor() {
        this.initializeClients();
    }

    /**
     * Initialise les clients API
     */
    private initializeClients() {
        // OpenAI
        if (process.env.OPENAI_API_KEY) {
            this.openaiClient = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }

        // Claude (Anthropic)
        if (process.env.ANTHROPIC_API_KEY) {
            this.claudeClient = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });
        }

        // Gemini (Google)
        if (process.env.GEMINI_API_KEY) {
            this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }

        // Groq 🆕
        if (process.env.GROQ_API_KEY) {
            this.groqClient = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });
        }
    }

    /**
     * Génère du contenu avec fallback automatique
     */
    async generateContent(
        prompt: string,
        config: Partial<AIConfig> = {},
        systemPrompt?: string
    ): Promise<AIResponse> {
        const errors: AIError[] = [];
        const startTime = Date.now();

        // Détermine l'ordre des providers à essayer
        const providersToTry = config.provider
            ? [config.provider, ...PROVIDER_PRIORITY.filter(p => p !== config.provider)]
            : PROVIDER_PRIORITY;

        // Essaie chaque provider dans l'ordre
        for (const provider of providersToTry) {
            try {
                console.log(`🤖 Tentative avec ${provider}...`);

                const response = await this.callProvider(provider, prompt, config, systemPrompt);

                console.log(`✅ Succès avec ${provider}`);
                return {
                    ...response,
                    executionTime: Date.now() - startTime,
                };
            } catch (error: any) {
                const aiError: AIError = {
                    provider,
                    error: error.message || 'Erreur inconnue',
                    code: error.code,
                    retryable: this.isRetryableError(error),
                };

                errors.push(aiError);
                console.error(`❌ Échec avec ${provider}:`, aiError.error);

                // Si l'erreur n'est pas retryable, on arrête
                if (!aiError.retryable) {
                    break;
                }
            }
        }

        // Tous les providers ont échoué
        throw new Error(
            `Tous les providers IA ont échoué:\n${errors
                .map(e => `- ${e.provider}: ${e.error}`)
                .join('\n')}`
        );
    }

    /**
     * Appelle un provider spécifique
     */
    private async callProvider(
        provider: AIProvider,
        prompt: string,
        config: Partial<AIConfig>,
        systemPrompt?: string
    ): Promise<Omit<AIResponse, 'executionTime'>> {
        switch (provider) {
            case 'openai':
                return this.callOpenAI(prompt, config, systemPrompt);
            case 'claude':
                return this.callClaude(prompt, config, systemPrompt);
            case 'gemini':
                return this.callGemini(prompt, config, systemPrompt);
            case 'groq':  // 🆕 GROQ
                return this.callGroq(prompt, config, systemPrompt);
            default:
                throw new Error(`Provider inconnu: ${provider}`);
        }
    }

    /**
     * Appel OpenAI
     */
    private async callOpenAI(
        prompt: string,
        config: Partial<AIConfig>,
        systemPrompt?: string
    ): Promise<Omit<AIResponse, 'executionTime'>> {
        if (!this.openaiClient) {
            throw new Error('OpenAI non configuré (clé API manquante)');
        }

        const model = config.model || PROVIDER_CONFIG.openai.defaultModel;

        const messages: any[] = [];
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await this.openaiClient.chat.completions.create({
            model,
            messages,
            temperature: config.temperature ?? 0.7,
            max_tokens: config.maxTokens ?? 1000,
        });

        const content = response.choices[0]?.message?.content || '';
        const tokensUsed = response.usage?.total_tokens || 0;

        return {
            content,
            provider: 'openai',
            model,
            tokensUsed,
            cost: this.calculateCost('openai', model, tokensUsed),
        };
    }

    /**
     * Appel Claude (Anthropic)
     */
    private async callClaude(
        prompt: string,
        config: Partial<AIConfig>,
        systemPrompt?: string
    ): Promise<Omit<AIResponse, 'executionTime'>> {
        if (!this.claudeClient) {
            throw new Error('Claude non configuré (clé API manquante)');
        }

        const model = config.model || PROVIDER_CONFIG.claude.defaultModel;

        const response = await this.claudeClient.messages.create({
            model,
            max_tokens: config.maxTokens ?? 1000,
            temperature: config.temperature ?? 0.7,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = response.content[0]?.type === 'text'
            ? response.content[0].text
            : '';

        const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

        return {
            content,
            provider: 'claude',
            model,
            tokensUsed,
            cost: this.calculateCost('claude', model, tokensUsed),
        };
    }

    /**
     * Appel Gemini (Google)
     */
    private async callGemini(
        prompt: string,
        config: Partial<AIConfig>,
        systemPrompt?: string
    ): Promise<Omit<AIResponse, 'executionTime'>> {
        if (!this.geminiClient) {
            throw new Error('Gemini non configuré (clé API manquante)');
        }

        const modelName = config.model || PROVIDER_CONFIG.gemini.defaultModel;
        const model = this.geminiClient.getGenerativeModel({ model: modelName });

        const fullPrompt = systemPrompt
            ? `${systemPrompt}\n\n${prompt}`
            : prompt;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: config.temperature ?? 0.7,
                maxOutputTokens: config.maxTokens ?? 1000,
            },
        });

        const content = result.response.text();
        const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;

        return {
            content,
            provider: 'gemini',
            model: modelName,
            tokensUsed,
            cost: this.calculateCost('gemini', modelName, tokensUsed),
        };
    }

    /**
     * Appel Groq 🆕
     */
    private async callGroq(
        prompt: string,
        config: Partial<AIConfig>,
        systemPrompt?: string
    ): Promise<Omit<AIResponse, 'executionTime'>> {
        if (!this.groqClient) {
            throw new Error('Groq non configuré (clé API manquante)');
        }

        const model = config.model || PROVIDER_CONFIG.groq.defaultModel;

        const messages: any[] = [];
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await this.groqClient.chat.completions.create({
            model,
            messages,
            temperature: config.temperature ?? 0.7,
            max_tokens: config.maxTokens ?? 1000,
        });

        const content = response.choices[0]?.message?.content || '';
        const tokensUsed = response.usage?.total_tokens || 0;

        return {
            content,
            provider: 'groq',
            model,
            tokensUsed,
            cost: 0, // GRATUIT ! 🎉
        };
    }

    /**
     * Détermine si une erreur est retryable
     */
    private isRetryableError(error: any): boolean {
        const retryableCodes = [
            'rate_limit_exceeded',
            'server_error',
            'timeout',
            'service_unavailable',
            'overloaded',
            '429',
            '500',
            '502',
            '503',
            '504',
        ];

        const errorString = error.message?.toLowerCase() || '';
        const errorCode = error.code?.toLowerCase() || '';

        return retryableCodes.some(
            code => errorString.includes(code) || errorCode.includes(code)
        );
    }

    /**
     * Calcule le coût approximatif
     */
    private calculateCost(provider: AIProvider, model: string, tokens: number): number {
        // Coûts approximatifs par 1000 tokens (à ajuster selon les tarifs réels)
        const costs: Record<string, number> = {
            'gpt-4': 0.03,
            'gpt-3.5-turbo': 0.002,
            'claude-3-5-sonnet-20241022': 0.015,
            'claude-3-haiku-20240307': 0.0025,
            'gemini-1.5-pro': 0.0035,
            'gemini-1.5-flash': 0.00035,
        };

        const costPer1k = costs[model] || 0.01;
        return (tokens / 1000) * costPer1k;
    }

    /**
     * Vérifie la disponibilité des providers
     */
    async checkProviderHealth(): Promise<Record<AIProvider, boolean>> {
        const health: Record<AIProvider, boolean> = {
            openai: false,
            claude: false,
            gemini: false,
        };

        // Test OpenAI
        if (this.openaiClient) {
            try {
                await this.openaiClient.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 5,
                });
                health.openai = true;
            } catch (error) {
                console.error('OpenAI health check failed:', error);
            }
        }

        // Test Claude
        if (this.claudeClient) {
            try {
                await this.claudeClient.messages.create({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 5,
                    messages: [{ role: 'user', content: 'test' }],
                });
                health.claude = true;
            } catch (error) {
                console.error('Claude health check failed:', error);
            }
        }

        // Test Gemini
        if (this.geminiClient) {
            try {
                const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
                await model.generateContent('test');
                health.gemini = true;
            } catch (error) {
                console.error('Gemini health check failed:', error);
            }
        }

        return health;
    }
}

// Export singleton
export const aiService = new AIService();
