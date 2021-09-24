const { reactive, setup, createApp, getCurrentInstance, watch, nextTick } = Vue;

const zh_cn = data['zh-cn'];
const en_us = data['en-us'];

let cachedTableData; // 切换未翻译时缓存数据
const cacheZhSet = new Set(); //缓存中文去重

class TableItem {
  constructor(prop) {
    const { pid = '', id = creatId(), key, en, zh, children } = prop;
    this.id = id;
    this.pid = pid;
    this.key = key;
    if (en) this.en = en;
    if (zh) this.zh = zh;
    if (children) this.children = children;
  }

  delSelf(tableData) {
    if (this.pid) {
      const parent = tableData.find(({ id }) => id === this.pid);
      const index = parent.children.findIndex(row => row.id === this.id);
      parent.children.splice(index, 1);
    } else {
      const index = tableData.findIndex(row => row.id === this.id);
      tableData.splice(index, 1);
    }
  }

  addChild(child) {
    this.children.push(child);
  }
}

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
      showAddForm: false,
      formData: {
        key: '',
        zh: '',
        en: '',
      },
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

    function toggleEmpty() {
      state.empty = !state.empty;
      if (state.empty) cachedTableData = state.tableData;
      state.tableData = state.empty ? filterEmpty(state.tableData) : cachedTableData;
    }

    function onDelete(row) {
      // 删靠前的，页面更新巨慢
      console.group('del');
      console.time('data');
      console.time('page');

      row.delSelf(state.tableData);

      console.timeEnd('data');
      nextTick(() => {
        console.timeEnd('page');
        console.groupEnd();
      });
    }

    function onAdd() {
      state.showAddForm = true;
      state.formData.pid = '';
    }

    function onAddChild(row) {
      state.showAddForm = true;
      state.formData.pid = row.id;
    }

    function saveForm() {
      internalInstance.refs['addForm'].validate(valid => {
        if (!valid) return;
        const item = new TableItem(state.formData);
        const { pid } = item;
        if (pid) {
          const parent = state.tableData.find(({ id }) => id === pid);
          parent.addChild(item);
        } else {
          state.tableData.push(item);
          pageScroll();
        }
        resetForm();
      });
    }
    function resetForm() {
      state.showAddForm = false;
      internalInstance.refs['addForm'].resetFields();
    }

    function onAddParent() {
      globalProperties
        .$prompt('请填写key', '添加一个外层', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: val => !!val,
          inputErrorMessage: '请填写key',
        })
        .then(({ value }) => {
          state.tableData.push(new TableItem({ key: value, children: [] }));
          pageScroll();
        })
        .catch(() => {});
    }

    watch(
      () => state.id,
      () => {
        location.pathname = `/fe-i18n/admin/${state.id}`;
      },
    );

    return {
      state,
      submit,
      toggleEmpty,
      onDelete,
      onAdd,
      onAddChild,
      saveForm,
      resetForm,
      onAddParent,
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

function formatTableData(zh_cn, en_us, pid = '') {
  if (typeof zh_cn !== 'object') return;
  // pid: parent id
  return Object.entries(zh_cn)
    .map(([k, v]) => {
      if (typeof v === 'object') {
        const id = creatId();
        const children = formatTableData(v, en_us[k], id);
        return new TableItem({ pid, key: k, id, children });
      } else if (!cacheZhSet.has(v)) {
        cacheZhSet.add(v);
        return new TableItem({ pid, key: k, zh: v, en: en_us[k] });
      }
    })
    .filter(item => !!item);
}

function creatId() {
  return Math.random().toString(32).slice(-8);
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

function pageScroll(top = document.body.clientHeight) {
  Vue.nextTick(() => {
    window.scroll({ top });
  });
}
