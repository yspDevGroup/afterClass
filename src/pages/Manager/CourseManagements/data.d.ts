/*
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-06-01 09:52:34
 * @,@LastEditTime: ,: 2021-06-02 17:23:03
 * @,@LastEditors: ,: Please set LastEditors
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\pages\Manager\BasicalSettings\NewClassManagement\data.d.ts
 */
export type classType={
    id?: string;
    KCMC?: string;
    KHKCLX?: kcshj;
    KCTP?: string;
    BJS?: number;
    KHBJSJs?: {
        id?: string;
        BJMC?: string;
        BJMS?: string;
        BJZT?: string;
        ZJS?: string;
        FJS?: string;
        BJRS?: number;
        KSS?: number;
        FY?: number;
        KKRQ?: string;
        JKRQ?: string;
        KBYS?: string;
      }[];
}
type kcshj={ id?: string; KCLX?: string };

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
  