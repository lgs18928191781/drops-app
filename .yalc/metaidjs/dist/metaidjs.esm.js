/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "#showmoney-popup,\r\n#mainframewrapper {\r\n  font-size: 16px;\r\n  position: fixed;\r\n  left: 0;\r\n  right: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n}\r\n#showmoney-popup {\r\n  z-index: 9999;\r\n  display: none;\r\n  animation: smfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\r\n}\r\n#showmoney-main-frame {\r\n  display: inline-block;\r\n  max-width: 500px;\r\n  width: 90vw;\r\n  height: 218px;\r\n  border-radius: 0.5em;\r\n  overflow: hidden;\r\n}\r\n#mainframewrapper {\r\n  z-index: 9998;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n#showmoney-popup.active,\r\n#mainframewrapper.active {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  animation: smfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\r\n}\r\n\r\n.sm-popup-box {\r\n  width: 90vw;\r\n  max-width: 500px;\r\n  max-height: 90vh;\r\n  overflow-y: auto;\r\n  background: #FFF;\r\n  border-radius: 0.5em;\r\n  border-top: 0.8em solid #2196F3;\r\n  box-shadow: 0 0 0.8em rgba(0,0,0, .4);\r\n}\r\n.error-popup .sm-popup-box {\r\n  border-top: 0.8em solid #FF5252;\r\n}\r\n#showmoney-popup.active .sm-popup-box {\r\n  animation: smslideIn .3s cubic-bezier(0, 0, .2, 1);\r\n}\r\n#showmoney-popup .sm-popup-box {\r\n  animation: smslideOut .3s cubic-bezier(0, 0, .2, 1);\r\n}\r\n.sm-linear-progress {\r\n  display: none;\r\n  background: #bbdefb;\r\n  height: 6px;\r\n  position: relative;\r\n  width: 100%;\r\n  margin: 0 auto;\r\n  overflow: hidden;\r\n  animation: start 0.3s ease-in;\r\n}\r\n.loading .sm-linear-progress {\r\n  display: inherit;\r\n}\r\n.sm-linear-progress .bar {\r\n  position: absolute;\r\n  background: #2196F3;\r\n  /* background: #eab300; */\r\n  transition: transform 0.2s linear;\r\n  transition: transform 0.2s linear;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 100%;\r\n}\r\n.sm-linear-progress .bar1 {\r\n  animation: progressLinearMovement 2.5s infinite;\r\n  animation-delay: 0;\r\n}\r\n.sm-linear-progress .bar2 {\r\n  left: -100%;\r\n  animation: progressLinearMovement 2.5s infinite;\r\n  animation-delay: 0.7s;\r\n}\r\n@keyframes progressLinearMovement {\r\n  0% {\r\n    left: -100%;\r\n  }\r\n  50% {\r\n    left: 100%;\r\n  }\r\n  100% {\r\n    left: 100%;\r\n  }\r\n}\r\n\r\n.sm-popup-header {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  position: relative;\r\n}\r\n.sm-popup-title {\r\n  font-weight: 600;\r\n  font-size: 1.25em;\r\n  line-height: 1.25;\r\n  color: #222;\r\n  box-sizing: border-box;\r\n  text-align: center;\r\n  width: 100%;\r\n  padding: 1em;\r\n}\r\n.sm-popup-close {\r\n  cursor: pointer;\r\n  font-family: inherit;\r\n  font-size: 120%;\r\n  line-height: 1.8;\r\n  border: 0;\r\n  background: transparent;\r\n  position: absolute;\r\n  right: 0.5em;\r\n  top: 0;\r\n  outline: none;\r\n}\r\n.sm-popup-close:before {\r\n  content: \"\\2715\";\r\n}\r\n.sm-popup-content {\r\n  margin: 1.5em 1em;\r\n  line-height: 1.5;\r\n  text-align: center;\r\n  color: #333;\r\n}\r\n.sm-popup-footer {\r\n  display: flex;\r\n  border-top: 1px solid #EEE;\r\n  justify-content: space-between;\r\n}\r\n.sm-popup-btn {\r\n  font-size: .875em;\r\n  padding: 1em;\r\n  border-radius: .25em;\r\n  border: 0;\r\n  cursor: pointer;\r\n  background: transparent;\r\n  will-change: transform;\r\n  transform: translateZ(0);\r\n  transition: transform .25s ease-out;\r\n  line-height: 1.15;\r\n  display: inline-block;\r\n  width: 49.99%;\r\n  outline: none;\r\n}\r\n.sm-popup-btn1 {\r\n  color: #888;\r\n  border-right: 1px solid #EEE;\r\n}\r\n.loading .sm-popup-btn2 {\r\n  color: #999;\r\n  cursor: not-allowed\r\n}\r\n.confirm-popup .amount-btn {\r\n  background: #eab300;\r\n  margin: 0 auto;\r\n  padding: 0.5em;\r\n  border-radius: 100px;\r\n  text-align: center;\r\n  width: 70%;\r\n  color: #FFF;\r\n  font-size: 1.2em;\r\n}\r\n.confirm-popup .amount-btn span {\r\n  font-size: 0.75em;\r\n  color: #EEE;\r\n}\r\n.confirm-popup .checkbox-group {\r\n  text-align: center;\r\n  margin: 1em 0;\r\n  color: #888;\r\n  font-size: 0.8em;\r\n  cursor: pointer;\r\n}\r\n.confirm-popup .checkbox-group input {\r\n  margin-right: 0.5em;\r\n}\r\n.confirm-popup .checkbox-group input:checked + label {\r\n  color: #eab300\r\n}\r\n\r\n@keyframes smslideIn {\r\n  from { transform: translateY(15%); }\r\n    to { transform: translateY(0); }\r\n}\r\n@keyframes smfadeIn {\r\n  from { opacity: 0; }\r\n    to { opacity: 1; }\r\n}\r\n@keyframes smfadeOut {\r\n  from { opacity: 1; }\r\n    to { opacity: 0; }\r\n}\r\n@keyframes smslideOut {\r\n  from { transform: translateY(0); }\r\n  to { transform: translateY(-10%); }\r\n}";
styleInject(css_248z);

/*
 * @Author: ohosanna
 * @Date: 2020-03-18 14:45:22
 * @Last Modified by: ohosanna
 * @Last Modified time: 2020-07-08 16:48:53
 */
var Popup = /** @class */ (function () {
    function Popup() {
        var popupEl = document.createElement('div');
        popupEl.setAttribute('id', 'showmoney-popup');
        document.body.appendChild(popupEl);
        this.popupWrapper = popupEl;
    }
    Popup.prototype.info = function (options) {
        this.show('info', options);
    };
    Popup.prototype.error = function (options) {
        this.show('error', options);
    };
    Popup.prototype.loading = function () {
        console.log(this.popupWrapper);
        this.show('info', { message: 'test' });
    };
    Popup.prototype.confirm = function (options) {
        var _this = this;
        if (!options.buttonAction) {
            options.buttonAction = function () {
                _this.close();
            };
        }
        this.show('confirm', options);
    };
    Popup.prototype.show = function (type, options) {
        if (type === void 0) { type = 'info'; }
        var popupDom = this.generatePopupContent(options);
        this.popupWrapper.appendChild(popupDom);
        this.popupWrapper.className = type + '-popup' + ' active';
    };
    Popup.prototype.close = function () {
        this.popupWrapper.className = '';
        this.popupWrapper.innerHTML = '';
    };
    Popup.prototype.generatePopupContent = function (options) {
        var _this = this;
        var box = document.createElement('div');
        box.className = 'sm-popup-box ' + (options.className ? options.className : '');
        // progress
        var progress = document.createElement('div');
        progress.className = 'sm-linear-progress';
        var bar1 = document.createElement('div');
        bar1.className = 'bar bar1';
        var bar2 = document.createElement('div');
        bar2.className = 'bar bar2';
        progress.appendChild(bar1);
        progress.appendChild(bar2);
        box.appendChild(progress);
        // header
        var popupHeader = document.createElement('header');
        popupHeader.className = 'sm-popup-header';
        var popupTitle = document.createElement('h2');
        popupTitle.className = 'sm-popup-title';
        if (options.title) {
            popupTitle.innerHTML = options.title;
            popupHeader.appendChild(popupTitle);
        }
        var closeBtn = document.createElement('button');
        closeBtn.className = 'sm-popup-close';
        closeBtn.onclick = function () { _this.close(); };
        if (options.showClose !== false) {
            popupHeader.appendChild(closeBtn);
        }
        // content
        var popupContent = document.createElement('div');
        popupContent.className = 'sm-popup-content';
        popupContent.innerHTML = options.message;
        // footer
        var popupFooter = document.createElement('footer');
        popupFooter.className = 'sm-popup-footer';
        if (options.buttonText) {
            var button = document.createElement('button');
            button.className = 'sm-popup-btn sm-popup-btn1';
            button.innerText = options.buttonText;
            if (options.buttonUrl) {
                var url_1 = options.buttonUrl;
                button.onclick = function () {
                    window.open(url_1, '_blank');
                };
            }
            if (options.buttonAction) {
                button.onclick = function () {
                    if (typeof options.buttonAction === 'function')
                        options.buttonAction();
                };
            }
            popupFooter.appendChild(button);
        }
        if (options.buttonText2) {
            var button2 = document.createElement('button');
            button2.className = 'sm-popup-btn sm-popup-btn2';
            button2.innerText = options.buttonText2;
            if (options.buttonUrl2) {
                var url_2 = options.buttonUrl2;
                button2.onclick = function () {
                    if (options.useCurrentWindow) {
                        window.open(url_2);
                    }
                    else {
                        window.open(url_2, '_blank');
                    }
                };
            }
            if (options.buttonAction2) {
                button2.onclick = function () {
                    if (typeof options.buttonAction2 === 'function')
                        options.buttonAction2();
                };
            }
            popupFooter.appendChild(button2);
        }
        box.appendChild(popupHeader);
        box.appendChild(popupContent);
        box.appendChild(popupFooter);
        return box;
    };
    return Popup;
}());
var Popup$1 = new Popup();

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
var generateRandomId = function () {
    return (Math.floor(Math.random() * 100000000000000000)).toString();
};
var PostmessageClient = /** @class */ (function () {
    function PostmessageClient(window) {
        var _this = this;
        this._onMessageReceived = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var message, handler, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!event.data || !event.data.v1) {
                            return [2 /*return*/];
                        }
                        message = event.data.v1;
                        handler = this.handlers[message.topic];
                        if (!handler) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, handler(message)];
                    case 2:
                        response = _a.sent();
                        if (message.reply) {
                            this.send(message.topic + ":reply", response, { repliesTo: message.messageId });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.handlers = {};
        this.targetWindow = window;
        this._pendingMessages = [];
        this._deliverMessages = false;
        this._replayQueue = {};
    }
    PostmessageClient.prototype.start = function () {
        window.addEventListener('message', this._onMessageReceived, false);
    };
    PostmessageClient.prototype.finalize = function () {
        window.removeEventListener('message', this._onMessageReceived, false);
    };
    PostmessageClient.prototype.subscribe = function (topic, handler) {
        this.handlers[topic] = handler;
    };
    PostmessageClient.prototype.send = function (topic, payload, metadata) {
        if (metadata === void 0) { metadata = {}; }
        if (!this.targetWindow) {
            return console.log('请指定目标窗口');
        }
        var messageId = generateRandomId();
        var message = {
            v1: __assign({ topic: topic,
                payload: payload,
                messageId: messageId }, metadata)
        };
        this.targetWindow.postMessage(message, '*');
        return message;
    };
    return PostmessageClient;
}());

var generateRandomId$1 = function () {
    return (Math.floor(Math.random() * 100000000000000000)).toString();
};
var hasClass = function (el, cls) {
    return el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};
var addClass = function (el, cls) {
    if (!hasClass(el, cls))
        el.className += " " + cls;
};
var MetaIdJs = /** @class */ (function () {
    function MetaIdJs(options) {
        var _this = this;
        this.postMessage = new PostmessageClient(window);
        this.mainFrameEl = null;
        this.accessToken = '';
        this.isInjectMainFrame = false;
        this.isLoaded = false;
        this._handlers = {};
        this.onError = function (res) {
            Popup$1.error({
                message: res.data.message
            });
        };
        this.handleCreateNodeSuccess = function (res) {
            var _a, _b;
            Popup$1.close();
            (_b = (_a = _this.mainFrameEl) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.setAttribute('style', 'display: none;');
            var payload = res.payload;
            var callback = _this._handlers[payload.handlerId].callback;
            if (callback) {
                callback(payload);
            }
        };
        this.handleCreateNodeError = function (res) {
            var payload = res.payload;
            Popup$1.close();
            Popup$1.error({
                message: payload.data && payload.data.message ? payload.data.message : res
            });
        };
        this.handleConfirmCreateNode = function (res) {
            var _a, _b;
            // console.log("confirm", res);
            Popup$1.close();
            (_b = (_a = _this.mainFrameEl) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeAttribute('style');
        };
        this.handleCloseCreateNode = function (res) {
            var _a, _b;
            Popup$1.close();
            (_b = (_a = _this.mainFrameEl) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.setAttribute('style', 'display: none;');
            var payload = res.payload;
            var callback = _this._handlers[payload.handlerId].onCancel;
            if (callback) {
                delete payload.handlerId;
                callback(payload);
            }
        };
        this.handleCallback = function (res) {
            var payload = res.payload;
            var callback = _this._handlers[payload.handlerId].callback;
            if (callback) {
                delete payload.handlerId;
                callback(payload);
            }
        };
        this.handleSdkLoaded = function () {
            _this.isLoaded = true;
            if (typeof _this.onLoaded === 'function') {
                _this.onLoaded();
            }
        };
        this.handleCommonError = function (res) {
            console.log('error', res);
            var payload = res.payload;
            Popup$1.close();
            if (payload.code === 202) {
                Popup$1.confirm({
                    message: 'User authentication expired.',
                    showClose: false,
                    buttonText: 'Cancel',
                    buttonText2: 'Login',
                    buttonUrl2: _this.SHOWMONEY_URL + "/userLogin?response_type=code&client_id=" + _this.oauthSettings.clientId + "&redirect_uri=" + _this.oauthSettings.redirectUri + "&scope=app&from=" + _this.oauthSettings.redirectUri
                });
            }
            else {
                _this.onError(payload);
            }
        };
        this.handleLoading = function () {
            _this.showLoadingPopup();
        };
        this.handleNotEnoughMoney = function (res) {
            var payload = res.payload;
            var message = payload.data.message;
            Popup$1.close();
            Popup$1.confirm({
                message: message ? message : 'Not enough money',
                showClose: false,
                buttonText: 'Cancel',
                buttonText2: 'Top up BSV',
                buttonUrl2: _this.SHOWMONEY_URL
            });
        };
        this.genesisNFT = function (params) {
            if (_this.isInjectMainFrame) {
                if (params.callback) {
                    var handlerId = generateRandomId$1();
                    _this._handlers[handlerId] = {};
                    if (params.callback) {
                        _this._handlers[handlerId]['callback'] = params.callback;
                    }
                    params = __assign(__assign({}, params), { handlerId: handlerId });
                    if (params.callback) {
                        delete params.callback;
                    }
                }
                window.mainFrameMessage.send('genesisNFT', params);
                // console.log(this._handlers)
            }
            else {
                throw new Error('showmoney frame 未加载');
            }
        };
        this.issueNFT = function (params) {
            debugger;
            if (params.callback) {
                var handlerId = generateRandomId$1();
                _this._handlers[handlerId] = {};
                if (params.callback) {
                    _this._handlers[handlerId]['callback'] = params.callback;
                }
                params = __assign(__assign({}, params), { handlerId: handlerId });
                if (params.callback) {
                    delete params.callback;
                }
            }
            if (_this.isInjectMainFrame) {
                window.mainFrameMessage.send('issueNFT', params);
                // console.log(this._handlers)
            }
            else {
                throw new Error('showmoney frame 未加载');
            }
        };
        this.SHOWMONEY_URL = options.baseUri || "https://www.showmoney.app";
        this.onLoaded = options.onLoaded;
        if (typeof options.onError === 'function') {
            this.onError = options.onError;
        }
        this.oauthSettings = __assign(__assign({}, options.oauthSettings), { clientSecret: '', scope: 'app', responseType: 'code' });
        this.init();
    }
    /**
     * injectMainFrame  注入主框架
     */
    MetaIdJs.prototype.injectMainFrame = function () {
        var _this = this;
        var mainFrame = document.createElement('iframe');
        var mainFrameWrapper = document.createElement('div');
        mainFrame.setAttribute('id', 'showmoney-main-frame');
        mainFrame.setAttribute('src', this.SHOWMONEY_URL + '/iframe');
        mainFrameWrapper.setAttribute('id', 'mainframewrapper');
        mainFrameWrapper.setAttribute('style', 'display: none;');
        mainFrameWrapper.appendChild(mainFrame);
        document.body.appendChild(mainFrameWrapper);
        // 报告 main-frame 载入完成
        mainFrame.onload = function () {
            if (mainFrame.contentWindow) {
                _this.mainFrameEl = mainFrame;
                // 无法把postmessage实例保留，会报跨域错误
                window.mainFrameMessage = new PostmessageClient(mainFrame.contentWindow);
                window.mainFrameMessage.send('send-options', _this.oauthSettings);
                // window.mainFrameMessage = mainFrameMessage
                _this.isInjectMainFrame = true;
                // console.log('mainFrame loaded')
            }
        };
    };
    MetaIdJs.prototype.initHandle = function () {
        var functionObj = [
            "swapreqswapargs",
            "estimateSwapToken2Amount",
            "estimateSwapToken1Amount",
            "isSupportedFt",
            "swapft",
            "getBalance",
        ];
        var _loop_1 = function (item) {
            this_1[item] = function (params) {
                var defParams = params;
                if (params.callback) {
                    var handlerId = generateRandomId$1();
                    this._handlers[handlerId] = {};
                    this._handlers[handlerId].callback = params.callback;
                    defParams.handlerId = handlerId;
                }
                delete defParams.callback;
                window.mainFrameMessage.send(item, defParams);
            };
        };
        var this_1 = this;
        for (var _i = 0, functionObj_1 = functionObj; _i < functionObj_1.length; _i++) {
            var item = functionObj_1[_i];
            _loop_1(item);
        }
    };
    /**
     * getUserInfo
     */
    MetaIdJs.prototype.getUserInfo = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('get-user-info', defParams);
    };
    /**
     * signMessage
     */
    MetaIdJs.prototype.signMessage = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('sign-messgae', defParams);
    };
    /**
     * eciesEncryptData
     */
    MetaIdJs.prototype.eciesEncryptData = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('ecies-encrypt-data', defParams);
    };
    MetaIdJs.prototype.eciesDecryptData = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('ecies-decrypt-data', defParams);
    };
    /**
     * ecdhEncryptData
     */
    MetaIdJs.prototype.ecdhEncryptData = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('ecdh-encrypt-data', defParams);
    };
    MetaIdJs.prototype.ecdhDecryptData = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('ecdh-decrypt-data', defParams);
    };
    MetaIdJs.prototype.getFTList = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('get-ftlist', defParams);
    };
    // 版本兼容
    MetaIdJs.prototype.addProtocolNode = function (params) {
        this.sendMetaDataTx(params);
    };
    /**
     * createProtocolNode
     */
    MetaIdJs.prototype.sendMetaDataTx = function (params) {
        if (!params.checkOnly) {
            this.showLoadingPopup();
        }
        if (params.callback || params.onCancel) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            if (params.callback) {
                this._handlers[handlerId]['callback'] = params.callback;
            }
            if (params.onCancel) {
                this._handlers[handlerId]['onCancel'] = params.onCancel;
            }
            params = __assign(__assign({}, params), { handlerId: handlerId });
            delete params.callback;
            delete params.onCancel;
        }
        if (this.isInjectMainFrame) {
            window.mainFrameMessage.send('create-node', params);
            // console.log(this._handlers)
        }
        else {
            throw new Error('showmoney frame 未加载');
        }
    };
    MetaIdJs.prototype.payToAddress = function (params) {
        var defParams = params;
        if (params.callback) {
            var handlerId = generateRandomId$1();
            this._handlers[handlerId] = {};
            this._handlers[handlerId].callback = params.callback;
            defParams.handlerId = handlerId;
        }
        delete defParams.callback;
        window.mainFrameMessage.send('pay-to-address', defParams);
    };
    MetaIdJs.prototype.showLoadingPopup = function () {
        var popupEl = document.getElementById('showmoney-popup');
        if (!popupEl)
            return;
        Popup$1.info({
            message: 'Processing data...',
            showClose: false
        });
        addClass(popupEl, 'loading');
    };
    MetaIdJs.prototype.handleErrorNotLoggedIn = function (resolve) {
        var message = resolve.payload;
        Popup$1.close();
        Popup$1.info(message.popup);
    };
    MetaIdJs.prototype.init = function () {
        this.injectMainFrame();
        // 监听信息
        this.postMessage.start();
        this.initHandle();
        this.postMessage.subscribe('sdk-loaded', this.handleSdkLoaded);
        this.postMessage.subscribe('error.not-logged-in', this.handleErrorNotLoggedIn);
        this.postMessage.subscribe('loading', this.handleLoading);
        this.postMessage.subscribe('success.create-node', this.handleCreateNodeSuccess);
        this.postMessage.subscribe('confirm.create-node', this.handleConfirmCreateNode);
        this.postMessage.subscribe('close.create-node', this.handleCloseCreateNode);
        this.postMessage.subscribe('error.create-node', this.handleCreateNodeError);
        this.postMessage.subscribe('error.not-enough-money', this.handleNotEnoughMoney);
        this.postMessage.subscribe('receive-callback', this.handleCallback);
        this.postMessage.subscribe('error.common', this.handleCommonError);
    };
    return MetaIdJs;
}());

window.MetaIdJs = MetaIdJs;

export default MetaIdJs;
//# sourceMappingURL=metaidjs.esm.js.map
