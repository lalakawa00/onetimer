

class TarotAIClient {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
        this.model = 'gemini-2.5-pro';
    }

    // 检查API密钥是否已配置
    isConfigured() {
        return !!this.apiKey;
    }

    // 读取系统提示词
    async getSystemPrompt() {
        try {
            const response = await fetch('./system-prompt.md');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('获取系统提示词失败:', error);
            // 在真实场景中，这里可以返回一个硬编码的默认提示
            return '你是一位资深的塔罗牌解读师，请解读图片中的塔罗牌并结合用户问题给出建议。';
        }
    }

    // 调用Gemini API进行塔罗牌解读
    async readTarot(imageData, question, spreadType) {
        if (!this.isConfigured()) {
            throw new Error('API密钥未配置，请在设置中输入。');
        }

        const systemPrompt = await this.getSystemPrompt();
        const url = `${this.baseURL}?key=${this.apiKey}`;

        // 从imageData URL中提取base64部分和MIME类型
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

            if (!response.ok) {
                const errorBody = await response.json();
                console.error('Gemini API 错误:', errorBody);
                throw new Error(`API 调用失败: ${errorBody.error.message}`);
            }

            const data = await response.json();
            
            // Gemini的响应直接在 candidates[0].content.parts[0].text 中
            const rawText = data.candidates[0].content.parts[0].text;

            // 尝试解析JSON
            try {
                // Gemini Vision API有时会在JSON字符串外添加 ```json ... ```, 需要移除
                const cleanedText = rawText.replace(/^```json\n|\n```$/g, '').trim();
                const parsed = JSON.parse(cleanedText);
                return parsed;
            } catch (e) {
                console.error("JSON解析失败:", e);
                console.error("原始回复:", rawText);
                // 如果解析失败，返回一个包含原始文本的结构化对象
                return {
                    cards: [{ name: "AI回复解析失败", reversed: false }],
                    interpretation: rawText,
                    advice: "AI返回了非预期的格式，以上是原始文本。"
                };
            }

        } catch (error) {
            console.error('调用Gemini API失败:', error);
            throw error; // 将错误继续向上抛出，以便UI层可以捕获
        }
    }
}

