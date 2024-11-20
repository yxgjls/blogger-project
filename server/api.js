import dotenv from 'dotenv';

dotenv.config(); // 加载 .env 文件中的环境变量

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const CACHE_DURATION = 300000; // 5分钟缓存时间
let cachedInfo = null; // 用于存储博客基本信息的缓存数据
let lastFetchTimeInfo = 0; // 基本信息缓存时间戳

export default async function handler(req, res) {
    const allowedOrigins = ['https://yxgjls.blogspot.com', 'https://blogger-project-vert.vercel.app'];

    // 获取请求的来源
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        return res.status(403).json({ error: 'Forbidden: Invalid request origin' });
    }

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    // 仅允许 GET 方法
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { BLOGGER_API_KEY, BLOGGER_BLOG_ID } = process.env;

    if (!BLOGGER_API_KEY || !BLOGGER_BLOG_ID) {
        return res.status(500).json({ error: 'Missing API key or Blog ID' });
    }

    // 获取请求类型
    const { type, pageToken } = req.query;

    try {
        if (type === 'info') {
            // 请求博客基本信息
            if (cachedInfo && Date.now() - lastFetchTimeInfo < CACHE_DURATION) {
                return res.status(200).json(cachedInfo); // 返回缓存数据
            }

            const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_BLOG_ID}?key=${BLOGGER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            // 更新缓存
            cachedInfo = data;
            lastFetchTimeInfo = Date.now();

            return res.status(200).json(data);
        } else if (type === 'posts') {
            // 请求博客文章列表
            let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_BLOG_ID}/posts?key=${BLOGGER_API_KEY}`;
            if (pageToken) {
                url += `&pageToken=${pageToken}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            return res.status(200).json(data);
        } else {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
}
