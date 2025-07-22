# 🔮 神秘塔罗牌解读网站

一个基于AI的塔罗牌图像识别与解读网站，用户可以上传塔罗牌照片，获得AI智能解读。

## 项目特色

- 🎨 **神秘主题设计** - 星空背景、渐变色彩、动态效果
- 📸 **图片上传** - 支持拖拽上传、文件选择，最大10MB
- 🔮 **AI智能解读** - 使用GPT-4V进行图像识别和塔罗解读
- 🃏 **多种牌阵** - 支持单张牌、三张牌、凯尔特十字牌阵
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 💾 **结果保存** - 支持解读结果下载保存

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **AI服务**: OpenAI GPT-4 Vision API
- **部署**: 静态网站 (适合Vercel免费版)

## 快速开始

### 1. 获取OpenAI API密钥

1. 前往 [OpenAI官网](https://platform.openai.com/) 注册账号
2. 在API Keys页面创建新的API密钥
3. 复制保存您的API密钥

### 2. 配置API密钥

打开 `api/openai-client.js` 文件，将第8行的API密钥替换为您的密钥：

```javascript
this.apiKey = 'your-openai-api-key-here'; // 替换为您的实际API密钥
```

### 3. 本地运行

由于浏览器的CORS限制，建议使用本地服务器运行：

```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js (需要先安装 http-server)
npx http-server

# 或使用PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000/tarot-reading/`

## 部署到Vercel

### 方法一：通过Git仓库部署

1. 将项目推送到GitHub仓库
2. 在 [Vercel](https://vercel.com) 注册账号
3. 点击"New Project"并选择您的GitHub仓库
4. 设置构建配置：
   - Framework Preset: Other
   - Root Directory: `tarot-reading`
   - Build Command: 留空
   - Output Directory: 留空
5. 点击"Deploy"

### 方法二：直接上传文件

1. 在Vercel中选择"Import project"
2. 选择"Browse all projects"
3. 上传整个 `tarot-reading` 文件夹
4. 点击"Deploy"

### 环境变量配置（可选）

为了安全起见，您可以在Vercel中配置环境变量：

1. 在Vercel项目设置中添加环境变量：
   - Name: `OPENAI_API_KEY`
   - Value: 您的OpenAI API密钥
2. 修改 `api/openai-client.js` 来读取环境变量（需要后端支持）

## 文件结构

```
tarot-reading/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 主要JavaScript逻辑
├── api/
│   ├── openai-client.js    # OpenAI API客户端
│   └── system-prompt.md    # AI系统提示词
├── images/             # 图片资源目录
└── README.md          # 项目说明
```

## 使用说明

1. **上传照片**: 点击或拖拽上传您抽到的塔罗牌照片
2. **输入问题**: 在文本框中描述您想咨询的问题
3. **选择牌阵**: 根据需要选择单张牌、三张牌或凯尔特十字牌阵
4. **开始解读**: 点击"开始解读"按钮，AI将分析您的塔罗牌
5. **查看结果**: 获得详细的解读分析和人生建议
6. **保存结果**: 可以下载保存解读结果为JSON文件

## 费用说明

- **网站部署**: Vercel免费版可免费部署
- **AI解读**: 使用OpenAI API，按实际使用量计费
  - GPT-4V (gpt-4-vision-preview): 输入约$0.01/1K tokens，输出约$0.03/1K tokens
  - 平均一次解读消耗约500-1000 tokens，费用约$0.01-0.03

## 注意事项

⚠️ **重要提醒**:

1. **API密钥安全**: 请妥善保管您的OpenAI API密钥，不要在公开代码中暴露
2. **费用控制**: 建议在OpenAI控制台设置使用限额，避免意外产生高额费用
3. **网络环境**: 需要能够访问OpenAI API的网络环境
4. **仅供娱乐**: 本网站提供的解读仅供娱乐参考，请勿用于重大决策

## 自定义配置

### 修改AI提示词

编辑 `api/system-prompt.md` 文件来自定义AI的解读风格和行为。

### 调整样式

修改 `css/style.css` 文件来自定义网站的视觉效果。

### 添加新功能

在 `js/app.js` 中添加新的JavaScript功能。

## 常见问题

**Q: 提示"AI解读服务暂时不可用"怎么办？**
A: 检查API密钥是否正确配置，网络是否能访问OpenAI服务。

**Q: 图片上传后没有反应？**
A: 确保图片格式为JPG/PNG，大小不超过10MB。

**Q: 可以识别哪些塔罗牌？**
A: 理论上可以识别所有标准韦特塔罗牌，但建议使用清晰、光线充足的照片。

## 技术支持

如果遇到问题，可以：

1. 检查浏览器控制台的错误信息
2. 确认API密钥配置正确
3. 尝试使用不同的图片
4. 检查网络连接

## 许可证

MIT License - 可自由使用、修改和分发。

---

**免责声明**: 本网站提供的塔罗牌解读仅供娱乐和参考，不构成专业建议。请理性对待解读结果，重大决策请咨询专业人士。

🔮 愿塔罗的智慧为您指引前路！