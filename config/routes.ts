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
    path: '/homepage',
    name: 'homePage',
    icon: 'smile',
    component: './Parent/Homepage',
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
  {
    path: '/listComponent',
    layout:false,
    component: './Parent/ListComponent',
  },
  {
    path: '/',
    layout: false,
    redirect: './homepage',
  },
  {
    component: './404',
  },
];
