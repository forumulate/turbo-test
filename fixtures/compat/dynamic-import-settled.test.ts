import { describe, it, expect, vi } from 'vitest';

// vi.dynamicImportSettled() resolves once every in-flight dynamic import() has settled — the
// escape hatch for code that fires `import()` without returning the promise.
describe('vi.dynamicImportSettled', () => {
  it('exists', () => {
    expect(typeof vi.dynamicImportSettled).toBe('function');
  });

  it('waits for a fire-and-forget import()', async () => {
    let answer = 0;
    setTimeout(() => {
      import('./dynamic-import-target').then((m) => { answer = m.answer; });
    }, 5);
    await vi.dynamicImportSettled();
    expect((globalThis as any).__dynImportLoaded).toBe(true);
    expect(answer).toBe(42);
  });

  it('resolves immediately when nothing is pending', async () => {
    await expect(vi.dynamicImportSettled()).resolves.toBeUndefined();
  });
});
