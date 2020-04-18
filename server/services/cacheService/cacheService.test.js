const { resolve } = require('path');
const { Readable, Writable } = require('stream');
const { readFileSync } = require('fs');
const { fileExistsAsync, mkDirAsync } = require('../../utils/promisified');
const CacheService = require('./cacheService');

describe('Тесты кэш сервиса', () => {
  test('тестовый лог чекается на валидность корректно', async () => {
    const svc = new CacheService('');
    svc.getBuildCacheLogPath = () => resolve('./services/cacheService/testLog');
    expect(await fileExistsAsync(svc.getBuildCacheLogPath())).toBeTruthy();
    const result = await svc.checkLog();
    expect(result).toBeFalsy();
  });

  test('лог пишется в файл через стрим', async () => {
    const svc = new CacheService('');
    const testPath = resolve('./services/cacheService/.testData');
    svc.getBuildCacheLogPath = () => resolve(`${testPath}/test.txt`);
    if (!(await fileExistsAsync(testPath))) {
      await mkDirAsync(testPath);
    }
    const rs = new Readable();
    rs._read = () => {};
    const resultPromise = svc.write('', rs);
    rs.push('test string');
    rs.push(null);
    const result = await resultPromise;
    expect(result).toBeTruthy();
    expect(readFileSync(`${testPath}/test.txt`, 'utf8')).toBe('test string');
  });

  test('лог читается из файла через стрим', async () => {
    const svc = new CacheService('');
    svc.getBuildCacheLogPath = () => resolve('./services/cacheService/testLog');
    expect(await fileExistsAsync(svc.getBuildCacheLogPath())).toBeTruthy();

    const ws = new Writable();
    let testStr = '';
    ws._write = (chunk) => {
      testStr += chunk.toString();
    };

    const result = await svc.read('', ws);
    expect(result).toBeTruthy();
    expect(testStr).toBe('some test log');
  });
});
