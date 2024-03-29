﻿export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'parent',
        path: '/user/parent',
        component: './user/Parent',
      },
    ],
  },
  {
    path: '/auth',
    layout: false,
    routes: [
      {
        path: '/auth/comwx',
        routes: [
          {
            path: '/auth/comwx/oncode',
            component: './Auth/ComWX/onCode',
          },
          {
            path: '/auth/comwx',
            component: './Auth/ComWX',
          },
        ],
      },
      {
        path: '/auth/sso',
        routes: [
          {
            path: '/auth/sso/oncode',
            component: './Auth/SSO/onCode',
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
        path: '/auth_callback/xaedu',
        component: './AuthCallback/xaedu',
      },
      {
        path: '/auth_callback/overDue',
        component: './AuthCallback/OverDue',
      },
    ],
  },

  //   菜单调整：课程服务、增值服务、课后服务、排课管理(从课程服务中来)、巡课管理...
  // 课后服务子菜单：服务管理、班级管理
  // 排课管理：增加按行政班排课功能。
  {
    path: '/homepage',
    name: 'homepage',
    icon: 'home',
    component: './Manager/Homepage',
  },
  {
    // 基本信息管理
    path: '/basicalSettings',
    name: 'basicalSettings',
    icon: 'fileText',
    access: 'isLogin',
    routes: [
      {
        // 学校信息维护
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
        // 服务协议配置
        path: '/basicalSettings/service',
        name: 'service',
        component: './Manager/Announcements/Service',
      },
      {
        path: '/basicalSettings/service/editServices',
        hideInMenu: 'true',
        name: 'serviceDetails',
        component: './Manager/Announcements/Service/EditArticle',
      },
      {
        path: '/basicalSettings/service/editArticle',
        hideInMenu: 'true',
        name: 'articleDetails',
        component: './Manager/Announcements/Service/EditArticle',
      },
      {
        // 学期学年维护
        path: '/basicalSettings/termManagement',
        name: 'termManagement',
        component: './Manager/BasicalSettings/TermManagement',
      },
      {
        // 教师管理
        path: '/basicalSettings/teacherManagement',
        name: 'teacherManagement',
        icon: 'Team',
        component: './Manager/BasicalSettings/TeacherManagement',
      },
      {
        path: '/basicalSettings/teacherManagement/detail',
        name: 'teacherInfo',
        hideInMenu: 'true',
        component: './Manager/BasicalSettings/TeacherManagement/Detail',
      },
      {
        // 学生管理
        path: '/basicalSettings/studentMaintenance',
        name: 'studentMaintenance',
        component: './Manager/BasicalSettings/StudentMaintenance',
      },
      {
        // 时段维护
        path: '/basicalSettings/periodMaintenance',
        name: 'periodMaintenance',
        component: './Manager/BasicalSettings/PeriodMaintenance',
      },
      {
        // 场地维护
        path: '/basicalSettings/roomManagement',
        name: 'roomManagement',
        component: './Manager/BasicalSettings/RoomManagement',
      },
      {
        // 基本信息维护模块
        path: '/basicalSettings/basical',
        name: 'basical',
        component: './ThirdParty',
        hideInMenu: 'true',
      },
    ],
  },
  {
    // 课程服务
    path: '/courseManagements',
    name: 'courseManagements',
    icon: 'AppstoreAdd',
    routes: [
      {
        // 课程管理
        path: '/courseManagements/CourseManagements',
        name: 'courseManagements',
        component: './Manager/CourseManagements',
      },
      {
        // 课程班管理
        path: '/courseManagements/classManagement',
        name: 'classManagement',
        component: './Manager/ClassManagement',
      },
      // {
      //   // 排课管理
      //   path: '/courseManagements/courseScheduling',
      //   name: 'courseScheduling',
      //   icon: 'Build',
      //   component: './Manager/CourseScheduling',
      // },

      {
        path: '/courseManagements/mechanismCourse/edit',
        name: 'mechanismCourseInfo',
        component: './Manager/Mechanisms/edit',
        hideInMenu: 'true',
      },
      //管理端课程风采
      {
        path: '/courseManagements/courseRecord',
        name: 'courseRecord',
        component: './Manager/CourseRecord',
      },
      {
        path: '/courseManagements/courseRecord/detail',
        name: 'courseRecord',
        component: './Manager/CourseRecord/Detail',
        hideInMenu: 'true',
      },
    ],
  },
  {
    // 课后服务
    path: '/afterClassManagement',
    name: 'afterClassManagement',
    icon: 'DeploymentUnitOutlined',
    routes: [
      // 报名设置
      {
        path: '/afterClassManagement/registration_setting',
        name: 'registrationSetting',
        component: './Manager/AfterClassManagement/RegistrationSetting',
      },
      // 行政班管理
      {
        path: '/afterClassManagement/class_management',
        name: 'administrationClassManagement',
        component: './Manager/AfterClassManagement/AdministrationClassManagement',
      },
      // 班级详情
      {
        path: '/afterClassManagement/class_management/detail',
        hideInMenu: 'true',
        name: 'clasDetail',
        component: './Manager/AfterClassManagement/AdministrationClassManagement/Detail',
      },
      // 服务配置
      {
        path: '/afterClassManagement/service_configuration',
        name: 'serviceConfiguration',
        component: './Manager/AfterClassManagement/ServiceConfiguration',
      },
    ],
  },
  {
    // 排课管理
    path: '/courseArrange',
    name: 'courseArrange',
    icon: 'InsertRowBelowOutlined',
    component: './Manager/CourseArrange',
  },
  {
    // 增值服务
    path: '/valueAddedServices',
    name: 'valueAddedServices',
    icon: 'SmileOutlined',
    routes: [
      {
        // 服务类别配置
        path: '/valueAddedServices/cateringService',
        component: './Manager/ValueAddedServices/CateringService',
        name: 'cateringService',
      },
      {
        // 服务管理
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
          },
        ],
      },
    ],
  },
  {
    // 巡课管理
    path: '/coursePatrol',
    icon: 'SolutionOutlined',
    name: 'coursePatrol',
    access: 'isLogin',
    routes: [
      {
        // 值班安排
        path: '/coursePatrol/Management',
        name: 'Management',
        component: './Manager/CoursePatrol',
      },
      {
        // 巡课记录
        path: '/coursePatrol/Record',
        name: 'Record',
        component: './Manager/CoursePatrol/Record',
      },
    ],
  },
  {
    // 行政审批
    path: '/audit',
    name: 'audit',
    icon: 'AuditOutlined',
    access: 'isLogin',
    routes: [
      {
        // 请假管理
        path: '/audit/leaveManagement',
        name: 'leaveManagement',
        component: './Manager/CourseManagements/LeaveManagement',
      },
      // 教师调代课管理
      {
        path: '/audit/substituteCourse',
        name: 'substituteCourse',
        component: './Manager/CourseManagements/SubstituteCourse',
      },
      // 教师补签管理
      {
        path: '/audit/resignManagement',
        name: 'resignManagement',
        component: './Manager/ResignManagement',
      },
      // 学生考勤更改审批管理
      {
        path: '/audit/recheckManagement',
        name: 'recheckManagement',
        component: './Manager/RecheckManagement',
      },
    ],
  },
  {
    // 订单管理
    path: '/orderInquiry',
    name: 'orderInquiry',
    icon: 'Profile',
    routes: [
      {
        // 课后服务订单
        path: '/orderInquiry/afterService',
        component: './Manager/OrderInquiry/AfterService',
        name: 'afterService',
      },
      {
        // 课程服务订单
        path: '/orderInquiry/courseorder',
        component: './Manager/OrderInquiry/CourseOrder',
        name: 'courseorder',
      },
      {
        // 增值服务订单
        path: '/orderInquiry/serviceorder',
        component: './Manager/OrderInquiry/ServiceOrder',
        name: 'serviceorder',
      },
      {
        // 课程退订
        path: '/orderInquiry/reimbursementClass',
        name: 'reimbursementClass',
        component: './Manager/CourseManagements/ReimbursementClass',
        access: 'isLogin',
      },
      {
        // 退款管理
        path: '/orderInquiry/refundManagement',
        name: 'refundManagement',
        component: './Manager/CourseManagements/RefundManagement',
        access: 'isLogin',
      },
    ],
  },
  {
    // 通知公告
    path: '/announcements',
    name: 'announcements',
    icon: 'Notification',
    // access: 'isLogin',
    routes: [
      {
        // 校内通知
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
            path: '/announcements/notice/articleDetails',
            hideInMenu: 'true',
            name: 'noticeDetails',
            component: './Manager/Announcements/Notice/ArticleDetails',
          },
        ],
      },
      {
        // 政策公告
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
    // 统计报表
    path: '/statistics',
    name: 'statistics',
    icon: 'BarChartOutlined',
    routes: [
      {
        // 课程统计
        path: '/statistics/afterSchoolCourse',
        name: 'afterschoolcoursen',
        component: './Manager/Statistics/AfterSchoolCourse',
      },
      {
        // 课后课程详情
        path: '/statistics/afterSchoolCourse/detail',
        hideInMenu: 'true',
        name: 'afterschoolclass',
        component: './Manager/Statistics/AfterSchoolCourse/Detail',
      },
      {
        // 课程统计
        path: '/statistics/afterServiceCourse',
        name: 'afterservicecourse',
        component: './Manager/Statistics/AfterServiceCourse',
      },
      {
        // 课后课程详情
        path: '/statistics/afterServiceCourse/details',
        hideInMenu: 'true',
        name: 'afterservicelclass',
        component: './Manager/Statistics/AfterServiceCourse/Details',
      },
      {
        // 考勤统计
        path: '/statistics/Attendance',
        name: 'attendancet',
        component: './Manager/Statistics/Attendance',
      },
      {
        // 考勤统计详情
        path: '/statistics/Attendance/Detail',
        hideInMenu: 'true',
        name: 'attendanceDetail',
        component: './Manager/Statistics/Attendance/Detail',
      },
      {
        // 互评统计
        path: '/statistics/mutualEvaluation',
        name: 'mutualEvaluation',
        component: './Manager/Statistics/MutualEvaluation',
      },
      {
        path: '/statistics/mutualEvaluation/class',
        name: 'class',
        hideInMenu: 'true',
        component: './Manager/Statistics/MutualEvaluation/Class',
      },
      {
        path: '/statistics/mutualEvaluation/detail',
        hideInMenu: 'true',
        name: 'mutualEvaluationInfo',
        component: './Manager/Statistics/MutualEvaluation/Detail',
      },
      {
        // 行政班统计
        path: '/statistics/administrativeClass',
        name: 'administrativeClass',
        component: './Manager/AdministrativeClass',
      },
      {
        path: '/statistics/administrativeClass/administrativeClassDetail',
        name: 'administrativeClassDetail',
        component: './Manager/AdministrativeClass/Detail',
        hideInMenu: 'true',
      },
    ],
  },
  {
    // 数据大屏
    path: '/graphic',
    layout: false,
    icon: 'PieChartOutlined',
    name: 'graphic',
    component: './Manager/Statistics/Graphic',
    access: 'isLogin',
  },
  {
    // 素质教育资源
    path: '/educational',
    icon: 'RadarChartOutlined',
    name: 'educational',
    component: './Manager/Educational',
    access: 'isLogin',
  },
  {
    // 系统配置
    path: '/sysSettings',
    icon: 'SlidersOutlined',
    name: 'sysSettings',
    access: 'isLogin',
    routes: [
      {
        path: '/sysSettings/auditSettings',
        name: 'auditSettings',
        component: './Manager/SysSettings/AuditSettings',
      },
      {
        path: '/sysSettings/asyncSettings',
        name: 'asyncSettings',
        component: './Manager/SysSettings/AsyncSettings',
        access: 'isWechat',
      },
    ],
  },
  /*** 老师路由 start ***/
  {
    path: '/teacher',
    layout: false,
    name: 'teacher',
    hideInMenu: 'true',
    // component: './layouts/mobileLayout',
    access: 'isTeacher',
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
        path: '/teacher/education/selectCourse',
        name: 'selectCourse',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/SelectCourse',
      },
      {
        path: '/teacher/education/selectCourse/apply',
        name: 'applys',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/SelectCourse/Apply',
      },
      // 教师请假
      {
        path: '/teacher/education/askForLeave',
        name: 'askForLeave',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/AskForLeave',
      },
      {
        path: '/teacher/education/askForLeave/newLeave',
        name: 'newLeave',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/AskForLeave/NewLeave',
      },
      // 教师调代课
      {
        path: '/teacher/education/courseAdjustment',
        name: 'courseAdjustment',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/CourseAdjustment',
      },
      {
        path: '/teacher/education/courseAdjustment/applys',
        name: 'applys',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/CourseAdjustment/Applys',
      },
      {
        path: '/teacher/education/courseAdjustment/details',
        name: 'courseAdjustmentDetails',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/CourseAdjustment/Details',
      },
      {
        path: '/teacher/home/substituteList',
        name: 'substituteList',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Home/Pages/SubstituteList',
      },
      {
        path: '/teacher/education/resign',
        name: 'resign',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Resign',
      },
      {
        path: '/teacher/education/resign/dealList',
        name: 'resign',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Resign/DealList',
      },
      {
        path: '/teacher/education/dealAbnormal',
        name: 'dealAbnormal',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Resign/DealAbnormal',
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
        path: '/teacher/education/record',
        name: 'record',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/Record',
      },
      {
        path: '/teacher/education/putRecord',
        name: 'feedback',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/PutRecord',
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
      // 学生考勤
      {
        path: '/teacher/education/studentRecord',
        name: 'studentRecord',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentRecord',
      },
      {
        path: '/teacher/education/studentRecord/apply',
        name: 'studentRecord',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentRecord/Apply',
      },
      {
        path: '/teacher/education/studentRecord/detail',
        name: 'studentRecord',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentRecord/Detail',
      },
      {
        path: '/teacher/education/studentRecord/edit',
        name: 'studentRecord',
        hideInMenu: 'true',
        component: './Teacher/Homepage/Education/StudentRecord/Edit',
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
    access: 'isParent',
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
        path: '/parent/study/classroomStyle',
        name: 'classroomStyle',
        icon: 'smile',
        component: './Parent/Homepage/Study/ClassroomStyle',
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
        path: '/parent/mine/dropClass/apply',
        name: 'dropClassApply',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/DropClass/Apply',
        hideInMenu: 'true',
      },
      {
        path: '/parent/mine/dropClass/details',
        name: 'details',
        icon: 'smile',
        component: './Parent/Homepage/Mine/Pages/DropClass/Details',
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
      // 课后服务
      {
        path: '/parent/home/afterClassCoach',
        name: 'afterClassCoach',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/AfterClassCoach',
      },
      {
        path: '/parent/home/afterClassCoach/interestClassroom',
        name: 'interestClassroom',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/AfterClassCoach/InterestClassroom',
      },
      // 订餐&托管
      {
        path: '/parent/home/trusteeship',
        name: 'trusteeship',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/Trusteeship',
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
        path: '/parent/home/serviceReservation/afterClassDetails',
        name: 'afterClassDetails',
        hideInMenu: 'true',
        component: './Parent/Homepage/Home/Pages/ServiceReservation/AfterClassDetails',
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
  /*** 移动端数据看板路由 start ***/
  {
    path: '/information',
    name: 'information',
    layout: false,
    icon: 'smile',
    hideInMenu: 'true',
    routes: [
      {
        path: '/information/home',
        name: 'home',
        icon: 'smile',
        component: './Information/HomePage',
        hideInMenu: 'true',
      },
      {
        path: '/information/noticeDetails',
        name: 'noticeDetails',
        icon: 'smile',
        component: './Information/HomePage/Home/NoticeDetails',
        hideInMenu: 'true',
      },
      {
        path: '/information/allNotice',
        name: 'noticeDetails',
        icon: 'smile',
        component: './Information/HomePage/Home/AllNotice',
        hideInMenu: 'true',
      },
      // 教室实时签到详情
      {
        path: '/information/signInDetails',
        name: 'signInDetails',
        component: './Information/HomePage/Home/SignInDetails',
        hideInMenu: 'true',
      },
    ],
  },
  /*** 移动端数据看板路由 end ***/
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
