// Pricing and login rules for the ShopLite checkout, in two builds:
//  - "main": the reviewed, correct implementation
//  - "feature/checkout-refactor": a refactor that quietly introduces three regressions
// The test suite in qualityTests.js runs against whichever build is selected.

export const RULES = {
  gstRate: 0.18,
  freeShippingFrom: 999,
  shippingFee: 49,
  maxQty: 10,
  coupons: {
    SAVE10: { type: 'percent', value: 10, minSubtotal: 500 },
    FLAT100: { type: 'flat', value: 100, minSubtotal: 1000 },
  },
};

const round2 = (n) => Math.round(n * 100) / 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createShopLite(build = 'main') {
  const refactor = build !== 'main';

  function validateLogin(email, password) {
    if (!EMAIL_RE.test(String(email))) return { ok: false, error: 'Enter a valid email address' };
    if (String(password).length < 8) return { ok: false, error: 'Password must be at least 8 characters' };
    return { ok: true };
  }

  function validateQty(qty) {
    // Regression 1: the refactor only checks the upper bound, so 0 slips through.
    const tooLow = refactor ? qty < 0 : qty < 1;
    if (!Number.isInteger(qty) || tooLow || qty > RULES.maxQty) {
      throw new ValidationError(`Quantity must be between 1 and ${RULES.maxQty}`);
    }
  }

  function priceCart(items, couponCode = null) {
    items.forEach((i) => validateQty(i.qty));
    const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0));

    let discount = 0;
    if (couponCode) {
      const coupon = RULES.coupons[couponCode];
      if (!coupon) throw new ValidationError(`Unknown coupon "${couponCode}"`);
      // Regression 2: the minimum-order check for coupons was dropped.
      const eligible = refactor ? true : subtotal >= coupon.minSubtotal;
      if (eligible) discount = coupon.type === 'percent' ? round2((subtotal * coupon.value) / 100) : coupon.value;
    }

    const afterDiscount = round2(subtotal - discount);
    // Regression 3: ">" instead of ">=" moves the free-shipping boundary by one rupee.
    const freeShipping = refactor ? afterDiscount > RULES.freeShippingFrom : afterDiscount >= RULES.freeShippingFrom;
    const shipping = items.length === 0 || freeShipping ? 0 : RULES.shippingFee;
    const tax = round2(afterDiscount * RULES.gstRate);
    const total = round2(afterDiscount + shipping + tax);
    return { subtotal, discount, shipping, tax, total };
  }

  return { validateLogin, priceCart };
}
