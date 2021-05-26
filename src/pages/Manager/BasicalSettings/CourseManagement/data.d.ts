/**
 * 
 * 
 课程管理维护字段
  id  UUID;
  KCMC 课程名称；
  KCLX 类型；
  KCSC 时长；
  KCFY 费用；
  KCTP 课程封面；
  KCMS 简介；
  KCZT 状态；
 */

export type CourseItem = {
    id?: string;
    KCMC?: string;
    KCLX?: string;
    KCSC?: number;
    KCFY?: number;
    KCTP?: string;
    KCMS?: string;
    KCZT?: string;
};

/**
 * 
课程类型维护 字段
 decs 描述
 state 名称
 */

export type DataSourceType = {
    id: React.Key;
    decs?: string;
    state?: string;
   
  };