/**
 * Service unifié pour gérer plusieurs providers IA
 * Supporte: OpenAI, Gemini AI, Claude AI
 */

export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface AIConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface AIResponse {
    content: string;
    tokensUsed?: number;
    cost?: number;
    provider: AIProvider;
    model: string;
}

export class AIService {
    /**
     * Génère du texte avec le provider spécifié
     */
    static async generateText(
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        switch (config.provider) {
            case 'openai':
                return this.generateWithOpenAI(prompt, config);
            case 'gemini':
                return this.generateWithGemini(prompt, config);
            case 'claude':
                return this.generateWithClaude(prompt, config);
            default:
                throw new Error(`Provider non supporté: ${config.provider}`);
        }
    }

    /**
     * Analyse une image avec le provider spécifié
     */
    static async analyzeImage(
        imageUrl: string,
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        switch (config.provider) {
            case 'openai':
                return this.analyzeImageWithOpenAI(imageUrl, prompt, config);
            case 'gemini':
                return this.analyzeImageWithGemini(imageUrl, prompt, config);
            case 'claude':
                return this.analyzeImageWithClaude(imageUrl, prompt, config);
            default:
                throw new Error(`Provider non supporté: ${config.provider}`);
        }
    }

    /**
     * Modère du contenu avec le provider spécifié
     */
    static async moderateContent(
        content: string,
        config: AIConfig
    ): Promise<{ safe: boolean; score: number; categories: string[] }> {
        switch (config.provider) {
            case 'openai':
                return this.moderateWithOpenAI(content, config);
            case 'gemini':
                return this.moderateWithGemini(content, config);
            case 'claude':
                return this.moderateWithClaude(content, config);
            default:
                throw new Error(`Provider non supporté: ${config.provider}`);
        }
    }

    // ==================== OPENAI ====================

    private static async generateWithOpenAI(
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model || 'gpt-4-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature || 0.7,
                max_tokens: config.maxTokens || 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0].message.content,
            tokensUsed: data.usage.total_tokens,
            cost: this.calculateOpenAICost(data.usage.total_tokens, config.model || 'gpt-4-turbo'),
            provider: 'openai',
            model: config.model || 'gpt-4-turbo'
        };
    }

    private static async analyzeImageWithOpenAI(
        imageUrl: string,
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model || 'gpt-4-vision-preview',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: imageUrl } }
                    ]
                }],
                max_tokens: config.maxTokens || 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI Vision API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0].message.content,
            tokensUsed: data.usage.total_tokens,
            cost: this.calculateOpenAICost(data.usage.total_tokens, 'gpt-4-vision-preview'),
            provider: 'openai',
            model: 'gpt-4-vision-preview'
        };
    }

    private static async moderateWithOpenAI(
        content: string,
        config: AIConfig
    ): Promise<{ safe: boolean; score: number; categories: string[] }> {
        const response = await fetch('https://api.openai.com/v1/moderations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({ input: content })
        });

        if (!response.ok) {
            throw new Error(`OpenAI Moderation API error: ${response.statusText}`);
        }

        const data = await response.json();
        const result = data.results[0];

        const flaggedCategories = Object.keys(result.categories).filter(
            cat => result.categories[cat]
        );

        return {
            safe: !result.flagged,
            score: result.flagged ? 0 : 100,
            categories: flaggedCategories
        };
    }

    private static calculateOpenAICost(tokens: number, model: string): number {
        const pricing: Record<string, { input: number; output: number }> = {
            'gpt-4-turbo': { input: 0.01, output: 0.03 },
            'gpt-4': { input: 0.03, output: 0.06 },
            'gpt-4-vision-preview': { input: 0.01, output: 0.03 },
            'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
        };

        const price = pricing[model] || pricing['gpt-4-turbo'];
        return (tokens / 1000) * ((price.input + price.output) / 2);
    }

    // ==================== GEMINI AI ====================

    private static async generateWithGemini(
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent?key=${config.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: config.temperature || 0.7,
                        maxOutputTokens: config.maxTokens || 1000
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        return {
            content,
            tokensUsed: data.usageMetadata?.totalTokenCount,
            cost: this.calculateGeminiCost(data.usageMetadata?.totalTokenCount || 0, config.model || 'gemini-pro'),
            provider: 'gemini',
            model: config.model || 'gemini-pro'
        };
    }

    private static async analyzeImageWithGemini(
        imageUrl: string,
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        // Télécharger l'image et la convertir en base64
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro-vision'}:generateContent?key=${config.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: base64Image
                                }
                            }
                        ]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini Vision API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        return {
            content,
            tokensUsed: data.usageMetadata?.totalTokenCount,
            cost: this.calculateGeminiCost(data.usageMetadata?.totalTokenCount || 0, 'gemini-pro-vision'),
            provider: 'gemini',
            model: 'gemini-pro-vision'
        };
    }

    private static async moderateWithGemini(
        content: string,
        config: AIConfig
    ): Promise<{ safe: boolean; score: number; categories: string[] }> {
        // Gemini utilise son propre système de sécurité
        const prompt = `Analyse ce contenu et détermine s'il est approprié. Réponds uniquement par un JSON avec: {"safe": true/false, "score": 0-100, "categories": ["cat1", "cat2"]}. Contenu: ${content}`;

        const result = await this.generateWithGemini(prompt, config);

        try {
            const analysis = JSON.parse(result.content);
            return analysis;
        } catch {
            // Fallback si parsing échoue
            return { safe: true, score: 50, categories: [] };
        }
    }

    private static calculateGeminiCost(tokens: number, model: string): number {
        const pricing: Record<string, number> = {
            'gemini-pro': 0.00025,
            'gemini-pro-vision': 0.00025,
            'gemini-ultra': 0.001
        };

        const pricePerToken = pricing[model] || pricing['gemini-pro'];
        return (tokens / 1000) * pricePerToken;
    }

    // ==================== CLAUDE AI ====================

    private static async generateWithClaude(
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model || 'claude-3-sonnet-20240229',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: config.maxTokens || 1000,
                temperature: config.temperature || 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.content[0].text,
            tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
            cost: this.calculateClaudeCost(
                data.usage.input_tokens,
                data.usage.output_tokens,
                config.model || 'claude-3-sonnet-20240229'
            ),
            provider: 'claude',
            model: config.model || 'claude-3-sonnet-20240229'
        };
    }

    private static async analyzeImageWithClaude(
        imageUrl: string,
        prompt: string,
        config: AIConfig
    ): Promise<AIResponse> {
        // Télécharger l'image et la convertir en base64
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model || 'claude-3-sonnet-20240229',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }],
                max_tokens: config.maxTokens || 1000
            })
        });

        if (!response.ok) {
            throw new Error(`Claude Vision API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            content: data.content[0].text,
            tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
            cost: this.calculateClaudeCost(
                data.usage.input_tokens,
                data.usage.output_tokens,
                config.model || 'claude-3-sonnet-20240229'
            ),
            provider: 'claude',
            model: config.model || 'claude-3-sonnet-20240229'
        };
    }

    private static async moderateWithClaude(
        content: string,
        config: AIConfig
    ): Promise<{ safe: boolean; score: number; categories: string[] }> {
        const prompt = `Analyse ce contenu et détermine s'il est approprié. Réponds uniquement par un JSON avec: {"safe": true/false, "score": 0-100, "categories": ["cat1", "cat2"]}. Contenu: ${content}`;

        const result = await this.generateWithClaude(prompt, config);

        try {
            const analysis = JSON.parse(result.content);
            return analysis;
        } catch {
            return { safe: true, score: 50, categories: [] };
        }
    }

    private static calculateClaudeCost(
        inputTokens: number,
        outputTokens: number,
        model: string
    ): number {
        const pricing: Record<string, { input: number; output: number }> = {
            'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
            'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
            'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 }
        };

        const price = pricing[model] || pricing['claude-3-sonnet-20240229'];
        return (inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output;
    }

    // ==================== HELPER METHODS ====================

    /**
     * Teste la connexion avec un provider
     */
    static async testProvider(config: AIConfig): Promise<boolean> {
        try {
            const result = await this.generateText('Test', config);
            return result.content.length > 0;
        } catch (error) {
            console.error(`Erreur test ${config.provider}:`, error);
            return false;
        }
    }

    /**
     * Obtient le meilleur provider disponible
     */
    static async getBestAvailableProvider(
        providers: AIConfig[]
    ): Promise<AIConfig | null> {
        for (const config of providers) {
            const isAvailable = await this.testProvider(config);
            if (isAvailable) return config;
        }
        return null;
    }
}
