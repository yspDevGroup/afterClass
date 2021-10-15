declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

/**
 * 学校基本数据字段
 * XXDM: 学校代码;
 * XXMC: 学校名称;
 * XXYWMC: 学校英文名称;
 * XXDZ: 学校地址;
 * XXYZBM: 学校邮政编码;
 * XZQHM: 行政区划码;
 */
type SchoolType = {
  id?: string;
  XXDM?: string;
  XXMC?: string;
  XXYWMC?: string;
  XXDZ?: string;
  XXYZBM?: string;
  XZQHM?: string;
};
/**
 * 校区基本数据字段
 * XQH: 校区号;
 * XQMC: 校区名称;
 * XQDZ: 校区地址;
 * XQYZBM: 校区邮政编码;
 * XQLXDH: 校区联系电话;
 * XQCZDH: 校区传真电话;
 */
type SchoolAreaType = {
  id?: string;
  XQH?: string;
  XQMC?: string;
  XQDZ?: string;
  XQYZBM?: string;
  XQLXDH?: string;
  XQCZDH?: string;
};
/**
 * 场地类型字段
 *  id  UUID;
 *  FJLX  场地类型;
 */
type RoomType = {
  id?: string;
  FJLX?: string;
};
/**
 * 场地维护字段
 *  id  UUID;
 *  FJBH  房间编号;
 *  FJMC  房间名称;
 *  FJLC  房间楼层;
 *  FJJZMJ  房间建筑面积;
 *  FJSYMJ  房间使用面积;
 *  FJRS  容纳人数;
 *  FJLX  场地类型;
 *  JXL  教学楼;
 *  XXJBSJ 学校基本数据
 *  SSXQ  所属校区;
 *  BZXX  备注;
 */
type RoomItem = {
  id?: string;
  FJBH?: string;
  FJMC?: string;
  FJLC?: string;
  FJJZMJ?: number;
  FJSYMJ?: number;
  FJRS?: number;
  FJLX?: RoomType;
  JXL?: string;
  XXJBSJ?: SchoolType;
  XQSJ?: SchoolAreaType;
  BZXX?: string;
  XQName?: string;
};

// 微信部门的数据类型
type WXDepType = {
  /** 部门名称 */
  name?: string;
  /** 父亲部门id,根部门该项为0 */
  parentid?: number;
  /** 部门id,根部门固定为1 */
  id?: number;
  /** 部门类型，32位整型，1表示班级，2表示年级，3表示学段，4表示校区，5表示学校（根部门） */
  type?: number;
  /** 入学年份，仅标准年级返回，格式为YYYY */
  register_year?: number;
  /** 标准年级 */
  standard_grade?: number;
  /** 在父部门中的次序值，order值大的排序靠前。 */
  order?: number;
  department_admins?: {
    /** 部门管理员的userid */
    userid?: string;
    /** 部门管理员的类型，1表示校区负责人，2表示年级负责人，3表示班主任，4表示任课老师，5表示学段负责人 */
    type?: number;
    /** 教师或班主任的科目 */
    subject?: string;
  }[];
  /** 是否是已毕业，1表示是，0表示不是。仅部门类型为年级时才返回该字段 */
  is_graduated?: number;
  /** 是否开启班级群，1表示开启，0表示关闭。仅部门类型为班级时才返回该字段 */
  open_group_chat?: number;
  /** 班级群id。仅部门类型为班级时且open_group_chat为1时才返回该字段 */
  group_chat_id?: number;
};
// 学年学期的数据类型
type ChainDataType = {
  /** 联动一级数据 类型 */
  data: { label: string; value: string }[];
  /** 联动二级数据类型 */
  subData: Record<string, { label: string; value: string }[]>;
};
// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

type Window = {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  routerBase: string;
  // wx_XQList: (WXDepType & { njList?: WXDepType[] })[];
};

declare let ga: () => void;

declare module 'react-h5-calendar';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const ENV_title: string;
declare const ENV_subTitle: string;
declare const ENV_copyRight: string;
/** 访问域名 */
declare const ENV_host: string;
/** 后台地址 */
declare const ENV_backUrl: string;
/** 统一认证地址 */
declare const ssoHost: string;
/** 认证类型 */
declare const authType: 'wechat' | 'password' | 'authorization_code';
/** 认证客户端id */
declare const clientId: string;
/** 认证客户端密钥 */
declare const clientSecret: string;
declare const testStudentId: string;
declare const testTeacherId: string;

declare const wx: any;
declare const WWOpenData: any;
declare const wxInfo: {
  xqList: (WXDepType & { njList?: WXDepType[] })[];
};
declare const xnxqInfo: {
  xnxqList: any;
  current: any;
  data: any;
};

type InitialState = {
  settings?: Partial<LayoutSettings>;
  currentUser?: any; // API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
};

/** oAuth认证token */
type TokenInfo = {
  access_token: string;
  expires_in?: string;
  refresh_token?: string;
  token_type?: string;
};
