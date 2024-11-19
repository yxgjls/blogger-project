import dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件中的环境变量

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
    const { BLOGGER_API_KEY, BLOGGER_BLOG_ID } = process.env;

    if (!BLOGGER_API_KEY || !BLOGGER_BLOG_ID) {
        return res.status(500).json({ error: 'Missing API key or Blog ID' });
    }

    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_BLOG_ID}/posts?key=${BLOGGER_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error); // 打印详细错误日志
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
