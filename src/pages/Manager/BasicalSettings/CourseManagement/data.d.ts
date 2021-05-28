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
 * 查询参数
 *
 * @export
 * @interface TableListParams
 */
export type TableListParams = {
    pageSize?: number;
    current?: number;
    search?: string;
    filter?: Record<string, any[]>;
    sorter?: Record<string, any>;
  } & Record<string, any>;
  


/**
 * 
课程类型维护 字段
 KCMS 描述
 KCLX 类型
 */

export type DataSourceType = {
    id?: string;
    KCLX?: string;
    KCMS?: string;
    title?: string;
};