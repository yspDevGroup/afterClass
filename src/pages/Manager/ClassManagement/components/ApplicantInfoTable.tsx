import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import {
  message,
  Popconfirm,
  Tooltip,
  Button,
  Modal,
  Space,
  // Divider,
  Form,
  Input,
  Upload,
  Badge,
} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { UploadOutlined } from '@ant-design/icons';
import ShowName from '@/components/ShowName';
import { createKHTKSJ, updateKHTKSJ } from '@/services/after-class/khtksj';
import { useModel } from 'umi';
import { createKHXSTK, updateKHXSTK } from '@/services/after-class/khxstk';
import moment from 'moment';
import { getAllKHXSDD } from '@/services/after-class/khxsdd';
import { getEnrolled } from '@/services/after-class/khbjsj';
import SignUp from '../components/SingUp';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import styles from '../index.less';
import AgentRegistration from '../components/AgentRegistration';
import { sendMessageToParent } from '@/services/after-class/wechat';
import ReplacePay from './replacePay';
import { getAuthorization } from '@/utils/utils';
import { JSInforMation } from '@/components/JSInforMation';

const { TextArea } = Input;

/**
 *
 * 报名人详情
 * @return {*}
 */
type ApplicantPropsType = {
  actionRefs: React.MutableRefObject<ActionType | undefined>;
  clickBjId?: any;
};

const ApplicantInfoTable: FC<ApplicantPropsType> = (props) => {
  const { actionRefs, clickBjId } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();

  const singUpRef = useRef<any>();
  const [KHXSBJs, setKHXSBJs] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  // 当前时间范围是否在报名时间范围内
  const [timeFalg, setTimeFalg] = useState<boolean>(true);
  // 当前时间范围是否在开课范围内
  const [kkTimeFalg, setkkTimeFalg] = useState<boolean>(true);
  // 报名列表数据
  const [applicantData, setApplicantData] = useState<any>({});
  // 报名人数
  const [selectNumber, setSelectNumber] = useState<number>(0);

  // 代报名中教辅费用
  const [JFAmount, setJFAmount] = useState<any>(0);
  // 代报名中班级信息
  // const [BjDetails, setBjDetails] = useState<any>();
  // 控制代报名中弹框
  const [modalVisible, setModalVisible] = useState(false);

  // 催缴费
  const [JFVisible, setJFVisible] = useState<boolean>(false);
  const [JFXSList, setJfXSList] = useState<any[]>([]);
  const [form] = Form.useForm();

  // 代缴费
  const [DJFXS, setDJFXS] = useState<string | undefined>();
  const [DJFVisible, setDJFVisible] = useState<boolean>(false);

  // 导入
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);

  // 获取报名学生数据
  const onsetKHXSBJs = async () => {
    const res = await getEnrolled({
      id: clickBjId,
    });
    if (res.status === 'ok') {
      setKHXSBJs(res.data);
    }
  };

  // 获取课后班级数据详情
  const getApplicantData = async () => {
    const result = await getKHBJSJ({
      id: clickBjId,
    });
    if (result.status === 'ok') {
      setApplicantData(result?.data);
      if (result.data?.KHKCJCs?.length !== 0) {
        let num: number = 0;
        for (let i = 0; i < result.data?.KHKCJCs.length; i += 1) {
          num += Number(result.data?.KHKCJCs[i].JCFY);
        }
        setJFAmount(Number(num).toFixed(2));
      }
      onsetKHXSBJs();
    } else {
      message.warning(result.message);
    }
  };

  useEffect(() => {
    if (clickBjId) {
      getApplicantData();
    }
  }, [clickBjId]);

  // 报名时间是否在范围内
  const getISTimeRange = () => {
    if (applicantData?.BMZT === 1) {
      setTimeFalg(true);
    } else {
      setTimeFalg(false);
    }
  };
  // 开课时间是否在范围内
  const getISKKTimeRange = () => {
    if (applicantData?.KKRQ && applicantData?.JKRQ) {
      const nowTime = moment().valueOf();
      const beginTime = moment(applicantData?.KKRQ, 'YYYY-MM-DD').valueOf();
      const endTime = moment(applicantData?.JKRQ, 'YYYY-MM-DD').add(1, 'days').valueOf();

      if (nowTime >= beginTime && nowTime <= endTime) {
        setkkTimeFalg(true);
      } else {
        setkkTimeFalg(false);
      }
    } else {
      setkkTimeFalg(false);
    }
  };
  // 取消报名
  const batchCancel = async (XSList: { XSJBSJId: string; ZT: number }[]) => {
    if (XSList.length > 0) {
      const newlist = XSList.map((item: any) => {
        return {
          KSS: applicantData?.KSS,
          LX: 0, //  1是服务   0是课程班是服务班
          XSJBSJId: item?.XSJBSJId,
          ZT: 0,
          KHBJSJId: clickBjId,
          XNXQId: applicantData?.XNXQId,
        };
      });

      const result = await createKHTKSJ(newlist);
      // const result = await cancleClass({
      //   KHBJSJId: applicantData?.id,
      //   XSlist: XSList,
      //   JZGJBSJId: currentUser?.JSId || testTeacherId,
      //   BZ: '',
      //   deviceIp: '117.36.118.42',
      //   MSG: `您所选的${applicantData?.KHKCSJ?.KCMC}-${applicantData?.BJMC}，取消报名请知悉`,
      // });
      if (result.status === 'ok') {
        message.success('取消报名成功');
        actionRef?.current?.clearSelected?.();
        onsetKHXSBJs();
      } else {
        message.error(result.message);
      }
    } else {
      message.error('您选择的课程没有可以取消报名的学生');
    }
  };

  // 取消报名
  const onCancelSignUp = (record: any) => {
    return (
      <Popconfirm
        title="确定取消该学生的报名吗?"
        onConfirm={async () => {
          batchCancel([{ XSJBSJId: record.XSJBSJId, ZT: record.ZT }]);
        }}
        okText="确定"
        cancelText="取消"
        placement="topRight"
      >
        <Tooltip placement="bottom" title="取消报名">
          <a>取消报名</a>
        </Tooltip>
      </Popconfirm>
    );
  };

  // 催缴费
  const urgingPayment = async (XSList: any[]) => {
    if (XSList.length) {
      setJFVisible(true);
      setJfXSList(XSList);
    } else {
      message.error('没有可催缴的学生');
    }

    // Modal.info({
    //   title: '催缴费通知',
    //   content: (

    //   )
    // })
    // if(XSList.length){

    //
  };

  const handleCJSubmit = async (param: any) => {
    try {
      const res = await sendMessageToParent({
        to: 'to_student_userid',
        text: param.MSG,
        ids: JFXSList,
      });
      if (res?.status === 'ok') {
        message.success('已催缴');
        setJFVisible(false);
        actionRef?.current?.clearSelected?.();
      } else {
        setJFVisible(false);
        message.error(res.message);
      }
    } catch {
      message.error('催缴出现错误，请联系管理员或稍后重试。');
    }
  };

  useEffect(() => {
    if (applicantData) {
      getISTimeRange();
      getISKKTimeRange();
    }
  }, [applicantData]);

  const onSubmit = () => {
    const { BJRS = 0 } = applicantData;
    // 判断人数是否超出范围
    if (BJRS - KHXSBJs?.length < selectNumber) {
      message.error('报名人数超出课程班限定人数');
    } else if (singUpRef?.current) {
      singUpRef.current.onSubmit?.();
    }
  };

  // 课程班学生代报名
  const showModalBM = () => {
    setModalVisible(true);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XH;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      render: (_text: any, record: any) => (
        <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
      ),
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`;
      },
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 150,
      render: (_text: any, record: any) => {
        return record?.createdAt?.substring(0, 16);
      },
    },
    {
      title: '缴费状态',
      dataIndex: 'ZT',
      key: 'ZT',
      align: 'center',
      width: 100,
      render: (_text: any) => {
        if (_text === 3) {
          return <span style={{ color: '#4884ff' }}>未缴费</span>;
        }
        if (_text === 1) {
          return <span style={{ color: '#4884ff' }}>退课中</span>;
        }
        return <span style={{ color: '#36970c' }}>已缴费</span>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            {
              //  如果报名时间内 开课时间外 报名类型属于先报名后缴费 或者缴费即报名 并且付款的的情况 实现退款退费
              !kkTimeFalg &&
              applicantData?.BJZT === '已开班' &&
              applicantData.BMLX !== 2 &&
              record?.ZT === 0 ? (
                <Popconfirm
                  title="确定取消该学生的报名吗?"
                  onConfirm={async () => {
                    try {
                      // 创建退课
                      const res = await createKHTKSJ([
                        {
                          ZT: 0,
                          LX: 0,
                          KSS: applicantData?.KSS,
                          XSJBSJId: record?.XSJBSJ?.id,
                          KHBJSJId: record?.KHBJSJId,
                          XNXQId: applicantData?.XNXQId,
                        },
                      ]);
                      if (res?.status === 'ok' && res?.data) {
                        // 更新退课状态
                        if (res?.data?.[0]?.id) {
                          const resupdateKHTKSJ = await updateKHTKSJ(
                            { id: res?.data?.[0]?.id },
                            { ZT: 1 },
                          );
                          // 查询该订单费用
                          if (resupdateKHTKSJ.status === 'ok') {
                            const resgetAllKHXSDD = await getAllKHXSDD({
                              XXJBSJId: currentUser?.xxId,
                              XSJBSJId: record?.XSJBSJ?.id,
                              DDLX: 0,
                              KHBJSJId: applicantData?.id,
                            });
                            if (resgetAllKHXSDD.status === 'ok') {
                              if (resgetAllKHXSDD!.data![0].DDFY! <= 0) {
                                onsetKHXSBJs();
                                message.success('取消成功');
                              } else {
                                // 创建退款
                                const rescreateKHXSTK = await createKHXSTK({
                                  KHBJSJId: record?.KHBJSJId,
                                  KHTKSJId: res?.data?.[0]?.id,
                                  XXJBSJId: currentUser?.xxId,
                                  XSJBSJId: record?.XSJBSJ?.id,
                                  TKJE: resgetAllKHXSDD!.data![0].DDFY!,
                                  JZGJBSJId: currentUser?.JSId || testTeacherId,
                                  TKZT: 0,
                                  SPSJ: moment(new Date()).format(),
                                  XNXQId: applicantData?.XNXQId,
                                });
                                if (rescreateKHXSTK.status === 'ok') {
                                  // 更新退款状态
                                  const resupdateKHXSTK = await updateKHXSTK(
                                    { id: rescreateKHXSTK!.data!.id! },
                                    {
                                      TKZT: 1,
                                      TKSJ: moment(new Date()).format(),
                                      deviceIp: '117.36.118.42',
                                    },
                                  );
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
                        }
                      }
                    } catch (err) {
                      message.error('取消失败，请联系管理员或稍后重试。');
                    }
                  }}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                  disabled={!JSInforMation(currentUser, false)}
                >
                  <Tooltip
                    placement="bottom"
                    title="本课程暂未开始上课，退课后，系统将自动发起全额退款"
                  >
                    <a
                      onClick={() => {
                        JSInforMation(currentUser);
                      }}
                    >
                      取消报名
                    </a>
                  </Tooltip>
                </Popconfirm>
              ) : (
                <></>
              )
            }
            {/* // 如果是上课时间段并且 未付款则只进行退课处理 */}
            {kkTimeFalg &&
              applicantData?.BJZT === '已开班' &&
              applicantData.BMLX === 0 &&
              record?.ZT === 3 && <>{onCancelSignUp(record)}</>}
            {/* 免费情况下已开班 已缴费  进行退课处理 */}
            {applicantData?.BJZT === '已开班' && applicantData.BMLX === 2 && record.ZT === 0 && (
              <>{onCancelSignUp(record)}</>
            )}

            {/* { applicantData?.BMLX!==1&&record?.ZT===0&&<>{onCancelSignUp(record.id)} <Divider type="vertical" /></>} */}

            {/* 催缴  先缴费后报名 */}
            {applicantData?.BMLX === 0 && record.ZT === 3 && (
              <>
                <a
                  onClick={() => {
                    if (record?.XSJBSJ?.WechatUserId) {
                      urgingPayment([record?.XSJBSJ?.WechatUserId]);
                    }
                  }}
                >
                  催缴费
                </a>
              </>
            )}

            {/* 缴费 */}
            {applicantData?.BMLX === 0 && record.ZT === 3 && (
              <>
                <a
                  onClick={() => {
                    setDJFVisible(true);
                    setDJFXS(record?.XSJBSJId);
                  }}
                >
                  代缴费
                </a>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  // 缴费完成清除选择的学生
  useEffect(() => {
    if (!DJFVisible) {
      setDJFXS(undefined);
    }
  }, [DJFVisible]);

  const UploadProps: any = {
    name: 'xlsx',
    action: `/api/upload/importStudentSignUp?KHBJSJId=${applicantData?.id}&XQSJId=${
      applicantData?.XQSJId
    }&JZGJBSJId=${currentUser?.JSId || testTeacherId}`,
    headers: {
      authorization: getAuthorization(),
    },
    data: {
      KHBJSJId: applicantData?.id,
      JZGJBSJId: currentUser?.JSId || testTeacherId,
    },
    // accept={''}
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isType =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isType) {
        message.error('请上传正确表格文件!');
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        message.error('文件大小不能超过2M');
        return Upload.LIST_IGNORE;
      }
      return isLt2M;
    },
    onChange(info: {
      file: { status: string; name: any; response: any };
      fileList: any;
      event: any;
    }) {
      if (info.file.status === 'done') {
        const code = info.file.response;
        if (code.status === 'ok') {
          const repeat = code.data?.find((v: { errorType: number }) => {
            return v.errorType === 0;
          });
          const wrong = code.data?.find((v: { errorType: number }) => {
            return v.errorType === 1;
          });
          const different = code.data?.find((v: { errorType: number }) => {
            return v.errorType === 2;
          });
          const sqlerr = code.data?.find((v: { errorType: number }) => {
            return v.errorType === 3;
          });
          if (repeat) {
            message.warning('存在重复数据，部分导入失败');
          } else if (wrong) {
            message.warning('数据格式有误，部分导入失败');
          } else if (different) {
            message.warning('部分数据有误，部分导入失败');
          } else if (sqlerr) {
            message.warning('未知错误，导入失败');
          } else {
            message.success('导入成功');
          }
          setUploadVisible(false);

          onsetKHXSBJs();
        } else {
          message.error(`${code.message}`);

          event?.currentTarget?.onerror(code);
        }
      } else if (info.file.status === 'error') {
        console.log('info.file.response', info.file);
      }
    },
  };

  console.log(applicantData, 'applicantData------');
  console.log(applicantData.BMZT, 'applicantData------');
  return (
    <div className={styles.BMdiv}>
      <Modal
        title="批量报名"
        visible={visible}
        width={600}
        destroyOnClose
        footer={
          <div className={styles.modelFooter}>
            <span className={styles.modelTips}>
              <span>{`总人数 ${applicantData?.BJRS || 0}`}</span>
              <span>{`已报 ${KHXSBJs?.length || 0}`}</span>
              <span
                style={
                  applicantData?.BJRS - KHXSBJs?.length < selectNumber
                    ? { color: '#FF4646', fontWeight: 'bold' }
                    : {}
                }
              >
                {`已选 ${selectNumber}`}
              </span>
            </span>
            <div>
              <Button type="primary" onClick={onSubmit}>
                提交
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(false);
                }}
              >
                取消
              </Button>
            </div>
          </div>
        }
        onCancel={() => {
          setVisible(false);
        }}
      >
        <SignUp
          applicantData={applicantData}
          ref={singUpRef}
          setVisible={setVisible}
          setSelectNumber={setSelectNumber}
          onsetKHXSBJs={onsetKHXSBJs}
        />
      </Modal>
      <ProTable
        rowSelection={
          {
            // selections: true,
          }
        }
        rowKey="id"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => {
          // setExamine(selectedRows);
          return (
            <>
              {
                // 免费课程    // 先报名后缴费
                applicantData?.BJZT === '已开班' && applicantData.BMLX !== 1 && (
                  <Tooltip
                    // defaultVisible
                    overlayClassName={styles.tooltipdiv}
                    title={
                      <ul style={{ padding: 0, listStyleType: 'none', width: '260px' }}>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />
                          <span className={styles.spanDiv}>免费：可随时取消</span>
                        </li>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />
                          <span className={styles.spanDiv}>
                            {' '}
                            先报名后缴费：报名时段内可以取消，正式上课时段内仅可取消未缴费学生
                          </span>
                        </li>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />{' '}
                          <span className={styles.spanDiv}>缴费即报名：仅可在报名时段内取消;</span>
                        </li>
                      </ul>
                    }
                  >
                    <Button
                      type="primary"
                      ghost
                      onClick={() => {
                        const newArr = selectedRows
                          .filter((value: { ZT: number }) => {
                            // 先报名后缴费
                            if (applicantData.BMLX === 0) {
                              // 如果已开课 只能取消未付款的
                              if (kkTimeFalg) {
                                return value.ZT === 3;
                              }
                              // 未开课退全款 则当前状态时报名时间段 则可退已缴费和 未缴费
                              return value.ZT === 0 || value.ZT === 3;
                            }
                            return value.ZT === 0;
                          })
                          .map((item: any) => {
                            return { XSJBSJId: item.XSJBSJId, ZT: item.ZT };
                          });
                        batchCancel(newArr);
                      }}
                    >
                      <span style={{ color: '#4884ff' }}>批量取消报名</span>
                    </Button>
                  </Tooltip>
                )
              }
              {
                // 报名即缴费
                applicantData?.BJZT === '已开班' && applicantData.BMLX === 1 && !kkTimeFalg && (
                  <Tooltip
                    overlayClassName={styles.tooltipdiv}
                    title={
                      <ul style={{ padding: 0, listStyleType: 'none', width: '260px' }}>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />
                          <span className={styles.spanDiv}>免费：可随时取消</span>
                        </li>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />
                          <span className={styles.spanDiv}>
                            {' '}
                            先报名后缴费：报名时段内可以取消，正式上课时段内仅可取消未缴费学生
                          </span>
                        </li>
                        <li className={styles.liDiv}>
                          <div className={styles.circle} />{' '}
                          <span className={styles.spanDiv}>缴费即报名：仅可在报名时段内取消;</span>
                        </li>
                      </ul>
                    }
                  >
                    <Button
                      type="primary"
                      ghost
                      onClick={() => {
                        const newArr = selectedRows
                          .filter((value: { ZT: number }) => {
                            if (!kkTimeFalg && value.ZT === 0) {
                              return true;
                            }
                            return false;
                          })
                          .map((item: any) => {
                            return { XSJBSJId: item.XSJBSJId, ZT: item.ZT };
                          });
                        batchCancel(newArr);
                      }}
                    >
                      <span style={{ color: '#4884ff' }}>批量取消报名</span>
                    </Button>
                  </Tooltip>
                )
              }
              {applicantData?.BMLX === 0 && (
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  ghost
                  onClick={() => {
                    const arr = selectedRows
                      .filter((value) => {
                        return applicantData?.BMLX === 0 && value.ZT === 3;
                      })
                      .map((item) => {
                        return item?.XSJBSJ?.WechatUserId;
                      });

                    urgingPayment(arr);
                  }}
                >
                  <span style={{ color: '#4884ff' }}>批量催缴费</span>
                </Button>
              )}
            </>
          );
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8, width: '30px' }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        search={false}
        dataSource={KHXSBJs}
        actionRef={actionRef}
        columns={columns}
        pagination={{
          pageSize: 5,
          defaultCurrent: 1,
          pageSizeOptions: ['5', '10', '20', '50'],
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
        headerTitle={`课程名称：${applicantData?.BJMC}`}
        toolBarRender={() => {
          // 报名类型属于 免费 和先报名后缴费 并且 报名时间和报名结束时间BJZT: “'未开班','已开班','已结课'
          if (
            applicantData?.BMLX === 1 &&
            applicantData?.BMZT === 1 &&
            setKHXSBJs.length < applicantData?.BJRS
          ) {
            return [
              <Button
                type="primary"
                onClick={() => {
                  showModalBM();
                }}
              >
                代报名
              </Button>,
            ];
          }
          if (applicantData?.BMLX !== 1 && applicantData?.BJZT === '已开班' && timeFalg) {
            // eslint-disable-next-line no-sparse-arrays
            return [
              <Button
                type="link"
                onClick={() => {
                  setUploadVisible(true);
                }}
              >
                导入报名
              </Button>,
              <Button
                type="primary"
                onClick={() => {
                  if (JSInforMation(currentUser)) {
                    setVisible(true);
                  }
                }}
              >
                批量报名
              </Button>,
              ,
            ];
          }
          if (applicantData.BMZT === 0 && setKHXSBJs.length < applicantData?.BJRS) {
            return [<Button type="link">报名未开启， 不能报名</Button>];
          }
          if (setKHXSBJs.length >= applicantData?.BJRS) {
            return [<Button type="link">报名人数已满， 不能报名</Button>];
          }

          return [];
        }}
      />

      {/*   缴费即报名 */}
      {applicantData.BMLX === 1 && (
        <AgentRegistration
          curXNXQId={applicantData?.XNXQId}
          JFTotalost={JFAmount}
          BjDetails={applicantData}
          ModalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onsetKHXSBJs={onsetKHXSBJs}
        />
      )}
      {/* 代缴费 */}
      <Modal
        title="催缴费通知"
        visible={JFVisible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setJFVisible(false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          form={form}
          initialValues={{
            MSG: `您所选的${applicantData?.KHKCSJ?.KCMC}-${applicantData?.BJMC}，还未交费，请及时处理。`,
          }}
          onFinish={handleCJSubmit}
          layout="horizontal"
        >
          <Form.Item
            label="通知内容"
            name="MSG"
            rules={[
              {
                required: true,
                message: '请输入催缴说明',
              },
            ]}
          >
            <TextArea rows={4} maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 先报名后缴费 缴费 */}
      <ReplacePay
        DJFXS={DJFXS}
        JFTotalost={JFAmount}
        BjDetails={applicantData}
        ModalVisible={DJFVisible}
        setModalVisible={setDJFVisible}
        onsetKHXSBJs={onsetKHXSBJs}
      />
      <Modal
        title="导入报名"
        destroyOnClose
        width="35vw"
        visible={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        footer={null}
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <>
          <p>
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>{' '}
              <span className={styles.messageSpan}>导入学生名单进行批量报名</span>
            </Upload>
          </p>
          <div className={styles.messageDiv}>
            <Badge color="#aaa" size="small" />
            上传文件仅支持模板格式
            <a style={{ marginLeft: '16px' }} type="download" href="/template/studentsImport.xlsx">
              下载模板
            </a>
            <br />
            <Badge color="#aaa" size="small" />
            确保表格内只有一个工作薄，如果有多个只有第一个会被处理
            <br />
            <Badge color="#aaa" size="small" />
            单次报名人数不得超出班级最大人数
          </div>
        </>
      </Modal>
    </div>
  );
};

export default ApplicantInfoTable;
