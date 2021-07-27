!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).metaidjs=n()}(this,(function(){"use strict";
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
    ***************************************************************************** */var e=function(){return(e=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var a in n=arguments[t])Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a]);return e}).apply(this,arguments)};function n(e,n){var t,r,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=n.call(e,i)}catch(e){o=[6,e],r=0}finally{t=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}!function(e,n){void 0===n&&(n={});var t=n.insertAt;if(e&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===t&&r.firstChild?r.insertBefore(a,r.firstChild):r.appendChild(a),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(document.createTextNode(e))}}('#showmoney-popup,\r\n#mainframewrapper {\r\n  font-size: 16px;\r\n  position: fixed;\r\n  left: 0;\r\n  right: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n}\r\n#showmoney-popup {\r\n  z-index: 9999;\r\n  display: none;\r\n  animation: smfadeOut 0.3s cubic-bezier(0, 0, 0.2, 1);\r\n}\r\n#showmoney-main-frame {\r\n  display: inline-block;\r\n  max-width: 500px;\r\n  width: 90vw;\r\n  height: 218px;\r\n  border-radius: 0.5em;\r\n  overflow: hidden;\r\n}\r\n#mainframewrapper {\r\n  z-index: 9998;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n#showmoney-popup.active,\r\n#mainframewrapper.active {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  animation: smfadeIn 0.3s cubic-bezier(0, 0, 0.2, 1);\r\n}\r\n\r\n.sm-popup-box {\r\n  width: 90vw;\r\n  max-width: 500px;\r\n  max-height: 90vh;\r\n  overflow-y: auto;\r\n  background: #FFF;\r\n  border-radius: 0.5em;\r\n  border-top: 0.8em solid #2196F3;\r\n  box-shadow: 0 0 0.8em rgba(0,0,0, .4);\r\n}\r\n.error-popup .sm-popup-box {\r\n  border-top: 0.8em solid #FF5252;\r\n}\r\n#showmoney-popup.active .sm-popup-box {\r\n  animation: smslideIn .3s cubic-bezier(0, 0, .2, 1);\r\n}\r\n#showmoney-popup .sm-popup-box {\r\n  animation: smslideOut .3s cubic-bezier(0, 0, .2, 1);\r\n}\r\n.sm-linear-progress {\r\n  display: none;\r\n  background: #bbdefb;\r\n  height: 6px;\r\n  position: relative;\r\n  width: 100%;\r\n  margin: 0 auto;\r\n  overflow: hidden;\r\n  animation: start 0.3s ease-in;\r\n}\r\n.loading .sm-linear-progress {\r\n  display: inherit;\r\n}\r\n.sm-linear-progress .bar {\r\n  position: absolute;\r\n  background: #2196F3;\r\n  /* background: #eab300; */\r\n  transition: transform 0.2s linear;\r\n  transition: transform 0.2s linear;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 100%;\r\n}\r\n.sm-linear-progress .bar1 {\r\n  animation: progressLinearMovement 2.5s infinite;\r\n  animation-delay: 0;\r\n}\r\n.sm-linear-progress .bar2 {\r\n  left: -100%;\r\n  animation: progressLinearMovement 2.5s infinite;\r\n  animation-delay: 0.7s;\r\n}\r\n@keyframes progressLinearMovement {\r\n  0% {\r\n    left: -100%;\r\n  }\r\n  50% {\r\n    left: 100%;\r\n  }\r\n  100% {\r\n    left: 100%;\r\n  }\r\n}\r\n\r\n.sm-popup-header {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  position: relative;\r\n}\r\n.sm-popup-title {\r\n  font-weight: 600;\r\n  font-size: 1.25em;\r\n  line-height: 1.25;\r\n  color: #222;\r\n  box-sizing: border-box;\r\n  text-align: center;\r\n  width: 100%;\r\n  padding: 1em;\r\n}\r\n.sm-popup-close {\r\n  cursor: pointer;\r\n  font-family: inherit;\r\n  font-size: 120%;\r\n  line-height: 1.8;\r\n  border: 0;\r\n  background: transparent;\r\n  position: absolute;\r\n  right: 0.5em;\r\n  top: 0;\r\n  outline: none;\r\n}\r\n.sm-popup-close:before {\r\n  content: "\\2715";\r\n}\r\n.sm-popup-content {\r\n  margin: 1.5em 1em;\r\n  line-height: 1.5;\r\n  text-align: center;\r\n  color: #333;\r\n}\r\n.sm-popup-footer {\r\n  display: flex;\r\n  border-top: 1px solid #EEE;\r\n  justify-content: space-between;\r\n}\r\n.sm-popup-btn {\r\n  font-size: .875em;\r\n  padding: 1em;\r\n  border-radius: .25em;\r\n  border: 0;\r\n  cursor: pointer;\r\n  background: transparent;\r\n  will-change: transform;\r\n  transform: translateZ(0);\r\n  transition: transform .25s ease-out;\r\n  line-height: 1.15;\r\n  display: inline-block;\r\n  width: 49.99%;\r\n  outline: none;\r\n}\r\n.sm-popup-btn1 {\r\n  color: #888;\r\n  border-right: 1px solid #EEE;\r\n}\r\n.loading .sm-popup-btn2 {\r\n  color: #999;\r\n  cursor: not-allowed\r\n}\r\n.confirm-popup .amount-btn {\r\n  background: #eab300;\r\n  margin: 0 auto;\r\n  padding: 0.5em;\r\n  border-radius: 100px;\r\n  text-align: center;\r\n  width: 70%;\r\n  color: #FFF;\r\n  font-size: 1.2em;\r\n}\r\n.confirm-popup .amount-btn span {\r\n  font-size: 0.75em;\r\n  color: #EEE;\r\n}\r\n.confirm-popup .checkbox-group {\r\n  text-align: center;\r\n  margin: 1em 0;\r\n  color: #888;\r\n  font-size: 0.8em;\r\n  cursor: pointer;\r\n}\r\n.confirm-popup .checkbox-group input {\r\n  margin-right: 0.5em;\r\n}\r\n.confirm-popup .checkbox-group input:checked + label {\r\n  color: #eab300\r\n}\r\n\r\n@keyframes smslideIn {\r\n  from { transform: translateY(15%); }\r\n    to { transform: translateY(0); }\r\n}\r\n@keyframes smfadeIn {\r\n  from { opacity: 0; }\r\n    to { opacity: 1; }\r\n}\r\n@keyframes smfadeOut {\r\n  from { opacity: 1; }\r\n    to { opacity: 0; }\r\n}\r\n@keyframes smslideOut {\r\n  from { transform: translateY(0); }\r\n  to { transform: translateY(-10%); }\r\n}');var t=new(function(){function e(){var e=document.createElement("div");e.setAttribute("id","showmoney-popup"),document.body.appendChild(e),this.popupWrapper=e}return e.prototype.info=function(e){this.show("info",e)},e.prototype.error=function(e){this.show("error",e)},e.prototype.loading=function(){console.log(this.popupWrapper),this.show("info",{message:"test"})},e.prototype.confirm=function(e){var n=this;e.buttonAction||(e.buttonAction=function(){n.close()}),this.show("confirm",e)},e.prototype.show=function(e,n){void 0===e&&(e="info");var t=this.generatePopupContent(n);this.popupWrapper.appendChild(t),this.popupWrapper.className=e+"-popup active"},e.prototype.close=function(){this.popupWrapper.className="",this.popupWrapper.innerHTML=""},e.prototype.generatePopupContent=function(e){var n=this,t=document.createElement("div");t.className="sm-popup-box "+(e.className?e.className:"");var r=document.createElement("div");r.className="sm-linear-progress";var a=document.createElement("div");a.className="bar bar1";var o=document.createElement("div");o.className="bar bar2",r.appendChild(a),r.appendChild(o),t.appendChild(r);var i=document.createElement("header");i.className="sm-popup-header";var s=document.createElement("h2");s.className="sm-popup-title",e.title&&(s.innerHTML=e.title,i.appendChild(s));var l=document.createElement("button");l.className="sm-popup-close",l.onclick=function(){n.close()},!1!==e.showClose&&i.appendChild(l);var c=document.createElement("div");c.className="sm-popup-content",c.innerHTML=e.message;var d=document.createElement("footer");if(d.className="sm-popup-footer",e.buttonText){var p=document.createElement("button");if(p.className="sm-popup-btn sm-popup-btn1",p.innerText=e.buttonText,e.buttonUrl){var u=e.buttonUrl;p.onclick=function(){window.open(u,"_blank")}}e.buttonAction&&(p.onclick=function(){"function"==typeof e.buttonAction&&e.buttonAction()}),d.appendChild(p)}if(e.buttonText2){var h=document.createElement("button");if(h.className="sm-popup-btn sm-popup-btn2",h.innerText=e.buttonText2,e.buttonUrl2){var m=e.buttonUrl2;h.onclick=function(){e.useCurrentWindow?window.open(m):window.open(m,"_blank")}}e.buttonAction2&&(h.onclick=function(){"function"==typeof e.buttonAction2&&e.buttonAction2()}),d.appendChild(h)}return t.appendChild(i),t.appendChild(c),t.appendChild(d),t},e}()),r=function(){function t(e){var t=this;this._onMessageReceived=function(e){return r=t,a=void 0,i=function(){var t,r,a,o;return n(this,(function(n){switch(n.label){case 0:if(!e.data||!e.data.v1)return[2];if(t=e.data.v1,!(r=this.handlers[t.topic]))return[3,4];n.label=1;case 1:return n.trys.push([1,3,,4]),[4,r(t)];case 2:return a=n.sent(),t.reply&&this.send(t.topic+":reply",a,{repliesTo:t.messageId}),[3,4];case 3:throw o=n.sent(),console.error(o),o;case 4:return[2]}}))},new((o=void 0)||(o=Promise))((function(e,n){function t(e){try{l(i.next(e))}catch(e){n(e)}}function s(e){try{l(i.throw(e))}catch(e){n(e)}}function l(n){n.done?e(n.value):new o((function(e){e(n.value)})).then(t,s)}l((i=i.apply(r,a||[])).next())}));var r,a,o,i},this.handlers={},this.targetWindow=e,this._pendingMessages=[],this._deliverMessages=!1,this._replayQueue={}}return t.prototype.start=function(){window.addEventListener("message",this._onMessageReceived,!1)},t.prototype.finalize=function(){window.removeEventListener("message",this._onMessageReceived,!1)},t.prototype.subscribe=function(e,n){this.handlers[e]=n},t.prototype.send=function(n,t,r){if(void 0===r&&(r={}),!this.targetWindow)return console.log("请指定目标窗口");var a=Math.floor(1e17*Math.random()).toString(),o={v1:e({topic:n,payload:t,messageId:a},r)};return this.targetWindow.postMessage(o,"*"),o},t}(),a=function(){return Math.floor(1e17*Math.random()).toString()},o=function(e,n){(function(e,n){return e.className.match(new RegExp("(\\s|^)"+n+"(\\s|$)"))})(e,n)||(e.className+=" "+n)},i=function(){function n(n){var o=this;this.postMessage=new r(window),this.mainFrameEl=null,this.accessToken="",this.isInjectMainFrame=!1,this.isLoaded=!1,this._handlers={},this.onError=function(e){t.error({message:e.data.message})},this.handleCreateNodeSuccess=function(e){var n,r;t.close(),null===(r=null===(n=o.mainFrameEl)||void 0===n?void 0:n.parentElement)||void 0===r||r.setAttribute("style","display: none;");var a=e.payload,i=o._handlers[a.handlerId].callback;i&&i(a)},this.handleCreateNodeError=function(e){var n=e.payload;t.close(),t.error({message:n.data&&n.data.message?n.data.message:e})},this.handleConfirmCreateNode=function(e){var n,r;t.close(),null===(r=null===(n=o.mainFrameEl)||void 0===n?void 0:n.parentElement)||void 0===r||r.removeAttribute("style")},this.handleCloseCreateNode=function(e){var n,r;t.close(),null===(r=null===(n=o.mainFrameEl)||void 0===n?void 0:n.parentElement)||void 0===r||r.setAttribute("style","display: none;");var a=e.payload,i=o._handlers[a.handlerId].onCancel;i&&(delete a.handlerId,i(a))},this.handleCallback=function(e){var n=e.payload,t=o._handlers[n.handlerId].callback;t&&(delete n.handlerId,t(n))},this.handleSdkLoaded=function(){o.isLoaded=!0,"function"==typeof o.onLoaded&&o.onLoaded()},this.handleCommonError=function(e){console.log("error",e);var n=e.payload;t.close(),202===n.code?t.confirm({message:"User authentication expired.",showClose:!1,buttonText:"Cancel",buttonText2:"Login",buttonUrl2:o.SHOWMONEY_URL+"/userLogin?response_type=code&client_id="+o.oauthSettings.clientId+"&redirect_uri="+o.oauthSettings.redirectUri+"&scope=app&from="+o.oauthSettings.redirectUri}):o.onError(n)},this.handleLoading=function(){o.showLoadingPopup()},this.handleNotEnoughMoney=function(e){var n=e.payload.data.message;t.close(),t.confirm({message:n||"Not enough money",showClose:!1,buttonText:"Cancel",buttonText2:"Top up BSV",buttonUrl2:o.SHOWMONEY_URL})},this.genesisNFT=function(n){if(!o.isInjectMainFrame)throw new Error("showmoney frame 未加载");if(n.callback){var t=a();o._handlers[t]={},n.callback&&(o._handlers[t].callback=n.callback),(n=e(e({},n),{handlerId:t})).callback&&delete n.callback}window.mainFrameMessage.send("genesisNFT",n)},this.issueNFT=function(n){if(n.callback){var t=a();o._handlers[t]={},n.callback&&(o._handlers[t].callback=n.callback),(n=e(e({},n),{handlerId:t})).callback&&delete n.callback}if(!o.isInjectMainFrame)throw new Error("showmoney frame 未加载");window.mainFrameMessage.send("issueNFT",n)},this.SHOWMONEY_URL=n.baseUri||"https://www.showmoney.app",this.onLoaded=n.onLoaded,"function"==typeof n.onError&&(this.onError=n.onError),this.oauthSettings=e(e({},n.oauthSettings),{clientSecret:"",scope:"app",responseType:"code"}),this.init()}return n.prototype.injectMainFrame=function(){var e=this,n=document.createElement("iframe"),t=document.createElement("div");n.setAttribute("id","showmoney-main-frame"),n.setAttribute("src",this.SHOWMONEY_URL+"/iframe"),t.setAttribute("id","mainframewrapper"),t.setAttribute("style","display: none;"),t.appendChild(n),document.body.appendChild(t),n.onload=function(){n.contentWindow&&(e.mainFrameEl=n,window.mainFrameMessage=new r(n.contentWindow),window.mainFrameMessage.send("send-options",e.oauthSettings),e.isInjectMainFrame=!0)}},n.prototype.initHandle=function(){for(var e=function(e){n[e]=function(n){var t=n;if(n.callback){var r=a();this._handlers[r]={},this._handlers[r].callback=n.callback,t.handlerId=r}delete t.callback,window.mainFrameMessage.send(e,t)}},n=this,t=0,r=["swapreqswapargs","estimateSwapToken2Amount","estimateSwapToken1Amount","isSupportedFt","swapft","getBalance"];t<r.length;t++){e(r[t])}},n.prototype.getUserInfo=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("get-user-info",n)},n.prototype.signMessage=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("sign-messgae",n)},n.prototype.eciesEncryptData=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("ecies-encrypt-data",n)},n.prototype.eciesDecryptData=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("ecies-decrypt-data",n)},n.prototype.ecdhEncryptData=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("ecdh-encrypt-data",n)},n.prototype.ecdhDecryptData=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("ecdh-decrypt-data",n)},n.prototype.getFTList=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("get-ftlist",n)},n.prototype.addProtocolNode=function(e){this.sendMetaDataTx(e)},n.prototype.sendMetaDataTx=function(n){if(n.checkOnly||this.showLoadingPopup(),n.callback||n.onCancel){var t=a();this._handlers[t]={},n.callback&&(this._handlers[t].callback=n.callback),n.onCancel&&(this._handlers[t].onCancel=n.onCancel),delete(n=e(e({},n),{handlerId:t})).callback,delete n.onCancel}if(!this.isInjectMainFrame)throw new Error("showmoney frame 未加载");window.mainFrameMessage.send("create-node",n)},n.prototype.payToAddress=function(e){var n=e;if(e.callback){var t=a();this._handlers[t]={},this._handlers[t].callback=e.callback,n.handlerId=t}delete n.callback,window.mainFrameMessage.send("pay-to-address",n)},n.prototype.showLoadingPopup=function(){var e=document.getElementById("showmoney-popup");e&&(t.info({message:"Processing data...",showClose:!1}),o(e,"loading"))},n.prototype.handleErrorNotLoggedIn=function(e){var n=e.payload;t.close(),t.info(n.popup)},n.prototype.init=function(){this.injectMainFrame(),this.postMessage.start(),this.initHandle(),this.postMessage.subscribe("sdk-loaded",this.handleSdkLoaded),this.postMessage.subscribe("error.not-logged-in",this.handleErrorNotLoggedIn),this.postMessage.subscribe("loading",this.handleLoading),this.postMessage.subscribe("success.create-node",this.handleCreateNodeSuccess),this.postMessage.subscribe("confirm.create-node",this.handleConfirmCreateNode),this.postMessage.subscribe("close.create-node",this.handleCloseCreateNode),this.postMessage.subscribe("error.create-node",this.handleCreateNodeError),this.postMessage.subscribe("error.not-enough-money",this.handleNotEnoughMoney),this.postMessage.subscribe("receive-callback",this.handleCallback),this.postMessage.subscribe("error.common",this.handleCommonError)},n}();return window.MetaIdJs=i,i}));
//# sourceMappingURL=metaidjs.udm.js.map