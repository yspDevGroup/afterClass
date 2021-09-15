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
        path: '/auth_callback/password',
        component: './AuthCallback/password',
      },
      {
        path: '/auth_callback/wechat',
        component: './AuthCallback/wechat',
      },
      {
        path: '/auth_callback/overDue',
        component: './AuthCallback/OverDue',
      },
    ],
  },
  {
    path: '/homepage',
    name: 'homepage',
    icon: 'home',
    component: './Manager/Homepage',
  },
  {
    path: '/basicalSettings',
    name: 'basicalSettings',
    icon: 'fileText',
    routes: [
      {
        path: '/basicalSettings/schoolInfo',
        name: 'schoolInfo',
        component: './Manager/BasicalSettings/SchoolInfo',
      },
      {
        path: '/basicalSettings/schoolInfo/schoolEditor',
        name: 'schoolEditor',
        hideInMenu: true,
        component: './Manager/BasicalSettings/SchoolInfo/SchoolEditor',
      },
      {
        path: '/basicalSettings/service',
        name: 'service',
        component: './Manager/Announcements/Service',
      },
      {
        path: '/basicalSettings/service/editArticle',
        hideInMenu: 'true',
        name: 'articleDetails',
        component: './Manager/Announcements/Service/editArticle',
      },
      {
        path: '/basicalSettings/termManagement',
        name: 'termManagement',
        component: './Manager/BasicalSettings/TermManagement',
      },
      {
        path: '/basicalSettings/periodMaintenance',
        name: 'periodMaintenance',
        component: './Manager/BasicalSettings/PeriodMaintenance',
      },
      {
        path: '/basicalSettings/roomManagement',
        name: 'roomManagement',
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
    icon: 'AppstoreAdd',
    routes: [
      {
        path: '/courseManagements/CourseManagements',
        name: 'courseManagements',
        component: './Manager/CourseManagements',
        // hideInMenu: 'true',
      },
      {
        path: '/courseManagements/mechanismCourse/edit',
        name: 'mechanismCourseInfo',
        component: './Manager/Mechanisms/edit',
        hideInMenu: 'true',
      },
    ],
  },
  {
    path: '/classManagement',
    name: 'classManagement',
    icon: 'InsertRowAbove',
    component: './Manager/ClassManagement',
  },
  {
    path: '/courseScheduling',
    name: 'courseScheduling',
    icon: 'Build',
    component: './Manager/CourseScheduling',
  },
  {
    path: '/teacherManagement',
    name: 'teacherManagement',
    icon: 'Team',
    component: './Manager/TeacherManagement',
  },
  {
    path: '/teacherManagement/detail',
    name: 'teacherInfo',
    hideInMenu: 'true',
    component: './Manager/TeacherManagement/Detail',
  },
  {
    path: '/orderInquiry',
    name: 'orderInquiry',
    icon: 'Profile',
    component: './Manager/OrderInquiry',
  },
  {
    path: '/announcements',
    name: 'announcements',
    icon: 'Notification',
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
        path: '/parent/study/askforLeave',
        name: 'courseIntro',
        icon: 'smile',
        component: './Parent/Homepage/Study/AskForLeave',
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
    path: '/403',
    layout: false,
    component: './403',
  },
  {
    component: './404',
  },
];
