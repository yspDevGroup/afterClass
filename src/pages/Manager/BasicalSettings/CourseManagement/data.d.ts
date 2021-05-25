/**
 * 
 * 
 课程管理维护字段
  id  UUID;
  KCMC 课程名称；
  LX 类型；
  SC 时长；
  FY 费用；
  KCFM 课程封面；
  JJ 简介；
  ZT 状态；
 */

export type CourseItem = {
    id?: string;
    KCMC?: string;
    LX?: string;
    SC?: number;
    FY?: number;
    KCFM?: string;
    JJ?: string;
    ZT?: string;
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