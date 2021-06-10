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
        path: '/basicalSettings/roomManagement',
        name: 'roomManagement',
        icon: 'smile',
        component: './Manager/BasicalSettings/RoomManagement',
      },
      {
        path: '/basicalSettings/periodMaintenance',
        name: 'periodMaintenance',
        icon: 'smile',
        component: './Manager/BasicalSettings/PeriodMaintenance',
      },
      {
        path: '/basicalSettings/termManagement',
        name: 'termManagement',
        icon: 'smile',
        component: './Manager/BasicalSettings/TermManagement',
      },
      {
        path: '/basicalSettings/',
        redirect: '/basicalSettings/roomManagement',
      },
    ],
  },
  {
    path: '/courseManagements',
    name: 'courseManagements',
    icon: 'smile',
    component: './Manager/CourseManagements',
  },
  {
    path: '/classManagement',
    name: 'classManagement',
    icon: 'smile',
    component: './Manager/ClassManagement',
  },
  {
    path: '/courseScheduling',
    name: 'courseScheduling',
    icon: 'smile',
    component: './Manager/CourseScheduling',
  },
  /*** 老师路由 start ***/
  {
    path: '/teacher',
    layout: false,
    routes: [
      {
        path: '/teacher/home',
        name: 'home',
        icon: 'smile',
        component: './Teacher/CheckonManagement',
      }
    ]
  },
  /*** 老师路由 end ***/
  /*** 家长路由 start ***/
  {
    path: '/parent',
    name: 'parent',
    layout: false,
    icon: 'smile',
    routes: [
      {
        path: '/parent/home',
        name: 'home',
        icon: 'smile',
        component: './Parent/Homepage',
      },
      {
        path: '/parent/courseDetails',
        name: 'courseDetails',
        icon: 'smile',
        component: './Parent/CourseDetails',
        hideInMenu: 'true',
      },
      {
        path: '/parent/home/myOrder',
        name: 'myOrder',
        hideInMenu: 'true',
        component: './Parent/Homepage/Mine/Pages/MyOrder',
      },
      {
        path: '/parent/home/course',
        name: 'course',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Course',
      },
      {
        path: '/parent/home/notice',
        name: 'notice',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Notice',
      },
      {
        path: '/parent/home/notice/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Details',
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
