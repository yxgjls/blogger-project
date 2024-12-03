// 定义 API 基础 URL
const API_BASE_URL = 'https://blogger-project-vert.vercel.app/api';

// 延时函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 创建包含文本的数组
const texts = [
    '日常打卡更新中&#8230;&#8230;<br/>英语系列更新中&#8230;&#8230;<br/>翻译系列更新中&#8230;&#8230;',
];

/**
 * 获取博客基本信息
 */
async function fetchBlogInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}?type=info`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        // 博文数量
        document.getElementById('post-count').textContent = data.posts.totalItems;

        const times = calculateTime(data);
        //最后更新时间
        document.getElementById('last-update-time').textContent = times.updateTime;

        //运行时间
        document.getElementById('blog-run-time').textContent = times.runTime;

        document.getElementById('temp-load2').style.display = 'none';
    } catch (error) {
        console.error('Failed to fetch blog info:', error);
    }
}

/**
 * 获取博客文章的总内容（分批处理和延时请求）
 * @param {string} pageToken - 当前页的分页令牌
 * @param {Array} allPosts - 累积的文章列表
 * @param {number} delayMs - 每次请求的延时时间（毫秒）
 * @returns {Promise<Array>} 返回包含全部文章的数组
 */
async function fetchAllBlogPosts(pageToken = '', allPosts = [], delayMs = 1000) {
    try {
        let url = `${API_BASE_URL}?type=posts`;
        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Fetched ${data.items.length} posts on this page.`);

        // 将当前页的文章添加到累积数组
        allPosts.push(...data.items);

        // 如果有下一页，递归获取并设置延时
        if (data.nextPageToken) {
            await delay(delayMs); // 延时处理
            return await fetchAllBlogPosts(data.nextPageToken, allPosts, delayMs);
        } else {
            return allPosts; // 返回累积的所有文章
        }
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return allPosts; // 返回当前累积的文章，即使出错
    }
}

// 统计字符和单词的函数
function calculateStatistics(posts) {
    let totalCharCount = 0;
    let chineseCharCount = 0;
    let latinWordCount = 0;
    let hiraganaKatakanaCount = 0;
    let digitCount = 0;
    let ipaSymbolCount = 0;
    let punctuationCount = 0;

    posts.forEach(post => {
        if (post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            // 更新总字符计数
            totalCharCount += textContent.length;

            // 匹配拉丁单词（如英文单词）
            const latinWords = textContent.match(/\b\p{L}+\b/gu) || [];
            latinWordCount += latinWords.length;

            // 针对其他类别逐字符处理
            for (const char of textContent) {
                if (/[\u4e00-\u9fff]/.test(char)) {
                    chineseCharCount++;
                } else if (/[\u3040-\u30ff]/.test(char)) {
                    hiraganaKatakanaCount++;
                } else if (/\d/.test(char)) {
                    digitCount++;
                } else if (/[\u0250-\u02AF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF]/.test(char)) {
                    ipaSymbolCount++;
                } else if (/[\p{P}\p{S}]/u.test(char)) {
                    punctuationCount++;
                }
            }
        }
    });

    const totalCount = chineseCharCount + latinWordCount + hiraganaKatakanaCount + digitCount + ipaSymbolCount + punctuationCount;

    return {
        totalCharCount,
        totalCount,
        chineseCharCount,
        latinWordCount,
        hiraganaKatakanaCount,
        digitCount,
        ipaSymbolCount,
        punctuationCount
    };
}

// 计算时间
function calculateTime(posts) {
    const blogStartDate = new Date('2024-11-10T00:00:00'); // 实际博客开始日期
    const blogUpdateDate = new Date(posts.updated);
    const now = new Date();
    const runTime = Math.floor((now - blogStartDate) / (1000 * 60 * 60 * 24));
    const updateTime = Math.floor((now - blogUpdateDate) / (1000 * 60 * 60 * 24));
    return {
        runTime,
        updateTime
    };
}

// 随机选择文本函数
function displayRandomText() {
    // 随机索引
    const randomIndex = Math.floor(Math.random() * texts.length);
    // 将随机选择的文本放入 div 中
    document.getElementById('randomText').innerHTML = texts[randomIndex];
}

// 初始化加载
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogInfo();
    displayRandomText();
});

// 调用示例
document.addEventListener('DOMContentLoaded', async () => {
    const delayMs = 2000; // 设置每次请求之间的延时为 2 秒
    const allPosts = await fetchAllBlogPosts('', [], delayMs);
    console.log(`Total posts fetched: ${allPosts.length}`);

    const stats = calculateStatistics(allPosts);

    console.log('Statistics:', stats);

    // 显示统计结果
    document.getElementById('total-count').textContent = stats.totalCount;
    //document.getElementById('temp-load2').style.display = 'none';
    setTimeout(() => {
        document.getElementById('temp-load2').style.display = 'none';
    }, 1000); // 延迟 3000 毫秒（即 3 秒）

});