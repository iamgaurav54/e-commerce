const products = [
  {
    id: 1,
    name: "The Solis Ring",
    category: "jewellery",
    price: 4900,
    badge: "BESTSELLER",
    image: "img/collection/solis-ring.jpg",
    description: "A refined statement ring with a timeless silhouette and elegant finish."
  },
  {
    id: 2,
    name: "The Aurelle Necklace",
    category: "jewellery",
    price: 6800,
    badge: "NEW ARRIVAL",
    image: "img/collection/collection-necklace.jpg",
    description: "An elegant necklace designed to bring understated sophistication to every look."
  },
  {
    id: 3,
    name: "The Forma Bracelet",
    category: "jewellery",
    price: 3600,
    badge: "",
    image: "img/collection/bracelet.jpg",
    description: "A beautifully considered bracelet for effortless everyday styling."
  },
  {
    id: 4,
    name: "The Everyday Tote",
    category: "bags",
    price: 8900,
    badge: "SIGNATURE",
    image: "img/collection/collection-handbag.jpg",
    description: "A versatile everyday bag combining practical design with refined style."
  },
  {
    id: 5,
    name: "The Muse Shoulder Bag",
    category: "bags",
    price: 7400,
    badge: "",
    image: "img/collection/shoulder-bag.jpg",
    description: "A modern shoulder bag with a timeless, understated aesthetic."
  },
  {
    id: 6,
    name: "The Heritage Watch",
    category: "watches",
    price: 12500,
    badge: "FEATURED",
    image: "img/collection/heritage-watch.jpg",
    description: "A classic timepiece that balances simplicity and timeless character."
  },
  {
    id: 7,
    name: "The Steel Chrono",
    category: "watches",
    price: 9800,
    badge: "",
    image: "img/collection/steel-watch.jpg",
    description: "A contemporary steel watch made for everyday sophistication."
  },
  {
    id: 8,
    name: "The Signature Belt",
    category: "accessories",
    price: 2900,
    badge: "ESSENTIAL",
    image: "img/collection/collection-wallet.jpg",
    description: "A considered finishing touch that completes a modern wardrobe."
  }
];

const productGrid = document.getElementById("productGrid");
const filterList = document.getElementById("filterList");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const quickView = document.getElementById("quickView");
const quickViewContent = document.getElementById("quickViewContent");
const toast = document.getElementById("collectionToast");

let activeFilter = "all";
let wishlist = new Set();
let toastTimer;

const formatPrice = price =>
  "₹" + price.toLocaleString("en-IN");

function getFilteredProducts() {
  let result = products.filter(product =>
    activeFilter === "all" || product.category === activeFilter
  );

  switch (sortSelect.value) {
    case "low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

function renderProducts() {
  const filtered = getFilteredProducts();

  resultCount.textContent =
    `${filtered.length} PRODUCTS`;

  if (!filtered.length) {
    productGrid.innerHTML =
      "<p>No products found in this category.</p>";
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${product.badge ? `
          <span class="product-badge">${product.badge}</span>
        ` : ""}

        <button
          class="wishlist-btn ${wishlist.has(product.id) ? "active" : ""}"
          data-wishlist="${product.id}"
          aria-label="Add ${product.name} to wishlist"
          aria-pressed="${wishlist.has(product.id)}"
        >
          <i class="${wishlist.has(product.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>

        <button
          class="quick-btn"
          data-quick="${product.id}"
        >
          QUICK VIEW
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-price">${formatPrice(product.price)}</span>

        <button
          class="add-btn"
          data-add="${product.id}"
        >
          ADD TO BAG +
        </button>
      </div>
    </article>
  `).join("");
}

// CATEGORY FILTERS

filterList.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  filterList.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn === button);
  });

  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

// CATEGORY CARD NAVIGATION

document.querySelectorAll(".category-card, .lifestyle-card")
  .forEach(card => {
    card.addEventListener("click", event => {
      event.preventDefault();

      const category = card.dataset.category;

      if (category) {
        activeFilter = category;

        filterList.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.toggle(
            "active",
            btn.dataset.filter === category
          );
        });

        renderProducts();
        document.getElementById("curated-edit")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  });

// WISHLIST

function toggleWishlist(id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast("Removed from your wishlist");
  } else {
    wishlist.add(id);
    showToast("Added to your wishlist ♡");
  }

  renderProducts();

  // Notify other Aurelia components if present
  window.dispatchEvent(new CustomEvent("aurelia:wishlist-updated", {
    detail: { products: [...wishlist] }
  }));
}

// BAG

function getBag() {
  try {
    return JSON.parse(localStorage.getItem("aureliaBag")) || [];
  } catch {
    return [];
  }
}

function addToBag(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const bag = getBag();
  const existing = bag.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    bag.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem("aureliaBag", JSON.stringify(bag));

  // Allows your existing bag component to update
  window.dispatchEvent(new CustomEvent("aurelia:bag-updated", {
    detail: { bag }
  }));

  showToast(`${product.name} added to your bag`);
}

// QUICK VIEW

function openQuickView(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  quickViewContent.innerHTML = `
    <div class="quick-product">
      <img src="${product.image}" alt="${product.name}">

      <div>
        <span class="eyebrow dark">
          ${product.category.toUpperCase()}
        </span>

        <h3>${product.name}</h3>

        <strong>${formatPrice(product.price)}</strong>

        <p>${product.description}</p>

        <button
          class="add-btn"
          data-add="${product.id}"
        >
          ADD TO BAG +
        </button>
      </div>
    </div>
  `;

  quickView.classList.add("open");
  quickView.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  quickView.classList.remove("open");
  quickView.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

quickView.addEventListener("click", event => {
  if (event.target.closest("[data-close]")) {
    closeQuickView();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeQuickView();
});

// PRODUCT ACTIONS

productGrid.addEventListener("click", handleProductAction);
quickViewContent.addEventListener("click", handleProductAction);

function handleProductAction(event) {
  const wishlistButton = event.target.closest("[data-wishlist]");
  const quickButton = event.target.closest("[data-quick]");
  const addButton = event.target.closest("[data-add]");

  if (wishlistButton) {
    toggleWishlist(Number(wishlistButton.dataset.wishlist));
  }

  if (quickButton) {
    openQuickView(Number(quickButton.dataset.quick));
  }

  if (addButton) {
    addToBag(Number(addButton.dataset.add));
  }
}

// TOAST NOTIFICATION

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// INITIALIZE

renderProducts();
