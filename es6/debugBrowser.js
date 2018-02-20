'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _r = require('@mcro/r2');

var _r2 = _interopRequireDefault(_r);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const sleep = ms => new Promise(res => setTimeout(res, ms));

process.on('unhandledRejection', function (reason) {
  console.log(reason);
  process.exit(0);
});

let exited = false;
process.on('beforeExit', () => {
  exited = true;
});

const DEV_URL = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=';

let DebugApps = class DebugApps {
  constructor({ sessions = [] }) {
    var _this = this;

    this.render = _asyncToGenerator(function* () {
      if (exited) return;
      const urls = yield _this.getSessions();
      if (!_this.browser) {
        console.log('error no browser wierd');
        return;
      }
      let pages = yield _this.browser.pages();
      if (!pages) {
        console.log('Error DebugBrowser.render: no pages');
        return;
      }
      for (const [index, url] of urls.entries()) {
        if (_this.urls[index] === url) {
          continue;
        }
        _this.urls[index] = url;
        if (!url) continue;
        if (!pages[index]) {
          yield _this.browser.newPage();
          yield sleep(20);
          pages = yield _this.browser.pages();
          if (!pages) {
            console.log('weird no pages............');
            return;
          }
        }
        const page = pages[index];
        yield Promise.all([page.waitForNavigation({
          timeout: 5000,
          waitUntil: 'domcontentloaded'
        }), page.goto(url)]);
        yield page.evaluate(function () {
          // open console
          let x = document.getElementById('tab-console');
          if (x) x.click();else {
            console.log('no element');
          }
        });
      }
    });

    this.sessions = sessions;
    this.urls = [];
  }

  setSessions(next) {
    this.sessions = next;
    this.render();
  }

  start() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.browser = yield _puppeteer2.default.launch({
        headless: false,
        args: [`--window-size=${800},${600}`]
      });
      // one less because it starts with a tab already open
      yield Promise.all(_this2.sessions.slice(1).map(function () {
        return _this2.browser.newPage();
      }));
      setInterval(_this2.render, 500);
    })();
  }

  getSessions() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return yield Promise.all(_this3.sessions.map(_this3.getDevUrl));
    })();
  }

  getDevUrl({ port, id }) {
    return _asyncToGenerator(function* () {
      const url = `http://127.0.0.1:${port}/${id ? `${id}/` : ''}json`;
      try {
        const [firstAnswer, ...rest] = yield _r2.default.get(url).json;
        if (rest.length) console.log('rest', rest);
        const { webSocketDebuggerUrl } = firstAnswer;
        if (!webSocketDebuggerUrl) {
          return null;
        }
        return `${DEV_URL}/${webSocketDebuggerUrl.replace(`ws://`, '')}`;
      } catch (err) {
        console.log('error fetching', url);
        return null;
      }
    })();
  }

};
exports.default = DebugApps;
//# sourceMappingURL=debugBrowser.js.map