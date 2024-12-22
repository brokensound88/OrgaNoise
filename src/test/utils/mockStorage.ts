export function setupStorageMock() {
  const storage: Record<string, string> = {};

  const mockStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(key => delete storage[key]); },
    length: Object.keys(storage).length,
    key: (index: number) => Object.keys(storage)[index] || null,
  };

  Object.defineProperty(window, 'localStorage', { value: mockStorage });
  Object.defineProperty(window, 'sessionStorage', { value: mockStorage });
}