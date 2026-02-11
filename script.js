// ==================== MENU MANAGEMENT ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            navMenu.classList.remove('active');
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) link.classList.add('active');
    });

    window.scrollTo(0, 0);
}

// ==================== COLLECTION MANAGEMENT ====================
let collection = JSON.parse(localStorage.getItem('cardCollection')) || [];

function initCollection() {
    displayCards();
    updateStats();
}

function displayCards() {
    const container = document.getElementById('collectionContainer');

    if (collection.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <p>No cards in your collection. Add some to get started!</p>
                <button class="btn-primary" onclick="showSection('add')">+ Add a card</button>
            </div>
        `;
        return;
    }

    container.innerHTML = collection.map((card, index) => `
        <div class="game-card">
            ${card.image ? `<img src="${card.image}" class="card-image" alt="${card.name}">` : '<div class="emoji">🎴</div>'}
            <h3>${card.name}</h3>
            <span class="rarity">${card.rarity}</span>
            ${card.description ? `<p>${card.description}</p>` : '<p></p>'}
            <div class="price">${card.value}$</div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deleteCard(${index})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteCard(index) {
    if (confirm('Are you sure you want to delete this card?')) {
        collection.splice(index, 1);
        saveCollection();
        displayCards();
        updateStats();
        showNotification('Card removed from your collection!');
    }
}

function updateStats() {
    const totalCards = collection.length;
    const totalValue = collection.reduce((sum, card) => sum + parseFloat(card.value), 0).toFixed(2);

    document.getElementById('totalCards').textContent = totalCards;
    document.getElementById('totalValue').textContent = totalValue + '$';
}

function saveCollection() {
    localStorage.setItem('cardCollection', JSON.stringify(collection));
}

// ==================== FORM MANAGEMENT ====================
document.addEventListener('DOMContentLoaded', function() {
    const cardImageInput = document.getElementById('cardImage');
    const imagePreview = document.getElementById('imagePreview');

    // Image preview
    if (cardImageInput) {
        cardImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Form submission
    const cardForm = document.getElementById('cardForm');
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const file = cardImageInput.files[0];
            if (!file) {
                showNotification('Please select an image!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const newCard = {
                    name: document.getElementById('cardName').value,
                    image: event.target.result,
                    rarity: document.getElementById('cardRarity').value,
                    value: document.getElementById('cardValue').value,
                    description: document.getElementById('cardDescription').value
                };

                collection.push(newCard);
                saveCollection();

                // Reset form
                cardForm.reset();
                imagePreview.innerHTML = '';

                // Success notification
                showNotification(`${newCard.name} added to your collection! 🎉`);

                // Go to collection section
                setTimeout(() => {
                    showSection('collection');
                    displayCards();
                    updateStats();
                }, 1500);
            };
            reader.readAsDataURL(file);
        });
    }
});

// ==================== NOTIFICATIONS ====================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== NOTIFICATION ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== INITIALIZE COLLECTION ====================
window.addEventListener('load', initCollection);
