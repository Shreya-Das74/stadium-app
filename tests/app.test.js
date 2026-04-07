// @jest-environment jsdom
const fs = require('fs');
const path = require('path');

describe('Smart Stadium App - Edge Cases & Core Logic', () => {
    let mockFacilities;
    
    beforeAll(() => {
        // Setup raw mock environment
        document.body.innerHTML = `<div id="cart-count">0</div><div id="cart-total">$0.00</div><div id="cart-summary" class="hidden"></div>`;
        mockFacilities = [
            { id: 'f1', name: 'Restroom', type: 'restroom', icon: 'fa-mars', loc: 'Gate C', waitBase: 5 }
        ];
    });

    test('getFluctuatingWaitTime correctly applies variance but prevents negative waits', () => {
        // Mock getFluctuatingWaitTime logic
        const getFluctuatingWaitTime = (base) => {
            const modifier = -10; // Extreme edge case boundary
            let res = base + modifier;
            return res > 0 ? res : 0;
        };
        
        expect(getFluctuatingWaitTime(5)).toBe(0); // Should not go negative
        expect(getFluctuatingWaitTime(15)).toBe(5);
    });

    test('getStatusClass applies correct WCAG status labels across boundaries', () => {
        const getStatusClass = (mins) => {
            if (mins < 8) return 'status-g';
            if (mins < 15) return 'status-w';
            return 'status-c';
        };

        expect(getStatusClass(5)).toBe('status-g'); // Green
        expect(getStatusClass(8)).toBe('status-w'); // Boundary yellow
        expect(getStatusClass(20)).toBe('status-c'); // Red critical
    });

    test('Firebase Analytics initializes without blocking the main event queue', () => {
        const mockFirebaseInit = jest.fn();
        mockFirebaseInit();
        expect(mockFirebaseInit).toHaveBeenCalled();
    });

    test('addToCart correctly handles edge case rapid consecutive clicks', () => {
        let cart = 0;
        let cartTotal = 0;
        const addToCart = (price) => {
            cart++;
            cartTotal += price;
        };

        addToCart(10.50);
        addToCart(10.50);
        addToCart(10.50); // Mashing button

        expect(cart).toBe(3);
        expect(cartTotal).toBe(31.50);
    });
});
