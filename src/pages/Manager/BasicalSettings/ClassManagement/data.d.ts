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
    FJSJ?: string;
    ZJS?: string;
    FJS?: string;
    BJRS?: number;
    BJMS?: string;
    BJZT?: string;
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
}
