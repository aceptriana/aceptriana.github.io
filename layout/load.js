
document.addEventListener("DOMContentLoaded", () => {
    // Inject Background Blobs
    const blobs = `
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
    `;
    document.body.insertAdjacentHTML('afterbegin', blobs);

    Promise.all([
        fetch('layout/header.html').then(res => res.text()),
        fetch('layout/footer.html').then(res => res.text())
    ]).then(([headerHtml, footerHtml]) => {
        const headerEl = document.getElementById('header-placeholder');
        if (headerEl) headerEl.outerHTML = headerHtml;

        const footerEl = document.getElementById('footer-placeholder');
        if (footerEl) footerEl.outerHTML = footerHtml;

        initScripts();
    });
});

function initScripts() {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50 });
    } else {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
        script.onload = () => {
            AOS.init({ duration: 800, once: true, offset: 50 });
        };
        document.body.appendChild(script);
    }

    // 3. Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('bg-background/90', 'shadow-lg', 'backdrop-blur-lg');
                header.classList.remove('glass-panel');
            } else {
                header.classList.remove('bg-background/90', 'shadow-lg', 'backdrop-blur-lg');
                header.classList.add('glass-panel');
            }
        });
    }

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // 5. Active Nav Link Logic
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop Nav
    const desktopLinks = document.querySelectorAll('nav.hidden.md\\:flex a');
    desktopLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.className = 'text-white font-medium hover:text-primary transition-colors pb-1 border-b-2 border-primary';
        } else {
            link.className = 'text-textSecondary hover:text-white transition-colors';
        }
    });

    // Mobile Nav
    const mobileLinksList = document.querySelectorAll('#mobile-menu a:not([href="#contact"])');
    mobileLinksList.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.className = 'text-white font-medium hover:text-primary transition-colors';
        } else {
            link.className = 'text-textSecondary hover:text-white transition-colors';
        }
    });

    // 6. Set Current Year dynamically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 7. Web3 Connect Logic
    const connectBtns = document.querySelectorAll('.btn-connect-wallet');
    const toast = document.getElementById('web3-toast');
    
    connectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textSpan = btn.querySelector('.wallet-text');
            const iconSvg = btn.querySelector('.wallet-icon');
            
            if (btn.classList.contains('connected')) return;

            // Loading state
            textSpan.textContent = 'Connecting...';
            iconSvg.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4 31.4" class="animate-spin"></circle>';
            
            setTimeout(() => {
                // Connected state
                btn.classList.add('connected');
                textSpan.textContent = '0x71C...9A23';
                iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
                btn.classList.replace('from-orange-500', 'from-green-500');
                btn.classList.replace('to-amber-500', 'to-emerald-500');
                btn.classList.replace('hover:from-orange-600', 'hover:from-green-600');
                btn.classList.replace('hover:to-amber-600', 'hover:to-emerald-600');
                btn.classList.replace('shadow-orange-500/25', 'shadow-green-500/25');
                btn.classList.replace('border-orange-400/30', 'border-green-400/30');

                // Show toast
                if (toast) {
                    toast.classList.remove('translate-x-[150%]', 'opacity-0');
                    toast.classList.add('translate-x-0', 'opacity-100');
                    
                    setTimeout(() => {
                        toast.classList.remove('translate-x-0', 'opacity-100');
                        toast.classList.add('translate-x-[150%]', 'opacity-0');
                    }, 4000);
                }

                // Fire Confetti
                if (typeof confetti === 'undefined') {
                    const script = document.createElement('script');
                    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
                    script.onload = () => {
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                    };
                    document.body.appendChild(script);
                } else {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }, 1500);
        });
    });
}
