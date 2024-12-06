// Generate Table of Contents (TOC)
function generateTOC() {
    const tocContainer = document.getElementById('toc');
    const headings = document.querySelectorAll('.post-body.entry-content h1, .post-body.entry-content h2, .post-body.entry-content h3, .post-body.entry-content h4');

    // Check if there are any headings
    if (headings.length === 0) {
        tocContainer.innerHTML = '<p>暂无目录</p>';
        return;
    }

    let tocContent = '<ul>';

    headings.forEach((heading, index) => {
        const anchorId = 'heading-' + index;
        heading.setAttribute('id', anchorId);

        const tocLevel = heading.tagName === 'H2' ? 1 : heading.tagName === 'H3' ? 2 : 3;

        tocContent += `<li><a href='#${anchorId}' id='Level${tocLevel}'>${heading.textContent}</a></li>`;
    });

    tocContent += '</ul>';
    tocContainer.innerHTML = tocContent;
}

// Highlight TOC link based on scroll position
function highlightSection() {
    const headings = document.querySelectorAll('.post-body.entry-content h1, .post-body.entry-content h2, .post-body.entry-content h3, .post-body.entry-content h4');
    const tocLinks = document.querySelectorAll('#toc a');

    let currentId = '';

    // Iterate over each heading to find the one currently in view
    headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        const nextHeading = headings[index + 1];
        const endOfSection = nextHeading ? nextHeading.getBoundingClientRect().top : document.documentElement.scrollHeight;

        // Check if the current heading and its section are fully in view window.innerHeight / 2
        if (!index && endOfSection > 100) {
            currentId = heading.id;
        }
        if (rect.top <= 100 && endOfSection > 100) {
            currentId = heading.id;
        }
    });

    // Update the 'active' class for the TOC link corresponding to the current section
    tocLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentId) {
            link.classList.add('active');
        }
    });
}

// Execute the functions
document.addEventListener('DOMContentLoaded', function () {
    generateTOC();
    // Set default highlight for the first TOC item
    const firstLink = document.querySelector('#toc a');
    if (firstLink) {
        firstLink.classList.add('active');
    }
    window.addEventListener('scroll', highlightSection);
});
function isSmallScreen1024() {
    return window.matchMedia('(max-width: 1024px)').matches;
}
function setupFontModal() {
    const settingsButton = document.getElementById('settingsButton');
    const fontModal = document.getElementById('fontModal');
    const closeFontModal = document.getElementById('closeFontModal');
    const postBody = document.querySelector('.post-body.entry-content');
    const fontModalContent = document.querySelector('#fontModal .modal-content');

    function adjustFontSize(size) {
        if (size === 'small') {
            postBody.style.fontSize = '18px';
        } else if (size === 'medium') {
            postBody.style.fontSize = '20px';
        } else if (size === 'large') {
            postBody.style.fontSize = '22px';
        }
        closeModal(fontModal);
    }
    function showModal(modalElement) {
        const targetRect = settingsButton.getBoundingClientRect();
        const targetLeft = targetRect.left;  // 目标元素的左边缘位置

        fontModalContent.style.right = `${window.innerWidth - targetLeft}px`;  // 计算与目标元素左侧的距离
        if (isSmallScreen1024()) {
            modalElement.style.visibility = 'visible';
        } else {
            modalElement.style.display = 'block';
        }
    }
    function closeModal(modalElement) {
        if (isSmallScreen1024()) {
            modalElement.style.visibility = 'hidden';
            fontModalContent.style.right = '-100%';
        } else {
            modalElement.style.display = 'none';
        }
    }

    settingsButton.addEventListener('click', () => showModal(fontModal));
    closeFontModal.addEventListener('click', () => closeModal(fontModal));

    document.getElementById('fontSmall').addEventListener('click', () => adjustFontSize('small'));
    document.getElementById('fontMedium').addEventListener('click', () => adjustFontSize('medium'));
    document.getElementById('fontLarge').addEventListener('click', () => adjustFontSize('large'));

    window.addEventListener('click', (event) => {
        if (event.target === fontModal) {
            if (isSmallScreen1024()) {
                fontModal.style.visibility = 'hidden';
                fontModalContent.style.right = '-100%';
            } else {
                fontModal.style.display = 'none';
            }
        }
    });
}

function setupQrCodeModal() {
    const qrCodeButton = document.getElementById('qrCodeButton');
    const qrCodeModal = document.getElementById('qrCodeModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const qrCodModalContent = document.querySelector('#qrCodeModal .modal-content');
    function showModal(modalElement) {
        const targetRect = qrCodeButton.getBoundingClientRect();
        const targetLeft = targetRect.left;  // 目标元素的左边缘位置

        qrCodModalContent.style.right = `${window.innerWidth - targetLeft}px`;  // 计算与目标元素左侧的距离
        if (isSmallScreen1024()) {
            modalElement.style.visibility = 'visible';
        } else {
            modalElement.style.display = 'block';
        }
    }
    function closeModal(modalElement) {
        if (isSmallScreen1024()) {
            modalElement.style.visibility = 'hidden';
            qrCodModalContent.style.right = '-100%';
        } else {
            modalElement.style.display = 'none';
        }
    }
    qrCodeButton.addEventListener('click', () => {
        qrCodeContainer.innerHTML = '';
        new QRCode(qrCodeContainer, {
            text: window.location.href,
            width: 150,
            height: 150
        });
        showModal(qrCodeModal)
    });

    closeQrModal.addEventListener('click', () => closeModal(qrCodeModal));

    window.addEventListener('click', (event) => {
        if (event.target === qrCodeModal) {
            //qrCodeModal.style.display = 'none';
            if (isSmallScreen1024()) {
                qrCodeModal.style.visibility = 'hidden';
                qrCodModalContent.style.right = '-100%';
            } else {
                qrCodeModal.style.display = 'none';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupFontModal();
    setupQrCodeModal();

});
document.addEventListener('DOMContentLoaded', function () {
    let isSmallScreen1024 = window.matchMedia('(max-width: 1024px)').matches;
    function reSet1024(event) {
        document.getElementById('qrCodeModal').removeAttribute('style');
        document.getElementById('fontModal').removeAttribute('style');
        document.querySelector('#fontModal .modal-content').removeAttribute('style');
        document.querySelector('#qrCodeModal .modal-content').removeAttribute('style');
        if (event.matches && !isSmallScreen1024) {
            // 切换到小屏幕
            isSmallScreen1024 = true;
        } else if (!event.matches && isSmallScreen1024) {
            // 切换到大屏幕  
            document.querySelector('.right-index').removeAttribute('style');
            document.querySelector('main .main-right').removeAttribute('style');
            if (document.getElementById('tocButton').classList.contains('active')) {
                document.getElementById('tocButton').classList.toggle('active');
            }

            isSmallScreen1024 = false;
        }
    }
    // 设置媒体查询
    const mediaQuery1024 = window.matchMedia('(max-width: 1024px)');
    // 添加监听器
    mediaQuery1024.addEventListener('change', reSet1024);
});
document.addEventListener('DOMContentLoaded', function () {
    // 获取元素引用
    const menuButton = document.getElementById('tocButton');
    const menuButtonclose = document.getElementById('toc-menu-close');
    const menuLeft = document.querySelector('main .main-right');
    const menuSection = document.querySelector('.right-index');



    // 添加点击事件监听器&#65306;菜单按钮
    menuButton.addEventListener('click', function (event) {
        event.preventDefault(); // 阻止默认行为&#65288;防止链接跳转&#65289;

        // 判断是否已有 active 类&#65292;执行相应的菜单开关操作
        if (menuButton.classList.contains('active')) {
            menuOff(); // 如果有 active 类&#65292;则关闭菜单
        } else {
            menuOn();  // 如果没有 active 类&#65292;则打开菜单
        }
    });

    // 添加点击事件监听器&#65306;关闭菜单按钮
    menuButtonclose.addEventListener('click', function (event) {
        menuOff(); // 关闭菜单
    });

    // 打开菜单的操作
    function menuOn() {
        menuButton.classList.toggle('active');  // 切换按钮的 active 状态
        menuLeft.style.visibility = 'visible';  // 设置菜单可见
        menuSection.style.right = '1rem';  // 菜单滑入屏幕
    }

    // 关闭菜单的操作
    function menuOff() {
        menuButton.classList.toggle('active');  // 切换按钮的 active 状态
        menuLeft.style.visibility = 'hidden';  // 隐藏菜单
        menuSection.style.right = '-100%';  // 菜单滑出屏幕
    }

    // 监听点击事件&#65292;若点击区域是 menuLeft&#65292;关闭菜单
    window.addEventListener('click', (event) => {
        console.log(event.target);
        if (event.target === menuLeft) {
            // 如果点击的是菜单区域本身&#65292;则关闭菜单
            menuButton.classList.toggle('active');  // 切换按钮的 active 状态
            menuLeft.style.visibility = 'hidden';  // 隐藏菜单
            menuSection.style.right = '-100%';  // 菜单滑出屏幕
        }
    });
}); 
