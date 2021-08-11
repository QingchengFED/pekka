exports.array2obj = function array2obj(arr) {
  return arr.reduce((pre, cur) => {
    pre[cur] = '';
    return pre;
  }, {});
};
