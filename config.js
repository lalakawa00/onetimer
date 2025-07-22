// 塔罗牌解读应用配置文件
window.TAROT_CONFIG = {
    // OpenAI API配置
    openai: {
        // 请在这里填入你的OpenAI API密钥
        apiKey: 'your-openai-api-key-here',
        // API基础地址，默认使用OpenAI官方地址
        baseURL: 'https://api.openai.com/v1',
        // 使用的模型
        model: 'gpt-4o-mini-2024-07-18',
        // 最大token数
        maxTokens: 1500,
        // 温度参数
        temperature: 0.7
    },
    
    // 安全配置
    security: {
        // 请求超时时间（毫秒）
        requestTimeout: 30000,
        // 最大重试次数
        maxRetries: 3
    },
    
    // 应用配置
    app: {
        // 应用名称
        name: '神秘塔罗牌解读',
        // 版本
        version: '1.0.0',
        // 是否启用演示模式
        demoMode: true
    }
};

// 配置说明：
// 1. 如果你有OpenAI API密钥，请替换 'your-openai-api-key-here'
// 2. 如果使用其他兼容的API服务，请修改 baseURL
// 3. 如果没有API密钥，应用会自动使用演示模式