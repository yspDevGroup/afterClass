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
        component: './Manager/Announcements/Service/EditArticle',
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
    // 课程管理
    path: '/courseManagements',
    name: 'courseManagements',
    icon: 'AppstoreAdd',
    routes: [
      {
        path: '/courseManagements/CourseManagements',
        name: 'courseManagements',
        component: './Manager/CourseManagements',
      },
      {
        path: '/courseManagements/leaveManagement',
        name: 'leaveManagement',
        component: './Manager/CourseManagements/LeaveManagement',
      },
      {
        path: '/courseManagements/mechanismCourse/edit',
        name: 'mechanismCourseInfo',
        component: './Manager/Mechanisms/edit',
        hideInMenu: 'true',
      },
      //退课管理
      {
        path: '/courseManagements/reimbursementClass',
        name: 'reimbursementClass',
        component: './Manager/CourseManagements/ReimbursementClass',
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
    path: '/coursePatrol',
    icon: 'SolutionOutlined',
    name: 'coursePatrol',
    routes: [
      {
        path: '/coursePatrol/Management',
        name: 'Management',
        component: './Manager/CoursePatrol',
      },
       //巡课记录
      {
        path: '/coursePatrol/Record',
        name: 'Record',
        component: './Manager/CoursePatrol/Record',
      },

    ]

  },
  // 教师管理
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
    routes: [
      {
        path: '/orderInquiry/courseorder',
        component: './Manager/OrderInquiry/CourseOrder',
        name: 'courseorder',
      },
      {
        path: '/orderInquiry/serviceorder',
        component: './Manager/OrderInquiry/ServiceOrder',
        name: 'serviceorder',
      },
    ],
  },
  // 服务管理
  {
    path: '/valueAddedServices',
    name: 'valueAddedServices',
    icon: 'SmileOutlined',
    routes: [
      {
        path: '/valueAddedServices/cateringService',
        component: './Manager/ValueAddedServices/CateringService',
        name: 'cateringService',
      },
      {
        path: '/valueAddedServices/serviceManagement',
        name: 'serviceManagement',
        routes: [
          {
            path: '/valueAddedServices/serviceManagement',
            hideInMenu: 'true',
            name: 'serviceManagement',
            component: './Manager/ValueAddedServices/ServiceManagement',
          },
          {
            path: '/valueAddedServices/serviceManagement/signUp',
            hideInMenu: 'true',
            name: 'signUp',
            component: './Manager/ValueAddedServices/ServiceManagement/SignUp',
          }
        ]
      },
    ],
  },
  // 通知公告
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
  // 统计管理
  //66
  {
    path: '/statistics',
    name: 'statistics',
    icon: 'BarChartOutlined',
    routes: [
      //课后课程统计
      {
        path: '/statistics/afterSchoolCourse',
        name: 'afterschoolcoursen',
        component: './Manager/Statistics/AfterSchoolCourse',
      },
      //课后课程详情
      {
        path: '/statistics/afterSchoolCourse/detail',
        hideInMenu: 'true',
        name: 'afterschoolclass',
        component: './Manager/Statistics/AfterSchoolCourse/Detail',
      },
      //请假管理
      {
        path: '/statistics/Attendance',
        name: 'Attendancet',
        component: './Manager/Statistics/Attendance',
      },
      //考勤统计详情
      {
        path: '/statistics/Attendance/Detail',
        hideInMenu: 'true',
        name: 'AttendanceDetail',
        component: './Manager/Statistics/Attendance/Detail',
      },
      //课程班互评统计
      {
        path: '/statistics/mutualEvaluation',
        name: 'mutualEvaluation',
        component: './Manager/Statistics/MutualEvaluation',
      },
      {
        path: '/statistics/mutualEvaluation/class',
        name:'class',
        hideInMenu: 'true',
        component: './Manager/Statistics/MutualEvaluation/Class',
      },
   
 //互评统计详情
      {
        path: '/statistics/mutualEvaluation/detail',
        hideInMenu: 'true',
        name: 'mutualEvaluationInfo',
        component: './Manager/Statistics/MutualEvaluation/Detail',
      },
      //课后课程统计
      {
        path: '/statistics/afterSchoolCourse',
        name: 'afterschoolcoursen',
        component: './Manager/Statistics/AfterSchoolCourse',
      },
      //课后课程详情
      {
        path: '/statistics/afterSchoolCourse/detail',
        hideInMenu: 'true',
        name: 'afterschoolclass',
        component: './Manager/Statistics/AfterSchoolCourse/Detail',
      },
    ],
  },
  // 素质教育资源
  {
    path: '/educational',
    icon: 'RadarChartOutlined',
    name: 'educational',
    component: './Manager/Educational',
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
        component: './Teacher/Homepage/Home/Pages/Course',
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
        path: '/teacher/education/feedback',
        name: 'feedback',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Feedback',
      },
      {
        path: '/teacher/education/feedback/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Feedback/Details',
      },
      {
        path: '/teacher/education/studentEvaluation',
        name: 'studentEvaluation',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentEvaluation',
      },
      {
        path: '/teacher/education/studentEvaluation/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentEvaluation/Details',
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
      {
        path: '/teacher/patrolArrange',
        name: 'patrolArrange',
        icon: 'smile',
        component: './Teacher/Homepage/PatrolArrange',
      },
      {
        path: '/teacher/patrolArrange/classes',
        name: 'patrolClasses',
        icon: 'smile',
        component: './Teacher/Homepage/PatrolArrange/Pages/Classes',
      },
      {
        path: '/teacher/patrolArrange/newPatrol',
        name: 'newPatrol',
        icon: 'smile',
        component: './Teacher/Homepage/PatrolArrange/Pages/NewPatrol',
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
        path: '/parent/study/teacherEvaluation',
        name: 'teacherEvaluation',
        icon: 'smile',
        component: './Parent/Homepage/Study/TeacherEvaluation',
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
        path: '/parent/mine/dropClass',
        name: 'dropClass',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/DropClass',
        hideInMenu: 'true',
      },
      {
        path: '/parent/mine/evaluation',
        name: 'evaluation',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/Evaluation',
        hideInMenu: 'true',
      },
      {
        path: '/parent/mine/evaluation/evaluationDetails',
        name: 'evaluationDetails',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/Evaluation/EvaluationDetails',
        hideInMenu: 'true',
      },
      {
        path: '/parent/home/course',
        name: 'course',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Course',
      },
      // 服务预定
      {
        path: '/parent/home/serviceReservation',
        name: 'serviceReservation',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/ServiceReservation',
      },
      {
        path: '/parent/home/serviceReservation/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/ServiceReservation/Details',
      },
      {
        path: '/parent/home/service',
        name: 'service',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Service',
      },
      {
        path: '/parent/home/service/details',
        name: 'details',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Service/Details',
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
