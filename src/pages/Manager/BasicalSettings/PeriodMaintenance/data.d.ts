/*
 * @,@Author: ,: your name
 * @,@Date: ,: 2021-05-28 16:01:24
 * @LastEditTime: 2021-06-17 18:04:17
 * @LastEditors: txx
 * @,@Description: ,: In User Settings Edit
 * @,@FilePath: ,: \afterClass\src\pages\Manager\BasicalSettings\PeriodMaintenance\data.d.ts
 */

export type Maintenance = {
    id?: string;
    /** 标题 */
    TITLE?: string;
    /** 开始时间 */
    KSSJ?: string;
    /** 结束时间 */
    JSSJ?: string;
    /** 类型 */
    TYPE?: string;
    /** 备注信息 */
    BZXX?: string;
    /** 课节数 */
    KJS?: string;
    /** 学年学期 */
    XNXQ?: {
        id?: string;
        /** 开始日期 */
        KSRQ?: string;
        /** 结束日期 */
        JSRQ?: string;
        /** 学年 */
        XN?: string;
        /** 学期 */
        XQ?: string;
    }
    /** 学校基本数据 */
    XXJBSJ?: SchoolType;
    SDMC?: string;
   
}