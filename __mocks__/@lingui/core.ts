export const i18n = {
  activate: jest.fn(),
  load: jest.fn(),
  _: (msg: any) => msg.id ?? msg,
};
