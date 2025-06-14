document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const tarotImageInput = document.getElementById('tarotImage');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewSection = document.querySelector('.image-preview-section');
    const userQuestionInput = document.getElementById('userQuestion');
    const analyzeButton = document.getElementById('analyzeButton');
    const analysisResultDiv = document.getElementById('analysisResult');
    const analysisResultPlaceholder = analysisResultDiv.querySelector('p.placeholder');

    let currentApiKey = localStorage.getItem('geminiApiKey'); // Use 'geminiApiKey' for consistency
    if (currentApiKey) {
        apiKeyInput.value = currentApiKey;
    }

    saveApiKeyButton.addEventListener('click', () => {
        currentApiKey = apiKeyInput.value.trim();
        if (currentApiKey) {
            localStorage.setItem('geminiApiKey', currentApiKey);
            alert('API 密钥已保存！');
        } else {
            alert('请输入有效的 API 密钥。');
        }
        checkCanAnalyze();
    });

    let uploadedFile = null;

    apiKeyInput.addEventListener('input', checkCanAnalyze);
    userQuestionInput.addEventListener('input', checkCanAnalyze);

    tarotImageInput.addEventListener('change', (event) => {
        uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewSection.style.display = 'block'; // Show preview section
            }
            reader.readAsDataURL(uploadedFile);
        } else {
            imagePreview.src = '#';
            imagePreviewSection.style.display = 'none'; // Hide preview section
            uploadedFile = null; // Reset uploadedFile if no file is selected
        }
        checkCanAnalyze();
    });

    function checkCanAnalyze() {
        const question = userQuestionInput.value.trim();
        if (currentApiKey && uploadedFile && question) {
            analyzeButton.disabled = false;
        } else {
            analyzeButton.disabled = true;
        }
    }

    analyzeButton.addEventListener('click', async () => {
        const userQuestion = userQuestionInput.value.trim();

        if (!currentApiKey) {
            alert('请先输入并保存您的 Gemini API 密钥。');
            return;
        }
        if (!uploadedFile) {
            alert('请先上传塔罗牌图片。');
            return;
        }
        if (!userQuestion) {
            alert('请输入您的问题。');
            return;
        }

        analysisResultDiv.style.display = 'block';
        analysisResultDiv.innerHTML = '<p>正在分析中，请稍候...</p>'; // Clear previous results and show loading
        analyzeButton.disabled = true;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;

            try {
                const modelName = 'gemini-2.5-flash-preview-05-20'; // User confirmed model
                const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentApiKey}`;

                const requestBody = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `请根据这张塔罗牌图片分析以下问题： "${userQuestion}"。请提供详细的解读，包括每张牌的含义以及它们之间的联系，并给出整体的解读和建议。`
                                },
                                {
                                    inline_data: {
                                        mime_type: uploadedFile.type,
                                        data: base64Image.split(',')[1]
                                    }
                                }
                            ]
                        }
                    ],
                    // "generationConfig": {
                    //   "maxOutputTokens": 2048 // Example: Increase if responses are truncated
                    // }
                };

                console.log('Sending request to Gemini API:', geminiApiUrl);
                console.log('Request body:', JSON.stringify(requestBody, null, 2));

                const response = await fetch(geminiApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                console.log('API Response Status:', response.status);

                if (!response.ok) {
                    let errorText = `Gemini API 请求失败: ${response.status} ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        console.error('Gemini API Error Data:', errorData);
                        errorText += ` - ${errorData.error ? errorData.error.message : JSON.stringify(errorData)}`;
                    } catch (e) {
                        const rawErrorText = await response.text();
                        console.error('Gemini API Raw Error Text:', rawErrorText);
                        errorText += ` - ${rawErrorText || '无法解析错误响应'}`;
                    }
                    throw new Error(errorText);
                }

                const data = await response.json();
                console.log('Gemini API Response Data:', JSON.stringify(data, null, 2));

                if (data.candidates && data.candidates.length > 0 && 
                    data.candidates[0].content && data.candidates[0].content.parts && 
                    data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0].text) {
                    
                    const resultContent = data.candidates[0].content.parts[0].text.trim();
                    analysisResultDiv.innerHTML = `<p>${resultContent.replace(/\n/g, '<br>')}</p>`;
                } else {
                    let detailedError = 'Gemini API 未能获取有效回复或回复结构不正确。';
                    if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason) {
                        detailedError += ` 结束原因: ${data.candidates[0].finishReason}.`;
                        if (data.candidates[0].safetyRatings) {
                            detailedError += ` 安全评级: ${JSON.stringify(data.candidates[0].safetyRatings)}`;
                        }
                    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                        detailedError += ` 提示被阻止，原因: ${data.promptFeedback.blockReason}.`;
                        if (data.promptFeedback.safetyRatings) {
                            detailedError += ` 安全评级: ${JSON.stringify(data.promptFeedback.safetyRatings)}`;
                        }
                    } else {
                        detailedError += ' 回复结构不正确或内容为空。请检查API响应。';
                    }
                    console.error('Error parsing API response:', detailedError, 'Full response:', data);
                    analysisResultDiv.innerHTML = `<p style="color: #f7768e;">${detailedError}</p><p>请检查开发者控制台了解详情。</p>`;
                }
            } catch (error) {
                console.error('分析错误:', error);
                analysisResultDiv.innerHTML = `<p style="color: #f7768e;">分析过程中发生错误：${error.message}. 请检查浏览器控制台获取更多信息。</p>`;
            }
            finally {
                 checkCanAnalyze(); 
            }
        };
        reader.readAsDataURL(uploadedFile);
    });

    checkCanAnalyze();
});