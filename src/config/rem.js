// import {
//   removeStore
// } from "./util";
// import {
//   MultipleState
// } from './env'
(function (doc, win) {
  var docEl = doc.documentElement
  win.vanvyDocumentWidth = docEl.clientWidth;
  win.vanvyDocumentHeight = docEl.clientHeight;
  // var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  // var recalc = function () {
  //   var clientWidth = docEl.clientWidth
  //   if (!clientWidth) return
  //   docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
  // }
  // if (!doc.addEventListener) return
  // win.addEventListener(resizeEvt, recalc, false)
  // doc.addEventListener('DOMContentLoaded', recalc, false)
  //   var state = {
  //   title: "title",
  //   url: "#"
  // };
  // win.history.pushState(state, "title", "#");
  // win.addEventListener("popstate", function (e) {
  //   console.log(e)
  //   removeStore(MultipleState)
  // }, false);
})(document, window)
