exports.array2obj = function array2obj(arr) {
  return arr.reduce((pre, cur) => {
    if (typeof cur === 'string') {
      pre[cur] = '';
    } else if (Array.isArray(cur)) {
      pre[cur[0]] = cur[1];
    }
    return pre;
  }, {});
};
