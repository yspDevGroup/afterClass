/**
 *
 *
 课程管理维护字段
  id  UUID;
  BJMC 班级名称；
  BJZT 班级状态；
  FY 费用；
  ZJS 主教师；
  FJS 副教师；
  NJMC 年级名称；
  BJMS 班级描述；
 */

export type CourseItem = {
  id?: string;
  BJMC?: string;
  BJZT?: string;
  FY?: number;
  ZJS?: string;
  FJS?: string;
  NJSJs?: [
    {
      id: string;
      NJ: number;
      NJMC: string;
    },
  ];
  BJMS?: string;
  NJSName?: string;
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
