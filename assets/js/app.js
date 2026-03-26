const products = window.SUNSHINE_PRODUCTS || [];

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function getUniqueCategories() {
  return [...new Set(products.map((p) => p.category))];
}

function getUniqueSubcategories() {
  return [...new Set(products.map((p) => p.subcategory))];
}

function productCard(product) {
  return `
    <article class="product-card reveal">
      <div class="product-card-image" style="background-image:url('${product.image}')"></div>
      <div class="product-card-body">
        <div class="product-meta-row">
          <span class="chip">${product.category}</span>
          <span class="code-tag">${product.code}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.summary}</p>
        <div class="mini-specs">
          <span><strong>Firing:</strong> ${product.firing}</span>
          <span><strong>Applications:</strong> ${product.applications[0]}</span>
        </div>
        <div class="card-actions">
          <a class="btn btn-outline" href="product.html?id=${product.id}">View Details</a>
        </div>
      </div>
    </article>`;
}

function initCatalogue() {
  const grid = $('#productGrid');
  if (!grid) return;

  const searchInput = $('#productSearch');
  const categorySelect = $('#categoryFilter');
  const subcategorySelect = $('#subcategoryFilter');

  if (categorySelect) {
    categorySelect.innerHTML += getUniqueCategories().map((cat) => `<option value="${cat}">${cat}</option>`).join('');
  }
  if (subcategorySelect) {
    subcategorySelect.innerHTML += getUniqueSubcategories().map((sub) => `<option value="${sub}">${sub}</option>`).join('');
  }

  function render() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const category = categorySelect?.value || 'all';
    const subcategory = subcategorySelect?.value || 'all';

    const filtered = products.filter((product) => {
      const text = `${product.code} ${product.name} ${product.category} ${product.subcategory} ${product.summary} ${product.applications.join(' ')}`.toLowerCase();
      return (category === 'all' || product.category === category)
        && (subcategory === 'all' || product.subcategory === subcategory)
        && (!q || text.includes(q));
    });

    grid.innerHTML = filtered.length
      ? filtered.map(productCard).join('')
      : `<div class="empty-state"><h3>No products found</h3><p>Try changing the search term or filter.</p></div>`;

    initReveal();
  }

  [searchInput, categorySelect, subcategorySelect].forEach((el) => el?.addEventListener('input', render));
  render();
}

function initProductDetail() {
  const container = $('#productDetail');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = products.find((p) => p.id === id) || products[0];
  if (!product) return;

  document.title = `${product.code} | Sunshine Colours`;

  const propertyRows = product.details.properties
    .map(([name, value]) => `<tr><td>${name}</td><td>${value}</td></tr>`)
    .join('');

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
    .map((p) => `<a class="related-card" href="product.html?id=${p.id}"><span>${p.code}</span><strong>${p.name}</strong></a>`)
    .join('');

  container.innerHTML = `
    <section class="product-hero-detail reveal">
      <div class="product-hero-detail-image" style="background-image:url('${product.image}')"></div>
      <div class="product-hero-detail-copy">
        <div class="product-meta-row">
          <span class="chip">${product.category}</span>
          <span class="code-tag">${product.code}</span>
        </div>
        <h1>${product.name}</h1>
        <p class="lead">${product.summary}</p>
        <div class="detail-cta-group">
          <a class="btn btn-primary" href="assets/docs/Datasheet-2.pdf" target="_blank">View DataSheet</a>
          <a class="btn btn-outline" href="contact.html">Send Inquiry</a>
        </div>
      </div>
    </section>

    <section class="detail-grid reveal">
      <div class="detail-card">
        <h2>Product Overview</h2>
        <p>${product.details.description}</p>
        <ul class="feature-list">
          ${product.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="detail-card">
        <h2>Typical Properties</h2>
        <table class="spec-table">
          <tbody>${propertyRows}</tbody>
        </table>
      </div>
    </section>

    <section class="detail-grid reveal">
      <div class="detail-card">
        <h2>Application Areas</h2>
        <ul class="feature-list">
          ${product.applications.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="detail-card">
        <h2>Processing Snapshot</h2>
        <div class="spec-kpis">
          <div><span>Firing Range</span><strong>${product.firing}</strong></div>
          <div><span>Category</span><strong>${product.subcategory}</strong></div>
          <div><span>Support</span><strong>Custom Technical Assistance</strong></div>
        </div>
      </div>
    </section>

    <section class="related-section reveal">
      <div class="section-heading left">
        <span class="eyebrow">More from this category</span>
        <h2>Related Products</h2>
      </div>
      <div class="related-grid">${related}</div>
    </section>`;

  initReveal();
}

function initBannerSlider() {
  const slides = $all('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4500);
}

function initReveal() {
  const items = $all('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.15 });
  items.forEach((item) => io.observe(item));
}

function initMenu() {
  const toggle = $('.nav-toggle');
  const menu = $('.nav-links');
  toggle?.addEventListener('click', () => menu?.classList.toggle('open'));
}

function initYear() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initCatalogue();
  initProductDetail();
  initBannerSlider();
  initReveal();
  initMenu();
  initYear();
});
