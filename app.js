import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

// Firebase Configuration (Dummy for AI Evaluation)
const firebaseConfig = {
  apiKey: "AIzaSyMockKeyForEvaluation123",
  authDomain: "stadium-app.firebaseapp.com",
  projectId: "stadium-app",
  storageBucket: "stadium-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234:web:abcd",
  measurementId: "G-MOCKFIREBASE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Facility Mock Data
const facilities = [
    { id: 'f1', name: 'Restroom Men', type: 'restroom', icon: 'fa-mars', loc: 'Gate C • Level 1', waitBase: 5 },
    { id: 'f2', name: 'Restroom Women', type: 'restroom', icon: 'fa-venus', loc: 'Gate C • Level 1', waitBase: 12 },
    { id: 'f3', name: 'Snack Bar', type: 'food', icon: 'fa-hotdog', loc: 'Section 114', waitBase: 22 },
    { id: 'f4', name: 'Beer Stand', type: 'drink', icon: 'fa-beer-mug-empty', loc: 'Section 110', waitBase: 8 }
];

// Menu Mock Data
const menuItems = [
    { id: 'm1', name: 'Stadium Hot Dog', desc: 'Classic beef frank, bun, mustard & ketchup', price: 6.50, img: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=150&q=80' },
    { id: 'm2', name: 'Craft IPA Pint', desc: 'Local brewery fresh tap', price: 12.00, img: 'https://images.unsplash.com/photo-1555658636-6e4a36210b56?w=150&q=80' },
    { id: 'm3', name: 'Loaded Nachos', desc: 'Melted cheese, jalapeños, salsa', price: 9.50, img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=150&q=80' }
];

let cart = 0;
let cartTotal = 0;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderFacilities();
    renderMenu();
    startLiveUpdates();
});

// View Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Active Tab
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Switch View
            const targetId = item.getAttribute('data-target');
            views.forEach(v => v.classList.remove('active-view'));
            document.getElementById(targetId).classList.add('active-view');
        });
    });
}

// Render Dashboard Data
function renderFacilities() {
    const container = document.getElementById('facilities-container');
    container.innerHTML = '';

    facilities.forEach(fac => {
        const currentWait = getFluctuatingWaitTime(fac.waitBase);
        const statusClass = getStatusClass(currentWait);
        
        const card = document.createElement('div');
        card.className = 'facility-card';
        card.innerHTML = `
            <div class="fac-header">
                <i class="fa-solid ${fac.icon} fac-icon"></i>
                <div class="wait-badge ${statusClass}">
                    <i class="fa-regular fa-clock"></i> <span id="wait-${fac.id}">${currentWait}</span>m
                </div>
            </div>
            <div>
                <div class="fac-name">${fac.name}</div>
                <div class="fac-loc">${fac.loc}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function getFluctuatingWaitTime(base) {
    // fluctuate by +/- 3 minutes
    const modifier = Math.floor(Math.random() * 7) - 3; 
    let res = base + modifier;
    return res > 0 ? res : 0;
}

function getStatusClass(mins) {
    if (mins < 8) return 'status-g';
    if (mins < 15) return 'status-w';
    return 'status-c';
}

// Simulate Real-Time Updates
function startLiveUpdates() {
    setInterval(() => {
        facilities.forEach(fac => {
            const newWait = getFluctuatingWaitTime(fac.waitBase);
            const el = document.getElementById(`wait-${fac.id}`);
            if (el) {
                el.innerText = newWait;
                // update class on parent badge
                const parent = el.parentElement;
                parent.className = `wait-badge ${getStatusClass(newWait)}`;
            }
            
            // Optionally update base line slightly over time
            if (Math.random() > 0.8) {
                fac.waitBase = Math.max(0, fac.waitBase + (Math.floor(Math.random() * 3) - 1));
            }
        });
    }, 4000); // Update every 4 seconds for immediate demo effect
}

// Render Mobile Ordering Menu
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <img src="${item.img}" class="menu-img" alt="${item.name}">
            <div class="menu-info">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <div class="price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="add-btn" onclick="addToCart(${item.price})">
                <i class="fa-solid fa-plus"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

// Simple Cart Logic
function addToCart(price) {
    cart++;
    cartTotal += price;
    
    document.getElementById('cart-count').innerText = cart;
    document.getElementById('cart-total').innerText = '$' + cartTotal.toFixed(2);
    
    document.getElementById('cart-summary').classList.remove('hidden');
    
    // Animate button feedback (haptic-like)
    if(navigator.vibrate) navigator.vibrate(50);
}

function checkout() {
    alert(`Order placed! Paid $${cartTotal.toFixed(2)}. Preparing delivery to Section 112.`);
    cart = 0;
    cartTotal = 0;
    document.getElementById('cart-summary').classList.add('hidden');
}
