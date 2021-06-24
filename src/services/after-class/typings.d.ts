// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginParams = {
    /** 登录名 */
    username: string;
    /** 密码 */
    password: string;
    /** 自动登录 */
    autoLogin: boolean;
    type: 'account' | 'mobile';
  };

  type LoginResult = {
    currentAuthority: string[];
    token: string;
    type: 'account' | 'mobile' | 'github';
  };

  type BJSJ = {
    id: string;
    /** 班号 */
    BH: string;
    /** 班级 */
    BJ: string;
    /** 建班年月 */
    JBNY: string;
    /** 班主任工号 */
    BZRGH: string;
    /** 班长学号 */
    BZXH?: string;
    /** 班级荣誉称号 */
    BJRYCH?: string;
    /** 学制 */
    XZ?: string;
    /** 班级类型码 */
    BJLXM?: string;
    /** 文理类型 */
    WLLX?: string;
    /** 毕业日期 */
    BYRQ?: string;
    /** 是否少数民族双语教学班 */
    SFSSMZSYJXB: string;
    /** 双语教学模式码 */
    SYJXMSM: string;
    NJSJId: string;
  };

  type CreateBJSJ = {
    /** 班号 */
    BH: string;
    /** 班级 */
    BJ: string;
    /** 建班年月 */
    JBNY: string;
    /** 班主任工号 */
    BZRGH: string;
    /** 班长学号 */
    BZXH?: string;
    /** 班级荣誉称号 */
    BJRYCH?: string;
    /** 学制 */
    XZ?: string;
    /** 班级类型码 */
    BJLXM?: string;
    /** 文理类型 */
    WLLX?: string;
    /** 毕业日期 */
    BYRQ?: string;
    /** 是否少数民族双语教学班 */
    SFSSMZSYJXB: string;
    /** 双语教学模式码 */
    SYJXMSM: string;
    NJSJId: string;
  };

  type UpdateBJSJ = {
    /** 班号 */
    BH?: string;
    /** 班级 */
    BJ?: string;
    /** 建班年月 */
    JBNY?: string;
    /** 班主任工号 */
    BZRGH?: string;
    /** 班长学号 */
    BZXH?: string;
    /** 班级荣誉称号 */
    BJRYCH?: string;
    /** 学制 */
    XZ?: string;
    /** 班级类型码 */
    BJLXM?: string;
    /** 文理类型 */
    WLLX?: string;
    /** 毕业日期 */
    BYRQ?: string;
    /** 是否少数民族双语教学班 */
    SFSSMZSYJXB?: string;
    /** 双语教学模式码 */
    SYJXMSM?: string;
    NJSJId?: string;
  };

  type FJLX = {
    id: string;
    /** 房间类型 */
    FJLX: string;
  };

  type CreateFJLX = {
    /** 房间类型 */
    FJLX: string;
  };

  type UpdateFJLX = {
    /** 房间类型 */
    FJLX?: string;
  };

  type FJSJ = {
    id: string;
    /** 房间编号 */
    FJBH?: string;
    /** 房间名称 */
    FJMC?: string;
    /** 房间楼层 */
    FJLC?: string;
    /** 房间建筑面积 */
    FJJZMJ?: number;
    /** 房间使用面积 */
    FJSYMJ?: number;
    /** 房间可容纳人数 */
    FJRS?: number;
    /** 教学楼 */
    JXL?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 校区ID */
    XQ?: string;
    /** 校区名称 */
    XQName?: string;
    XXJBSJ?: {
      id?: string;
      XXDM?: string;
      XXMC?: string;
      XXYWMC?: string;
      XXDZ?: string;
      XXYZBM?: string;
      XZQHM?: string;
    };
    FJLX?: { id?: string; FJLX?: string };
  };

  type CreateFJSJ = {
    /** 房间编号 */
    FJBH?: string;
    /** 房间名称 */
    FJMC?: string;
    /** 房间楼层 */
    FJLC?: string;
    /** 房间建筑面积 */
    FJJZMJ?: number;
    /** 房间使用面积 */
    FJSYMJ?: number;
    /** 房间可容纳人数 */
    FJRS?: number;
    /** 教学楼 */
    JXL?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 校区ID */
    XQ?: string;
    /** 校区名称 */
    XQName?: string;
    /** 房间类型ID */
    FJLXId?: string;
  };

  type UpdateFJSJ = {
    /** 房间编号 */
    FJBH?: string;
    /** 房间名称 */
    FJMC?: string;
    /** 房间楼层 */
    FJLC?: string;
    /** 房间建筑面积 */
    FJJZMJ?: number;
    /** 房间使用面积 */
    FJSYMJ?: number;
    /** 房间可容纳人数 */
    FJRS?: number;
    /** 教学楼 */
    JXL?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 校区ID */
    XQ?: string;
    /** 校区名称 */
    XQName?: string;
    /** 房间类型ID */
    FJLXId?: string;
  };

  type JCSJ = {
    id: string;
    /** 教材编码 */
    JCBM: string;
    /** 教材名称 */
    JCMC: string;
    /** ISBN */
    ISBN?: string;
    /** 作者 */
    ZZ: string;
    /** 版别 */
    BB: string;
    /** 印次 */
    YC?: string;
    /** 定价 */
    DJ: number;
    /** 出版社 */
    CBS: string;
    /** 发行编号 */
    FXBH?: string;
    /** 出版日期 */
    CBRQ?: string;
    /** 装订 */
    ZD?: string;
    /** 开本 */
    KB?: string;
    /** 字数 */
    ZS?: number;
    /** 页数 */
    YS?: number;
    /** 内容简介 */
    NRJJ?: string;
  };

  type CreateJCSJ = {
    /** 教材编码 */
    JCBM: string;
    /** 教材名称 */
    JCMC: string;
    /** ISBN */
    ISBN?: string;
    /** 作者 */
    ZZ: string;
    /** 版别 */
    BB: string;
    /** 印次 */
    YC?: string;
    /** 定价 */
    DJ: number;
    /** 出版社 */
    CBS: string;
    /** 发行编号 */
    FXBH?: string;
    /** 出版日期 */
    CBRQ?: string;
    /** 装订 */
    ZD?: string;
    /** 开本 */
    KB?: string;
    /** 字数 */
    ZS?: number;
    /** 页数 */
    YS?: number;
    /** 内容简介 */
    NRJJ?: string;
  };

  type UpdateJCSJ = {
    /** 教材编码 */
    JCBM?: string;
    /** 教材名称 */
    JCMC?: string;
    /** ISBN */
    ISBN?: string;
    /** 作者 */
    ZZ?: string;
    /** 版别 */
    BB?: string;
    /** 印次 */
    YC?: string;
    /** 定价 */
    DJ?: number;
    /** 出版社 */
    CBS?: string;
    /** 发行编号 */
    FXBH?: string;
    /** 出版日期 */
    CBRQ?: string;
    /** 装订 */
    ZD?: string;
    /** 开本 */
    KB?: string;
    /** 字数 */
    ZS?: number;
    /** 页数 */
    YS?: number;
    /** 内容简介 */
    NRJJ?: string;
  };

  type JCXX = {
    id: string;
    /** 名称 */
    MC: string;
    /** 英文名称 */
    YWMC?: string;
    /** 时长 */
    SC: number;
    /** 说明 */
    SM?: string;
  };

  type CreateJCXX = {
    /** 名称 */
    MC: string;
    /** 英文名称 */
    YWMC?: string;
    /** 时长 */
    SC: number;
    /** 说明 */
    SM?: string;
  };

  type UpdateJCXX = {
    /** 名称 */
    MC?: string;
    /** 英文名称 */
    YWMC?: string;
    /** 时长 */
    SC?: number;
    /** 说明 */
    SM?: string;
  };

  type JXJHSJ = {
    id: string;
    /** 课程号 */
    KCH: string;
    /** 授课年级 */
    SKNJ: string;
    /** 上课学年 */
    SKXN: string;
    /** 上课学期码 */
    SKXQM: string;
    /** 考试方式码 */
    KSFSM?: string;
    KCSJId: string;
  };

  type CreateJXJHSJ = {
    /** 课程号 */
    KCH: string;
    /** 授课年级 */
    SKNJ: string;
    /** 上课学年 */
    SKXN: string;
    /** 上课学期码 */
    SKXQM: string;
    /** 考试方式码 */
    KSFSM?: string;
    KCSJId: string;
  };

  type UpdateJXJHSJ = {
    /** 课程号 */
    KCH?: string;
    /** 授课年级 */
    SKNJ?: string;
    /** 上课学年 */
    SKXN?: string;
    /** 上课学期码 */
    SKXQM?: string;
    /** 考试方式码 */
    KSFSM?: string;
    KCSJId?: string;
  };

  type JZGJBSJ = {
    id: string;
    /** 工号 */
    GH: string;
    /** 姓名 */
    XM: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM: string;
    /** 出生日期 */
    CSRQ: string;
    /** 出生地码 */
    CSDM: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM: string;
    /** 国籍 / 地区码 */
    GJDQM: string;
    /** 身份证件类型码 */
    SFZJLXM: string;
    /** 身份证件号 */
    SFZJH: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 机构号 */
    JGH: string;
    /** 家庭住址 */
    JTZZ?: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 学历码 */
    XLM: string;
    /** 参加工作年月 */
    GZNY: string;
    /** 来校年月 */
    LXNY?: string;
    /** 从教年月 */
    CJNY?: string;
    /** 编制类别码 */
    BZLBM: string;
    /** 档案编号 */
    DABH?: string;
    /** 档案文本 */
    DAWB?: string;
    /** 通信地址 */
    TXDZ: string;
    /** 联系电话 */
    LXDH: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 特长 */
    TC?: string;
    /** 岗位职业码 */
    GWZYM: string;
    /** 主要任课学段 */
    ZYRKXD: string;
  };

  type CreateJZGJBSJ = {
    /** 工号 */
    GH: string;
    /** 姓名 */
    XM: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM: string;
    /** 出生日期 */
    CSRQ: string;
    /** 出生地码 */
    CSDM: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM: string;
    /** 国籍 / 地区码 */
    GJDQM: string;
    /** 身份证件类型码 */
    SFZJLXM: string;
    /** 身份证件号 */
    SFZJH: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 机构号 */
    JGH: string;
    /** 家庭住址 */
    JTZZ?: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 学历码 */
    XLM: string;
    /** 参加工作年月 */
    GZNY: string;
    /** 来校年月 */
    LXNY?: string;
    /** 从教年月 */
    CJNY?: string;
    /** 编制类别码 */
    BZLBM: string;
    /** 档案编号 */
    DABH?: string;
    /** 档案文本 */
    DAWB?: string;
    /** 通信地址 */
    TXDZ: string;
    /** 联系电话 */
    LXDH: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 特长 */
    TC?: string;
    /** 岗位职业码 */
    GWZYM: string;
    /** 主要任课学段 */
    ZYRKXD: string;
  };

  type UpdateJZGJBSJ = {
    /** 工号 */
    GH?: string;
    /** 姓名 */
    XM?: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM?: string;
    /** 出生日期 */
    CSRQ?: string;
    /** 出生地码 */
    CSDM?: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM?: string;
    /** 国籍 / 地区码 */
    GJDQM?: string;
    /** 身份证件类型码 */
    SFZJLXM?: string;
    /** 身份证件号 */
    SFZJH?: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM?: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 机构号 */
    JGH?: string;
    /** 家庭住址 */
    JTZZ?: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 学历码 */
    XLM?: string;
    /** 参加工作年月 */
    GZNY?: string;
    /** 来校年月 */
    LXNY?: string;
    /** 从教年月 */
    CJNY?: string;
    /** 编制类别码 */
    BZLBM?: string;
    /** 档案编号 */
    DABH?: string;
    /** 档案文本 */
    DAWB?: string;
    /** 通信地址 */
    TXDZ?: string;
    /** 联系电话 */
    LXDH?: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 特长 */
    TC?: string;
    /** 岗位职业码 */
    GWZYM?: string;
    /** 主要任课学段 */
    ZYRKXD?: string;
  };

  type KCSJ = {
    id: string;
    /** 课程名称 */
    KCMC: string;
    /** 课程码 */
    KCM: string;
    /** 课程等级码 */
    KCDJM: string;
    /** 课程别名 */
    KCBM: string;
    /** 课程简介 */
    KCJJ?: string;
    /** 课程要求 */
    KCYQ?: string;
    /** 总学时 */
    ZXS?: number;
    /** 周学时 */
    ZHXS?: number;
    /** 自学学时 */
    ZXXS?: number;
    /** 授课方式码 */
    SKFSM: string;
    /** 教材编码 */
    JCBM?: string;
    /** 参考书目 */
    CKSM?: string;
  };

  type CreateKCSJ = {
    /** 课程号 */
    KCH: string;
    /** 课程名称 */
    KCMC: string;
    /** 课程码 */
    KCM: string;
    /** 课程等级码 */
    KCDJM: string;
    /** 课程别名 */
    KCBM: string;
    /** 课程简介 */
    KCJJ?: string;
    /** 课程要求 */
    KCYQ?: string;
    /** 总学时 */
    ZXS?: number;
    /** 周学时 */
    ZHXS?: number;
    /** 自学学时 */
    ZXXS?: number;
    /** 授课方式码 */
    SKFSM: string;
    /** 教材编码 */
    JCBM?: string;
    /** 参考书目 */
    CKSM?: string;
  };

  type UpdateKCSJ = {
    /** 课程号 */
    KCH?: string;
    /** 课程名称 */
    KCMC?: string;
    /** 课程码 */
    KCM?: string;
    /** 课程等级码 */
    KCDJM?: string;
    /** 课程别名 */
    KCBM?: string;
    /** 课程简介 */
    KCJJ?: string;
    /** 课程要求 */
    KCYQ?: string;
    /** 总学时 */
    ZXS?: number;
    /** 周学时 */
    ZHXS?: number;
    /** 自学学时 */
    ZXXS?: number;
    /** 授课方式码 */
    SKFSM?: string;
    /** 教材编码 */
    JCBM?: string;
    /** 参考书目 */
    CKSM?: string;
  };

  type KHBJSJ = {
    id: string;
    /** 班级名称 */
    BJMC: string;
    /** 班级描述 */
    BJMS?: string;
    /** 班级状态 */
    BJZT: '待发布' | '已发布' | '已下架' | '已结课';
    /** 主教ID */
    ZJS?: string;
    /** 副教ID */
    FJS?: string;
    /** 班级人数 */
    BJRS?: number;
    /** 课时数 */
    KSS?: number;
    /** 费用 */
    FY?: number;
    /** 开课日期 */
    KKRQ?: string;
    /** 结课日期 */
    JKRQ?: string;
    /** 报名开始时间 */
    BMKSSJ?: string;
    /** 报名结束时间 */
    BMJSSJ?: string;
    /** 课程图片 */
    KCTP?: string;
    /** 年级ID */
    NJS?: string;
    /** 校区ID */
    XQ?: string;
    /** 年级名称 */
    NJSName?: string;
    /** 校区名称 */
    XQName?: string;
    /** 主教名称 */
    ZJSName?: string;
    /** 副教名称 */
    FJSName?: string;
    /** 课后课程ID */
    KHKCSJId?: string;
    KHKCSJ?: {
      id?: string;
      KCMC?: string;
      KCLX?: string;
      KCTP?: string;
      KCZT?: '待发布' | '已发布' | '已下架' | '已结课';
      KCMS?: string;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      XNXQId?: string;
      KHKCLX?: { id?: string; KCLX?: string; KBYS?: string };
    };
    KHPKSJs?: { id?: string; WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6' }[];
  };

  type CreateKHBJSJ = {
    /** 班级名称 */
    BJMC: string;
    /** 班级描述 */
    BJMS?: string;
    /** 班级状态 */
    BJZT: '待发布' | '已发布' | '已下架' | '已结课';
    /** 主教 */
    ZJS?: string;
    /** 副教 */
    FJS?: string;
    /** 班级人数 */
    BJRS?: number;
    /** 课时数 */
    KSS?: number;
    /** 费用 */
    FY?: number;
    /** 开课日期 */
    KKRQ?: string;
    /** 结课日期 */
    JKRQ?: string;
    /** 报名开始时间 */
    BMKSSJ?: string;
    /** 报名结束时间 */
    BMJSSJ?: string;
    /** 课程图片 */
    KCTP?: string;
    /** 年级ID */
    NJS?: string;
    /** 校区ID */
    XQ?: string;
    /** 年级名称 */
    NJSName?: string;
    /** 校区名称 */
    XQName?: string;
    /** 主教名称 */
    ZJSName?: string;
    /** 副教名称 */
    FJSName?: string;
    /** 课后课程ID */
    KHKCSJId: string;
  };

  type UpdateKHBJSJ = {
    /** 班级名称 */
    BJMC?: string;
    /** 班级描述 */
    BJMS?: string;
    /** 班级状态 */
    BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
    /** 主教 */
    ZJS?: string;
    /** 副教 */
    FJS?: string;
    /** 班级人数 */
    BJRS?: number;
    /** 课时数 */
    KSS?: number;
    /** 费用 */
    FY?: number;
    /** 开课日期 */
    KKRQ?: string;
    /** 结课日期 */
    JKRQ?: string;
    /** 报名开始时间 */
    BMKSSJ?: string;
    /** 报名结束时间 */
    BMJSSJ?: string;
    /** 课程图片 */
    KCTP?: string;
    /** 年级ID */
    NJS?: string;
    /** 校区ID */
    XQ?: string;
    /** 年级名称 */
    NJSName?: string;
    /** 校区名称 */
    XQName?: string;
    /** 主教名称 */
    ZJSName?: string;
    /** 副教名称 */
    FJSName?: string;
    /** 课后课程ID */
    KHKCSJId?: string;
  };

  type KHJSPJ = {
    id: string;
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type CreateKHJSPJ = {
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type UpdateKHJSPJ = {
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type KHKCLX = {
    id: string;
    /** 课后课程类型 */
    KCLX: string;
    /** 班级课表颜色 */
    KBYS?: string;
  };

  type CreateKHKCLX = {
    /** 课后课程类型 */
    KCLX: string;
    /** 班级课表颜色 */
    KBYS?: string;
  };

  type UpdateKHKCLX = {
    /** 课后课程类型 */
    KCLX?: string;
    /** 班级课表颜色 */
    KBYS?: string;
  };

  type KHKCSJ = {
    id: string;
    /** 课程名称 */
    KCMC: string;
    /** 课程图片 */
    KCTP?: string;
    /** 课程状态 */
    KCZT: '待发布' | '已发布' | '已下架' | '已结课';
    /** 课程描述 */
    KCMS?: string;
    /** 开课日期 */
    KKRQ?: string;
    /** 结课日期 */
    JKRQ?: string;
    /** 报名开始时间 */
    BMKSSJ?: string;
    /** 报名结束时间 */
    BMJSSJ?: string;
    /** 学年学期ID */
    XNXQId?: string;
    XNXQ?: { id?: string; XN?: string; XQ?: string; KSRQ?: string; JSRQ?: string };
    KHKCLX?: { id?: string; KCLX?: string };
    KHBJSJs?: {
      id?: string;
      BJMC?: string;
      BJMS?: string;
      BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
      ZJS?: string;
      FJS?: string;
      BJRS?: number;
      KSS?: number;
      FY?: number;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      KCTP?: string;
      KBYS?: string;
      NJS?: string;
      XQ?: string;
      NJSName?: string;
      XQName?: string;
      ZJSName?: string;
      FJSName?: string;
    }[];
  };

  type CreateKHKCSJ = {
    /** 课程名称 */
    KCMC: string;
    /** 课程图片 */
    KCTP: string;
    /** 课程状态 */
    KCZT: '待发布' | '已发布' | '已下架' | '已结课';
    /** 课程描述 */
    KCMS?: string;
    /** 开课日期 */
    KKRQ: string;
    /** 结课日期 */
    JKRQ: string;
    /** 报名开始时间 */
    BMKSSJ: string;
    /** 报名结束时间 */
    BMJSSJ: string;
    /** 学年 */
    XN: string;
    /** 学期 */
    XQ: string;
    /** 课程类型ID */
    KHKCLXId?: string;
  };

  type UpdateKHKCSJ = {
    /** 课程名称 */
    KCMC?: string;
    /** 课程图片 */
    KCTP?: string;
    /** 课程状态 */
    KCZT?: '待发布' | '已发布' | '已下架' | '已结课';
    /** 课程描述 */
    KCMS?: string;
    /** 开课日期 */
    KKRQ?: string;
    /** 结课日期 */
    JKRQ?: string;
    /** 报名开始时间 */
    BMKSSJ?: string;
    /** 报名结束时间 */
    BMJSSJ?: string;
    /** 学年学期ID */
    XNXQId?: string;
    /** 课程类型ID */
    KHKCLXId?: string;
  };

  type KHPKSJ = {
    id: string;
    /** 上课日期(周几) */
    WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    KHBJSJ?: {
      id?: string;
      BJMC?: string;
      BJMS?: string;
      BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
      ZJS?: string;
      FJS?: string;
      BJRS?: number;
      KSS?: number;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      KCTP?: string;
      NJS?: string;
      XQ?: string;
      NJSName?: string;
      XQName?: string;
      ZJSName?: string;
      FJSName?: string;
      KHKCSJ?: {
        id?: string;
        KCMC?: string;
        KCTP?: string;
        KCZT?: '待发布' | '已发布' | '已下架' | '已结课';
        KCMS?: string;
        KKRQ?: string;
        JKRQ?: string;
        BMKSSJ?: string;
        BMJSSJ?: string;
      };
    };
    XXSJPZ?: {
      id?: string;
      KSSJ?: string;
      JSSJ?: string;
      KJS?: string;
      TITLE?: string;
      BZXX?: string;
      TYPE?: 0 | 1 | 2;
    };
    FJSJ?: {
      id?: string;
      FJBH?: string;
      FJMC?: string;
      FJLC?: string;
      FJJZMJ?: number;
      FJSYMJ?: number;
      FJRS?: number;
      FJLX?: string;
      XQ?: string;
      XQName?: string;
    };
  };

  type CreateKHPKSJ = {
    /** 上课日期(周几) */
    WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    /** 学校时间配置ID */
    XXSJPZId?: string;
    /** 课后班级ID */
    KHBJSJId?: string;
    /** 房间ID */
    FJSJId?: string;
    /** 学年学期ID */
    XNXQId?: string;
  };

  type UpdateKHPKSJ = {
    /** 上课日期(周几) */
    WEEKDAY?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
    /** 学校时间配置ID */
    XXSJPZId?: string;
    /** 课后班级ID */
    KHBJSJId?: string;
    /** 房间ID */
    FJSJId?: string;
    /** 学校ID */
    XNXQId?: string;
  };

  type KHXSCQ = {
    /** 出勤状态 */
    CQZT?: '出勤' | '请假' | '缺勤';
    /** 出勤日期 */
    CQRQ?: string;
    /** 学生Id */
    XSId?: string;
    KHBJSJ?: {
      id?: string;
      BJMC?: string;
      BJMS?: string;
      BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
      ZJS?: string;
      FJS?: string;
      BJRS?: number;
      KSS?: number;
      FY?: number;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      KCTP?: string;
    };
    /** 年级ID */
    NJS?: string;
    /** 校区ID */
    XQ?: string;
    /** 年级名称 */
    NJSName?: string;
    /** 校区名称 */
    XQName?: string;
    /** 主教名称 */
    ZJSName?: string;
    /** 副教名称 */
    FJSName?: string;
  };

  type CreateKHXSCQ = {
    /** 出勤状态 */
    CQZT?: '出勤' | '请假' | '缺勤';
    /** 出勤日期 */
    CQRQ?: string;
    /** 学生Id */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type UpdateKHXSCQ = {
    /** 出勤状态 */
    CQZT?: '出勤' | '请假' | '缺勤';
    /** 出勤日期 */
    CQRQ?: string;
  };

  type KHXSDD = {
    /** 订单编号 */
    DDBH?: string;
    /** 下单时间 */
    XDSJ?: string;
    /** 支付方式 */
    ZFFS?: '线上支付' | '线下支付';
    /** 支付时间 */
    ZFSJ?: string;
    /** 电子发票 */
    DZFP?: string;
    /** 订单状态 */
    DDZT?: '待付款' | '已付款' | '已取消' | '待退款' | '已退款';
    /** 订单费用 */
    DDFY?: number;
    /** 学生Id */
    XSId?: string;
    KHBJSJ?: {
      id?: string;
      BJMC?: string;
      BJMS?: string;
      BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
      ZJS?: string;
      FJS?: string;
      BJRS?: number;
      KSS?: number;
      FY?: number;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      KCTP?: string;
    };
    /** 年级ID */
    NJS?: string;
    /** 校区ID */
    XQ?: string;
    /** 年级名称 */
    NJSName?: string;
    /** 校区名称 */
    XQName?: string;
    /** 主教名称 */
    ZJSName?: string;
    /** 副教名称 */
    FJSName?: string;
  };

  type CreateKHXSDD = {
    /** 下单时间 */
    XDSJ?: string;
    /** 支付方式 */
    ZFFS?: '线上支付' | '线下支付';
    /** 支付时间 */
    ZFSJ?: string;
    /** 电子发票 */
    DZFP?: string;
    /** 订单状态 */
    DDZT?: '待付款' | '已付款' | '已取消' | '待退款' | '已退款';
    /** 订单费用 */
    DDFY?: number;
    /** 学生Id */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type UpdateKHXSDD = {
    /** 下单时间 */
    XDSJ?: string;
    /** 支付方式 */
    ZFFS?: '线上支付' | '线下支付';
    /** 支付时间 */
    ZFSJ?: string;
    /** 电子发票 */
    DZFP?: string;
    /** 订单状态 */
    DDZT?: '待付款' | '已付款' | '已取消' | '待退款' | '已退款';
    /** 订单费用 */
    DDFY?: number;
  };

  type KHXSPJ = {
    id: string;
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type CreateKHXSPJ = {
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type UpdateKHXSPJ = {
    /** 评价日期 */
    PJRQ?: string;
    /** 评价类型 */
    PJLX?: '节次评价' | '总评价';
    /** 评价分数 */
    PJFS?: string;
    /** 评语 */
    PY?: string;
    /** 教师ID */
    JSId?: string;
    /** 学生ID */
    XSId?: string;
    /** 班级ID */
    KHBJSJId?: string;
  };

  type KHXSQJ = {
    /** 请假开始时间 */
    KSSJ?: string;
    /** 请假结束时间 */
    JSSJ?: string;
    /** 请假时长 */
    QJSC?: number;
    /** 请假原因 */
    QJYY?: string;
    /** 请假状态 */
    QJZT?: '已确认' | '待确认' | '已取消';
    /** 请假类型 */
    QJLX?: '按课时请假' | '按时间请假';
    /** 学生Id */
    XSId?: string;
    KHBJSJs?: {
      id?: string;
      BJMC?: string;
      BJMS?: string;
      BJZT?: '待发布' | '已发布' | '已下架' | '已结课';
      ZJS?: string;
      FJS?: string;
      BJRS?: number;
      KSS?: number;
      FY?: number;
      KKRQ?: string;
      JKRQ?: string;
      BMKSSJ?: string;
      BMJSSJ?: string;
      KCTP?: string;
      NJS?: string;
      XQ?: string;
      NJSName?: string;
      XQName?: string;
      ZJSName?: string;
      FJSName?: string;
    }[];
  };

  type CreateKHXSQJ = {
    /** 请假开始时间 */
    KSSJ: string;
    /** 请假结束时间 */
    JSSJ: string;
    /** 请假时长 */
    QJSC?: number;
    /** 请假原因 */
    QJYY: string;
    /** 请假状态 */
    QJZT: '已确认' | '待确认' | '已取消';
    /** 请假类型 */
    QJLX: '按课时请假' | '按时间请假';
    /** 学生Id */
    XSId?: string;
    /** 班级ID */
    bjIds?: { KHBJSJId?: string; QJRQ?: string }[];
  };

  type UpdateKHXSQJ = {
    /** 请假开始时间 */
    KSSJ?: string;
    /** 请假结束时间 */
    JSSJ?: string;
    /** 请假时长 */
    QJSC?: number;
    /** 请假原因 */
    QJYY?: string;
    /** 请假状态 */
    QJZT?: '已确认' | '待确认' | '已取消';
    /** 请假类型 */
    QJLX?: '按课时请假' | '按时间请假';
  };

  type NJSJ = {
    id: string;
    /** 年级 */
    NJ: number;
    /** 年级名称 */
    NJMC: string;
  };

  type CreateNJSJ = {
    /** 年级 */
    NJ: number;
    /** 年级名称 */
    NJMC: string;
  };

  type UpdateNJSJ = {
    /** 年级 */
    NJ?: number;
    /** 年级名称 */
    NJMC?: string;
  };

  type PKSJ = {
    id: string;
    /** 课程号 */
    KCH: string;
    /** 授课教师工号 */
    SKJSGH: string;
    /** 房间编号 */
    FJBH?: string;
    /** 授课日期 */
    SKRQ?: string;
    /** 开始课节数 */
    KSKJS?: number;
    /** 结束课节数 */
    JSKJS?: number;
  };

  type CreatePKSJ = {
    /** 课程号 */
    KCH: string;
    /** 授课教师工号 */
    SKJSGH: string;
    /** 房间编号 */
    FJBH?: string;
    /** 授课日期 */
    SKRQ?: string;
    /** 开始课节数 */
    KSKJS?: number;
    /** 结束课节数 */
    JSKJS?: number;
    KCSJId: string;
    JZGJBSJId: string;
  };

  type UpdatePKSJ = {
    /** 课程号 */
    KCH?: string;
    /** 授课教师工号 */
    SKJSGH?: string;
    /** 房间编号 */
    FJBH?: string;
    /** 授课日期 */
    SKRQ?: string;
    /** 开始课节数 */
    KSKJS?: number;
    /** 结束课节数 */
    JSKJS?: number;
    KCSJId?: string;
    JZGJBSJId?: string;
  };

  type CurrentUser = {
    id?: string;
    /** 学校代码 */
    XXDM?: string;
    /** 登录名，学号或工号 */
    loginName?: string;
    /** 姓名 */
    username: string;
    /** 头像 */
    avatar?: string;
    /** 身份ID */
    identityId?: string;
    /** 部门ID */
    departmentId?: string;
    /** 状态，0无效1有效，其他可由业务自行定义 */
    status?: number;
    /** 权限 */
    auth?: '老师' | '家长' | '管理员';
    /** 微信用户ID */
    userId?: string;
    /** 微信用户企业ID */
    CorpId?: string;
    subscriber_info?: {
      remark?: string;
      children?: { njId?: string; department?: string[]; student_userid?: string; name?: string }[];
    };
  };

  type CreateUser = {
    /** 学校代码 */
    XXDM: string;
    /** 登录名，学号或工号 */
    loginName: string;
    /** 密码 */
    password: string;
    /** 姓名 */
    username: string;
    /** 头像 */
    avatar?: string;
    /** 身份ID */
    identityId?: string;
    /** 部门ID */
    departmentId?: string;
    /** 状态，0无效1有效，其他可由业务自行定义 */
    status: number;
    UserTypeId: string;
    UserType?: { id?: string; name?: string };
  };

  type XL = {
    id: string;
    /** 标题 */
    BT?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
  };

  type CreateXL = {
    /** 标题 */
    BT?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
    XNXQId: string;
  };

  type UpdateXL = {
    /** 标题 */
    BT?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
    XNXQId: string;
  };

  type XNJGSJ = {
    id: string;
    /** 机构号 */
    JGH: string;
    /** 隶属机构号 */
    LSJGH: string;
    /** 机构名称 */
    JGMC: string;
    /** 机构简称 */
    JGJC: string;
    /** 负责人工号 */
    FZRGH?: string;
  };

  type CreateXNJGSJ = {
    /** 机构号 */
    JGH: string;
    /** 隶属机构号 */
    LSJGH: string;
    /** 机构名称 */
    JGMC: string;
    /** 机构简称 */
    JGJC: string;
    /** 负责人工号 */
    FZRGH?: string;
  };

  type UpdateXNJGSJ = {
    /** 机构号 */
    JGH?: string;
    /** 隶属机构号 */
    LSJGH?: string;
    /** 机构名称 */
    JGMC?: string;
    /** 机构简称 */
    JGJC?: string;
    /** 负责人工号 */
    FZRGH?: string;
  };

  type XNXQ = {
    id: string;
    /** 学年 */
    XN: string;
    /** 学期 */
    XQ: string;
    /** 开始日期 */
    KSRQ: string;
    /** 结束日期 */
    JSRQ: string;
  };

  type CreateXNXQ = {
    /** 学年 */
    XN: string;
    /** 学期 */
    XQ: string;
    /** 开始日期 */
    KSRQ: string;
    /** 结束日期 */
    JSRQ: string;
  };

  type UpdateXNXQ = {
    /** 学年 */
    XN?: string;
    /** 学期 */
    XQ?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
  };

  type XQSJ = {
    id: string;
    /** 校区号 */
    XQH?: string;
    /** 校区名称 */
    XQMC?: string;
    /** 校区地址 */
    XQDZ?: string;
    /** 校区邮政编码 */
    XQYZBM?: string;
    /** 校区联系电话 */
    XQLXDH?: string;
    /** 校区传真电话 */
    XQCZDH?: string;
    XXJBSJ?: {
      id?: string;
      XXDM?: string;
      XXMC?: string;
      XXYWMC?: string;
      XXDZ?: string;
      XXYZBM?: string;
      XZQHM?: string;
    };
    JZGJBSJ?: { id?: string; GH?: string; XM?: string; YWXM?: string; XMPY?: string };
  };

  type CreateXQSJ = {
    /** 校区号 */
    XQH?: string;
    /** 校区名称 */
    XQMC?: string;
    /** 校区地址 */
    XQDZ?: string;
    /** 校区邮政编码 */
    XQYZBM?: string;
    /** 校区联系电话 */
    XQLXDH?: string;
    /** 校区传真电话 */
    XQCZDH?: string;
    /** 校区负责人ID */
    JZGJBSJId?: string;
  };

  type UpdateXQSJ = {
    /** 校区号 */
    XQH?: string;
    /** 校区名称 */
    XQMC?: string;
    /** 校区地址 */
    XQDZ?: string;
    /** 校区邮政编码 */
    XQYZBM?: string;
    /** 校区联系电话 */
    XQLXDH?: string;
    /** 校区传真电话 */
    XQCZDH?: string;
    /** 校区负责人ID */
    JZGJBSJId?: string;
  };

  type XSJBSJ = {
    id: string;
    /** 学号 */
    XH: string;
    /** 姓名 */
    XM: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM: string;
    /** 出生日期 */
    CSRQ: string;
    /** 出生地码 */
    CSDM: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM: string;
    /** 国籍/地区码 */
    GJDQM: string;
    /** 身份证件类型码 */
    SFZJLXM: string;
    /** 身份证件号 */
    SFZJH: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 独生子女标志 */
    DSZYBZ: string;
    /** 入学年月 */
    RXNY: string;
    /** 年级 */
    NJ: number;
    /** 班号 */
    BH: string;
    /** 学生类别码 */
    XSLBM: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 是否流动人口 */
    SFLDRK: string;
    /** 特长 */
    TC?: string;
    /** 联系电话 */
    LXDH?: string;
    /** 通信地址 */
    TXDZ?: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 学籍号 */
    XJH?: string;
  };

  type CreateXSJBSJ = {
    /** 学号 */
    XH: string;
    /** 姓名 */
    XM: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM: string;
    /** 出生日期 */
    CSRQ: string;
    /** 出生地码 */
    CSDM: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM: string;
    /** 国籍/地区码 */
    GJDQM: string;
    /** 身份证件类型码 */
    SFZJLXM: string;
    /** 身份证件号 */
    SFZJH: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 独生子女标志 */
    DSZYBZ: string;
    /** 入学年月 */
    RXNY: string;
    /** 年级 */
    NJ: number;
    /** 班号 */
    BH: string;
    /** 学生类别码 */
    XSLBM: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 是否流动人口 */
    SFLDRK: string;
    /** 特长 */
    TC?: string;
    /** 联系电话 */
    LXDH?: string;
    /** 通信地址 */
    TXDZ?: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 学籍号 */
    XJH?: string;
  };

  type UpdateXSJBSJ = {
    /** 学号 */
    XH?: string;
    /** 姓名 */
    XM?: string;
    /** 英文姓名 */
    YWXM?: string;
    /** 姓名拼音 */
    XMPY?: string;
    /** 曾用名 */
    CYM?: string;
    /** 性别码 */
    XBM?: string;
    /** 出生日期 */
    CSRQ?: string;
    /** 出生地码 */
    CSDM?: string;
    /** 籍贯 */
    JG?: string;
    /** 民族码 */
    MZM?: string;
    /** 国籍/地区码 */
    GJDQM?: string;
    /** 身份证件类型码 */
    SFZJLXM?: string;
    /** 身份证件号 */
    SFZJH?: string;
    /** 婚姻状况码 */
    HYZKM?: string;
    /** 港澳台侨外码 */
    GATQWM?: string;
    /** 政治面貌码 */
    ZZMMM?: string;
    /** 健康状况码 */
    JKZKM?: string;
    /** 信仰宗教码 */
    XYZJM?: string;
    /** 血型码 */
    XXM?: string;
    /** 身份证件有效期 */
    SFZJYXQ?: string;
    /** 独生子女标志 */
    DSZYBZ?: string;
    /** 入学年月 */
    RXNY?: string;
    /** 年级 */
    NJ?: number;
    /** 班号 */
    BH?: string;
    /** 学生类别码 */
    XSLBM?: string;
    /** 现住址 */
    XZZ?: string;
    /** 户口所在地 */
    HKSZD?: string;
    /** 户口性质码 */
    HKXZM?: string;
    /** 是否流动人口 */
    SFLDRK?: string;
    /** 特长 */
    TC?: string;
    /** 联系电话 */
    LXDH?: string;
    /** 通信地址 */
    TXDZ?: string;
    /** 邮政编码 */
    YZBM?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 学籍号 */
    XJH?: string;
  };

  type XXGG = {
    /** 公告标题 */
    BT?: string;
    /** 公告内容 */
    NR?: string;
  };

  type CreateXXGG = {
    /** 公告标题 */
    BT?: string;
    /** 公告内容 */
    NR?: string;
  };

  type UpdateXXGG = {
    /** 公告标题 */
    BT?: string;
    /** 公告内容 */
    NR?: string;
  };

  type XXJBSJ = {
    id: string;
    /** 学校代码 */
    XXDM: string;
    /** 学校名称 */
    XXMC: string;
    /** 学校英文名称 */
    XXYWMC?: string;
    /** 学校地址 */
    XXDZ: string;
    /** 学校邮政编码 */
    XXYZBM: string;
    /** 行政区划码 */
    XZQHM: string;
    /** 建校年月 */
    JXNY: string;
    /** 校庆日 */
    XQR: string;
    /** 学校办学类型码 */
    XXBXLXM: string;
    /** 学校主管部门码 */
    XXZGBMM: string;
    /** 法定代表人号 */
    FDDBRH?: string;
    /** 法人证书号 */
    FRZSH: string;
    /** 校长工号 */
    XZGH?: string;
    /** 校长姓名 */
    XZXM: string;
    /** 党委负责人号 */
    DWFZRH?: string;
    /** 组织机构码 */
    ZZJGM?: string;
    /** 联系电话 */
    LXDH: string;
    /** 传真电话 */
    CZDH: string;
    /** 电子信箱 */
    DZXX: string;
    /** 主页地址 */
    ZYDZ: string;
    /** 历史沿革 */
    LSYG?: string;
    /** 学校办别码 */
    XXBBM: string;
    /** 所属主管单位码 */
    SSZGDWM: string;
    /** 所在地城乡类型码 */
    SZDCXLXM: string;
    /** 所在地经济属性码 */
    SZDJJSXM: string;
    /** 所在地民族属性 */
    SZDMZSX: string;
    /** 小学学制 */
    XXXZ?: number;
    /** 小学入学年龄 */
    XXRXNL?: number;
    /** 初中学制 */
    CZXZ?: number;
    /** 初中入学年龄 */
    CZRXNL?: number;
    /** 高中学制 */
    GZXZ?: number;
    /** 主教学语言码 */
    ZJXYYM: string;
    /** 辅教学语言码 */
    FJXYYM: string;
    /** 招生半径 */
    ZSBJ?: string;
  };

  type CreateXXJBSJ = {
    /** 学校代码 */
    XXDM: string;
    /** 学校名称 */
    XXMC: string;
    /** 学校英文名称 */
    XXYWMC?: string;
    /** 学校地址 */
    XXDZ: string;
    /** 学校邮政编码 */
    XXYZBM: string;
    /** 行政区划码 */
    XZQHM: string;
    /** 建校年月 */
    JXNY: string;
    /** 校庆日 */
    XQR: string;
    /** 学校办学类型码 */
    XXBXLXM: string;
    /** 学校主管部门码 */
    XXZGBMM: string;
    /** 法定代表人号 */
    FDDBRH?: string;
    /** 法人证书号 */
    FRZSH: string;
    /** 校长工号 */
    XZGH?: string;
    /** 校长姓名 */
    XZXM: string;
    /** 党委负责人号 */
    DWFZRH?: string;
    /** 组织机构码 */
    ZZJGM?: string;
    /** 联系电话 */
    LXDH: string;
    /** 传真电话 */
    CZDH: string;
    /** 电子信箱 */
    DZXX: string;
    /** 主页地址 */
    ZYDZ: string;
    /** 历史沿革 */
    LSYG?: string;
    /** 学校办别码 */
    XXBBM: string;
    /** 所属主管单位码 */
    SSZGDWM: string;
    /** 所在地城乡类型码 */
    SZDCXLXM: string;
    /** 所在地经济属性码 */
    SZDJJSXM: string;
    /** 所在地民族属性 */
    SZDMZSX: string;
    /** 小学学制 */
    XXXZ?: number;
    /** 小学入学年龄 */
    XXRXNL?: number;
    /** 初中学制 */
    CZXZ?: number;
    /** 初中入学年龄 */
    CZRXNL?: number;
    /** 高中学制 */
    GZXZ?: number;
    /** 主教学语言码 */
    ZJXYYM: string;
    /** 辅教学语言码 */
    FJXYYM: string;
    /** 招生半径 */
    ZSBJ?: string;
  };

  type UpdateXXJBSJ = {
    /** 学校代码 */
    XXDM?: string;
    /** 学校名称 */
    XXMC?: string;
    /** 学校英文名称 */
    XXYWMC?: string;
    /** 学校地址 */
    XXDZ?: string;
    /** 学校邮政编码 */
    XXYZBM?: string;
    /** 行政区划码 */
    XZQHM?: string;
    /** 建校年月 */
    JXNY?: string;
    /** 校庆日 */
    XQR?: string;
    /** 学校办学类型码 */
    XXBXLXM?: string;
    /** 学校主管部门码 */
    XXZGBMM?: string;
    /** 法定代表人号 */
    FDDBRH?: string;
    /** 法人证书号 */
    FRZSH?: string;
    /** 校长工号 */
    XZGH?: string;
    /** 校长姓名 */
    XZXM?: string;
    /** 党委负责人号 */
    DWFZRH?: string;
    /** 组织机构码 */
    ZZJGM?: string;
    /** 联系电话 */
    LXDH?: string;
    /** 传真电话 */
    CZDH?: string;
    /** 电子信箱 */
    DZXX?: string;
    /** 主页地址 */
    ZYDZ?: string;
    /** 历史沿革 */
    LSYG?: string;
    /** 学校办别码 */
    XXBBM?: string;
    /** 所属主管单位码 */
    SSZGDWM?: string;
    /** 所在地城乡类型码 */
    SZDCXLXM?: string;
    /** 所在地经济属性码 */
    SZDJJSXM?: string;
    /** 所在地民族属性 */
    SZDMZSX?: string;
    /** 小学学制 */
    XXXZ?: number;
    /** 小学入学年龄 */
    XXRXNL?: number;
    /** 初中学制 */
    CZXZ?: number;
    /** 初中入学年龄 */
    CZRXNL?: number;
    /** 高中学制 */
    GZXZ?: number;
    /** 主教学语言码 */
    ZJXYYM?: string;
    /** 辅教学语言码 */
    FJXYYM?: string;
    /** 招生半径 */
    ZSBJ?: string;
  };

  type XXPZ = {
    /** 键 */
    KEY?: 'BMKSSJ' | 'BMJSSJ' | 'KKRQ' | 'JKRQ' | 'TITLE';
    /** 值 */
    VALUE?: string;
    /** 备注信息 */
    REMARK?: string;
    XNXQ?: { id?: string; XN?: string; XQ?: string; KSRQ?: string; JSRQ?: string };
  };

  type CreateXXPZ = {
    /** 键 */
    KEY: 'BMKSSJ' | 'BMJSSJ' | 'KKRQ' | 'JKRQ' | 'TITLE';
    /** 值 */
    VALUE: string;
    /** 备注信息 */
    REMARK?: string;
    /** 学年 */
    xn?: string;
    /** 学期 */
    xq?: string;
  };

  type UpdateXXPZ = {
    /** 键 */
    KEY: 'BMKSSJ' | 'BMJSSJ' | 'KKRQ' | 'JKRQ' | 'TITLE';
    /** 值 */
    VALUE: string;
    /** 备注信息 */
    REMARK?: string;
  };

  type XXSJPZ = {
    id: string;
    /** 开始时间 */
    KSSJ?: string;
    /** 结束时间 */
    JSSJ?: string;
    /** 课节数 */
    KJS?: string;
    /** 标题/名称 */
    TITLE?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 类型，0:时段维护，1:报名开始/结束时间，2:开课/结课日期 */
    TYPE?: '0' | '1' | '2';
    XXJBSJ?: {
      id?: string;
      XXDM?: string;
      XXMC?: string;
      XXYWMC?: string;
      XXDZ?: string;
      XXYZBM?: string;
      XZQHM?: string;
    };
    XNXQ?: { id?: string; XN?: string; XQ?: string; KSRQ?: string; JSRQ?: string };
  };

  type CreateXXSJPZ = {
    /** 开始时间 */
    KSSJ?: string;
    /** 结束时间 */
    JSSJ?: string;
    /** 课节数 */
    KJS?: string;
    /** 标题/名称 */
    TITLE?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 类型，0:时段维护，1:报名开始/结束时间，2:开课/结课日期 */
    TYPE: '0' | '1' | '2';
    /** 学年 */
    xn: string;
    /** 学期 */
    xq: string;
  };

  type UpdateXXSJPZ = {
    /** 开始时间 */
    KSSJ?: string;
    /** 结束时间 */
    JSSJ?: string;
    /** 课节数 */
    KJS?: string;
    /** 标题/名称 */
    TITLE?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 类型，0:时段维护，1:报名开始/结束时间，2:开课/结课日期 */
    TYPE?: '0' | '1' | '2';
  };

  type ZXFA = {
    id: string;
    /** 方案名称 */
    FAMC: string;
    /** 开始日期 */
    KSRQ: string;
    /** 结束日期 */
    JSRQ: string;
    /** 起始时间 */
    QSSJ: string;
    /** 说明 */
    SM?: string;
  };

  type CreateZXFA = {
    /** 方案名称 */
    FAMC: string;
    /** 开始日期 */
    KSRQ: string;
    /** 结束日期 */
    JSRQ: string;
    /** 起始时间 */
    QSSJ: string;
    /** 说明 */
    SM?: string;
  };

  type UpdateZXFA = {
    /** 方案名称 */
    FAMC?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
    /** 起始时间 */
    QSSJ?: string;
    /** 说明 */
    SM?: string;
  };

  type ZXSJ = {
    id: string;
    /** 上课时段 */
    SD: string;
    /** 上课属性 */
    SX: string;
    /** 开始时间 */
    KSSJ: string;
    /** 结束时间 */
    JSSJ: string;
    /** 适用星期 */
    SYXQ: string;
  };

  type CreateZXSJ = {
    /** 上课时段 */
    SD: string;
    /** 上课属性 */
    SX: string;
    /** 适用星期 */
    SYXQ: string;
  };

  type UpdateZXSJ = {
    id?: string;
    /** 上课时段 */
    SD?: string;
    /** 上课属性 */
    SX?: string;
    /** 适用星期 */
    SYXQ?: string;
    JCXXId?: string;
    ZXFAId?: string;
  };
}
