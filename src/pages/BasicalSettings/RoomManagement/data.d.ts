/**
 * 场地维护字段
 *  id  UUID;
 *  CDMC  场地名称;
 *  CDLX  场地类型;
 *  SSXQ  所属校区;
 *  RNRS  容纳人数;
 *  CDDZ  场地地址;
 *  BZ  备注;
 */
export type RoomItem = {
  id?: string;
  CDMC?: string;
  CDLX?: string;
  SSXQ?: string;
  RNRS?: string;
  CDDZ?: string;
  BZ?: string;
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
