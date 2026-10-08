import { serializePackageAttributes } from './serialize-package';

describe('serializePackageAttributes', () => {
  it('includes URL and free access for custom packages', () => {
    const attributes = serializePackageAttributes({
      isCustom: true,
      url: 'https://example.com',
      isFreeAccess: true,
    });

    expect(attributes.url).toBe('https://example.com');
    expect(attributes.isFreeAccess).toBe(true);
  });

  it('omits URL and free access for managed packages', () => {
    const attributes = serializePackageAttributes({
      isCustom: false,
      url: 'https://example.com',
      isFreeAccess: true,
    });

    expect(attributes).not.toHaveProperty('url');
    expect(attributes).not.toHaveProperty('isFreeAccess');
  });
});
