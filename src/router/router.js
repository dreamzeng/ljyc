import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/login.vue')
};

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () => import('@/views/error-page/500.vue')
};

export const preview = {
  path: '/preview',
  name: 'preview',
  component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
  path: '/locking',
  name: 'locking',
  component: () =>
    import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      title: { i18n: 'home' },
      name: 'home_index',
      component: () => import('@/views/home/home.vue'),
      meta:{
        //title:'fa'
      }
    },
    {
      path: 'ownspace',
      title: '个人中心',
      name: 'ownspace_index',
      component: () => import('@/views/own-space/own-space.vue')
    },
    {
      path: 'order/:order_id',
      title: '订单详情',
      name: 'order-info',
      component: () =>
        import('@/views/advanced-router/component/order-info.vue')
    }, // 用于展示动态路由
    {
      path: 'shopping',
      title: '购物详情',
      name: 'shopping',
      component: () =>
        import('@/views/advanced-router/component/shopping-info.vue')
    }, // 用于展示带参路由
    {
      path: 'message',
      title: '消息中心',
      name: 'message_index',
      component: () => import('@/views/message/message.vue')
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/access',
    icon: 'key',
    name: 'access',
    title: '权限管理',
    component: Main,
    children: [
      {
        path: 'index',
        title: '权限管理',
        name: 'access_index',
        component: () => import('@/views/access/access.vue')
      }
    ]
  },
  {
    path: '/access-test',
    icon: 'lock-combination',
    title: '权限测试页',
    name: 'accesstest',
    access: 0,
    component: Main,
    children: [
      {
        path: 'index',
        title: '权限测试页',
        name: 'accesstest_index',
        access: 0,
        component: () => import('@/views/access/access-test.vue')
      }
    ]
  },
  {
    path: '/international',
    icon: 'earth',
    title: { i18n: 'international' },
    name: 'international',
    component: Main,
    children: [
      {
        path: 'index',
        title: { i18n: 'international' },
        name: 'international_index',
        component: () => import('@/views/international/international.vue')
      }
    ]
  },
  {
    path: '/form',
    icon: 'android-checkbox',
    name: 'form',
    title: '表单编辑',
    component: Main,
    children: [
      {
        path: 'artical-publish',
        title: '文章发布',
        name: 'artical-publish',
        icon: 'compose',
        component: () =>
          import('@/views/form/article-publish/article-publish.vue')
      },
      {
        path: 'workflow',
        title: '工作流',
        name: 'workflow',
        icon: 'arrow-swap',
        component: () => import('@/views/form/work-flow/work-flow.vue')
      }
    ]
  },
  {
    path: '/tables',
    icon: 'ios-grid-view',
    name: 'tables',
    title: '表格',
    component: Main,
    children: [
      {
        path: 'dragableTable',
        title: '可拖拽排序',
        name: 'dragable-table',
        icon: 'arrow-move',
        component: () => import('@/views/tables/dragable-table.vue')
      },
      {
        path: 'editableTable',
        title: '可编辑表格',
        name: 'editable-table',
        icon: 'edit',
        component: () => import('@/views/tables/editable-table.vue')
      },
      {
        path: 'searchableTable',
        title: '可搜索表格',
        name: 'searchable-table',
        icon: 'search',
        component: () => import('@/views/tables/searchable-table.vue')
      },
      {
        path: 'exportableTable',
        title: '表格导出数据',
        name: 'exportable-table',
        icon: 'code-download',
        component: () => import('@/views/tables/exportable-table.vue')
      },
      {
        path: 'table2image',
        title: '表格转图片',
        name: 'table-to-image',
        icon: 'images',
        component: () => import('@/views/tables/table-to-image.vue')
      }
    ]
  },
  {
    path: '/advanced-router',
    icon: 'ios-infinite',
    name: 'advanced-router',
    title: '高级路由',
    component: Main,
    children: [
      {
        path: 'mutative-router',
        title: '动态路由',
        name: 'mutative-router',
        icon: 'link',
        component: () => import('@/views/advanced-router/mutative-router.vue')
      },
      {
        path: 'argument-page',
        title: '带参页面',
        name: 'argument-page',
        icon: 'android-send',
        component: () => import('@/views/advanced-router/argument-page.vue')
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  preview,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
];
