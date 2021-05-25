/**
 * 
    id  UUID;
    BJMC:班级名称；
    SKDD 上课地点；
    SKLS 授课老师；
    ZJLS 助教老师；
    XSRS 学生人数；
    JJ 简介 ;
    ZT 状态 ;
 */

export type ClassItem = {
    id?: string;
    BJMC?: string;
    SKDD?: string;
    SKLS?: string;
    ZJLS?: string[];
    XSRS?: number;
    JJ?: string;
    ZT?: string;
};

export type StudentType = {
    id?: string;
    XM?: string;
    XH?: string;
    SSNJ?: string;
    SSBJ?: string;
}
