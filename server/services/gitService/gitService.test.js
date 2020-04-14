const GitService = require('./gitService');

const ETALON_FORMAT = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';

describe('Тесты гит сервиса', () => {
  describe('Тесты функции получения команды лога', () => {
    test('Функция возращает корректную команду, когда вызывается без параметров', () => {
      const svc = new GitService();
      const cmd = svc.getLogCommand();
      expect(cmd).toStrictEqual(['log', '-1', ETALON_FORMAT]);
    });

    test('Функция возращает корректную команду, когда с параметров untilHash', () => {
      const svc = new GitService();
      const cmd = svc.getLogCommand({ untilHash: 'testHash' });
      expect(cmd).toStrictEqual(['log', 'testHash...HEAD', ETALON_FORMAT]);
    });
  });

  test('Функция получения команды отображения инфо по коммиту отрабатывает корректно', () => {
    const svc = new GitService();
    const cmd = svc.getShowCommand('testHash');
    expect(cmd).toStrictEqual(['show', '--quiet', ETALON_FORMAT, 'testHash']);
  });
});
