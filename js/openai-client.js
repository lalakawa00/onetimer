// OpenAI API客户端，直接在前端调用
class TarotAIClient {
    constructor() {
        // 从配置文件读取设置
        this.config = window.TAROT_CONFIG || {};
        this.apiKey = this.config.openai?.apiKey || 'apikey';
        this.baseURL = this.config.openai?.baseURL || 'apiurl';
        this.model = this.config.openai?.model || 'gemini-2.5-pro';
        this.temperature = this.config.openai?.temperature || 0.7;
        this.requestTimeout = this.config.security?.requestTimeout || 30000;
        this.maxRetries = this.config.security?.maxRetries || 3;
    }

    // 读取系统提示词
    async getSystemPrompt() {
        try {
            const response = await fetch('./system-prompt.md');
            const promptText = await response.text();
            return promptText;
        } catch (error) {
            console.error('获取系统提示词失败:', error);
            return this.getDefaultPrompt();
        }
    }

    // 默认系统提示词
    getDefaultPrompt() {
        return `你是一位拥有20年经验的资深塔罗牌解读师，精通韦特塔罗体系，对人类心理学和灵性成长有深刻理解。

请按照以下步骤进行塔罗牌解读：

1. 仔细观察图片中的塔罗牌
2. 识别牌名和正位/逆位
3. 结合用户问题进行深度解读
4. 提供实用的人生建议

解读风格要求：
- 温暖关怀，用"你"来称呼
- 既有神秘色彩又实用
- 积极正面，强调成长机会
- 避免绝对化预言

请以JSON格式返回结果：
{
  "cards": [{"name": "牌名", "reversed": false}],
  "interpretation": "详细解读",
  "advice": "具体建议"
}`;
    }

    // 将图片转换为base64
    imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // 调用OpenAI API进行塔罗牌解读
    async readTarot(imageData, question, spreadType) {
        try {
            const systemPrompt = await this.getSystemPrompt();
            
            // 构建消息
            const messages = [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `请解读这张塔罗牌图片。

用户问题：${question}
牌阵类型：${this.getSpreadDescription(spreadType)}

请仔细观察图片中的塔罗牌，识别牌名和方向，然后结合用户的问题进行深入解读。`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageData,
                                detail: "high"
                            }
                        }
                    ]
                }
            ];

            // 调用OpenAI API
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // 尝试解析JSON响应
            try {
                const parsedResponse = JSON.parse(aiResponse);
                return parsedResponse;
            } catch (parseError) {
                // 如果不是JSON格式，则创建标准格式响应
                return {
                    cards: [{ name: "未识别", reversed: false }],
                    interpretation: aiResponse,
                    advice: "请根据解读内容采取适当的行动。"
                };
            }

        } catch (error) {
            console.error('OpenAI API调用失败:', error);
            throw new Error('AI解读服务暂时不可用，请稍后重试。');
        }
    }

    // 获取牌阵描述
    getSpreadDescription(spreadType) {
        const descriptions = {
            'single': '单张牌解读 - 针对问题的核心指引',
            'three': '三张牌解读 - 过去、现在、未来的时间线分析',
            'celtic': '凯尔特十字解读 - 全方位深度分析'
        };
        return descriptions[spreadType] || '单张牌解读';
    }

    // 验证API密钥是否设置
    isConfigured() {
        return this.apiKey && this.apiKey !== 'your-openai-api-key-here';
    }
}

// 导出为全局变量供其他文件使用
window.TarotAIClient = TarotAIClient;