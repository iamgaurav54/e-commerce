/* PRODUCTS */
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
    "₹" + Number(price).toLocaleString("en-IN");
function getFilteredProducts() {
    let result = products.filter(product =>
        activeFilter === "all" ||
        product.category === activeFilter
    );

    if (sortSelect) {

        switch (sortSelect.value) {

            case "low":
                result.sort((a, b) => a.price - b.price);
                break;

            case "high":
                result.sort((a, b) => b.price - a.price);
                break;

            case "name":
                result.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;
        }
    }

    return result;
}
function renderProducts() {

    if (!productGrid) return;

    const filtered = getFilteredProducts();

    if (resultCount) {
        resultCount.textContent =
            `${filtered.length} PRODUCTS`;
    }

    if (!filtered.length) {

        productGrid.innerHTML = `
            <p class="ac-empty-message">
                No products found in this category.
            </p>
        `;

        return;
    }

    productGrid.innerHTML = filtered.map(product => `

        <article class="ac-product-card">

            <div class="ac-product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                ${product.badge ? `
                    <span class="ac-product-badge">
                        ${product.badge}
                    </span>
                ` : ""}

                <button
                    class="ac-wishlist-btn ${wishlist.has(product.id) ? "ac-active" : ""}"
                    data-wishlist="${product.id}"
                    aria-label="Add ${product.name} to wishlist"
                    aria-pressed="${wishlist.has(product.id)}"
                >
                    <i class="${wishlist.has(product.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>

                <button
                    class="ac-quick-btn"
                    data-quick="${product.id}"
                >
                    QUICK VIEW
                </button>

            </div>

            <div class="ac-product-info">

                <span class="ac-product-category">
                    ${product.category}
                </span>

                <h3 class="ac-product-name">
                    ${product.name}
                </h3>

                <span class="ac-product-price">
                    ${formatPrice(product.price)}
                </span>

                <button
                    class="ac-add-btn"
                    data-add="${product.id}"
                >
                    ADD TO BAG +
                </button>

            </div>

        </article>

    `).join("");
}
if (filterList) {

    filterList.addEventListener("click", event => {

        const button = event.target.closest("[data-filter]");

        if (!button) return;

        activeFilter = button.dataset.filter;

        filterList.querySelectorAll(".ac-filter-link").forEach(btn => {

            btn.classList.toggle(
                "ac-active",
                btn === button
            );

        });

        renderProducts();

    });

}

if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
}

document.querySelectorAll(
    ".ac-category-card, .ac-lifestyle-card"
).forEach(card => {

    card.addEventListener("click", event => {

        const category = card.dataset.category;

        if (!category) return;

        event.preventDefault();

        activeFilter = category;

        if (filterList) {

            filterList.querySelectorAll(".ac-filter-link").forEach(btn => {

                btn.classList.toggle(
                    "ac-active",
                    btn.dataset.filter === category
                );

            });

        }

        renderProducts();

        const target = document.getElementById("curated-edit");

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });

});


/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(id) {

    if (wishlist.has(id)) {

        wishlist.delete(id);
        showToast("Removed from your wishlist");

    } else {

        wishlist.add(id);
        showToast("Added to your wishlist ♡");

    }

    renderProducts();

    window.dispatchEvent(
        new CustomEvent("aurelia:wishlist-updated", {
            detail: {
                products: [...wishlist]
            }
        })
    );

}


/* =========================================
   SHOPPING BAG
========================================= */

function getBag() {

    try {

        return JSON.parse(
            localStorage.getItem("aureliaBag")
        ) || [];

    } catch (error) {

        return [];

    }

}


function updateBagCount() {

    const bag = getBag();

    const count = bag.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    document.querySelectorAll(
        ".ac-bag-count"
    ).forEach(element => {

        element.textContent = count;

    });

}


function addToBag(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product) return;

    const bag = getBag();

    const existing = bag.find(
        item => item.id === id
    );

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

    localStorage.setItem(
        "aureliaBag",
        JSON.stringify(bag)
    );

    updateBagCount();

    window.dispatchEvent(
        new CustomEvent("aurelia:bag-updated", {
            detail: { bag }
        })
    );

    showToast(`${product.name} added to your bag`);

}


/* =========================================
   QUICK VIEW
========================================= */

function openQuickView(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product || !quickView || !quickViewContent) return;

    quickViewContent.innerHTML = `

        <div class="ac-quick-product">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div>

                <span class="ac-eyebrow ac-dark">
                    ${product.category.toUpperCase()}
                </span>

                <h3>${product.name}</h3>

                <strong>
                    ${formatPrice(product.price)}
                </strong>

                <p>
                    ${product.description}
                </p>

                <button
                    class="ac-add-btn"
                    data-add="${product.id}"
                >
                    ADD TO BAG +
                </button>

            </div>

        </div>

    `;

    quickView.classList.add("ac-open");

    quickView.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeQuickView() {

    if (!quickView) return;

    quickView.classList.remove("ac-open");

    quickView.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


/* QUICK VIEW CLOSE BUTTON */

if (quickView) {

    quickView.addEventListener("click", event => {

        if (
            event.target === quickView ||
            event.target.closest("[data-close]")
        ) {
            closeQuickView();
        }

    });

}


/* ESCAPE KEY */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeQuickView();
    }

});


/* =========================================
   PRODUCT ACTIONS
========================================= */

function handleProductAction(event) {

    const wishlistButton = event.target.closest("[data-wishlist]");
    const quickButton = event.target.closest("[data-quick]");
    const addButton = event.target.closest("[data-add]");

    if (wishlistButton) {

        toggleWishlist(
            Number(wishlistButton.dataset.wishlist)
        );

        return;
    }

    if (quickButton) {

        openQuickView(
            Number(quickButton.dataset.quick)
        );

        return;
    }

    if (addButton) {

        addToBag(
            Number(addButton.dataset.add)
        );

    }

}


if (productGrid) {
    productGrid.addEventListener("click", handleProductAction);
}

if (quickViewContent) {
    quickViewContent.addEventListener("click", handleProductAction);
}


/* =========================================
   TOAST NOTIFICATION
========================================= */

function showToast(message) {

    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;

    toast.classList.add("ac-show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("ac-show");

    }, 2500);

}


/* =========================================
   INITIALIZE
========================================= */

renderProducts();

updateBagCount();
// end of product 
// starting of about js 
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = [
        ".aa-about-philosophy-image",
        ".aa-about-philosophy-content",
        ".aa-about-founder-image",
        ".aa-about-founder-content",
        ".aa-about-film-content",
        ".aa-about-team-intro",
        ".aa-about-team-member",
        ".aa-about-behind-content",
        ".aa-about-gallery-item",
        ".aa-about-universe-content",
        ".aa-about-universe-value"
    ];
    const elements = document.querySelectorAll(
        revealElements.join(", ")
    );
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
        elements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "none";
        });
    } else {
        elements.forEach(element => {
            element.classList.add("aa-about-reveal");
        });
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "aa-about-revealed"
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );
        elements.forEach(element => {
            revealObserver.observe(element);
        });

    }
    const teamMembers = document.querySelectorAll(
        ".aa-about-team-member"
    );
    teamMembers.forEach((member, index) => {
        member.style.setProperty(
            "--aa-about-delay",
            `${index * 120}ms`
        );
    });
    const video = document.getElementById(
        "aa-about-video"
    );
    const playButton = document.getElementById(
        "aa-about-film-play"
    );
    const muteButton = document.getElementById(
        "aa-about-film-mute"
    );
    const playIcon = playButton?.querySelector("i");
    const muteIcon = muteButton?.querySelector("i");
    if (video && playButton) {
        playButton.addEventListener("click", async () => {
            if (video.paused) {
                try {
                    await video.play();
                    playButton.setAttribute(
                        "aria-label",
                        "Pause brand film"
                    );
                    if (playIcon) {
                        playIcon.className = "fa-solid fa-pause";
                    }
                } catch (error) {
                    console.error(
                        "Unable to play the brand film:",
                        error
                    );
                }

            } else {

                video.pause();

            }

        });
        video.addEventListener("play", () => {
            if (playIcon) {
                playIcon.className = "fa-solid fa-pause";
            }
            playButton.setAttribute(
                "aria-label",
                "Pause brand film"
            );
        });
        video.addEventListener("pause", () => {
            if (playIcon) {
                playIcon.className = "fa-solid fa-play";
            }
            playButton.setAttribute(
                "aria-label",
                "Play brand film"
            );
        });
        video.addEventListener("ended", () => {
            if (playIcon) {
                playIcon.className = "fa-solid fa-play";
            }
            playButton.setAttribute(
                "aria-label",
                "Play brand film"
            );
        });
    }
    if (video && muteButton) {
        muteButton.addEventListener("click", () => {
            video.muted = !video.muted;
            if (muteIcon) {
                muteIcon.className = video.muted
                    ? "fa-solid fa-volume-xmark"
                    : "fa-solid fa-volume-high";
            }
            muteButton.setAttribute(
                "aria-label",
                video.muted ? "Unmute video" : "Mute video"
            );
        });
    }
    if (video) {
        const videoObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !video.paused) {
                        video.pause();
                    }
                });
            },
            {
                threshold: 0.1
            }
        );
        videoObserver.observe(video);
    }
    const galleryImages = document.querySelectorAll(
        ".aa-about-gallery-item img"
    );
    let currentImageIndex = 0;
    if (galleryImages.length) {
        const lightbox = document.createElement("div");
        lightbox.className = "aa-about-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Image gallery");
        lightbox.setAttribute("aria-hidden", "true");
        const showGalleryImage = index => {
            currentImageIndex =
                (index + galleryImages.length) %
                galleryImages.length;

            const selectedImage =
                galleryImages[currentImageIndex];

            lightboxImage.src = selectedImage.src;

            lightboxImage.alt = selectedImage.alt;

            const galleryItem =
                selectedImage.closest(
                    ".aa-about-gallery-item"
                );

            const caption = galleryItem?.querySelector(
                "span"
            );

            lightboxCaption.textContent =
                caption?.textContent || selectedImage.alt;

            lightboxCounter.textContent =
                `${String(currentImageIndex + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`;

        };
        // Open gallery
        const openGallery = index => {
            showGalleryImage(index);
            lightbox.classList.add(
                "aa-about-lightbox-active"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "false"
            );
            document.body.style.overflow = "hidden";
            closeButton.focus();

        };
        // Close gallery
        const closeGallery = () => {
            lightbox.classList.remove(
                "aa-about-lightbox-active"
            );
            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );
            document.body.style.overflow = "";
            galleryImages[currentImageIndex].closest(
                ".aa-about-gallery-item"
            )?.focus();

        };
        galleryImages.forEach((image, index) => {
            image.closest(
                ".aa-about-gallery-item"
            ).style.cursor = "zoom-in";
            image.closest(
                ".aa-about-gallery-item"
            ).setAttribute("tabindex", "0");
            image.closest(
                ".aa-about-gallery-item"
            ).setAttribute("role", "button");
            image.closest(
                ".aa-about-gallery-item"
            ).setAttribute(
                "aria-label",
                `Open image ${index + 1}: ${image.alt}`
            );
            image.closest(
                ".aa-about-gallery-item"
            ).addEventListener("click", () => {
                openGallery(index);
            });
            image.closest(
                ".aa-about-gallery-item"
            ).addEventListener("keydown", event => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openGallery(index);
                }
            });
        });
        previousButton.addEventListener("click", () => {
            showGalleryImage(currentImageIndex - 1);
        });
        nextButton.addEventListener("click", () => {
            showGalleryImage(currentImageIndex + 1);

        });
        closeButton.addEventListener(
            "click",
            closeGallery
        );
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) {
                closeGallery();
            }
        });
        document.addEventListener("keydown", event => {
            if (
                !lightbox.classList.contains(
                    "aa-about-lightbox-active"
                )
            ) {
                return;
            }
            if (event.key === "Escape") {
                closeGallery();
            }
            if (event.key === "ArrowLeft") {
                showGalleryImage(currentImageIndex - 1);
            }
            if (event.key === "ArrowRight") {
                showGalleryImage(currentImageIndex + 1);
            }
        });
    }
    document.querySelectorAll(
        '.aa-about-page a[href^="#"]'
    ).forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "start"
            });
        });
    });
    document.querySelectorAll(
        ".aa-about-page img"
    ).forEach(image => {
        image.addEventListener("error", () => {
            console.warn(
                "AURELIA image could not be loaded:",
                image.src
            );
        });
    });
    console.log(
        "AURELIA About page initialized successfully."
    );
});
// end of the about 
