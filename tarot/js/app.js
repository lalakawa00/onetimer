// 全局变量
let uploadedImage = null;
let isProcessing = false;
let tarotAI = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 初始化OpenAI客户端
    tarotAI = new TarotAIClient();
    
    const fileInput = document.getElementById('tarotImage');
    const readButton = document.getElementById('readButton');
    
    // 检查API配置
    checkAPIConfiguration();
    
    // 文件上传事件
    fileInput.addEventListener('change', handleImageUpload);
    
    // 开始解读按钮
    readButton.addEventListener('click', startReading);
    
    // 拖拽上传
    setupDragAndDrop();
}

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 验证文件类型和大小
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
    const uploadArea = document.getElementById('uploadArea');
    const previewArea = document.getElementById('previewArea');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = imageSrc;
    uploadArea.style.display = 'none';
    previewArea.style.display = 'block';
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
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImage = e.target.result;
                    showPreview(uploadedImage);
                    updateReadButtonState();
                };
                reader.readAsDataURL(file);
            }
        }
    });
}

// 更新开始按钮状态
function updateReadButtonState() {
    const readButton = document.getElementById('readButton');
    const userQuestion = document.getElementById('userQuestion').value.trim();
    
    readButton.disabled = !uploadedImage || !userQuestion || isProcessing;
}

// 检查API配置
function checkAPIConfiguration() {
    if (!tarotAI.isConfigured()) {
        showAPIWarning();
    }
}

// 显示API配置警告
function showAPIWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'api-warning';
    warningDiv.style.cssText = `
        background: rgba(255, 193, 7, 0.2);
        border: 1px solid #ffc107;
        border-radius: 10px;
        padding: 15px;
        margin: 20px 0;
        color: #856404;
        text-align: center;
    `;
    warningDiv.innerHTML = `
        <h4>⚠️ API配置提醒</h4>
        <p>请在 config.js 文件中配置您的 OpenAI API 密钥才能使用AI解读功能</p>
        <p>当前将使用模拟数据进行演示</p>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(warningDiv, container.firstElementChild.nextElementSibling);
}

// 在DOM加载完成后监听问题输入
document.addEventListener('DOMContentLoaded', function() {
    const userQuestion = document.getElementById('userQuestion');
    if (userQuestion) {
        userQuestion.addEventListener('input', updateReadButtonState);
    }
});

// 开始解读
async function startReading() {
    if (isProcessing) return;
    
    isProcessing = true;
    updateUIForProcessing(true);
    
    try {
        const question = document.getElementById('userQuestion').value.trim();
        const spreadType = document.querySelector('input[name="spread"]:checked').value;
        
        // 显示加载状态
        showLoadingState();
        
        // 调用AI API
        const reading = await callAIAPI(uploadedImage, question, spreadType);
        
        // 显示结果
        displayResult(reading);
        
    } catch (error) {
        console.error('解读失败:', error);
        showError('抱歉，解读过程中出现了错误。请稍后再试。');
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
    
    if (processing) {
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        readButton.disabled = true;
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
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 调用AI API
async function callAIAPI(imageData, question, spreadType) {
    try {
        // 使用OpenAI客户端进行解读
        const reading = await tarotAI.readTarot(imageData, question, spreadType);
        return reading;
    } catch (error) {
        console.error('AI解读失败:', error);
        // 如果API调用失败，使用模拟数据
        console.warn('使用模拟数据:', error);
        return getMockReading(question, spreadType);
    }
}

// 显示结果
function displayResult(reading) {
    const resultContent = document.getElementById('resultContent');
    
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
                <div class="interpretation-text">${reading.interpretation}</div>
            </div>
            
            ${reading.advice ? `
                <div class="advice">
                    <h4>建议与指引</h4>
                    <div class="advice-text">${reading.advice}</div>
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
            <button onclick="retryReading()" class="retry-btn">重试</button>
        </div>
    `;
}

// 重试解读
function retryReading() {
    startReading();
}

// 保存解读
function saveReading() {
    const resultContent = document.getElementById('resultContent').innerHTML;
    const question = document.getElementById('userQuestion').value;
    
    const readingData = {
        question: question,
        timestamp: new Date().toLocaleString('zh-CN'),
        result: resultContent
    };
    
    // 创建下载链接
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

// 模拟数据（当API不可用时使用）
function getMockReading(question, spreadType) {
    const mockCards = {
        single: [
            { name: "愚者", reversed: false }
        ],
        three: [
            { name: "过去 - 倒吊人", reversed: false },
            { name: "现在 - 力量", reversed: false },
            { name: "未来 - 星星", reversed: false }
        ],
        celtic: [
            { name: "当前状况 - 魔术师", reversed: false },
            { name: "挑战 - 女祭司", reversed: true },
            { name: "过去 - 皇后", reversed: false },
            { name: "未来 - 皇帝", reversed: false },
            { name: "意识 - 教皇", reversed: false },
            { name: "潜意识 - 恋人", reversed: true },
            { name: "自我认知 - 战车", reversed: false },
            { name: "外部影响 - 力量", reversed: false },
            { name: "希望与恐惧 - 隐士", reversed: false },
            { name: "最终结果 - 命运之轮", reversed: false }
        ]
    };
    
    const mockInterpretations = {
        single: "愚者牌代表着新的开始和无限的可能性。这张牌鼓励你勇敢地踏出舒适区，拥抱未知的冒险。对于你的问题，它暗示着现在是一个适合尝试新事物、开启新旅程的时机。",
        three: "从过去到现在，你经历了从停滞到内在力量的觉醒。倒吊人代表过去的牺牲和等待，力量牌显示你现在拥有足够的内在力量去面对挑战。星星牌预示着未来充满希望，你的愿望将逐渐实现。",
        celtic: "魔术师显示你当前充满创造力和行动力，但女祭司逆位提醒你要注意直觉的缺失。皇后代表过去的美好时光，而皇帝预示未来将有稳定的结构出现。恋人逆位暗示潜意识中的选择困难，但命运之轮作为最终结果，表明一切都将朝着有利的方向发展。"
    };
    
    const mockAdvice = {
        single: "保持开放的心态，不要害怕犯错。愚者的智慧在于相信生命的旅程会带你到该去的地方。",
        three: "继续培养你的内在力量，保持耐心和希望。过去的等待即将结束，美好的未来正在向你走来。",
        celtic: "平衡你的理性与直觉，在做出重要决定时既要考虑逻辑也要倾听内心的声音。命运正在眷顾你。"
    };
    
    return {
        cards: mockCards[spreadType],
        interpretation: mockInterpretations[spreadType],
        advice: mockAdvice[spreadType]
    };
}

// 添加CSS样式（动态添加）
const additionalStyles = `
<style>
.loading-animation {
    text-align: center;
    padding: 40px;
}

.crystal-ball {
    font-size: 4rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
}

.loading-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffd700;
    margin: 0 3px;
    animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
    0%, 80%, 100% {
        transform: scale(0);
    } 40% {
        transform: scale(1);
    }
}

.reading-result {
    line-height: 1.8;
}

.reading-result h4 {
    color: #ffd700;
    margin: 20px 0 10px 0;
    font-size: 1.2rem;
}

.cards-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.card-item {
    background: rgba(139, 92, 246, 0.2);
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid #8b5cf6;
}

.interpretation-text, .advice-text {
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border-left: 3px solid #ffd700;
}

.error-message {
    text-align: center;
    padding: 40px;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.retry-btn {
    background: linear-gradient(45deg, #ff6b35, #ffd700);
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 15px;
}

.dragover {
    border-color: #ffd700 !important;
    background: rgba(255, 215, 0, 0.2) !important;
}
</style>
`;

// 添加样式到页面
document.head.insertAdjacentHTML('beforeend', additionalStyles);