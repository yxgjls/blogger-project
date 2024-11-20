// 定义 API 基础 URL
const API_BASE_URL = 'https://blogger-project-vert.vercel.app/api';

// 延时函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        // 处理数据，例如更新页面内容
        document.getElementById('post-count').textContent = data.posts.totalItems;
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

// 初始化加载
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogInfo();
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
    document.getElementById('temp-load2').style.display = 'none';
});