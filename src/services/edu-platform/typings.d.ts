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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
    NJSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
  };

  type NJSJ = {
    id: string;
    /** 年级 */
    NJ: number;
    /** 年级名称 */
    NJMC: string;
    XXJBSJId: string;
  };

  type CreateNJSJ = {
    /** 年级 */
    NJ: number;
    /** 年级名称 */
    NJMC: string;
    XXJBSJId: string;
  };

  type UpdateNJSJ = {
    /** 年级 */
    NJ?: number;
    /** 年级名称 */
    NJMC?: string;
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    /** 创建时间 */
    createdAt?: string;
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
    XXJBSJId: string;
  };

  type CreateXL = {
    /** 标题 */
    BT?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
    XXJBSJId: string;
    XNXQId: string;
  };

  type UpdateXL = {
    /** 标题 */
    BT?: string;
    /** 开始日期 */
    KSRQ?: string;
    /** 结束日期 */
    JSRQ?: string;
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
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
    XXJBSJId: string;
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
    XXJBSJId?: string;
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
    XXJBSJId: string;
  };

  type CreateZXSJ = {
    /** 上课时段 */
    SD: string;
    /** 上课属性 */
    SX: string;
    /** 适用星期 */
    SYXQ: string;
    XXJBSJId: string;
  };

  type UpdateZXSJ = {
    id?: string;
    /** 上课时段 */
    SD?: string;
    /** 上课属性 */
    SX?: string;
    /** 适用星期 */
    SYXQ?: string;
    XXJBSJId?: string;
    JCXXId?: string;
    ZXFAId?: string;
  };
}
