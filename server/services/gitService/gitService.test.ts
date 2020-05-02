import { EventEmitter } from 'events';
import { GitService } from './gitService';

const ETALON_FORMAT: string = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';

const mockSpawn: any = new EventEmitter();
mockSpawn.stdout = new EventEmitter();
mockSpawn.stderr = new EventEmitter();

jest.mock('child_process', () => ({
  spawn: jest.fn(() => mockSpawn),
}));

describe('Тесты гит сервиса', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('Функция клонирования репозитория (clone) запускает команду гита в отдельном процессе с правильными параметрами', async () => {
    const svc = new GitService();
    const clone = svc.clone('test', 'test');
    mockSpawn.emit('close', 0);
    const { spawn } = require('child_process');
    const result = await clone;
    expect(spawn).toHaveBeenCalledWith('git', ['clone', 'test', '/home/repos/test']);
    expect(result).toBeTruthy();
  });

  test('Функция чекаута репозитория (сheckout) запускает команду гита в отдельном процессе с правильными параметрами', async () => {
    const { spawn } = require('child_process');
    const svc = new GitService();
    const checkout = svc.checkout('test', 'test');
    mockSpawn.emit('close', 0);
    const result = await checkout;
    expect(spawn).toHaveBeenCalledWith('git', ['checkout', 'test'], { cwd: '/home/repos/test' });
    expect(result).toBeTruthy();
  });

  test('Функция обновления репозитория (pull) запускает команду гита в отдельном процессе с правильными параметрами', async () => {
    const { spawn } = require('child_process');
    const svc = new GitService();
    const pull = svc.pullRepo('test');
    mockSpawn.emit('close', 0);
    const result = await pull;
    expect(spawn).toHaveBeenCalledWith('git', ['pull'], { cwd: '/home/repos/test' });
    expect(result).toBeTruthy();
  });
});
