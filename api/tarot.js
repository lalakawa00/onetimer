
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { imageData, question, spreadType } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured on the server.' });
    }

    if (!imageData || !question || !spreadType) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const systemPrompt = getSystemPrompt(spreadType);
    const userMessage = `请为以下塔罗牌进行解读。

问题：${question}
牌阵类型：${getSpreadTypeText(spreadType)}

请提供完整的塔罗牌解读，包括：
1. 识别出的塔罗牌及其位置含义
2. 针对问题的详细解读分析
3. 具体的建议与指引

请将所有内容整合为一个连贯、完整的解读，使用🔮 AI解读结果作为标题。`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
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
            console.error('OpenAI API Error:', errorData);
            return res.status(response.status).json({ error: errorData.error?.message || 'API call failed' });
        }

        const data = await response.json();
        res.status(200).json({ reading: data.choices[0].message.content });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

function getSystemPrompt(spreadType) {
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

function getSpreadTypeText(spreadType) {
    const spreadMap = {
        'single': '单张牌',
        'three': '三张牌（过去-现在-未来）',
        'celtic': '凯尔特十字'
    };
    return spreadMap[spreadType] || '未知牌阵';
}
