
document.addEventListener("DOMContentLoaded", () => {
    // Inject Web3 Network Canvas Background
    const canvasHtml = `<canvas id="web3-network" class="fixed inset-0 w-full h-full z-[-1] opacity-60"></canvas>`;
    document.body.insertAdjacentHTML('afterbegin', canvasHtml);
    initWeb3Network();

    Promise.all([
        fetch('/layout/header.html').then(res => res.text()),
        fetch('/layout/footer.html').then(res => res.text())
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
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('.html')) currentPath = currentPath.replace('.html', '');
    if (currentPath === '/index' || currentPath === '') currentPath = '/';
    
    // Desktop Nav
    const desktopLinks = document.querySelectorAll('nav.hidden.md\\:flex a');
    desktopLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath.startsWith('/projects/') && link.getAttribute('href') === '/proyek') || (currentPath.startsWith('/services/') && link.getAttribute('href') === '/layanan') || (currentPath.startsWith('/articles/') && link.getAttribute('href') === '/artikel')) {
            link.className = 'text-white font-medium hover:text-primary transition-colors pb-1 border-b-2 border-primary';
        } else {
            link.className = 'text-textSecondary hover:text-white transition-colors';
        }
    });

    // Mobile Nav
    const mobileLinksList = document.querySelectorAll('#mobile-menu a:not([href="#contact"])');
    mobileLinksList.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath.startsWith('/projects/') && link.getAttribute('href') === '/proyek') || (currentPath.startsWith('/services/') && link.getAttribute('href') === '/layanan') || (currentPath.startsWith('/articles/') && link.getAttribute('href') === '/artikel')) {
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
            const iconImg = btn.querySelector('.wallet-icon');
            
            if (btn.classList.contains('connected')) return;

            // Loading state
            textSpan.textContent = 'Connecting...';
            // Replace with a simple SVG spinner by injecting an SVG next to it and hiding img
            iconImg.style.display = 'none';
            const spinner = document.createElement('div');
            spinner.className = 'w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent spinner-temp';
            btn.insertBefore(spinner, textSpan);
            
            setTimeout(() => {
                // Connected state
                btn.classList.add('connected');
                textSpan.textContent = '0x71C...9A23';
                
                // Remove spinner and show a checkmark or keep fox
                const tempSpinner = btn.querySelector('.spinner-temp');
                if (tempSpinner) tempSpinner.remove();
                
                iconImg.style.display = 'block';
                // Keep the original fox icon or change to something else
                // We'll keep the fox icon as requested

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

    // 8. Page Transitions
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            // Allow default for external links, anchor links, mailto, and javascript
            if (target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('#') || target.startsWith('javascript') || link.target === '_blank') return;
            
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = target;
            }, 400); // matches the 0.4s CSS transition
        });
    });

    // Fix for Back-Forward Cache (BFCache) keeping fade-out class
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('fade-out');
    });

    // 9. Load Web3 Connect Script
    const web3Script = document.createElement('script');
    web3Script.src = "/assets/js/web3-connect.js";
    document.body.appendChild(web3Script);

    // 10. Init Crypto Ticker
    initCryptoTicker();
}

async function initCryptoTicker() {
    const tickerEl = document.getElementById('crypto-ticker');
    if (!tickerEl) return;
    
    try {
        // Fetch top crypto pairs from Binance API
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","ADAUSDT","DOGEUSDT"]');
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            let tickerHtml = '';
            // Duplicate the items a few times for a smooth infinite marquee loop
            for (let i = 0; i < 3; i++) {
                data.forEach(coin => {
                    const symbol = coin.symbol.replace('USDT', '');
                    const price = parseFloat(coin.lastPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    const change = parseFloat(coin.priceChangePercent);
                    const isUp = change >= 0;
                    const colorClass = isUp ? 'text-green-400' : 'text-red-400';
                    const icon = isUp ? '▲' : '▼';
                    
                    tickerHtml += `
                        <div class="flex items-center space-x-2 mx-6 text-xs font-mono font-medium">
                            <span class="text-white">${symbol}</span>
                            <span class="text-textSecondary">${price}</span>
                            <span class="${colorClass}">${icon} ${Math.abs(change).toFixed(2)}%</span>
                        </div>
                    `;
                });
            }
            tickerEl.innerHTML = tickerHtml;
        }
    } catch (error) {
        console.error('Failed to load crypto ticker', error);
        tickerEl.innerHTML = '<span class="text-xs text-textSecondary mx-4">Ticker unavailable</span>';
    }
}

function initWeb3Network() {
    const canvas = document.getElementById('web3-network');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Mouse properties
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.baseColor = '#A78BFA';
        }
        
        update() {
            if (this.x > width || this.x < 0) this.vx = -this.vx;
            if (this.y > height || this.y < 0) this.vy = -this.vy;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Slight push away from mouse
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 1.5;
                    this.y -= (dy / distance) * force * 1.5;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        let numParticles = (width * height) / 15000;
        if (numParticles > 100) numParticles = 100; // cap max particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(167, 139, 250, ${1 - distance/120})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    resize();
    animate();
}
