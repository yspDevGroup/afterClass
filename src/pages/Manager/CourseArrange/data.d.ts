/**
 * 
 * 排课管理维护字段
    id  UUID;
    BJMC:班级名称；
    FJSJ 上课地点；
    ZJS 授课老师；
    FJS 助教老师；
    BJRS 学生人数；
    BJMS 简介 ;
    BJZT 状态 ;
 */

export type ClassItem = {
  id?: string;
  BJMC?: string;
  FJSJ?: FJSJtype;
  ZJS?: string;
  FJS?: string;
  BJRS?: number;
  BJMS?: string;
  BJZT?: string;
};
/**
 * 
    "FJBH": 房间编号 ,
    "FJMC": 房间名称,
    "FJLC": 房间楼层, 
    "FJJZMJ": 房间建筑面积,
    "FJSYMJ": 房间使用面积,
    "FJRS":房间容纳人数 ,
    "FJLX": 房间类型
 * 
 */

type FJSJtype = {
  id?: string;
  FJBH?: string;
  FJMC?: string;
  FJLC?: string;
  FJJZMJ?: number;
  FJSYMJ?: number;
  FJRS?: number;
  FJLX?: string;
};

/**
 * 
 *  学生信息字段
    id  UUID;
    XM:姓名
    SKDD 学号
    SSNJ 所属年级;
    SSBJ 所属班级;
 */

export type StudentType = {
  id?: string;
  XM?: string;
  XH?: string;
  SSNJ?: string;
  SSBJ?: string;
};

/**
 * 
 *  班级字段
    id : UUID;
    BJ: 班级
    LS: 老师
 */

export type BJType = {
  id?: string;
  BJMC?: string;
  ZJS?: string;
};

/**
 * 
 *  年级字段
    id : UUID;
    NJ: 年级
    NJMC: 年级名称
 */

export type GradeType = {
  id?: string;
  NJ?: string;
  NJMC?: string;
};

/**
 * 
 *  场地字段
    id  UUID;
    FJLX:场地类型
 */
export type SiteType = {
  id?: string;
  FJMC?: string;
};

/**
 * 
 *  课程字段
    id  UUID;
    KCMC:课程名称
 */
export type CourseType = {
  id?: string;
  KCMC?: string;
};
