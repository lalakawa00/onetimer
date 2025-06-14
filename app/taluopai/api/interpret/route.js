import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Parse data from the frontend request
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const question = formData.get('question');
    const userApiKey = formData.get('apiKey');

    // Basic validation on the server side
    if (!imageFile || !question || !userApiKey) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 2. Convert the image file to a Base64 string
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // 3. Construct the detailed prompt for the AI
    const promptText = `
      你是一位智慧、深刻且富有同情心的塔罗牌解读大师。你的任务是分析我上传的塔罗牌阵图片，并结合我提出的问题，提供清晰、富有启发性的指引。

      请遵循以下原则进行解读：
      1.  **识别牌面**：首先，尽你所能识别图片中的每一张牌，包括它们的正位或逆位。在解读的开始部分，明确列出你识别出的牌，例如：“我看到牌阵中有：‘魔术师（正位）’、‘圣杯二（逆位）’...”。
      2.  **承认不确定性**：由于这只是图片识别，请优雅地承认可能存在误差。你可以说：“根据我的观察，这张牌似乎是‘权杖骑士’。如果我的识别是准确的，那么它象征着……”
      3.  **结合问题**：将牌意与我提出的具体问题紧密结合，进行深入分析。不要只给出宽泛、通用的牌意解释。
      4.  **提供洞见而非预测**：你的目标是引导我进行自我反思，发现新的视角和可能性，而不是做出宿命般的预测。请使用启发性的语言。
      5.  **富有同情心的语气**：使用温暖、支持和鼓励的语气。

      我的问题是：“${question}”

      现在，请开始你的解读。
    `;

    // 4. Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userApiKey}`, // Use the key provided by the user
      },
      body: JSON.stringify({
        model: "gpt-4o", // Ensure the model supports vision
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
      }),
    });
    
    // 5. Handle the response from OpenAI
    const aiResult = await response.json();

    if (!response.ok) {
      // Forward OpenAI's error message to the client
      return NextResponse.json({ error: aiResult.error.message || '与OpenAI服务器通信时发生错误。' }, { status: response.status });
    }

    const interpretation = aiResult.choices?.[0]?.message?.content;

    if (!interpretation) {
      return NextResponse.json({ error: 'AI未能返回有效的解读内容。' }, { status: 500 });
    }
    
    // 6. Send the successful interpretation back to the frontend
    return NextResponse.json({ interpretation });

  } catch (err) {
    console.error(err); // Log the error on the server for debugging
    return NextResponse.json({ error: '服务器内部错误。' }, { status: 500 });
  }
}
