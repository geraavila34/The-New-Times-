// Datos iniciales de ejemplo
let articles = JSON.parse(localStorage.getItem('articles')) || [
    {
        id: 1,
        title: "Revolución tecnológica: IA transforma la industria",
        subtitle: "La inteligencia artificial está cambiando el periodismo",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        category: "tecnologia",
        author: "María García",
        image: "https://picsum.photos/800/400?random=1",
        date: "2024-12-20",
        isBreakingNews: false,
        isFeatured: true,
        views: 150,
        attachments: []
    },
    {
        id: 2,
        title: "Acuerdo histórico sobre cambio climático",
        subtitle: "200 países firman el pacto más ambicioso",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        category: "politica",
        author: "Carlos Ruiz",
        image: "https://picsum.photos/800/400?random=2",
        date: "2024-12-19",
        isBreakingNews: true,
        isFeatured: false,
        views: 230,
        attachments: []
    },
    {
        id: 3,
        title: "Nuevo récord en la bolsa de valores",
        subtitle: "Los mercados alcanzan máximos históricos",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        category: "economia",
        author: "Ana López",
        image: "https://picsum.photos/800/400?random=3",
        date: "2024-12-18",
        isBreakingNews: false,
        isFeatured: false,
        views: 89,
        attachments: []
    }
];

function saveArticles() {
    localStorage.setItem('articles', JSON.stringify(articles));
}

// Fecha actual
document.addEventListener('DOMContentLoaded', function() {
    const date = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = date;
    
    displayBreakingNews();
    displayFeaturedArticle();
    displayArticles('all');
});

// Breaking News
function displayBreakingNews() {
    const breaking = articles.filter(a => a.isBreakingNews);
    const div = document.getElementById('breakingNews');
    if (breaking.length > 0) {
        div.style.display = 'block';
        document.getElementById('breakingContent').textContent = 
            breaking.map(a => a.title).join(' • ');
    }
}

// Artículo destacado
function displayFeaturedArticle() {
    const featured = articles.find(a => a.isFeatured) || articles[0];
    if (!featured) return;
    
    document.getElementById('featuredArticle').innerHTML = `
        <div class="featured-card" onclick="openArticle(${featured.id})">
            <img src="${featured.image || 'https://picsum.photos/800/400'}" alt="${featured.title}">
            <div class="featured-info">
                <span class="category">${featured.category}</span>
                <h2>${featured.title}</h2>
                <p>${featured.subtitle}</p>
            </div>
        </div>
    `;
}

// Mostrar artículos
function displayArticles(category) {
    let filtered = category === 'all' ? articles : articles.filter(a => a.category === category);
    filtered = filtered.filter(a => !a.isFeatured);
    
    const grid = document.getElementById('articlesGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:50px;">No hay artículos en esta categoría</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(article => `
        <article class="article-card" onclick="openArticle(${article.id})">
            <img src="${article.image || 'https://picsum.photos/400/300'}" alt="${article.title}">
            <div class="card-content">
                <span class="category">${article.category}</span>
                <h3>${article.title}</h3>
                <p>${article.subtitle || ''}</p>
                <div class="meta">
                    <span>${article.author}</span> • 
                    <span>${formatDate(article.date)}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Abrir artículo
function openArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    article.views = (article.views || 0) + 1;
    saveArticles();
    
    document.getElementById('modalBody').innerHTML = `
        <span class="category" style="display:inline-block; background:#e94560; color:white; padding:5px 15px; border-radius:20px; font-size:0.8em; margin-bottom:15px;">${article.category}</span>
        <h1>${article.title}</h1>
        <p style="color:#666; margin:10px 0;">Por <strong>${article.author}</strong> • ${formatDate(article.date)}</p>
        ${article.image ? `<img src="${article.image}" style="width:100%; border-radius:10px; margin:20px 0;">` : ''}
        <div style="font-size:1.1em; line-height:1.8;">${article.content}</div>
        ${article.attachments && article.attachments.length > 0 ? `
            <div style="margin-top:30px; padding:20px; background:#f5f5f5; border-radius:10px;">
                <h3>📎 Archivos adjuntos</h3>
                ${article.attachments.map(att => `
                    <a href="${att.url}" download style="display:block; margin:5px 0; color:#e94560;">📄 ${att.name}</a>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    document.getElementById('articleModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('articleModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function filterCategory(category) {
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
    displayFeaturedArticle();
    displayArticles(category);
}

function toggleSearch() {
    const bar = document.getElementById('searchBar');
    bar.style.display = bar.style.display === 'none' ? 'block' : 'none';
}

function searchArticles() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.content.toLowerCase().includes(query)
    );
    
    const grid = document.getElementById('articlesGrid');
    document.getElementById('featuredArticle').innerHTML = '';
    
    grid.innerHTML = filtered.map(article => `
        <article class="article-card" onclick="openArticle(${article.id})">
            <img src="${article.image || 'https://picsum.photos/400/300'}" alt="${article.title}">
            <div class="card-content">
                <span class="category">${article.category}</span>
                <h3>${article.title}</h3>
                <div class="meta">${article.author} • ${formatDate(article.date)}</div>
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
}

// Cerrar modal con Escape o clic fuera
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.getElementById('articleModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('articleModal')) closeModal();
});

saveArticles();