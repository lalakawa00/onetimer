class TarotAIClient {
    constructor() {}

    isConfigured() {
        // 不再需要检查API密钥，因为它是通过环境变量在服务器端设置的
        return true;
    }

    async readTarot(imageData, question, spreadType) {
        try {
            const response = await fetch('/api/tarot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageData, question, spreadType })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API call failed');
            }

            const data = await response.json();
            return { unifiedReading: data.reading };

        } catch (error) {
            console.error('Tarot API call failed:', error);
            throw new Error(`解读失败: ${error.message}`);
        }
    }
}

// 确保在没有模块加载器的环境中也能使用
if (typeof window !== 'undefined') {
    window.TarotAIClient = TarotAIClient;
}