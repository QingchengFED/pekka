const { reactive, ref, setup, createApp, unref } = Vue;

createApp({
  setup() {
    const wordsArray = reactive(obj2arr(data));
    const appName = apps.find(v => (v.id = id)).name;
    apps.push({id:2,name:'333'})
    function submit() {
      updateWords(arr2obj(wordsArray))
        .then(() => {
          window.alert('提交成功');
        })
        .catch(window.alert);
    }
    function selectAPP(e) {
      location.pathname = `/fe-i18n/admin/${e.target.value}`
    }
    return { wordsArray, submit, selectAPP, apps, appName };
  },
}).mount('#app');

function obj2arr(obj) {
  const array = [];
  Object.entries(obj).forEach(([key, val]) => {
    array.push({ key, val });
  });
  return array;
}

function arr2obj(arr) {
  return arr.reduce((obj, { key, val }) => {
    if (val) obj[key] = val;
    return obj;
  }, {});
}

function updateWords(data) {
  return axios.put(`/fe-i18n/api/i18n/${id}`, data);
}
