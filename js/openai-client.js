class OpenAIClient {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.baseURL = 'https://api.tu-zi.com/v1';
    }

    isConfigured() {
        return this.apiKey && this.apiKey.trim() !== '';
    }

    async readTarot(imageData, question, spreadType) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API密钥未配置');
        }

        try {
            // 将base64图片数据转换为文件
            const imageFile = this.dataURLToFile(imageData, 'tarot.jpg');
            
            // 调用OpenAI Vision API
            const response = await this.callOpenAIAPI(imageFile, question, spreadType);
            
            // 统一返回格式，将所有内容合并为一个完整的AI解读
            return {
                unifiedReading: response
            };
            
        } catch (error) {
            console.error('OpenAI API调用失败:', error);
            throw new Error(`解读失败: ${error.message}`);
        }
    }

    dataURLToFile(dataURL, filename) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, { type: mime });
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    async callOpenAIAPI(imageFile, question, spreadType) {
        // 确保图片是base64格式
        let imageData = imageFile;
        if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
            imageData = imageFile;
        } else {
            // 如果是File对象，直接转换为base64
            imageData = await this.fileToBase64(imageFile);
        }

        // 验证图片格式
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const imageType = imageData.split(';')[0].split(':')[1];
        if (!supportedTypes.includes(imageType)) {
            throw new Error('不支持的图片格式。请上传 JPG、PNG 或 WebP 格式的图片。');
        }

        // 准备系统提示词
        const systemPrompt = this.getSystemPrompt(spreadType);
        
        // 构建用户消息
        const userMessage = `请为以下塔罗牌进行解读。

问题：${question}
牌阵类型：${this.getSpreadTypeText(spreadType)}

请提供完整的塔罗牌解读，包括：
1. 识别出的塔罗牌及其位置含义
2. 针对问题的详细解读分析
3. 具体的建议与指引

请将所有内容整合为一个连贯、完整的解读，使用🔮 AI解读结果作为标题。`;

        // 使用OpenAI的Vision API
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: userMessage
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageData
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API调用失败');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    getSystemPrompt(spreadType) {
        return `你是一位经验丰富的塔罗牌解读师。请根据用户上传的塔罗牌图片和他们的具体问题，提供专业、深入且富有洞察力的解读。

你的解读应该：
- 准确识别图片中的塔罗牌
- 结合牌阵类型分析问题
- 提供具体、实用的建议
- 语言要温暖、鼓励，但保持专业
- 避免过于笼统的表述

牌阵类型说明：
- 单张牌：针对具体问题的直接回答
- 三张牌：过去-现在-未来的时间线分析
- 凯尔特十字：全面的情况分析和建议

请将所有内容整合为一个完整的解读，不要分开展示不同的部分。`;
    }

    getSpreadTypeText(spreadType) {
        const spreadMap = {
            'single': '单张牌',
            'three': '三张牌（过去-现在-未来）',
            'celtic': '凯尔特十字'
        };
        return spreadMap[spreadType] || '未知牌阵';
    }

    // 保存API密钥
    saveApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    // 清除API密钥
    clearApiKey() {
        this.apiKey = '';
        localStorage.removeItem('openai_api_key');
    }
}

// 为了向后兼容，也提供TarotAIClient别名
class TarotAIClient extends OpenAIClient {
    constructor() {
        super();
    }
}