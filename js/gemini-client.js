class TarotAIClient {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api-proxy.me/gemini/v1beta/models/gemini-2.5-pro:generateContent';
        this.model = 'gemini-2.5-pro';
    }

    isConfigured() {
        return !!this.apiKey;
    }

    async getSystemPrompt() {
        try {
            const response = await fetch('./system-prompt.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('获取系统提示词失败:', error);
            return '你是一位资深的塔罗牌解读师，请解读图片中的塔罗牌并结合用户问题给出建议。';
        }
    }

    async readTarot(imageData, question, spreadType) {
        if (!this.isConfigured()) {
            throw new Error('API密钥未配置，请在设置中输入。');
        }

        const systemPrompt = await this.getSystemPrompt();
        const url = `${this.baseURL}?key=${this.apiKey}`;

        const match = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!match) {
            throw new Error('无效的图片数据格式');
        }
        const mimeType = match[1];
        const base64Data = match[2];

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: systemPrompt },
                        { text: `牌阵类型: ${spreadType}, 用户问题: ${question}` },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1500
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Gemini API 错误:', data);
                throw new Error(`API 调用失败: ${data.error?.message || '未知错误'}`);
            }

            // **健壮性修复：检查API响应是否因为安全策略等原因被阻止**
            if (!data.candidates || data.candidates.length === 0) {
                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    console.error('请求被阻止:', data.promptFeedback);
                    throw new Error(`请求因内容安全策略被阻止: ${data.promptFeedback.blockReason}`);
                } else {
                    console.error('API返回无效响应:', data);
                    throw new Error('AI未能生成有效回复，可能是因为内容限制。请尝试调整您的问题或图片。');
                }
            }
            
            const rawText = data.candidates[0].content.parts[0].text;

            try {
                const cleanedText = rawText.replace(/^```json\n|\n```$/g, '').trim();
                const parsed = JSON.parse(cleanedText);
                return parsed;
            } catch (e) {
                console.error("JSON解析失败:", e, "\n原始回复:", rawText);
                return {
                    cards: [{ name: "AI回复解析失败", reversed: false }],
                    interpretation: rawText,
                    advice: "AI返回了非预期的格式，以上是原始文本。请检查系统提示词是否要求返回JSON。"
                };
            }

        } catch (error) {
            console.error('调用Gemini API失败:', error);
            throw error;
        }
    }
}