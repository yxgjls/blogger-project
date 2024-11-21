document.addEventListener('DOMContentLoaded', () => {

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 查询归档列表中的所有链接
    document.querySelectorAll('.post-count-link').forEach(link => {
        // 检查链接的 href 是否与当前 URL 相同
        if (link.href === currentUrl) {
            // 为匹配的链接所在的 li 添加 active 类
            link.classList.add('active');
        }
    });
});
