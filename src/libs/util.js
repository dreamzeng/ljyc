import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';

let util = {};
util.title = function(title) {
  title = title || '邻家养车 admin';
  window.document.title = title;
};

const ajaxUrl =
  env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production' ? 'https://www.url.com' : 'https://debug.url.com';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

util.inOf = function(arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function(ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.showThisRoute = function(itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

util.getRouterObjByName = function(routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  // debugger;
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function(vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function(vm, name) {
  let title = '';
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'otherRouter') {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '',
        name: 'home_index'
      }
    ];
  } else if (
    (name.indexOf('_index') >= 0 || isOtherRouter) &&
    name !== 'home_index'
  ) {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ];
    } else if (
      currentPathObj.children.length <= 1 &&
      currentPathObj.name !== 'home'
    ) {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ];
    } else {
      let childObj = currentPathObj.children.filter(child => {
        return child.name === name;
      })[0];
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

util.openNewPage = function(vm, name, argu, query,father) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    /* let tag = vm.$store.state.app.tagsList.filter(item => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    }); 
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }  */
    let fatherName = father.name;
    let filterObj =  (vm.$store.state.app.routers.filter(item => {
      return fatherName === item.name;
    }))[0];
    if(filterObj && filterObj.children){
      let tag =  filterObj.children;
      vm.$store.commit('increateTag', tag);
    } 

  }
  vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function(routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (
      routers[i].name === name &&
      routers[i].children &&
      routers[i].redirect === undefined
    ) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function(vm) {
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist');
  // 全屏相关
};

/* 
  生成唯一的 uuid
*/
util.uuid = () =>{
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; 
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
                                                      
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}


export default util;
