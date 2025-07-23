
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { imageData, question, spreadType, lang } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured on the server.' });
    }

    if (!imageData || !question || !spreadType) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const systemPrompt = getSystemPrompt(spreadType, lang);
    const userMessage = getUserMessage(question, spreadType, lang);

    try {
        const response = await fetch('https://api.tu-zi.com/v1/chat/completions', {
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
                max_tokens: 1000,
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

const systemPrompts = {
    zh: `你是一位神秘的塔罗牌占卜师。你的语言精炼、深刻，充满诗意与智慧，如同神谕。

你的解读要做到：
- **言简意赅**: 避免冗长解释，直击核心。
- **意境深远**: 使用象征和隐喻，引发深思。
- **洞察本质**: 穿透牌面，揭示问题的根源与未来的可能性。
- **保持神秘**: 语言风格要统一，温暖而又充满敬畏感。

牌阵类型说明（仅作你解读时的内在参考，无需在回答中提及）：
- 单张牌：针对具体问题的直接回答。
- 三张牌：过去-现在-未来的时间线分析。
- 凯尔特十字：全面的情况分析和建议。

请将所有内容无缝融合为一篇充满智慧的短文，不要分段或使用列表。`,
    en: `You are a mystical tarot card diviner. Your language is concise, profound, poetic, and full of wisdom, like an oracle.

Your interpretation should be:
- **Concise**: Avoid lengthy explanations, go straight to the core.
- **Profound**: Use symbols and metaphors to inspire deep thought.
- **Insightful**: Penetrate the cards to reveal the root of the problem and future possibilities.
- **Mysterious**: Maintain a consistent language style, warm yet reverent.

Spread type descriptions (for your internal reference only, do not mention in the answer):
- Single Card: Direct answer to a specific question.
- Three Cards: Past-Present-Future timeline analysis.
- Celtic Cross: Comprehensive situation analysis and advice.

Please seamlessly integrate all content into a wise and concise short essay, without paragraphs or lists.`
};

const userMessages = {
    zh: (question, spreadType) => `请为以下塔罗牌进行解读。

问题：${question}
牌阵类型：${getSpreadTypeText(spreadType, 'zh')}

请以“**你的塔罗启示**”为标题，用一篇精炼、深刻、充满智慧的短文呈现解读，无需分点。
内容应自然融合以下三个层面：
1. **牌面之镜**：揭示牌面及其象征。
2. **意象解读**：深入剖析处境与未来。
3. **星辰指引**：给予一句画龙点睛的神谕。`,
    en: (question, spreadType) => `Please interpret the following tarot cards.

Question: ${question}
Spread Type: ${getSpreadTypeText(spreadType, 'en')}

Please present the interpretation as a concise, profound, and wise short essay, titled "**Your Tarot Revelation**", without bullet points.
The content should naturally integrate the following three aspects:
1. **Mirror of the Cards**: Revealing the cards and their symbolism.
2. **Interpretation of Imagery**: Deeply analyzing the core situation and future direction.
3. **Guidance from the Stars**: Providing a powerful, insightful oracle.`
};

function getSystemPrompt(spreadType, lang) {
    return systemPrompts[lang] || systemPrompts['zh'];
}

function getUserMessage(question, spreadType, lang) {
    return userMessages[lang](question, spreadType) || userMessages['zh'](question, spreadType);
}

const spreadTypeTexts = {
    zh: {
        'single': '单张牌',
        'three': '三张牌（过去-现在-未来）',
        'celtic': '凯尔特十字'
    },
    en: {
        'single': 'Single Card',
        'three': 'Three Cards (Past-Present-Future)',
        'celtic': 'Celtic Cross'
    }
};

function getSpreadTypeText(spreadType, lang) {
    return (spreadTypeTexts[lang] && spreadTypeTexts[lang][spreadType]) || spreadTypeTexts['zh'][spreadType] || '未知牌阵';
}
