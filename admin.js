// Verificar login
function checkAuth() {
    const logged = localStorage.getItem('adminLoggedIn');
    if (!logged) {
        const password = prompt('🔐 Ingrese la contraseña de administrador:');
        if (password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            alert('❌ Contraseña incorrecta');
            window.location.href = 'index.html';
        }
    }
}

function getArticles() {
    return JSON.parse(localStorage.getItem('articles')) || [];
}

function saveArticles(articles) {
    localStorage.setItem('articles', JSON.stringify(articles));
}

function showSection(name) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-sidebar nav a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(name).classList.add('active');
    event.target.classList.add('active');
    
    if (name === 'dashboard') loadDashboard();
    if (name === 'manageArticles') loadTable();
}

function loadDashboard() {
    const articles = getArticles();
    document.getElementById('totalArticles').textContent = articles.length;
    document.getElementById('totalViews').textContent = articles.reduce((sum, a) => sum + (a.views || 0), 0);
}

function saveArticle(event) {
    event.preventDefault();
    
    const articles = getArticles();
    const article = {
        id: Date.now(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        author: document.getElementById('author').value || 'Redacción',
        subtitle: document.getElementById('subtitle').value,
        content: document.getElementById('content').value,
        date: new Date().toISOString().split('T')[0],
        isBreakingNews: document.getElementById('isBreakingNews').checked,
        isFeatured: document.getElementById('isFeatured').checked,
        views: 0,
        attachments: window.currentAttachments || []
    };
    
    // Manejar imagen
    const imageFile = document.getElementById('mainImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            article.image = e.target.result;
            articles.unshift(article);
            saveArticles(articles);
            alert('✅ Artículo publicado exitosamente!');
            document.getElementById('articleForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            loadDashboard();
        };
        reader.readAsDataURL(imageFile);
    } else {
        article.image = 'https://picsum.photos/800/400?random=' + Date.now();
        articles.unshift(article);
        saveArticles(articles);
        alert('✅ Artículo publicado exitosamente!');
        document.getElementById('articleForm').reset();
        loadDashboard();
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Adjuntos
window.currentAttachments = [];

function handleAttachments(event) {
    const files = event.target.files;
    const list = document.getElementById('attachmentsList');
    window.currentAttachments = [];
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            window.currentAttachments.push({
                name: file.name,
                url: e.target.result
            });
            
            const div = document.createElement('div');
            div.textContent = '📎 ' + file.name;
            div.style.cssText = 'padding:5px; background:#f5f5f5; margin:5px 0; border-radius:5px;';
            list.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
}

function loadTable() {
    const articles = getArticles();
    document.getElementById('articlesTableBody').innerHTML = articles.map(a => `
        <tr>
            <td>${a.title}</td>
            <td>${a.category}</td>
            <td>${a.date}</td>
            <td class="action-btns">
                <button class="btn-view" onclick="viewArticle(${a.id})">Ver</button>
                <button class="btn-delete" onclick="deleteArticle(${a.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function viewArticle(id) {
    window.open('index.html', '_blank');
}

function deleteArticle(id) {
    if (confirm('¿Eliminar este artículo?')) {
        const articles = getArticles().filter(a => a.id !== id);
        saveArticles(articles);
        loadTable();
        loadDashboard();
    }
}

function saveSettings(event) {
    event.preventDefault();
    localStorage.setItem('siteSettings', JSON.stringify({
        title: document.getElementById('siteTitle').value
    }));
    alert('✅ Configuración guardada!');
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboard();
});