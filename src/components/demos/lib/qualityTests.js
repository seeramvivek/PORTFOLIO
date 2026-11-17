import { ValidationError } from './shoplite';

export class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

const show = (v) => (typeof v === 'string' ? `"${v}"` : JSON.stringify(v));

const expect = (actual) => ({
  toBe(expected, label = 'value') {
    if (actual !== expected) throw new AssertionError(`${label}: expected ${show(expected)}, got ${show(actual)}`, show(expected), show(actual));
  },
});

function expectThrows(fn, label) {
  try {
    fn();
  } catch (err) {
    if (err instanceof ValidationError) return err;
    throw err;
  }
  throw new AssertionError(`${label}: expected a ValidationError, but the call succeeded`, 'ValidationError', 'no error');
}

const item = (price, qty = 1) => ({ price, qty });

// Each test: id, title, technique, severity if it fails, and the steps a tester would follow manually.
export const TESTS = [
  {
    id: 'TC-01', title: 'Login accepts valid credentials', technique: 'Functional', severity: 'Critical',
    steps: ['Open the login page', 'Enter asha@example.com / Secret123', 'Submit'],
    run: (s) => expect(s.validateLogin('asha@example.com', 'Secret123').ok).toBe(true, 'login ok'),
  },
  {
    id: 'TC-02', title: 'Login rejects a malformed email', technique: 'Negative', severity: 'Major',
    steps: ['Enter "asha@example" as email', 'Enter a valid password', 'Submit'],
    run: (s) => expect(s.validateLogin('asha@example', 'Secret123').ok).toBe(false, 'login ok'),
  },
  {
    id: 'TC-03', title: 'Password of 7 characters is rejected', technique: 'Boundary', severity: 'Major',
    steps: ['Enter a valid email', 'Enter a 7-character password', 'Submit'],
    run: (s) => expect(s.validateLogin('asha@example.com', 'Abc1234').ok).toBe(false, 'login ok'),
  },
  {
    id: 'TC-04', title: 'Password of exactly 8 characters is accepted', technique: 'Boundary', severity: 'Major',
    steps: ['Enter a valid email', 'Enter an 8-character password', 'Submit'],
    run: (s) => expect(s.validateLogin('asha@example.com', 'Abc12345').ok).toBe(true, 'login ok'),
  },
  {
    id: 'TC-05', title: 'Subtotal is the sum of price × quantity', technique: 'Functional', severity: 'Critical',
    steps: ['Add item ₹250 × 2', 'Add item ₹120 × 1', 'Open the cart'],
    run: (s) => expect(s.priceCart([item(250, 2), item(120, 1)]).subtotal).toBe(620, 'subtotal'),
  },
  {
    id: 'TC-06', title: 'Quantity 0 is rejected', bug: 'Cart accepts a quantity of 0', technique: 'Boundary', severity: 'Major',
    steps: ['Add an item to the cart', 'Change its quantity to 0', 'Proceed to checkout'],
    run: (s) => { expectThrows(() => s.priceCart([item(300, 0)]), 'qty 0'); },
  },
  {
    id: 'TC-07', title: 'Quantity 11 (above max 10) is rejected', technique: 'Boundary', severity: 'Minor',
    steps: ['Add an item to the cart', 'Change its quantity to 11', 'Proceed to checkout'],
    run: (s) => { expectThrows(() => s.priceCart([item(300, 11)]), 'qty 11'); },
  },
  {
    id: 'TC-08', title: 'SAVE10 gives 10% off at exactly ₹500', technique: 'Boundary', severity: 'Major',
    steps: ['Add items worth ₹500', 'Apply coupon SAVE10', 'Check the discount line'],
    run: (s) => expect(s.priceCart([item(500)], 'SAVE10').discount).toBe(50, 'discount'),
  },
  {
    id: 'TC-09', title: 'SAVE10 is not applied below ₹500', bug: 'SAVE10 discount applied below the ₹500 minimum order', technique: 'Boundary', severity: 'Major',
    steps: ['Add items worth ₹499', 'Apply coupon SAVE10', 'Check the discount line'],
    run: (s) => expect(s.priceCart([item(499)], 'SAVE10').discount).toBe(0, 'discount'),
  },
  {
    id: 'TC-10', title: 'Free shipping at exactly ₹999', bug: 'Shipping fee charged at exactly ₹999 (should be free)', technique: 'Boundary', severity: 'Major',
    steps: ['Add items worth ₹999', 'Open checkout', 'Check the shipping line'],
    run: (s) => expect(s.priceCart([item(999)]).shipping).toBe(0, 'shipping'),
  },
  {
    id: 'TC-11', title: '₹49 shipping fee at ₹998', technique: 'Boundary', severity: 'Minor',
    steps: ['Add items worth ₹998', 'Open checkout', 'Check the shipping line'],
    run: (s) => expect(s.priceCart([item(998)]).shipping).toBe(49, 'shipping'),
  },
  {
    id: 'TC-12', title: 'GST of 18% is charged after the discount', technique: 'Functional', severity: 'Critical',
    steps: ['Add items worth ₹2000', 'Apply coupon FLAT100', 'Check the tax line'],
    run: (s) => expect(s.priceCart([item(2000)], 'FLAT100').tax).toBe(342, 'tax'),
  },
  {
    id: 'TC-13', title: 'Unknown coupon shows an error', technique: 'Negative', severity: 'Minor',
    steps: ['Add any item', 'Apply coupon "FREE50"', 'Check for an error message'],
    run: (s) => { expectThrows(() => s.priceCart([item(400)], 'FREE50'), 'unknown coupon'); },
  },
  {
    id: 'TC-14', title: 'Order total adds up across all lines', technique: 'Regression', severity: 'Critical',
    steps: ['Add ₹750 × 2', 'Apply SAVE10', 'Compare total with subtotal − discount + shipping + tax'],
    run: (s) => {
      const r = s.priceCart([item(750, 2)], 'SAVE10');
      expect(r.total).toBe(1593, 'total');
    },
  },
];

export function runTest(test, shop) {
  const start = performance.now();
  try {
    test.run(shop);
    return { status: 'passed', ms: performance.now() - start };
  } catch (err) {
    return {
      status: 'failed',
      ms: performance.now() - start,
      message: err.message,
      expected: err.expected,
      actual: err.actual,
    };
  }
}
