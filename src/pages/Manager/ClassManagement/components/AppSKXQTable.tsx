/*
 * @description: 授课安排列表
 * @author: wsl
 * @Date: 2021-12-07 10:57:15
 * @LastEditTime: 2022-03-11 18:27:56
 * @LastEditors: zpl
 */
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Badge } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import styles from '../index.less';
import moment from 'moment';

const statusColors = {
  出勤: '#89da8c',
  请假: '#f2c862',
  代课: '#ac90fb',
  待上: '#DDD',
  缺席: '#ff7171',
};

type TeacherLabelProps = {
  /** 上课日期 */
  SKRQ: string;
  /** 考勤信息类别 */
  status?: string;
  /** 微信用户ID */
  WechatUserId?: string;
  /** 姓名 */
  XM?: string;
};

/**
 * 根据教师出勤信息渲染dom
 */
const TeacherLabel: FC<TeacherLabelProps> = ({ SKRQ, status = '', WechatUserId, XM }) => {
  let colors: string = '';
  if (status) {
    colors = statusColors[status];
  } else if (moment(new Date(SKRQ)).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD")) {
    colors = statusColors.待上;
  }
  if (colors) {
    return (
      <span className={styles.TeacherName} style={{ border: `1px solid ${colors}` }}>
        <Badge color={colors} />
        <ShowName type="userName" openid={WechatUserId} XM={XM} />
      </span>
    );
  }
  return <>—</>;
};

/** 授课详情数据定义 */
type SKXQProps = {
  /** 上课日期 */
  SKRQ: string;
  /** 学校时间配置 */
  XXSJPZ: {
    /** 开始时间 */
    KSSJ: string;
    /** 结束时间 */
    JSSJ: string;
  };
  teachers?: {
    /** 微信用户ID */
    WechatUserId?: string;
    /** 姓名 */
    XM?: string;
    /** 任教类型，1 主教，0 副教 */
    type: number;
    /** 出勤信息 */
    status?: string;
  }[];
};

type ApplicantPropsType = {
  SKXQData?: any;
};

const ApplicantInfoTable: FC<ApplicantPropsType> = ({ SKXQData }) => {
  const [DataSource, setDataSource] = useState<SKXQProps[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getAllKHJSCQ({
        KHBJSJId: SKXQData.id,
      });
      if (res.status === 'ok') {
        /** 所有出勤信息 */
        const CQDataList = res?.data || [];
        const result = await getKCBSKSJ({
          KHBJSJId: [SKXQData?.id],
        });
        if (result.status === 'ok') {
          /** 所有排课信息 */
          const allSKData = result.data!.rows!;
          console.log(allSKData, 'allSKData----')
          // 遍历所有排课节次组装数据
          const newDataSource: SKXQProps[] = allSKData.map((skData: { SKRQ: string | undefined; XXSJPZId: string | undefined; KCBSKJSSJs: any; XXSJPZ: any; }) => {
            // 当前课时已出勤的所有老师
            const cqTeacherList = CQDataList.filter((data) => {
              const sameDay = data.CQRQ === skData.SKRQ;
              const sameJC = data.XXSJPZId === skData.XXSJPZId;
              return sameDay && sameJC;
            });
            console.log(cqTeacherList, 'cqTeacherList------')
            // 当前课时排课的所有老师
            const pkTeacherList = skData.KCBSKJSSJs;

            console.log(pkTeacherList, 'pkTeacherList-----')
            let teachers: {
              /** 微信用户ID */
              WechatUserId?: string;
              /** 姓名 */
              XM?: string;
              /** 任教类型，1 主教，0 副教 */
              type: number;
              /** 出勤信息 */
              status?: string;
            }[] = [];
            if (cqTeacherList.length) {
              if (cqTeacherList.length !== pkTeacherList?.length) {
                cqTeacherList.forEach((item1: any) => {
                  pkTeacherList.forEach((item2: any) => {
                    if (item1?.JZGJBSJId === item2?.JZGJBSJId) {
                      // eslint-disable-next-line no-param-reassign
                      item2.CQZT = item1?.CQZT
                    }
                  })
                })
                teachers = pkTeacherList.map((teacher: { JZGJBSJ: { WechatUserId: any; XM: any; }; JSLX: null; CQZT: any; }) => {
                  return {
                    WechatUserId: teacher.JZGJBSJ.WechatUserId,
                    XM: teacher.JZGJBSJ.XM,
                    type:
                      typeof teacher.JSLX === 'undefined' || teacher.JSLX === null ? 1 : teacher.JSLX,
                    status: teacher.CQZT,
                  };
                });
              } else {
                teachers = cqTeacherList.map((teacher) => {
                  return {
                    WechatUserId: teacher.JZGJBSJ.WechatUserId,
                    XM: teacher.JZGJBSJ.XM,
                    type:
                      typeof teacher.JSLX === 'undefined' || teacher.JSLX === null ? 1 : teacher.JSLX,
                    status: teacher.CQZT,
                  };
                });
              }
            } else if (pkTeacherList?.length) {
              teachers = pkTeacherList.map((teacher: { JZGJBSJ: { WechatUserId: any; XM: any; }; JSLX: any; }) => ({
                WechatUserId: teacher.JZGJBSJ?.WechatUserId,
                XM: teacher.JZGJBSJ?.XM,
                type: teacher.JSLX!,
              }));
            }
            return {
              SKRQ: skData.SKRQ!,
              XXSJPZ: {
                KSSJ: skData.XXSJPZ!.KSSJ!,
                JSSJ: skData.XXSJPZ!.JSSJ!,
              },
              teachers,
            };
          });
          console.log(newDataSource, 'newDataSource---')
          setDataSource(newDataSource);
        }
      }
    })();
  }, []);

  const columns: ProColumns<SKXQProps>[] = [
    {
      title: '节次',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
      render: (_text, record) => {
        return DataSource.indexOf(record) + 1;
      },
    },
    {
      title: '上课日期',
      dataIndex: 'SKRQ',
      key: 'SKRQ',
      align: 'center',
      width: 170,
      render: (_text, record) => {
        return `${record.SKRQ} ${record.XXSJPZ.KSSJ?.substring(
          0,
          5,
        )}~${record.XXSJPZ.JSSJ?.substring(0, 5)}`;
      },
    },
    {
      title: '主教师',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text, record) => {
        return (
          <>
            {record.teachers?.length === 0 ? (
              <>—</>
            ) : (
              <>
                {record.teachers?.map((value) => {
                  if (value.type === 1) {
                    return (
                      <TeacherLabel
                        SKRQ={record.SKRQ}
                        status={value.status}
                        WechatUserId={value.WechatUserId}
                        XM={value.XM}
                      />
                    );
                  }
                  return '';
                })}
              </>
            )}
          </>
        );
      },
    },
    {
      title: '副教师',
      dataIndex: 'FJS',
      key: 'FJS',
      align: 'center',
      width: 230,
      ellipsis: true,
      render: (_text, record) => {
        return (
          <>
            {record.teachers?.find((items) => items.type === 0) ? (
              <>
                {record.teachers?.map((value) => {
                  if (value.type === 0) {
                    return (
                      <TeacherLabel
                        SKRQ={record.SKRQ}
                        status={value.status}
                        WechatUserId={value.WechatUserId}
                        XM={value.XM}
                      />
                    );
                  }
                  return '';
                })}
              </>
            ) : (
              <>—</>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className={styles.BMdivs}>
      <ProTable<SKXQProps>
        rowKey="id"
        search={false}
        dataSource={DataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          defaultCurrent: 1,
          pageSizeOptions: ['5'],
          showQuickJumper: false,
          showSizeChanger: false,
          showTotal: undefined,
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        headerTitle={`课程班名称：${SKXQData?.BJMC}`}
        toolBarRender={() => {
          return Object.keys(statusColors).map((stat) => (
            <Badge key={stat} color={statusColors[stat]} text={stat} />
          ));
        }}
      />
    </div>
  );
};

export default ApplicantInfoTable;
