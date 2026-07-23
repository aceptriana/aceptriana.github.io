const fs = require('fs');
const path = require('path');

const dir = __dirname;
const bloggerJsContent = `
// ==========================================
// KONFIGURASI BLOGGER API
// ==========================================
const BLOG_ID = '6139632383335306469';
const API_KEY = 'AIzaSyBmWGZ8t5ABU0H1IzpnLQGH9DO1WIsFshs';

function extractImageAndSnippet(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const img = tempDiv.querySelector('img');
    const imageUrl = img ? img.src : 'assets/img/project/defi.png';
    let snippet = tempDiv.textContent || tempDiv.innerText || "";
    snippet = snippet.trim().substring(0, 150) + '...';
    return { imageUrl, snippet };
}

async function loadBloggerPosts(options) {
    const { gridId, alertId, loadingId, maxResults = 9 } = options;
    const blogGrid = document.getElementById(gridId);
    const apiAlert = document.getElementById(alertId);
    const loading = document.getElementById(loadingId);
    
    if (!blogGrid) return;

    const dummyPosts = [
        { title: "Mengenal Lebih Dalam Red Hat Enterprise Linux (RHEL)", published: "2026-07-20T10:00:00Z", url: "#", content: "<div><img src='https://placehold.co/600x400/1C1929/A78BFA?text=RHEL+Guide'>Red Hat Enterprise Linux adalah distro Linux komersial yang dikembangkan oleh Red Hat. Sangat cocok untuk pasar korporasi...</div>" },
        { title: "Membangun Smart Contract Pertamamu dengan Solidity", published: "2026-07-15T14:30:00Z", url: "#", content: "<div><img src='https://placehold.co/600x400/1C1929/A78BFA?text=Solidity'>Dalam tutorial ini, kita akan membahas dasar-dasar bahasa pemrograman Solidity untuk membuat Smart Contract di Ethereum...</div>" },
        { title: "Optimasi SEO pada Aplikasi Single Page (SPA)", published: "2026-07-10T08:15:00Z", url: "#", content: "<div><img src='https://placehold.co/600x400/1C1929/A78BFA?text=SEO+Optimization'>Aplikasi Single Page seringkali bermasalah dengan SEO. Artikel ini membahas cara melakukan pre-rendering agar SEO tetap optimal...</div>" }
    ];

    function render(posts) {
        blogGrid.innerHTML = '';
        posts.forEach((post, index) => {
            const { imageUrl, snippet } = extractImageAndSnippet(post.content);
            const date = new Date(post.published).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const delay = index * 100;
            const card = \`
                <div class="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-primary/50 transition-all duration-500 flex flex-col h-full" data-aos="fade-up" data-aos-delay="\${delay}">
                    <div class="relative h-48 overflow-hidden">
                        <img src="\${imageUrl}" alt="\${post.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex items-center space-x-2 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                            <i data-lucide="calendar" class="w-3 h-3"></i>
                            <span>\${date}</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-primary transition-colors">
                            <a href="\${post.url}" target="_blank">\${post.title}</a>
                        </h3>
                        <p class="text-textSecondary text-sm mb-6 flex-grow line-clamp-3">\${snippet}</p>
                        <a href="\${post.url}" target="_blank" class="inline-flex items-center space-x-2 text-primary hover:text-primaryHover transition-colors text-sm font-medium mt-auto group-hover:translate-x-1 duration-300">
                            <span>Baca di Blogger</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
            \`;
            blogGrid.insertAdjacentHTML('beforeend', card);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (!BLOG_ID || !API_KEY) {
        if (apiAlert) apiAlert.classList.remove('hidden');
        render(dummyPosts.slice(0, maxResults));
        return;
    }

    if (loading) loading.classList.remove('hidden');
    try {
        const response = await fetch(\`https://www.googleapis.com/blogger/v3/blogs/\${BLOG_ID}/posts?key=\${API_KEY}&fetchImages=true&maxResults=\${maxResults}\`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            render(data.items);
        } else {
            blogGrid.innerHTML = '<p class="text-textSecondary text-center col-span-full">Belum ada artikel yang dipublikasikan.</p>';
        }
    } catch (error) {
        console.error('Error fetching Blogger API:', error);
        blogGrid.innerHTML = '<p class="text-red-400 text-center col-span-full">Gagal mengambil data dari Blogger API. Periksa koneksi atau API Key Anda.</p>';
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}
`;

fs.writeFileSync(path.join(dir, 'blogger.js'), bloggerJsContent);

// Modify artikel.html
let artikelHtml = fs.readFileSync(path.join(dir, 'artikel.html'), 'utf8');
artikelHtml = artikelHtml.replace(/<script>[\s\S]*?document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/, 
`<script src="blogger.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadBloggerPosts({
                gridId: 'blog-grid',
                alertId: 'api-alert',
                loadingId: 'loading',
                maxResults: 9
            });
        });
    </script>`);
fs.writeFileSync(path.join(dir, 'artikel.html'), artikelHtml);

// Modify index.html to add Artikel section
let indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const articleSection = `
        <section id="latest-articles" class="container mx-auto px-6 py-20" data-aos="fade-up">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h4 class="text-primary font-semibold tracking-wider text-sm uppercase mb-2">Artikel Terkini</h4>
                    <h2 class="text-3xl md:text-4xl font-bold text-white">Tulisan & Blog</h2>
                </div>
                <a href="artikel.html" class="inline-flex items-center space-x-2 text-textSecondary hover:text-white transition-colors glass-panel px-4 py-2 rounded-lg border border-white/10">
                    <span class="text-sm">Lihat Semua Artikel</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>

            <!-- Configuration Alert -->
            <div id="home-api-alert" class="hidden max-w-2xl mx-auto mb-12 glass-panel border border-yellow-500/50 p-6 rounded-2xl">
                <div class="flex items-start space-x-4">
                    <i data-lucide="alert-triangle" class="w-6 h-6 text-yellow-500 shrink-0 mt-1"></i>
                    <div>
                        <h3 class="text-yellow-500 font-bold mb-2">Blogger API Belum Dikonfigurasi</h3>
                        <p class="text-textSecondary text-sm">Silakan masukkan <strong>BLOG_ID</strong> dan <strong>API_KEY</strong> di file <code>blogger.js</code>.</p>
                    </div>
                </div>
            </div>

            <div id="home-blog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Posts will be injected here -->
            </div>
            
            <div id="home-blog-loading" class="flex justify-center items-center py-12 hidden">
                <i data-lucide="loader-2" class="w-8 h-8 text-primary animate-spin"></i>
            </div>
            
            <div class="mt-8 flex justify-center md:hidden">
                <a href="artikel.html" class="flex items-center space-x-2 text-textSecondary hover:text-white transition-colors glass-panel px-4 py-2 rounded-lg border border-white/10">
                    <span class="text-sm">Lihat Semua Artikel</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </section>
`;

// Insert the article section right before the final "Punya Proyek Menarik" section
if (!indexHtml.includes('id="latest-articles"')) {
    indexHtml = indexHtml.replace(/<section class="container mx-auto px-6 py-20"\s*data-aos="fade-up">\s*<div class="bg-gradient-to-r from-surface2/, \`\${articleSection}\n\n        <section class="container mx-auto px-6 py-20" data-aos="fade-up">\n            <div class="bg-gradient-to-r from-surface2\`);
}

if (!indexHtml.includes('blogger.js')) {
    indexHtml = indexHtml.replace('<script src="layout/load.js"></script>', 
    \`<script src="layout/load.js"></script>
    <script src="blogger.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            loadBloggerPosts({
                gridId: 'home-blog-grid',
                alertId: 'home-api-alert',
                loadingId: 'home-blog-loading',
                maxResults: 3
            });
        });
    </script>\`);
}

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
console.log('Refactored Blogger script and injected into index.html');
