const { reactive, setup, createApp } = Vue;

createApp({
  setup() {
    const state = reactive({
      id,
      apps,
      wordsKeys: Object.keys(data['en-us']),
      zh_cn: data['zh-cn'],
      en_us: data['en-us'],
      empty: false,
    });

    function submit() {
      updateWords({ 'zh-cn': state.zh_cn, 'en-us': state.en_us })
        .then(() => {
          window.alert('提交成功');
        })
        .catch(window.alert);
    }
    function selectAPP(e) {
      location.pathname = `/fe-i18n/admin/${e.target.value}`;
    }
    function toggleEmpty() {
      state.empty = !state.empty;
      state.wordsKeys = state.empty ? filterEmpty(state.en_us) : Object.keys(state.en_us);
    }
    return {
      state,
      submit,
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

function updateWords(data) {
  return axios.put(`/fe-i18n/api/i18n/${id}`, data);
}

function filterEmpty(obj) {
  return Object.keys(obj).filter(key => {
    return !obj[key] || (typeof obj[key] === 'object' && filterEmpty(obj[key]).length);
  });
}
