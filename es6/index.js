#!/usr/bin/env node
'use strict';

let start = (() => {
  var _ref = _asyncToGenerator(function* ({
    sessions = [{ port: '9000' }, { port: '9001' }],
    port = 8000
  } = {}) {
    yield (0, _killPort2.default)(port);
    let allSessions = sessions;
    const browser = new _debugBrowser2.default({
      sessions
    });
    browser.start();
    new _server2.default({
      onTargets(targets = []) {
        if (!Array.isArray(targets)) return;
        const targetSessions = targets.map(id => ({ id, port }));
        const next = [...allSessions, ...targetSessions];
        browser.setSessions(next);
      }
    });
  });

  return function start() {
    return _ref.apply(this, arguments);
  };
})();

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _debugBrowser = require('./debugBrowser');

var _debugBrowser2 = _interopRequireDefault(_debugBrowser);

var _killPort = require('kill-port');

var _killPort2 = _interopRequireDefault(_killPort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

start();
//# sourceMappingURL=index.js.map