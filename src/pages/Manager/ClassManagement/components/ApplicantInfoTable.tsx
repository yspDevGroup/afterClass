import type { FC } from 'react';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
import { message, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { paginationConfig } from '@/constant';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { createKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';
import { useModel } from 'umi';
import { createKHXSTK, updateKHXSTK } from '@/services/after-class/khxstk';
import moment from 'moment';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { getEnrolled } from '@/services/after-class/khbjsj';

/**
 *
 * 报名人详情
 * @return {*}
 */
type ApplicantPropsType = {
  dataSource: Record<any, any>;
  actionRefs: React.MutableRefObject<ActionType | undefined>
};

const ApplicantInfoTable: FC<ApplicantPropsType> = (props) => {
  const { BJMC, KCBDatas } = props.dataSource;
  const {actionRefs} = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();
  const [KHXSBJs, setKHXSBJs] = useState<any>();
  const onsetKHXSBJs = async () => {
    const res = await getEnrolled({
      id: KCBDatas?.id
    });
    if (res.status === 'ok') {
      setKHXSBJs(res.data)
    }
  }
  useEffect(() => {
    if (KCBDatas) {
      onsetKHXSBJs()
    }
  }, [KCBDatas])
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XH
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      render: (_text: any, record: any) => {
        const showWXName = record?.XSJBSJ?.XM === '未知' && record?.XSJBSJ?.WechatUserId;
        if (showWXName) {
          return <WWOpenDataCom type="userName" openid={record?.XSJBSJ.WechatUserId} />;
        }
        return record?.XSJBSJ?.XM;
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`
      },
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 150,
      render: (_text: any, record: any) => {
        return record?.createdAt?.substring(0, 16)
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_: any, record: any) => {
        return <>
          {
            new Date(KCBDatas?.BMJSSJ).getTime() >= new Date().getTime() ?
              <Popconfirm
                title="确定取消该学生的报名吗?"
                onConfirm={async () => {
                  try {
                    // 创建退课
                    const res = await createKHTKSJ([{
                      ZT: 0,
                      LX: 0,
                      KSS: KCBDatas?.KSS,
                      XSJBSJId: record?.XSJBSJ?.id,
                      KHBJSJId: record?.KHBJSJId
                    }])
                    if (res.status === 'ok') {
                      // 更新退课状态
                      const resupdateKHTKSJ = await updateKHTKSJ({ id: res.data[0].id }, { ZT: 1 })
                      // 查询该订单费用
                      if (resupdateKHTKSJ.status === 'ok') {
                        const resgetAllKHXSDD = await getAllKHXSDD({
                          XXJBSJId: currentUser?.xxId,
                          XSJBSJId: record?.XSJBSJ?.id,
                          DDLX: 0,
                          bjmc: KCBDatas?.BJMC
                        })
                        if (resgetAllKHXSDD.status === 'ok') {
                          // 创建退款
                          const rescreateKHXSTK = await createKHXSTK({
                            KHBJSJId: record?.KHBJSJId,
                            KHTKSJId: res.data[0].id,
                            XXJBSJId: currentUser?.xxId,
                            XSJBSJId: record?.XSJBSJ?.id,
                            TKJE: resgetAllKHXSDD!.data![0].DDFY!,
                            JZGJBSJId: currentUser?.JSId || testTeacherId,
                            TKZT: 0,
                            SPSJ: moment(new Date()).format()
                          })
                          if (rescreateKHXSTK.status === 'ok') {
                            // 更新退款状态
                            const resupdateKHXSTK = await updateKHXSTK({ id: rescreateKHXSTK!.data!.id! }, {
                              TKZT: 1,
                              TKSJ: moment(new Date()).format(),
                              deviceIp: '117.36.118.42'
                            })
                            if (resupdateKHXSTK.status === 'ok') {
                              message.success('课程费用已原路返还');
                              onsetKHXSBJs();
                              actionRefs.current?.reload();
                            } else {
                              message.error('取消失败，请联系管理员或稍后重试。');
                            }
                          }
                        }
                      }
                    }
                  } catch (err) {
                    message.error('取消失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <Tooltip title="本课程暂未开始上课，退课后，系统将自动发起全额退款">
                  <a>取消报名</a>
                </Tooltip>
              </Popconfirm> : <></>
          }

        </>
      },
    },
  ];
  return (
    <div>
      <div style={{ marginBottom: 16 }}>课程班名称：{BJMC}</div>
      <ProTable
        search={false}
        dataSource={KHXSBJs}
        actionRef={actionRef}
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
      />
    </div>
  );
};

export default ApplicantInfoTable;
