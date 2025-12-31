/**
 * localStorage 封装工具
 * 提供安全的存储操作，带有错误处理
 */

const STORAGE_PREFIX = "bookkeeping_";

/**
 * 获取存储的数据
 * @param {string} key - 键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的数据或默认值
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
}

/**
 * 设置存储的数据
 * @param {string} key - 键名
 * @param {*} value - 要存储的值
 * @returns {boolean} 是否成功
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return false;
  }
}

/**
 * 删除存储的数据
 * @param {string} key - 键名
 * @returns {boolean} 是否成功
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
}

/**
 * 清空所有应用数据
 * @returns {boolean} 是否成功
 */
export function clearStorage() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}
