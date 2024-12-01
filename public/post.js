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

function setupFontModal() {
    const settingsButton = document.getElementById('settingsButton');
    const fontModal = document.getElementById('fontModal');
    const closeFontModal = document.getElementById('closeFontModal');
    const postBody = document.querySelector('.post-body.entry-content');
    const fontModalContent = document.querySelector('#fontModal .modal-content');

    function adjustFontSize(size) {
        if (size === 'small') {
            postBody.style.fontSize = '0.9em';
        } else if (size === 'medium') {
            postBody.style.fontSize = '1em';
        } else if (size === 'large') {
            postBody.style.fontSize = '1.1em';
        }
        fontModal.style.display = 'none';
    }
    function showModal(modalElement) {
        const targetRect = settingsButton.getBoundingClientRect();
        const targetLeft = targetRect.left;  // 目标元素的左边缘位置

        fontModalContent.style.right = `${window.innerWidth - targetLeft}px`;  // 计算与目标元素左侧的距离
        modalElement.style.display = 'block';
    }
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    settingsButton.addEventListener('click', () => showModal(fontModal));
    closeFontModal.addEventListener('click', () => closeModal(fontModal));

    document.getElementById('fontSmall').addEventListener('click', () => adjustFontSize('small'));
    document.getElementById('fontMedium').addEventListener('click', () => adjustFontSize('medium'));
    document.getElementById('fontLarge').addEventListener('click', () => adjustFontSize('large'));

    window.addEventListener('click', (event) => {
        if (event.target === fontModal) {
            fontModal.style.display = 'none';
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
        modalElement.style.display = 'block';
    }
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
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
            qrCodeModal.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupFontModal();
    setupQrCodeModal();

});
