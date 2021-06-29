export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/auth_callback',
    layout: false,
    routes: [
      {
        path: '/auth_callback',
        component: './AuthCallback',
      },
    ],
  },
  {
    path: '/basicalSettings',
    name: 'basicalSettings',
    icon: 'crown',
    routes: [
      {
        path: '/basicalSettings/termManagement',
        name: 'termManagement',
        icon: 'smile',
        component: './Manager/BasicalSettings/TermManagement',
      },
      {
        path: '/basicalSettings/periodMaintenance',
        name: 'periodMaintenance',
        icon: 'smile',
        component: './Manager/BasicalSettings/PeriodMaintenance',
      },
      {
        path: '/basicalSettings/roomManagement',
        name: 'roomManagement',
        icon: 'smile',
        component: './Manager/BasicalSettings/RoomManagement',
      },
      {
        path: '/basicalSettings/',
        redirect: '/basicalSettings/termManagement',
      },
    ],
  },
  {
    path: '/courseManagements',
    name: 'courseManagements',
    icon: 'ProfileOutlined',
    routes: [
      {
        path: '/courseManagements/',
        name: 'courseManagements',
        icon: 'smile',
        component: './Manager/CourseManagements',
        hideInMenu: 'true',
      },
      {
        path: '/courseManagements/classMaintenance',
        name: 'classMaintenance',
        icon: 'smile',
        hideInMenu: 'true',
        component: './Manager/ClassMaintenance',
      },
    ],
  },
  {
    path: '/classManagement',
    name: 'classManagement',
    icon: 'CreditCardOutlined',
    component: './Manager/ClassManagement',
  },
  {
    path: '/courseScheduling',
    name: 'courseScheduling',
    icon: 'CarryOutOutlined',
    component: './Manager/CourseScheduling',
  },
  {
    path: '/noticenotice',
    name: 'noticenotice',
    icon: 'CarryOutOutlined',
    component: './Manager/Noticenotice',
  },
  {
    path: '/orderInquiry',
    name: 'orderInquiry',
    icon: 'BarsOutlined',
    component: './Manager/OrderInquiry',
  },
  /*** 老师路由 start ***/
  {
    path: '/teacher',
    layout: false,
    hideInMenu: 'true',
    routes: [
      {
        path: '/teacher/home',
        name: 'home',
        icon: 'smile',
        component: './Teacher/Homepage',
      },
      {
        path: '/teacher/home/courseDetails',
        name: 'courseDetails',
        icon: 'smile',
        component: './Teacher/Homepage/Home/Pages/CourseDetails',
        hideInMenu: 'true',
      },
      {
        path: '/teacher/home/notice',
        name: 'notice',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Home/Pages/Notice',
      },
      {
        path: '/teacher/home/notice/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Home/Pages/Details',
      },
      {
        path: '/teacher/education/callTheRoll',
        name: 'details',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/CallTheRoll',
      },
    ],
  },
  /*** 老师路由 end ***/
  /*** 家长路由 start ***/
  {
    path: '/parent',
    name: 'parent',
    layout: false,
    icon: 'smile',
    hideInMenu: 'true',
    routes: [
      {
        path: '/parent/home',
        name: 'home',
        icon: 'smile',
        component: './Parent/Homepage',
        hideInMenu: 'true',
      },
      {
        path: '/parent/home/courseDetails',
        name: 'courseDetails',
        icon: 'smile',
        component: './Parent/Homepage/Home/Pages/CourseDetails',
        hideInMenu: 'true',
      },
      {
        path: '/parent/mine/orderDetails',
        name: 'orderDetails',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/OrderDetails',
        hideInMenu: 'true',
      },
      {
        path: '/parent/mine/order',
        name: 'order',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/Order',
        hideInMenu: 'true',
      },
      {
        path: '/parent/home/notice',
        name: 'notice',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Notice',
      },
      {
        path: '/parent/home/notice/announcement',
        name: 'announcement',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Announcement',
      },
      {
        path: '/parent/home/emptyArticle',
        name: 'emptyArticle',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/EmptyArticle',
      },
    ],
  },
  /*** 家长路由 end ***/
  {
    path: '/',
    layout: false,
    component: './index',
  },
  {
    component: './404',
  },
];
