/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import styles from '../index.less';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { Badge } from 'antd';


type ApplicantPropsType = {
  SKXQData?: any;
};

const ApplicantInfoTable: FC<ApplicantPropsType> = (props) => {
  const { SKXQData } = props;
  const [DataSource, setDataSource] = useState<any>();

  useEffect(() => {
    (
      async () => {
        const res = await getAllKHJSCQ({
          KHBJSJId: SKXQData.id
        })
        if (res.status === 'ok') {
          const CQData = res?.data || [];
          const result = await getKCBSKSJ({
            KHBJSJId: SKXQData?.id,
          })
          if (result.status === 'ok') {
            const AllSKData = result.data!.rows!;
            const NoSignInArr: any[] = [];
            for (let i = 0; i < CQData.length; i++) {
              const obj = CQData[i];
              const TimeId = obj.XXSJPZId;
              const SKRQ = obj.CQRQ;
              const JsId = obj.JZGJBSJId;
              const CQZTs = obj.CQZT;
              for (let j = 0; j < result.data!.rows!.length; j++) {
                const aj = result.data!.rows![j];
                const TimeIds = aj.XXSJPZId;
                const SKRQs = aj.SKRQ;

                aj.KCBSKJSSJs.forEach((value: any) => {
                  if (TimeId === TimeIds && SKRQ === SKRQs && JsId === value.JZGJBSJ.id) {
                    aj.KCBSKJSSJs.find((item: any) => {
                      if (item.JZGJBSJ.id === JsId) {
                        // eslint-disable-next-line no-param-reassign
                        item.JZGJBSJ.type = CQZTs
                        NoSignInArr.push(aj)
                        return NoSignInArr;
                      }
                      return ''
                    })
                  }
                })
              }
            }
            NoSignInArr.forEach((value) => {
              AllSKData.push(value)
            })
            const unique = (arr: any) => {
              const arr1: any[] = [];
              for (let i = 0, len = arr.length; i < len; i++) {
                if (!arr1.includes(arr[i])) {      // 检索arr1中是否含有arr中的值
                  arr1.push(arr[i]);
                }
              }
              return arr1;
            }
            setDataSource(unique(AllSKData));
          }
        }
      }
    )()
  }, [])

  const columns: ProColumns<any>[] = [
    {
      title: '节次',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
      render: (_text: any, record: any) => {
        return DataSource.indexOf(record) + 1
      }
    },
    {
      title: '上课日期',
      dataIndex: 'SKRQ',
      key: 'SKRQ',
      align: 'center',
      width: 170,
      render: (_text: any, record: any) => {
        return `${record.SKRQ} ${record.XXSJPZ.KSSJ.substring(0, 5)}~${record.XXSJPZ.JSSJ.substring(0, 5)}`
      }
    },
    {
      title: '主教师',
      dataIndex: 'ZJS',
      key: 'ZJS',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return <>{
          record?.KCBSKJSSJs.length === 0 ? <>—</> : <>
            {
              record?.KCBSKJSSJs.map((value: any) => {
                if (value.JSLX === 1) {
                  let colors: any = '';
                  if (new Date(record.SKRQ) > new Date()) {
                    colors = '#dddddd'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '出勤') {
                    colors = '#89da8c'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '请假') {
                    colors = '#f2c862'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '代课') {
                    colors = '#ac90fb'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '缺席') {
                    colors = '#ff7171'
                  } else {
                    colors = '#ff7171'
                  }
                  const showWXName = value?.JZGJBSJ?.XM === '未知' && value?.JZGJBSJ?.WechatUserId;
                  if (showWXName) {
                    return <span className={styles.TeacherName} style={{ border: `1px solid ${colors}` }}><Badge color={colors} /><WWOpenDataCom type="userName" openid={value?.JZGJBSJ?.WechatUserId} /></span>
                  }
                  return <span className={styles.TeacherName} style={{ border: `1px solid ${colors}` }}><Badge color={colors} />{value.JZGJBSJ?.XM}</span>;
                }
                return '';
              })
            }
          </>
        }</>

      },
    },
    {
      title: '副教师',
      dataIndex: 'FJS',
      key: 'FJS',
      align: 'center',
      width: 230,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return <>{
           record?.KCBSKJSSJs.find((items: any) => items.JSLX === 0) ? <>
              {
              record?.KCBSKJSSJs.map((value: any) => {
                if (value.JSLX === 0) {
                  let colors: any = '';
                  if (new Date(record.SKRQ) > new Date()) {
                    colors = '#dddddd'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '出勤') {
                    colors = '#89da8c'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '请假') {
                    colors = '#f2c862'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '代课') {
                    colors = '#ac90fb'
                  } else if (value.JZGJBSJ.type && value.JZGJBSJ.type === '缺席') {
                    colors = '#ff7171'
                  } else {
                    colors = '#ff7171'
                  }
                  const showWXName = value?.JZGJBSJ?.XM === '未知' && value?.JZGJBSJ?.WechatUserId;
                  if (showWXName) {
                    return <span className={styles.TeacherName} style={{ border: `1px solid ${colors}` }}><Badge color={colors} /><WWOpenDataCom type="userName" openid={value?.JZGJBSJ?.WechatUserId} /></span>
                  }
                  return <span className={styles.TeacherName} style={{ border: `1px solid ${colors}` }}><Badge color={colors} />{value.JZGJBSJ?.XM}</span>;
                }
                return '';
              })
            }</> : <>—</>

        }</>
      },
    },

  ];

  return (
    <div className={styles.BMdivs}>
      <ProTable
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
        toolBarRender={() => [
          <Badge color="#89da8c" text="出勤" />,
          <Badge color="#f2c862" text="请假" />,
          <Badge color="#ac90fb" text="代课" />,
          <Badge color="#dddddd" text="待上" />,
          <Badge color="#ff7171" text="缺勤" />,
        ]}
      />
    </div>
  );
};

export default ApplicantInfoTable;
