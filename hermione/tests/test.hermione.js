const assert = require('assert');

describe('Интерграционные тесты' , () => {
  it('При открытии главной страницы происходит переадресация', function() {
    const { baseUrl } = this.browser.options;
    return this.browser
      .url('/')
      .pause(2000)
      .getUrl()
      .then((url) => {
        assert.equal(url ===`${baseUrl}/settings` || url === `${baseUrl}/buildHistory`, true);
      });
  })

  it('Настройки сохраняются происходит переход на страницу с историей билдов', function() {
    const { baseUrl } = this.browser.options;
    return this.browser
      .url('/settings')
      .pause(1000)
      .setValue('#repoField', 'WoodenPC/test')
      .setValue('#commandField', 'npm run install')
      .setValue('#branchField', 'master')
      .setValue('#periodField', '10')
      .click('.Button=Save')
      .pause(5000)
      .getUrl()
      .then((url) => {
        assert.equal(url, `${baseUrl}/buildHistory`);
      });
  });

  it('запуск сборки по коммиту работает, сборка появляется в списке', function() {
    const testHash = '6181cd7a89cbc0076250ffc48cf7e8000b1d19c7'
    return this.browser
      .url('buildHistory')
      .pause(1000)
      .click('.Button=Run build')
      .setValue('#commitHashField', testHash)
      .$('.Form')
      .click('.Button=Run build')
      .pause(1000)
      .refresh(true)
      .isExisting(`.Card=${testHash}`);
  });

  it('ребилд сборки работает, происходит переход на новую страницу сборку', function() {
    let firstUrl = this.browser.options.baseUrl;
    return this.browser
      .url('buildHistory')
      .pause(2000)
      .$('.Card')
      .click()
      .pause(4000)
      .getUrl()
      .then((url) => {
        firstUrl = url;
      })
      .click('.Button=Rebuild')
      .pause(2000)
      .getUrl()
      .then((url) => {
        assert.notEqual(firstUrl, url);
      })
      .isExisting('.Card')
      .isExisting('.LogDetails');
  });
});