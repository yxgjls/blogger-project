import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件中的环境变量

export default async function handler(req, res) {
    const { BLOGGER_API_KEY, BLOGGER_BLOG_ID } = process.env;

    // 构建 Blogger API 请求 URL
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_BLOG_ID}/posts?key=${BLOGGER_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
