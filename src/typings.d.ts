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

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const ENV_title: string;
declare const ENV_subTitle: string;
declare const ENV_copyRight: string;
declare const ENV_backUrl: string;
declare const ENV_host: string;

declare const wx: any;
declare const WWOpenData: any;
declare const wxInfo: {
  xqList: (WXDepType & { njList?: WXDepType[] })[];
};
declare const xnxqInfo: {
  xnxqList: any;
  current: any;
};