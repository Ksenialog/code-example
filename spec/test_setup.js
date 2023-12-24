import NoticeMessages from 'Common/Components/NoticeMessages';

/**
 * Мокаем focus-trap, т.к. необходимости проверять его работу нет
 * Если нужно протестировать работу focusTrap миксина - см. https://github.com/focus-trap/tabbable#testing-in-jsdom
 */
jest.mock('focus-trap', () => ({
  createFocusTrap: () => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
  }),
}));

/**
 * Сохраняем инстанс NoticeMessages (наследник AbstractTopFrameComponent) в window.frames.top,
 * в котором все методы show..Notice вызываются в контексте window.frames.top.NoticeMessages
 */
global.frames.top.NoticeMessages = NoticeMessages;

beforeEach(() => {
  // eslint-disable-next-line jest/no-standalone-expect
  expect.hasAssertions();
});
