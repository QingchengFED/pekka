const { reactive, setup, createApp, getCurrentInstance } = Vue;

const zh_cn = data['zh-cn'];
const en_us = data['en-us'];


let cachedTableData; // 切换未翻译时缓存数据
const cacheZhSet = new Set(); //缓存中文去重

const app = createApp({
  setup() {
    const internalInstance = getCurrentInstance();
    const { globalProperties } = internalInstance.appContext.config;
    const tableData = formatTableData(zh_cn, en_us);

    const [zhUniqueKeys, enUniqueKeys] = diffObjs(zh_cn, en_us);
    const tip1 = zhUniqueKeys.length && `中文keys: ${zhUniqueKeys.join('、')} 在英文中不存在`;
    const tip2 = enUniqueKeys.length && `英文keys: ${enUniqueKeys.join('、')} 在中文中不存在`;
    
    const state = reactive({
      id,
      apps,
      tableData,
      empty: false,
      tip1,
      tip2,
    });

    function submit() {
      updateWords(getUpdateData(state.tableData))
        .then(() => {
          globalProperties.$message.success('提交成功');
        })
        .catch(window.alert);
    }
    function selectAPP(e) {
      location.pathname = `/fe-i18n/admin/${e.target.value}`;
    }
    function toggleEmpty() {
      state.empty = !state.empty;
      if (state.empty) cachedTableData = state.tableData;
      state.tableData = state.empty ? filterEmpty(state.tableData) : cachedTableData;
    }
    return {
      state,
      submit,
      selectAPP,
      toggleEmpty,
    };
  },
});

app.use(ElementPlus.default);
app.mount('#app');

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

function filterEmpty(arr) {
  return arr
    .map(item => {
      if (item.children) {
        item.children = filterEmpty(item.children);
        return item.children.length ? item : false;
      } else {
        return item.en ? false : item;
      }
    })
    .filter(v => v);
}

function formatTableData(zh_cn, en_us) {
  if (typeof zh_cn !== 'object') return;

  return Object.entries(zh_cn)
    .map(([k, v]) => {
      if (typeof v === 'object') {
        const children = formatTableData(v, en_us[k]);
        if (children.length) {
          return {
            key: k,
            id: idFunc(),
            children,
          };
        }
      } else if (!cacheZhSet.has(v)) {
        cacheZhSet.add(v);
        return {
          key: k,
          id: idFunc(),
          zh: v,
          en: en_us[k],
        };
      }
    })
    .filter(item => !!item);

  function idFunc() {
    return Math.random().toString(32).slice(-8);
  }
}

function getUpdateData(arr) {
  return {
    'zh-cn': arr2obj(arr, 'zh'),
    'en-us': arr2obj(arr, 'en'),
  };

  function arr2obj(arr, lang) {
    const init = {};
    return arr.reduce((data, item) => {
      if (Array.isArray(item.children)) {
        data[item.key] = arr2obj(item.children, lang);
      } else {
        data[item.key] = item[lang];
      }
      return data;
    }, init);
  }
}

/**
 * 暂时只支持比较两层对象key
 * @param {object} s1
 * @param {object} s2
 * @returns  各自独有的keys
 */
function diffObjs(s1, s2) {
  const keys1 = objKeysDeep(s1);
  const keys2 = objKeysDeep(s2);

  keys1.forEach(k => {
    if (keys2.has(k)) {
      keys1.delete(k);
      keys2.delete(k);
    }
  });

  return [[...keys1], [...keys2]];

  function objKeysDeep(obj) {
    const result = new Set();
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === 'object') {
        Object.entries(v).forEach(([k1]) => {
          result.add(`${k}.${k1}`);
        });
      } else {
        result.add(k);
      }
    });

    return result;
  }
}
