import {
  PLATFORMINFO
} from "./env"
import { read } from "fs";

/**
 * 获取localStorage
 * @param {any} name
 * @returns {any} localStorage
 */
export const getStore = name => {
  if (!name) return
  let res = window.localStorage.getItem(name);
  if (res) {
    let temp = JSON.parse(res);
    temp = typeof temp === "object" ? temp : res;
    return temp;
  }
}

/**
 * 存储localStorage
 * @param {any} name
 * @param {any} content
 */
export const setStore = (name, content) => {
  if (!name) return
  let store = getStore(name);
  _.extend(store, content);
  content = JSON.stringify(store);
  window.localStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 * @param {any} name
 * @returns {any} sessionStorage
 */
export const getSessionStore = name => {
  if (!name) return
  let res = window.sessionStorage.getItem(name);
  let temp = {};
  if (res) {
    temp = JSON.parse(res);
    temp = typeof temp === "object" ? temp : res;
  }
  return temp;
}

/**
 * 存储sessionStorage
 * @param {any} name
 * @param {any} content
 */
export const setSessionStore = (name, content) => {
  if (!name) return
  let store = getSessionStore(name);
  _.extend(store, content);
  content = JSON.stringify(store);
  window.sessionStorage.setItem(name, content);
}

/**
 * 获取开放平台信息
 * @returns {any} 开放平台信息
 */
export const getPlatformInfo = () => {
  let res = window.sessionStorage.getItem(PLATFORMINFO);
  if (res) {
    let temp = JSON.parse(res);
    return temp;
  }
  return null;
}
/**
 * 是否是开放平台
 * @returns {Boolean} 是否
 */
export const isOpenPlatform = () => {
  let res = getPlatformInfo();
  return res && res.isOpenPlatform || false;
}
