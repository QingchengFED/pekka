const { reactive, setup, createApp } = Vue;

let searchParams = new URLSearchParams(location.search);

createApp({
  setup() {
    const state = reactive({
      apps,
      wordsArray: obj2arr(data),
      onlyEmpty: +searchParams.get('onlyEmpty'),
      q: searchParams.get('q'),
    });

    function submit() {
      updateWords(arr2obj(state.wordsArray))
        .then(() => {
          window.alert('提交成功');
        })
        .catch(window.alert);
    }
    function toggleEmpty() {
      searchParams.set('onlyEmpty', +!state.onlyEmpty);
      location.search = searchParams.toString();
    }
    function selectAPP(e) {
      location.pathname = `/fe-i18n/admin/${e.target.value}`;
    }
    function search() {
      searchParams.set('q', state.q);
      location.search = searchParams.toString();
    }
    return {
      state,
      submit,
      search,
      selectAPP,
      toggleEmpty,
    };
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
