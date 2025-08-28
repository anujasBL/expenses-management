import '@testing-library/jest-dom';

// Mock external services
jest.mock('@/services/api', () => ({
  api: {
    expenses: {
      getAll: jest.fn(),
      getById: jest.fn(),
      saveNew: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    categories: {
      getAll: jest.fn(),
      getById: jest.fn(),
      saveNew: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        client_secret: 'pi_test_secret_123',
        id: 'pi_test_123',
      }),
      confirm: jest.fn().mockResolvedValue({
        status: 'succeeded',
        id: 'pi_test_123',
      }),
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_123' } },
      }),
    },
  })),
}));

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([
    {
      statusCode: 202,
      headers: {},
      body: '',
    },
  ]),
}));

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test_image_123',
        secure_url:
          'https://res.cloudinary.com/test/image/upload/test_image_123.jpg',
        width: 800,
        height: 600,
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
    image: jest.fn().mockReturnValue({
      transformation: jest.fn().mockReturnThis(),
      toURL: jest
        .fn()
        .mockReturnValue(
          'https://res.cloudinary.com/test/image/upload/test_image_123.jpg'
        ),
    }),
  },
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn(date => date.toISOString().split('T')[0]),
  parseISO: jest.fn(dateString => new Date(dateString)),
  isToday: jest.fn(() => false),
  isYesterday: jest.fn(() => false),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
