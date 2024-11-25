function fetchData() {
    const baseUrl = '/feeds/posts/summary?alt=json';
    let allEntries = []; // 用于存储所有博文
    let nextUrl = baseUrl; // 起始 URL

    function fetchNextPage(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const entries = data.feed.entry || [];
                allEntries = allEntries.concat(entries); // 将当前页数据合并到总数据中

                // 检查是否有下一页
                const nextLink = data.feed.link.find(link => link.rel === 'next');
                if (nextLink) {
                    nextUrl = nextLink.href; // 获取下一页的链接
                    fetchNextPage(nextUrl); // 递归获取下一页数据
                } else {
                    // 所有页面数据抓取完毕，处理数据
                    handleData({ feed: { entry: allEntries } });
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchNextPage(nextUrl); // 开始抓取第一页
}

function handleData(data) {
    const categories = {};
    const entries = data.feed.entry || [];
    const currentPageUrl = window.location.href;
    const blogPosts = [];
    let currentPrefix = null;
    let currentNumber = null;

    entries.forEach(entry => {
        const url = entry.link.find(link => link.rel === 'alternate').href;
        const title = entry.title.$t;

        const slug = decodeURIComponent(url.split('/').pop());
        const levels = slug.split('-');

        const numberMatch = parseInt(levels.pop(), 10);
        const prefix = levels.join('-');

        if (url === currentPageUrl) {
            currentPrefix = prefix;
            currentNumber = numberMatch;
        }

        if (!isNaN(numberMatch)) {
            blogPosts.push({ url, title, prefix, number: numberMatch });
        }

        let currentLevel = categories;
        levels.forEach(level => {
            if (!currentLevel[level]) {
                currentLevel[level] = { _postCount: 0 };
            }
            currentLevel = currentLevel[level];
        });

        if (!currentLevel._posts) currentLevel._posts = [];
        currentLevel._posts.push({ url, title, order: numberMatch });

        // 更新各层级的 _postCount
        let updateLevel = categories;
        levels.forEach(level => {
            updateLevel[level]._postCount = (updateLevel[level]._postCount || 0) + 1;
            updateLevel = updateLevel[level];
        });
    });

    const filteredPosts = blogPosts
        .filter(post => post.prefix === currentPrefix)
        .sort((a, b) => a.number - b.number);

    generateNavigationButtons(filteredPosts, currentPageUrl, currentNumber);
    generateCategoryList(categories, currentPageUrl);
    document.getElementById('temp-load').style.display = 'none';
}

function generateNavigationButtons(filteredPosts, currentPageUrl, currentNumber) {
    const currentIndex = filteredPosts.findIndex(post => post.url === currentPageUrl);
    if (currentIndex === -1) return;

    const previousPost = filteredPosts[currentIndex - 1];
    const nextPost = filteredPosts[currentIndex + 1];

    const prevButton = document.getElementById('prevPost');
    const nextButton = document.getElementById('nextPost');

    if (previousPost) {
        prevButton.classList.add('visible');

        prevButton.href = previousPost.url;

        prevButton.title = `上一篇:${previousPost.title}`;
    } else {
        prevButton.classList.remove('visible');

    }

    if (nextPost) {
        nextButton.classList.add('visible');

        nextButton.href = nextPost.url;
        nextButton.title = `下一篇:${nextPost.title}`;
    } else {
        nextButton.classList.remove('visible');

    }
}

function generateCategoryList(categories, currentPageUrl, parentElement = document.getElementById('category-list')) {
    for (const category in categories) {
        if (category === '_posts' || category === '_postCount') continue;

        const li = document.createElement('li');
        li.style.listStyleType = 'none';
        li.style.cursor = 'pointer';

        // 包裹标题和箭头的容器
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.alignItems = 'center';
        flexContainer.style.justifyContent = 'space-between';
        flexContainer.style.padding = '5px'; // 可选：调整行间距和视觉效果

        const link = document.createElement('span'); // 标题
        link.textContent = `${category} (${categories[category]._postCount})`;

        const arrowSpan = document.createElement('span'); // 箭头
        arrowSpan.textContent = '\u25BC'; // 默认向下箭头
        arrowSpan.style.transition = 'transform 0.2s'; // 平滑翻转效果

        const sublist = document.createElement('ul');
        sublist.style.display = 'none';
        sublist.style.marginLeft = '20px'; // 内缩显示子目录

        const toggleDisplay = function () {
            const isExpanded = sublist.style.display === 'block';
            sublist.style.display = isExpanded ? 'none' : 'block';
            arrowSpan.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)'; // 翻转箭头
        };

        // 整行点击事件绑定到 flexContainer
        flexContainer.onclick = toggleDisplay;

        // 自动展开当前文章所在的目录
        if (containsCurrentUrl(categories[category], currentPageUrl)) {
            sublist.style.display = 'block';
            arrowSpan.style.transform = 'rotate(180deg)';
        }

        // 构建 li 的子元素
        flexContainer.appendChild(link);
        flexContainer.appendChild(arrowSpan);
        li.appendChild(flexContainer); // flexContainer 放入 li 中
        li.appendChild(sublist); // 子目录 ul 放在 flexContainer 之外

        // 递归生成子目录
        generateCategoryList(categories[category], currentPageUrl, sublist);

        // 将 li 添加到父元素
        parentElement.appendChild(li);
    }

    if (categories._posts) {
        const sortedPosts = categories._posts.sort((a, b) => a.order - b.order);
        sortedPosts.forEach(post => {
            const postLi = document.createElement('li');
            postLi.style.listStyleType = 'none';
            const postLink = document.createElement('a');
            postLink.href = post.url;
            postLink.textContent = post.title;

            if (post.url === currentPageUrl) {
                postLink.id = 'active';
                expandParentElements(postLi);
            }

            postLi.appendChild(postLink);
            parentElement.appendChild(postLi);
        });
    }
}


function containsCurrentUrl(category, currentPageUrl) {
    if (category._posts) {
        return category._posts.some(post => post.url === currentPageUrl);
    }
    return Object.values(category).some(subcategory => typeof subcategory === 'object' && containsCurrentUrl(subcategory, currentPageUrl));
}


// 展开父级元素
function expandParentElements(element) {
    if (element.parentElement && element.parentElement.tagName === 'UL') {
        element.parentElement.style.display = 'block';
        const parentLi = element.parentElement.parentElement;
        if (parentLi && parentLi.querySelector('span')) {
            parentLi.querySelector('span').textContent = '\u25BC\u00A0 ';
        }
        expandParentElements(parentLi);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});