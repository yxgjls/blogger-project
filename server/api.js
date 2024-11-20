import dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件中的环境变量

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
    const allowedOrigins = ['https://yxgjls.blogspot.com', 'https://blogger-project-vert.vercel.app'];

    // 获取请求的来源
    const origin = req.headers.origin;

    // 检查来源是否被允许
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        return res.status(403).json({ error: 'Forbidden: Invalid request origin' });
    }

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end(); // 直接返回空响应
    }

    // 仅允许 GET 方法
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

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
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
