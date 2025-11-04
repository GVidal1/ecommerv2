import {
  loadCurrentUser,
  loadUsers,
  removeUserByEmail,
  productsCache,
  loadProducts,
  addProduct,
  removeProductById,
  updateProductById,
  generateNewProductId,
} from '../../globalState.js';
import listOfCategories from '../../utils/listOfCategories.js';

// Variables globales del módulo
let container;
let contentElement;
let tabUsers;
let tabProducts;
let users = [];

function renderDashboard(adminName) {
  if (!contentElement) return;

  const totalUsers = users?.length || 0;
  const totalProducts = productsCache?.length || 0;
  const totalValue =
    productsCache?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

  contentElement.innerHTML = `
      <div class="admin-section-header">
        <h2>Dashboard</h2>
        <p>Resumen general del sistema</p>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${totalUsers}</span>
            <span class="stat-label">Usuarios</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon products">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${totalProducts}</span>
            <span class="stat-label">Productos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon value">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">$${totalValue.toFixed(2)}</span>
            <span class="stat-label">Valor Total</span>
          </div>
        </div>
      </div>
  `;
}

function renderUsers() {
  if (!contentElement) return;

  users = loadUsers();

  const rows = users
    .map(
      (u) => `
      <tr>
        <td>
          <div class="user-info">
            <img src="https://ui-avatars.com/api/?name=${
              u.nombre || 'User'
            }&background=2563eb&color=fff" alt="${u.nombre || u.email}" />
            <div>
              <div class="user-name">${u.nombre || 'Sin nombre'}</div>
              <div class="user-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${u.rol || 'usuario'}</td>
        <td>${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
        <td class="td-actions">
          <button class="admin-btn admin-btn-danger btn-remove-user" data-email="${
            u.email
          }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Eliminar
          </button>
        </td>
      </tr>
    `
    )
    .join('');

  contentElement.innerHTML = ` 
      <div class="admin-section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Administra los usuarios del sistema</p>
      </div>
      
      <div class="admin-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows ||
              '<tr><td colspan="4" class="text-center">No hay usuarios registrados</td></tr>'
            }
          </tbody>
        </table>
      </div>
    `;

  contentElement.querySelectorAll('.btn-remove-user').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const email = e.currentTarget.getAttribute('data-email');
      if (confirm(`¿Eliminar usuario ${email}?`)) {
        removeUserByEmail(email);
        // actualizar vista local
        const idx = users.findIndex((u) => u.email === email);
        if (idx >= 0) users.splice(idx, 1);
        renderUsers();
      }
    });
  });
}

function renderProducts() {
  if (!contentElement) return;

  let selectedImageDataUrl = '';
  loadProducts();
  const rows = productsCache
    .map(
      (p) => `
      <tr>
        <td>
          <div class="product-info">
            <img src="${
              p.thumbnail || 'https://via.placeholder.com/50'
            }" alt="${p.title}" />
            <div>
              <div class="product-title">${p.title}</div>
              <div class="product-category">${p.category}</div>
            </div>
          </div>
        </td>
        <td>$${Number(p.price).toFixed(2)}</td>
        <td>${p.stock || 'N/A'}</td>
        <td class="td-actions">
          <button class="admin-btn admin-btn-secondary btn-edit-product" data-id="${
            p.id
          }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Editar
          </button>
          <button class="admin-btn admin-btn-danger btn-remove-product" data-id="${
            p.id
          }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Eliminar
          </button>
        </td>
      </tr>
    `
    )
    .join('');

  const categoryOptions = listOfCategories
    .map((c) => `<option value="${c}">${c}</option>`)
    .join('');

  contentElement.innerHTML = ` 
      <div class="admin-section-header">
        <h2>Gestión de Productos</h2>
        <p>Administra el catálogo de productos</p>
      </div>

      <div class="admin-grid">
        <div class="admin-form">
          <h3>Añadir/Editar Producto</h3>
          <form id="form-product">
            <input type="hidden" id="id" />
            <div class="grid">
              <label>
                <span>Título del Producto</span>
                <input type="text" id="title" placeholder="Ej: Camiseta Casual" required />
              </label>
              <label>
                <span>Precio</span>
                <input type="number" id="price" placeholder="0.00" step="0.01" required />
              </label>
              <label>
                <span>Categoría</span>
                <select id="category" required>
                  <option value="" disabled selected>Selecciona una categoría</option>
                  ${categoryOptions}
                </select>
              </label>
              <label>
                <span>Stock</span>
                <input type="number" id="stock" placeholder="0" min="0" />
              </label>
              <label class="full">
                <span>Descripción</span>
                <textarea id="description" placeholder="Describe el producto..." rows="3"></textarea>
              </label>
              <label>
                <span>URL de Imagen</span>
                <input type="url" id="thumbnail" placeholder="https://..." />
              </label>
              <label>
                <span>Subir Imagen</span>
                <input type="file" id="imageFile" accept="image/*" class="file-input" />
              </label>
            </div>

            <div class="image-preview-wrap">
              <img id="imagePreview" class="image-preview" alt="Vista previa" hidden />
            </div>

            <div class="form-actions">
              <button type="button" id="cancel-edit" class="admin-btn admin-btn-secondary" hidden>Cancelar</button>
              <button type="submit" id="submit-btn" class="admin-btn admin-btn-primary">Agregar Producto</button>
            </div>
          </form>
        </div>

        <div class="admin-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${
                rows ||
                '<tr><td colspan="4" class="text-center">No hay productos registrados</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

  const form = contentElement.querySelector('#form-product');
  const cancelBtn = contentElement.querySelector('#cancel-edit');
  const fileInput = form.querySelector('#imageFile');
  const imgPreview = form.querySelector('#imagePreview');

  function resetForm() {
    form.reset();
    form.querySelector('#id').value = '';
    form.querySelector('#submit-btn').textContent = 'Agregar';
    cancelBtn.hidden = true;
    selectedImageDataUrl = '';
    if (imgPreview) {
      imgPreview.hidden = true;
      imgPreview.removeAttribute('src');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idRaw = form.querySelector('#id').value;
    const title = form.querySelector('#title').value.trim();
    const price = parseFloat(form.querySelector('#price').value);
    const category = form.querySelector('#category').value;
    const description = form.querySelector('#description').value.trim();
    const thumbnail = form.querySelector('#thumbnail').value.trim();

    if (!title || isNaN(price) || !category) return;

    if (idRaw) {
      const id = parseInt(idRaw);
      const ok = updateProductById(id, {
        title,
        price,
        category,
        description,
        thumbnail: selectedImageDataUrl || thumbnail || '',
        images: selectedImageDataUrl
          ? [selectedImageDataUrl]
          : thumbnail
          ? [thumbnail]
          : undefined,
      });
      if (ok) {
        resetForm();
      }
    } else {
      const newId = generateNewProductId();
      addProduct({
        id: newId,
        title,
        price,
        category,
        images: selectedImageDataUrl
          ? [selectedImageDataUrl]
          : thumbnail
          ? [thumbnail]
          : [],
        thumbnail: selectedImageDataUrl || thumbnail || '',
        description: description || '',
      });
      resetForm();
    }
    renderProducts();
  });

  cancelBtn.addEventListener('click', () => {
    resetForm();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      selectedImageDataUrl = '';
      if (imgPreview) {
        imgPreview.hidden = true;
        imgPreview.removeAttribute('src');
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      selectedImageDataUrl = String(reader.result || '');
      if (selectedImageDataUrl && imgPreview) {
        imgPreview.src = selectedImageDataUrl;
        imgPreview.hidden = false;
      }
    };
    reader.readAsDataURL(file);
  });

  contentElement.querySelectorAll('.btn-remove-product').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      if (confirm(`¿Eliminar producto ${id}?`)) {
        removeProductById(id);
        renderProducts();
      }
    });
  });

  contentElement.querySelectorAll('.btn-edit-product').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      const product = productsCache.find((p) => p.id === id);
      if (!product) return;
      form.querySelector('#id').value = product.id;
      form.querySelector('#title').value = product.title || '';
      form.querySelector('#price').value = product.price || '';
      form.querySelector('#category').value = product.category || '';
      form.querySelector('#description').value = product.description || '';
      const existingThumb =
        product.thumbnail || (product.images && product.images[0]) || '';
      form.querySelector('#thumbnail').value = existingThumb;
      if (existingThumb && imgPreview) {
        selectedImageDataUrl = existingThumb;
        imgPreview.src = existingThumb;
        imgPreview.hidden = false;
      } else if (imgPreview) {
        selectedImageDataUrl = '';
        imgPreview.hidden = true;
        imgPreview.removeAttribute('src');
      }
      form.querySelector('#submit-btn').textContent = 'Guardar';
      cancelBtn.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

export async function Admin() {
  const container = document.createElement('div');
  container.classList.add('container-admin');

  const user = loadCurrentUser();
  users = await loadUsers();
  await loadProducts();

  const adminName = user?.nombre || user?.email || 'Admin';
  container.innerHTML = `
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 8H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 16H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h1>Admin Panel</h1>
      </div>
      <nav class="admin-nav">
        <button id="tab-dashboard" class="active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
          Dashboard
        </button>
        <button id="tab-products">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2"/>
          </svg>
          Productos
        </button>
        <button id="tab-users">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Usuarios
        </button>
      </nav>
    </aside>

    <header class="admin-header">
      <div class="admin-header-left">
        <button id="menu-toggle" class="admin-btn admin-btn-secondary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="breadcrumb">Panel de Administración</div>
      </div>
      <div class="admin-header-right">
        <div class="admin-user-info">
          <img src="https://ui-avatars.com/api/?name=${adminName}&background=2563eb&color=fff" alt="${adminName}"/>
          <span>${adminName}</span>
        </div>
        <a href="#/" class="admin-btn admin-btn-secondary">Salir</a>
      </div>
    </header>

    <main class="admin-main">
      <div id="admin-content"></div>
    </main>
  `;

  // Obtener referencias a los elementos
  contentElement = container.querySelector('#admin-content');
  tabUsers = container.querySelector('#tab-users');
  tabProducts = container.querySelector('#tab-products');
  const tabDashboard = container.querySelector('#tab-dashboard');

  // Configurar eventos de los tabs
  tabDashboard?.addEventListener('click', () => {
    tabProducts.classList.remove('active');
    tabUsers.classList.remove('active');
    tabDashboard.classList.add('active');
    renderDashboard();
    // Close mobile sidebar if open
    closeMobileSidebar();
  });

  tabUsers?.addEventListener('click', () => {
    tabProducts.classList.remove('active');
    tabDashboard.classList.remove('active');
    tabUsers.classList.add('active');
    renderUsers();
    // Close mobile sidebar if open
    closeMobileSidebar();
  });

  tabProducts?.addEventListener('click', () => {
    tabUsers.classList.remove('active');
    tabDashboard.classList.remove('active');
    tabProducts.classList.add('active');
    renderProducts();
    // Close mobile sidebar if open
    closeMobileSidebar();
  });

  // Mobile menu toggle functionality
  const menuToggle = container.querySelector('#menu-toggle');
  const sidebar = container.querySelector('.admin-sidebar');
  
  function closeMobileSidebar() {
    if (sidebar) {
      sidebar.classList.remove('open');
    }
  }

  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
      closeMobileSidebar();
    }
  });

  // Vista inicial: Dashboard
  renderDashboard(adminName);

  return container;
}
