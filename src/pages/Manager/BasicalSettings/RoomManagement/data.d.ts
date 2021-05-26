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
export type RoomItem = {
  id?: string;
  FJBH?: string;
  FJMC?: string;
  FJLC?: string;
  FJJZMJ?: number;
  FJSYMJ?: number;
  FJRS?: number;
  FJLX?: string;
  JXL?: string;
  XXJBSJ?: SchoolType;
  XQSJ?: SchoolAreaType;
  BZXX?: string;
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
 场地类型维护 字段
 decs 描述
 state 名称
 */

export type DataSourceType = {
  id: React.Key;
  decs?: string;
  state?: string;

};