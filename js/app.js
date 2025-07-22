// 全局变量
let uploadedImage = null;
let isProcessing = false;
let tarotAI = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 初始化Gemini客户端
    tarotAI = new TarotAIClient();

    // 绑定DOM元素事件
    document.getElementById('tarotImage').addEventListener('change', handleImageUpload);
    document.getElementById('readButton').addEventListener('click', startReading);
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('saveApiConfigBtn').addEventListener('click', saveApiConfig);
    document.getElementById('userQuestion').addEventListener('input', updateReadButtonState);
    document.querySelector('.remove-btn').addEventListener('click', removeImage);

    // 检查API配置
    checkAPIConfiguration();
    
    // 拖拽上传
    setupDragAndDrop();
}

// 打开设置模态框并填充已有数据
function openSettingsModal() {
    document.getElementById('apiKey').value = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('apiModal').style.display = 'flex';
}

// 检查API配置
function checkAPIConfiguration() {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
        tarotAI.apiKey = apiKey;
        document.getElementById('apiModal').style.display = 'none';
    } else {
        openSettingsModal(); // 如果没有key，直接打开设置窗口
    }
}

// 保存API配置
function saveApiConfig() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        tarotAI.apiKey = apiKey;
        document.getElementById('apiModal').style.display = 'none';
        alert('API密钥已保存！');
    } else {
        alert('请输入您的Gemini API密钥。');
    }
}

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        showPreview(uploadedImage);
        updateReadButtonState();
    };
    reader.readAsDataURL(file);
}

// 显示图片预览
function showPreview(imageSrc) {
    document.getElementById('previewImage').src = imageSrc;
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('previewArea').style.display = 'block';
}

// 移除图片
function removeImage() {
    uploadedImage = null;
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('tarotImage').value = '';
    updateReadButtonState();
}

// 设置拖拽上传
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('tarotImage').files = files;
            handleImageUpload({ target: { files: files } });
        }
    });
}

// 更新开始按钮状态
function updateReadButtonState() {
    const readButton = document.getElementById('readButton');
    const userQuestion = document.getElementById('userQuestion').value.trim();
    
    readButton.disabled = !uploadedImage || !userQuestion || isProcessing;
}

// 开始解读
async function startReading() {
    if (isProcessing) return;

    if (!tarotAI.isConfigured()) {
        alert('请先点击右下角设置按钮 ⚙️ 配置您的Gemini API密钥。');
        openSettingsModal();
        return;
    }
    
    isProcessing = true;
    updateUIForProcessing(true);
    
    try {
        const question = document.getElementById('userQuestion').value.trim();
        const spreadType = document.querySelector('input[name="spread"]:checked').value;
        
        showLoadingState();
        
        const reading = await tarotAI.readTarot(uploadedImage, question, spreadType);
        
        displayResult(reading);
        
    } catch (error) {
        console.error('解读失败:', error);
        showError(error.message || '抱歉，解读过程中出现了错误。请检查网络或API密钥后重试。');
    } finally {
        isProcessing = false;
        updateUIForProcessing(false);
    }
}

// 更新UI处理状态
function updateUIForProcessing(processing) {
    const readButton = document.getElementById('readButton');
    const btnText = readButton.querySelector('.btn-text');
    const loading = readButton.querySelector('.loading');
    
    readButton.disabled = processing;
    if (processing) {
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
    } else {
        btnText.style.display = 'inline-block';
        loading.style.display = 'none';
        updateReadButtonState();
    }
}

// 显示加载状态
function showLoadingState() {
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    
    resultSection.style.display = 'block';
    resultContent.innerHTML = `
        <div class="loading-animation">
            <div class="crystal-ball">🔮</div>
            <p>正在连接神秘力量，请稍候...</p>
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示结果
function displayResult(reading) {
    const resultContent = document.getElementById('resultContent');
    
    // 使用 pre-wrap 来保留换行和空格
    const formatText = (text) => {
        return text.replace(/\n/g, '<br>');
    }

    resultContent.innerHTML = `
        <div class="reading-result">
            <div class="cards-identified">
                <h4>识别到的塔罗牌</h4>
                <div class="cards-list">
                    ${reading.cards.map(card => `
                        <div class="card-item">
                            <strong>${card.name}</strong>
                            ${card.reversed ? ' (逆位)' : ' (正位)'}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="interpretation">
                <h4>解读分析</h4>
                <div class="interpretation-text">${formatText(reading.interpretation)}</div>
            </div>
            
            ${reading.advice ? `
                <div class="advice">
                    <h4>建议与指引</h4>
                    <div class="advice-text">${formatText(reading.advice)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// 显示错误
function showError(message) {
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <p>${message}</p>
            <button onclick="startReading()" class="retry-btn">重试</button>
        </div>
    `;
}

// 保存解读
function saveReading() {
    const resultContent = document.getElementById('resultContent').innerText;
    const question = document.getElementById('userQuestion').value;
    
    const readingData = {
        question: question,
        timestamp: new Date().toLocaleString('zh-CN'),
        result: resultContent
    };
    
    const blob = new Blob([JSON.stringify(readingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `塔罗解读_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('解读已保存！');
}

// 动态添加CSS样式
const additionalStyles = `
<style>
.loading-animation { text-align: center; padding: 40px; }
.crystal-ball { font-size: 4rem; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
.loading-dots span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ffd700; margin: 0 3px; animation: bounce 1.4s infinite ease-in-out both; }
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
.reading-result { line-height: 1.8; }
.reading-result h4 { color: #ffd700; margin: 20px 0 10px 0; font-size: 1.2rem; }
.cards-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.card-item { background: rgba(139, 92, 246, 0.2); padding: 8px 15px; border-radius: 20px; border: 1px solid #8b5cf6; }
.interpretation-text, .advice-text { background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 10px; border-left: 3px solid #ffd700; white-space: pre-wrap; }
.error-message { text-align: center; padding: 40px; }
.error-icon { font-size: 3rem; margin-bottom: 20px; }
.retry-btn { background: linear-gradient(45deg, #ff6b35, #ffd700); color: white; border: none; padding: 10px 25px; border-radius: 20px; cursor: pointer; margin-top: 15px; }
.dragover { border-color: #ffd700 !important; background: rgba(255, 215, 0, 0.2) !important; }
</style>
`;
document.head.insertAdjacentHTML('beforeend', additionalStyles);