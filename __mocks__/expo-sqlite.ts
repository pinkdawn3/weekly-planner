const mockDb = {
  execSync: jest.fn(),
  runSync: jest.fn(),
  getAllSync: jest.fn().mockReturnValue([]),
  getFirstSync: jest.fn().mockReturnValue(null),
};

export const openDatabaseSync = jest.fn(() => mockDb);
export { mockDb };
