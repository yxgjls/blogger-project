fetch('https://blogger-project-vert.vercel.app/api?type=info')
    .then(response => response.json())
    .then(data => {
        console.log(data); // 在前端处理数据
    })
    .catch(error => console.error('Error:', error));




document.addEventListener('DOMContentLoaded', function() {
    // 查找首页中每篇文章的预览内容
    const postPreviews = document.querySelectorAll(".post-body.entry-content .real-post");
    postPreviews.forEach(function(preview) {
    const textContent = preview.textContent || preview.innerText || '';

    // Match all Latin words (English words)
    const latinWords = textContent.match(/\b\p{L}+\b/gu) || [];
    let wordCount = latinWords.length;

    // Process each character individually for other categories
    for (const char of textContent) {
    if (/[\u4e00-\u9fff]/.test(char)) {
    wordCount++;
    } else if (/[\u3040-\u30ff]/.test(char)) {
    wordCount++;
    } else if (/\d/.test(char)) {
    wordCount++;
    } else if (/[\u0250-\u02AF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF]/.test(char)) {
    wordCount++;
    } else if (/[\p{P}\p{S}]/u.test(char)) {
    wordCount++;
    }
    }    

    // 创建一个 span 容器元素用于放置字数和图标
    const wordCountContainer = document.createElement("span");
    wordCountContainer.className = "word-count-container"; // 添加容器的类

    // 创建字数统计的元素
    const wordCountElement = document.createElement("span");
    wordCountElement.className = "word-count";
    wordCountElement.innerText = wordCount + "字";

    // 创建 Font Awesome 图标元素
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa", "fa-bar-chart");
    iconElement.setAttribute("aria-hidden", "true"); // 保持无障碍兼容性

    // 将字数和图标添加到同一个容器中
    const space = document.createTextNode(" "); // 空格字符
    wordCountContainer.appendChild(iconElement);
    wordCountContainer.appendChild(space); // 添加空格
    wordCountContainer.appendChild(wordCountElement);

    const isPostPage = /^\/\d{4}\/\d{2}\/.+\.html$/.test(window.location.pathname);
    const isStaticPage = /^\/p\/.+\.html$/.test(window.location.pathname);

    // 创建一个 span 容器元素用于放置字数和图标
    const categoriesContainer = document.createElement("span");
    categoriesContainer.className = "categories-container"; // 添加容器的类

    const previousSiblingElement = preview.previousElementSibling;   
    const slug = formatSlug(previousSiblingElement.href)

    // 创建 Font Awesome 图标元素
    const iconElement2 = document.createElement("i");
    iconElement2.classList.add("fa-solid", "fa-box-archive");
    iconElement2.setAttribute("aria-hidden", "true"); // 保持无障碍兼容性    

    const tag = document.createElement("span");
    tag.className = "category-tag";
    tag.innerText = slug;

    // 将字数和图标添加到同一个容器中
    const space2 = document.createTextNode(" "); // 空格字符
    categoriesContainer.appendChild(iconElement2);
    categoriesContainer.appendChild(space2); // 添加空格
    categoriesContainer.appendChild(tag);      


    if (!isPostPage) {
    // 在首页运行的代码
    // 将容器插入到预览区域的合适位置

    if (!isStaticPage){
        preview.parentNode.nextElementSibling.children[0].appendChild(categoriesContainer);
        preview.parentNode.nextElementSibling.children[0].appendChild(wordCountContainer);
    } 
    
    } else {
    // 非主页运行的代码
    // 将容器插入到预览区域的合适位置
        preview.parentNode.previousElementSibling.children[0].appendChild(categoriesContainer);    

        preview.parentNode.previousElementSibling.children[0].appendChild(wordCountContainer);
    }    
  });
});
function formatSlug(url) {
    // 从 URL 中提取最后一部分
    const slug = decodeURIComponent(url.split("/").pop());

    // 去掉扩展名和最后的 -数字
    const baseSlug = slug.replace(/-\d+\.html$/, "");

    // 将连字符替换为斜杠
    const formattedSlug = baseSlug.replace(/-/g, "/");

    return formattedSlug;
}  





// 获取按钮元素
const backToTopBtn = document.getElementById('scrollToTop');

// 当用户向下滚动 300px 时显示按钮
window.onscroll = function() {
if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    backToTopBtn.classList.add("visible"); // 添加显示动画的类
} else {
    backToTopBtn.classList.remove("visible"); // 移除动画类
}
};

// 点击按钮时回到页面顶部
backToTopBtn.onclick = function() {
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
};



// 切换主题功能
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleTheme');

    // 初始化按钮状态
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        updateButton(true);
    }

    // 切换主题事件
    toggleButton.addEventListener('click', function () {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateButton(isDark);
    });

    // 更新按钮状态
    function updateButton(isDark) {
        const icon = document.querySelector('#toggleTheme i');
        const text = document.querySelector('#toggleTheme div');
        if (isDark) {
            icon.className = 'fa-regular fa-sun'; // 日间图标
            text.textContent = '日间';
        } else {
            icon.className = 'fa-regular fa-moon'; // 夜间图标
            text.textContent = '夜间';
        }
    }
});

// 订阅功能
document.getElementById('subscribeButton').onclick = function () {
    window.open('/feeds/posts/default', '_blank');
};

document.addEventListener('DOMContentLoaded', function() {
// 获取当前 URL 路径
var currentUrl = window.location.pathname;

// 获取所有 nav-item 的 li 标签
var navItems = document.querySelectorAll('li.nav-item');

// 判断当前 URL 并给对应的 li 标签添加 active 类
if (currentUrl === '/') {
    navItems[0].classList.add('active'); // 首页
} else if (currentUrl === '/p/about-me.html') {
    navItems[2].classList.add('active'); // 关于
}

// 为第二个 li&#65288;下载&#65289;和第四个 li&#65288;友链&#65289;添加下拉菜单的类
navItems[1].classList.add('dropdown');
navItems[3].classList.add('dropdown');

// 为下拉菜单项添加子菜单&#65288;此处仅为示例&#65292;可以根据需求修改&#65289;
navItems[1].innerHTML += `
 <ul class='dropdown-menu'>
   <li><a href='/downloads/item1'>下载项1</a></li>
   <li><a href='/downloads/item2'>下载项2</a></li>
 </ul>
`;
navItems[3].innerHTML += `
 <ul class='dropdown-menu'>
   <li><a href='/friends/item1'>友链项1</a></li>
   <li><a href='/friends/item2'>友链项2</a></li>
 </ul>
`;
});



   
