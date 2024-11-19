const fs = require('fs');
const path = require('path');
const express = require('express');
const { google } = require('googleapis');
const { marked } = require('marked');

const app = express();
const port = 3000;

// OAuth 2.0 设置
const SCOPES = ['https://www.googleapis.com/auth/blogger', 'https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// 检查令牌是否有效
async function checkToken() {
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);

        try {
            await oAuth2Client.getAccessToken();
            return true;
        } catch (error) {
            console.warn('Token is invalid or expired. Reauthorization required.');
            return false;
        }
    }
    return false;
}

// 启动授权流程
function startAuthorization(callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    app.get('/', async (req, res) => {
        const code = req.query.code;
        if (!code) {
            res.status(400).send('No code provided');
            return;
        }

        try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            // 保存令牌
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Token stored to', TOKEN_PATH);

            res.send('Authorization successful! You can close this tab.');

            // 执行授权后的回调
            if (callback) await callback();
        } catch (error) {
            console.error('Error retrieving access token:', error);
            res.status(500).send('Error retrieving access token');
        } finally {
            setTimeout(() => process.exit(0), 500);
        }
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// 包装网络请求，添加重试机制
async function withRetry(requestFn, options = { retries: 3, delay: 1000 }) {
    const { retries, delay } = options;
    let attempts = 0;

    while (attempts < retries) {
        try {
            return await requestFn();
        } catch (error) {
            attempts++;
            console.warn(`Attempt ${attempts} failed. Retrying in ${delay}ms...`, error.message);

            if (attempts >= retries) {
                console.error('All retry attempts failed.');
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

// 上传图片到 Google Drive
async function uploadImageToGoogleDrive(drive, imagePath, folderId) {
    const fileName = path.basename(imagePath);
    const fileData = fs.createReadStream(imagePath);

    const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
    };
    const media = { mimeType: 'image/*', body: fileData }; // 支持多种图片格式

    const response = await withRetry(() =>
        drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        })
    );

    const fileId = response.data.id;

    try {
        // 设置文件公开共享
        await withRetry(() =>
            drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            })
        );

        // 返回生成的 URL
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=s4000`;
    } catch (error) {
        console.error('Error setting file permissions:', error.message);
        throw error;
    }
}

// 替换 Markdown 中的本地图片路径
async function replaceLocalImages(markdownContent, drive, folderId, baseDir = '.') {
    const imageRegex = /!\[(.*?)\]\((.+?)\)/g;  // 修改正则表达式以捕获图片描述文本
    let match;
    const replacements = [];

    while ((match = imageRegex.exec(markdownContent)) !== null) {
        const altText = match[1];  // 获取图片描述文本
        const localPath = path.resolve(baseDir, match[2]);  // match[2] 现在是文件路径
        if (fs.existsSync(localPath)) {
            console.log('Uploading image:', localPath);
            const driveUrl = await uploadImageToGoogleDrive(drive, localPath, folderId);
            replacements.push({ 
                original: match[0],  // 保存完整的原始匹配文本
                altText,
                driveUrl 
            });
        } else {
            console.warn('Image not found:', localPath);
        }
    }

    // 替换本地路径为上传后的 URL，同时保留 alt 文本
    replacements.forEach(({ original, altText, driveUrl }) => {
        markdownContent = markdownContent.replace(
            original, 
            `<img src="${driveUrl}" alt="${altText}">`
        );
    });

    return markdownContent;
}

// 从 Markdown 文件获取标题并返回去除标题后的内容
function extractTitleAndContent(markdownContent) {
    const lines = markdownContent.split('\n');
    const firstLine = lines[0];
    const title = firstLine.replace(/^#+\s*/, '').trim(); // 去除 Markdown 标题符号
    
    // 找到第一个非空行的索引
    let contentStartIndex = 1;
    while (contentStartIndex < lines.length && !lines[contentStartIndex].trim()) {
        contentStartIndex++;
    }
    
    // 从第一个非空行开始截取内容
    const content = lines.slice(contentStartIndex).join('\n');
    
    return {
        title,
        content
    };
}

// 将文章发布到 Blogger 的草稿箱
async function publishDraftToBlogger(auth, markdownContent, labels = []) {
    const blogger = google.blogger({ version: 'v3', auth });
    const blogId = '613821936068239100'; // 替换为实际的博客 ID
    
    // 提取标题和内容
    const { title, content } = extractTitleAndContent(markdownContent);
    
    const htmlContent = marked(content, {
        breaks: true,
        gfm: true,
    }); // Markdown 转为 HTML

    try {
        const response = await withRetry(() =>
            blogger.posts.insert({
                blogId: blogId,
                isDraft: true,
                requestBody: {
                    title: title,
                    content: htmlContent,
                    labels: labels,
                },
            })
        );

        console.log('Post saved to draft successfully:');
        console.log('Title:', response.data.title);
        console.log('Labels:', response.data.labels);
        console.log('Generated URL:', response.data.url);
    } catch (error) {
        console.error('Error publishing draft:', error);
    }
}

// 主函数
(async () => {
    try {
        const tokenValid = await checkToken();
        const markdownPath = 'article.md'; // 替换为你的 Markdown 文件路径
        const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
        const labels = ['Draft', 'Markdown']; // 指定标签
        const folderId = '10qS3KSAdLMLbOw1vsrGvBoN_w0qNpaRQ'; // 替换为 Google Drive 文件夹 ID

        if (!tokenValid) {
            console.log('Token is invalid or missing. Starting authorization process...');
            startAuthorization(async () => {
                const drive = google.drive({ version: 'v3', auth: oAuth2Client });
                const updatedMarkdownContent = await replaceLocalImages(markdownContent, drive, folderId);
                await publishDraftToBlogger(oAuth2Client, updatedMarkdownContent, labels);
                console.log('Article published after authorization.');
            });
        } else {
            console.log('Token is valid. Proceeding to publish...');
            const drive = google.drive({ version: 'v3', auth: oAuth2Client });
            const updatedMarkdownContent = await replaceLocalImages(markdownContent, drive, folderId);
            await publishDraftToBlogger(oAuth2Client, updatedMarkdownContent, labels);
            console.log('Article published successfully.');
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();
