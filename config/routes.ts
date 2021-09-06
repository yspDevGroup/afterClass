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
      {
        path: '/auth_callback/overDue',
        component: './AuthCallback/OverDue',
      },
    ],
  },
  {
    path:'/homepage',
    name: 'homepage',
    icon: 'bank',
    component: './Manager/Homepage',
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
    path: '/announcements',
    name: 'announcements',
    icon: 'CarryOutOutlined',
    routes: [
      {
        name: 'notice',
        path: '/announcements/notice',
        routes: [
          {
            path: '/announcements/notice',
            hideInMenu: 'true',
            name: 'notice',
            component: './Manager/Announcements/Notice',
          },
          {
            path: '/announcements/notice/editArticle',
            hideInMenu: 'true',
            name: 'editArticle',
            component: './Manager/Announcements/Notice/EditArticle',
          },
          {
            path: '/announcements/notice/noticeDetails',
            hideInMenu: 'true',
            name: 'noticeDetails',
            component: './Manager/Announcements/Notice/NoticeDetails',
          },
        ],
      },
      {
        path: '/announcements/policy',
        name: 'policy',
        routes: [
          {
            path: '/announcements/policy',
            hideInMenu: 'true',
            name: 'policy',
            component: './Manager/Announcements/Policy',
          },
          {
            path: '/announcements/policy/articleDetails',
            hideInMenu: 'true',
            name: 'articleDetails',
            component: './Manager/Announcements/Policy/ArticleDetails',
          },
        ],
      },
    ],
  },
  {
    path: '/courseManagements',
    name: 'courseManagements',
    icon: 'ProfileOutlined',
    routes: [
      {
        path: '/courseManagements/CourseManagements',
        name: 'courseManagements',
        icon: 'smile',
        component: './Manager/CourseManagements',
        // hideInMenu: 'true',
      },
      // {
      //   path: '/courseManagements/Mechanism',
      //   name: 'mechanism',
      //   icon: 'smile',
      //   component: './Manager/Mechanisms',
      // },
      {
        path: '/courseManagements/mechanismCourse/edit',
        name: 'mechanismCourseInfo',
        hideInMenu: 'true',
        component: './Manager/Mechanisms/edit',
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
        path: '/teacher/home/courseIntro',
        name: 'courseIntro',
        icon: 'smile',
        component: './Teacher/Homepage/Home/Pages/CourseDetails/Detail',
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
        path: '/teacher/home/course',
        name: 'course',
        hideInMenu: 'true',
        component: './teacher/Homepage/Home/Pages/Course',
      },
      {
        path: '/teacher/education/callTheRoll',
        name: 'callTheRoll',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/CallTheRoll',
      },
      {
        path: '/teacher/education/rollcallrecord',
        name: 'callTheRoll',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/RollCallRecord',
      },
      {
        path: '/teacher/home/notice/announcement',
        name: 'announcement',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Home/Pages/Announcement',
      },
      {
        path: '/teacher/home/emptyArticle',
        name: 'emptyArticle',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Home/Pages/EmptyArticle',
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
        path: '/parent/home/courseIntro',
        name: 'courseIntro',
        icon: 'smile',
        component: './Parent/Homepage/Home/Pages/CourseDetails/Detail',
        hideInMenu: 'true',
      },
      {
        path: '/parent/home/courseTable',
        name: 'courseIntro',
        icon: 'smile',
        component: './Parent/Homepage/Home/Pages/CourseDetails/CourseTable',
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
