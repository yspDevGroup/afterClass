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
        path: '/basicalSettings/',
        redirect: '/basicalSettings/roomManagement',
      },
    ],
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
