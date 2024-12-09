fetch('https://blogger-project-vert.vercel.app/api?type=info')
    .then(response => response.json())
    .then(data => {
        //console.log(data); // 在前端处理数据
    })
    .catch(error => console.error('Error:', error));




document.addEventListener('DOMContentLoaded', function () {
    // 查找首页中每篇文章的预览内容
    const postPreviews = document.querySelectorAll(".post-body.entry-content .real-post");
    postPreviews.forEach(function (preview) {
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

            if (!isStaticPage) {
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
window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.classList.add("visible"); // 添加显示动画的类
    } else {
        backToTopBtn.classList.remove("visible"); // 移除动画类
    }
};

// 点击按钮时回到页面顶部
backToTopBtn.onclick = function () {
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

document.addEventListener('DOMContentLoaded', function () {
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


document.addEventListener('DOMContentLoaded', function () {
    // 定义一个函数，当屏幕宽度小于等于1280时执行
    function initMenu() {
        // 获取元素引用
        const menuButton = document.getElementById('icon-menu-a');
        const menuButtonclose = document.getElementById('menu-close');
        const menuLeft = document.querySelector('main .main-left');
        const menuSection = document.getElementById('main-leftsection');

        // 添加点击事件监听器：菜单按钮
        menuButton.addEventListener('click', handleMenuButtonClick);

        // 添加点击事件监听器：关闭菜单按钮
        menuButtonclose.addEventListener('click', handleCloseMenuClick);

        // 打开菜单的操作
        function menuOn() {
            menuButton.classList.toggle('active');  // 切换按钮的 active 状态
            menuLeft.style.visibility = 'visible';  // 设置菜单可见
            menuSection.style.left = '1rem';  // 菜单滑入屏幕
        }

        // 关闭菜单的操作
        function menuOff() {
            menuButton.classList.toggle('active');  // 切换按钮的 active 状态
            menuLeft.style.visibility = 'hidden';  // 隐藏菜单
            menuSection.style.left = '-100%';  // 菜单滑出屏幕
        }

        // 监听点击事件，若点击区域是 menuLeft，则关闭菜单
        window.addEventListener('click', handleWindowClick);

        // 菜单按钮的点击事件处理函数
        function handleMenuButtonClick(event) {
            event.preventDefault(); // 阻止默认行为（防止链接跳转）

            // 判断是否已有 active 类，执行相应的菜单开关操作
            if (menuButton.classList.contains('active')) {
                menuOff(); // 如果有 active 类，则关闭菜单
            } else {
                menuOn();  // 如果没有 active 类，则打开菜单
            }
        }

        // 关闭菜单按钮的点击事件处理函数
        function handleCloseMenuClick(event) {
            menuOff(); // 关闭菜单
        }

        // 窗口点击事件处理函数
        function handleWindowClick(event) {
            if (event.target === menuLeft) {
                // 如果点击的是菜单区域本身，则关闭菜单
                menuButton.classList.toggle('active');  // 切换按钮的 active 状态
                menuLeft.style.visibility = 'hidden';  // 隐藏菜单
                menuSection.style.left = '-100%';  // 菜单滑出屏幕
            }
        }

        // 解除监听器的函数
        function removeEventListeners() {
            menuButton.removeEventListener('click', handleMenuButtonClick);
            menuButtonclose.removeEventListener('click', handleCloseMenuClick);
            window.removeEventListener('click', handleWindowClick);
        }

        // 返回解除事件监听器的方法
        return removeEventListeners;
    }

    // 使用 matchMedia 检测屏幕宽度
    const mediaQuery = window.matchMedia('(max-width: 1280px)');

    // 定义媒体查询匹配时的回调函数
    function handleMediaQueryChange(event) {
        if (event.matches) {
            // 屏幕宽度小于等于1280时初始化菜单
            if (!removeListeners) {
                removeListeners = initMenu();
            }
        } else {
            // 屏幕宽度大于1280时解除事件监听
            if (removeListeners) {
                removeListeners();
                removeListeners = null;
            }
        }
    }

    // 在页面加载时初始化菜单
    let removeListeners = null;

    // 初始化时立即检查屏幕宽度
    handleMediaQueryChange(mediaQuery);

    // 监听媒体查询变化
    mediaQuery.addEventListener('change', handleMediaQueryChange);
});


document.addEventListener('DOMContentLoaded', function () {
    let isSmallScreen1280 = window.matchMedia('(max-width: 1280px)').matches;

    function reSet1280(event) {
        if (event.matches && !isSmallScreen1280) {
            // 切换到小屏幕
            isSmallScreen1280 = true;
        } else if (!event.matches && isSmallScreen1280) {
            // 切换到大屏幕  
            document.getElementById('main-leftsection').removeAttribute('style');
            document.querySelector('main .main-left').removeAttribute('style');
            if (document.getElementById('icon-menu-a').classList.contains('active')) {
                document.getElementById('icon-menu-a').classList.toggle('active');
            }

            isSmallScreen1280 = false;
        }
    }
    // 设置媒体查询
    const mediaQuery1280 = window.matchMedia('(max-width: 1280px)');
    // 添加监听器
    mediaQuery1280.addEventListener('change', reSet1280);
});

document.addEventListener('DOMContentLoaded', function () {


    const mediaQuery1024 = window.matchMedia('(max-width: 1024px)');
    const mediaQuery768 = window.matchMedia('(max-width: 768px)');
    const mediaQuery576 = window.matchMedia('(max-width: 576px)');
    function updateButtonPosition() {

        if (mediaQuery576.matches) {

            const button = document.querySelector('.fixed-sidebar');
            //button.style.width = 'auto';
            //button.style.left = 'calc(100% - 2.8rem)';     
            button.removeAttribute('style');

        } else if (mediaQuery768.matches) {
            const button = document.querySelector('.fixed-sidebar');
            const element3 = document.querySelector('main .main-mid');
            const style = window.getComputedStyle(element3);
            const paddingRight = style.paddingRight;
            const buttonWidth = parseInt(paddingRight, 10);


            button.style.width = `${buttonWidth}px`
            button.style.left = `calc(100% - ${buttonWidth}px)`;

        } else if (mediaQuery1024.matches) {
            // 屏幕宽度大于768px且小于等于1024px
            const button = document.querySelector('.fixed-sidebar');
            const element3 = document.querySelector('main .main-mid');
            const style = window.getComputedStyle(element3);
            const paddingRight = style.paddingRight;
            const buttonWidth = parseInt(paddingRight, 10);


            button.style.width = `${buttonWidth}px`
            button.style.left = `calc(100% - ${buttonWidth}px)`;
            //console.log(button);
            //console.log(paddingRight);
            //console.log(buttonWidth);
            //console.log(button.style.left);
        } else {
            // 屏幕宽度大于1024px
            const button = document.querySelector('.fixed-sidebar');
            const element1 = document.getElementById('main-topsection');
            const element2 = document.getElementById('main-rightsection');
            // 获取两个元素的位置
            const rect1 = element1.getBoundingClientRect();
            const rect2 = element2.getBoundingClientRect();

            // 计算两个元素之间的间距&#65288;右边界 - 左边界&#65289;
            const gap = rect2.left - rect1.right;

            // 设置按钮的宽度&#65288;略小于间距&#65289;
            const buttonWidth = gap * 0.9; // 设置按钮宽度为间距的 90%

            // 设置按钮位置为中间
            const centerX = (rect1.right + rect2.left) / 2;

            // 更新按钮的宽度和位置
            button.style.width = `${buttonWidth}px`;
            button.style.left = `${centerX - buttonWidth / 2}px`;
            //console.log(button);
            //console.log(buttonWidth);
            //console.log(button.style.left);
        }

    }

    updateButtonPosition();
    window.addEventListener('resize', updateButtonPosition);
});

document.addEventListener('DOMContentLoaded', () => {
    // 定义一个函数来绑定事件
    function bindClickEvent(button, menu) {
        if (!button || !menu) return;

        // 定义点击事件的逻辑
        function toggleMenu() {
            // 监听内容变化并重新设置 max-height
            //console.log('监听');
            const observer = new MutationObserver(() => {
                if (menu.classList.contains('active')) {
                    menu.style.maxHeight = menu.scrollHeight + 'px';
                    //console.log('监听更改');
                }
                else {
                    //console.log('监听未更改');
                }
            });

            observer.observe(menu, { childList: true, subtree: true, attributes: true });

            // 切换展开/收起逻辑
            if (menu.classList.contains('active')) {
                // 收起菜单
                menu.style.maxHeight = menu.scrollHeight + 'px'; // 确保正确动画起点
                menu.offsetHeight; // 强制浏览器重绘
                menu.style.maxHeight = '0'; // 设置收起动画
                menu.style.opacity = '0'; // 设置透明度动画
                setTimeout(() => {
                    menu.classList.remove('active');
                    menu.style.maxHeight = ''; // 清空行内样式
                    menu.style.opacity = ''; // 恢复透明度样式
                    menu.style.visibility = 'hidden'; // 隐藏元素
                }, 300); // 等待动画结束
            } else {
                // 展开菜单
                menu.style.visibility = 'visible'; // 先显示
                menu.style.opacity = '0'; // 从透明开始
                menu.offsetHeight; // 强制浏览器重绘
                menu.style.maxHeight = menu.scrollHeight + 'px'; // 动态设置展开高度
                menu.style.opacity = '1'; // 设置透明度动画
                menu.classList.add('active'); // 标记为展开
            }
        }

        // 为按钮绑定点击事件
        button.addEventListener('click', toggleMenu);
    }

    // 定义一个函数来移除事件
    function unbindClickEvent(button) {
        if (button) {
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button); // 用克隆替换&#65292;移除所有绑定事件
        }
    }

    // 使用 matchMedia 监听媒体查询
    const mediaQuery = window.matchMedia('(max-width: 1280px)');

    // 定义一个函数来重置菜单样式
    function resetMenuStyle(menu) {
        if (menu) {
            menu.style.maxHeight = '';
            menu.style.opacity = '';
            menu.style.visibility = '';
            menu.classList.remove('active'); // 确保状态回归到初始
        }
    }

    // 修改 handleMediaChange 函数
    function handleMediaChange(e) {
        const button1 = document.querySelector('.category-url');
        const menu1 = document.getElementById('left-index');
        const button2 = document.querySelector('.category');
        const menu2 = document.getElementById('left-label');
        const button3 = document.querySelector('.archive');
        const menu3 = document.getElementById('left-archive');
        if (e.matches) {
            // 小屏幕&#65292;绑定事件
            bindClickEvent(button1, menu1);
            bindClickEvent(button2, menu2);
            bindClickEvent(button3, menu3);
        } else {
            // 大屏幕&#65292;移除事件并重置样式
            unbindClickEvent(button1);
            resetMenuStyle(menu1); // 这里清理小屏幕下的行内样式
            unbindClickEvent(button2);
            resetMenuStyle(menu2);
            unbindClickEvent(button3);
            resetMenuStyle(menu3);
        }
    }

    // 初始化时运行
    handleMediaChange(mediaQuery);

    // 监听媒体查询的变化
    mediaQuery.addEventListener('change', handleMediaChange);

});

document.getElementById('icon-menu-a').addEventListener('click', function (e) {
    // 添加波纹效果
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    // 获取按钮的相对位置
    const rect = this.getBoundingClientRect();
    const rippleX = e.clientX - rect.left; // 鼠标点击位置相对于按钮左上角的水平偏移
    const rippleY = e.clientY - rect.top;  // 鼠标点击位置相对于按钮左上角的垂直偏移
    ripple.style.left = `${rippleX - 50}px`; // 波纹居中
    ripple.style.top = `${rippleY - 50}px`;

    // 将波纹效果插入按钮内
    this.appendChild(ripple);

    // 动画结束后移除波纹
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });

    // 切换 active 类&#65292;显示点击后的样式
    //this.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.fixed-sidebar');
    const triggerBar = document.querySelector('.trigger-bar');
    const container = document.querySelector('.trigger-bar-wrapper');
    let isOpen = false;
    let isTouching = false;
    let startX = 0;

    // 点击悬浮条&#65292;轻微弹性动画
    triggerBar.addEventListener('click', () => {
        if (!isOpen) {
            triggerBar.classList.add('bounce');
            setTimeout(() => {
                triggerBar.classList.remove('bounce');
            }, 300); // 弹性动画时间
            openMenu();
        }
    });


    // 打开菜单
    function openMenu() {
        menu.classList.add('open');
        triggerBar.classList.add('hidden');
        isOpen = true;
    }

    // 关闭菜单
    function closeMenu() {
        menu.classList.remove('open');
        triggerBar.classList.remove('hidden');
        isOpen = false;
    }


    window.addEventListener('click', (event) => {
        if (event.target != menu && event.target != triggerBar) {
            closeMenu();
        }
    });
});


