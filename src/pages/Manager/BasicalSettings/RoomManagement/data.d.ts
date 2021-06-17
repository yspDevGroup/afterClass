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
 场地类型维护 字段
 decs 描述
 state 名称
 */

export type DataSourceType = {
  id?: string;
  FJLX?: string;
  title?: string;
};