/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2022-05-12 15:05:21
 * @LastEditTime: 2022-05-13 17:09:18
 * @LastEditors: Sissle Lynn
 */
import React, { useState } from 'react';
import { useModel } from 'umi';
import {
  Form,
  Modal,
  Select,
  message,
  Tooltip,
  Switch,
  Space,
  Button,
  Drawer,
  DatePicker,
  Row,
  Col,
} from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import ShowName from '@/components/ShowName';
import { createKHKQXG } from '@/services/after-class/khkqxg';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getCourseSchedule, getScheduleByDate } from '@/services/after-class/khxksj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';

const { Option } = Select;

/**
 * 学生考勤更改新增
 * @returns
 */
const NewAdd = (props: { refresh: () => Promise<void> }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { refresh } = props;
  const userId = currentUser?.JSId || testTeacherId;
  // form定义
  const [form] = Form.useForm();
  // 表格数据
  const [dataSource, setDataScouse] = useState<any>([]);
  const [course, setCourse] = useState<any>([]);
  const [stuCols, setStuCols] = useState<any>();
  // 考勤更改状态
  const [swtChecked, setSwtChecked] = useState<boolean>(true);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // 获取当前学年学期
  const [termId, setTermId] = useState<string>();
  // 配置班级ID
  const [classId, setClassId] = useState<string>();
  // 配置节次ID
  const [periodId, setPeriodId] = useState<string>();
  const [day, setDay] = useState<string>();
  const getData = async (days: string) => {
    setDay(days);
    const result = await queryXNXQList(currentUser?.xxId);
    if (result) {
      setTermId(result?.current?.id);
      const res = await getScheduleByDate({
        JZGJBSJId: currentUser?.JSId || testTeacherId,
        RQ: days,
        XNXQId: result?.current?.id,
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok' && res.data) {
        const { rows } = res.data;
        setCourse(rows);
      }
    }
  };
  const getStuData = async (bjId?: string, jcId?: string) => {
    // 查询学生所有课后服务出勤记录
    const resAll = await getAllKHXSCQ({
      bjId: bjId || undefined, // 班级ID
      CQRQ: day, // 日期
      XXSJPZId: jcId,
    });
    if (resAll.status === 'ok') {
      setClassId(bjId);
      setPeriodId(jcId);
      const allData = resAll.data;
      // allData 有值时已点过名
      if (allData?.length) {
        allData.forEach((item: any) => {
          item.isLeave = item.CQZT === '请假';
          item.isRealTo = item.CQZT;
        });
        setStuCols(allData);
      }
    }
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = async (values: any) => {
    const res = await getCourseSchedule({
      KHKCSJId: values.course,
      RQ: moment(values.date).format('YYYY-MM-DD'),
      XNXQId: termId!,
      XXJBSJId: currentUser?.xxId,
    });
    if (res.status === 'ok' && res.data) {
      if (res.data?.length) {
        let arr = [];
        for (const ele of res.data) {
          const { BJMC, KCBSKSJs, ISFW, xs_count, fwxs_count } = ele;
          arr = KCBSKSJs?.map((val: any) => {
            return {
              XXSJPZ: val.XXSJPZ,
              FJSJ: val.FJSJ,
              BJMC,
              bjId: val.KHBJSJId,
              jcId: val.XXSJPZId,
              xs_count: ISFW ? fwxs_count : xs_count,
            };
          });
        }
        setDataScouse(arr);
      } else {
        setDataScouse([]);
      }
    }
  };

  const columns: any = [
    {
      title: '班级名称',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
      width: 120,
    },
    {
      title: '上课时间',
      dataIndex: 'XXSJPZ',
      key: 'XXSJPZ',
      align: 'center',
      width: 120,
      render: (_: any, record: any) =>
        ` ${record.XXSJPZ?.KSSJ?.substring(0, 5)} - ${record.XXSJPZ?.JSSJ?.substring(0, 5)}`,
    },
    {
      title: '上课地点',
      dataIndex: 'FJSJ',
      key: 'FJSJ',
      align: 'center',
      width: 120,
      render: (_: any, record: any) => record.FJSJ?.FJMC,
    },
    {
      title: '学生人数',
      dataIndex: 'xs_count',
      key: 'xs_count',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 80,
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            onClick={() => {
              getStuData(record.bjId, record.jcId);
              setVisible(true);
            }}
          >
            {' '}
            更改考勤
          </Button>
        );
      },
    },
  ];
  const StuColumns: any = [
    {
      title: '姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      render: (test: any, record: any) => {
        return (
          <ShowName type="userName" openid={record?.XSJBSJ?.WechatUserId} XM={record?.XSJBSJ?.XM} />
        );
      },
    },
    {
      title: '请假',
      dataIndex: 'isLeave',
      key: 'isLeave',
      align: 'center',
      render: (text: string, record: any) => {
        return text ? (
          <Tooltip title={record.leaveYY} trigger="click">
            <span style={{ color: 'red' }}>是</span>
          </Tooltip>
        ) : (
          <span>否</span>
        );
      },
    },
    {
      title: '考勤情况',
      dataIndex: 'CQZT',
      key: 'CQZT',
      align: 'center',
      render: (text: string, record: any) => {
        return (
          <div key={record.id}>
            <Switch
              checkedChildren="出勤"
              unCheckedChildren="缺席"
              checked={record.CQZT === '出勤'}
              disabled={true}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setShowDrawer(true);
        }}
      >
        新增
      </Button>
      <Drawer
        title="新增学生考勤更改记录"
        placement="right"
        closable={false}
        onClose={() => {
          setDay('');
          setCourse([]);
          setDataScouse([]);
          setShowDrawer(false);
          form.resetFields();
        }}
        visible={showDrawer}
        size="large"
      >
        <Form
          form={form}
          labelCol={{ flex: '90px' }}
          wrapperCol={{ flex: 'auto' }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={11}>
              <Form.Item name="date" label="考勤日期" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(value: Moment | null, dateString: string) => {
                    getData(dateString);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Form.Item name="course" label="课程名称" rules={[{ required: true }]}>
                <Select placeholder="请选择课程" style={{ width: '100%' }}>
                  {course?.length &&
                    course.map((item: { id: string; KCMC: string }) => {
                      return <Option key={item.id}>{item.KCMC}</Option>;
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
              查询
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <ProTable<any>
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{
            defaultPageSize: 5,
            defaultCurrent: 1,
            pageSizeOptions: ['5'],
            showQuickJumper: false,
            showSizeChanger: false,
            showTotal: undefined,
          }}
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </Drawer>
      <Modal
        title="学生考勤更改"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={600}
        className="ces"
      >
        <ProTable<any>
          dataSource={stuCols}
          columns={StuColumns}
          rowKey="id"
          pagination={{
            defaultPageSize: 5,
            defaultCurrent: 1,
            pageSizeOptions: ['5'],
            showQuickJumper: false,
            showSizeChanger: false,
            showTotal: undefined,
          }}
          rowSelection={{}}
          tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
            <Space size={12}>
              <span style={{ verticalAlign: 'middle' }}>
                考勤：
                <Switch
                  checkedChildren="出勤"
                  unCheckedChildren="缺席"
                  defaultChecked={true}
                  onChange={(checked) => setSwtChecked(checked)}
                />
              </span>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )}
          tableAlertOptionRender={({ selectedRows, onCleanSelected }) => {
            return (
              <Space size={16}>
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '考勤更改确认',
                      icon: <ExclamationCircleOutlined />,
                      width: 200,
                      centered: true,
                      wrapClassName: 'ces',
                      content: (
                        <div style={{ lineHeight: '30px', textIndent: '2em', paddingTop: '12px' }}>
                          您已选择{selectedRows?.length}名学生，是否确认统一更改学生考勤为
                          <span style={{ fontWeight: 'bold', fontSize: 16, padding: '0 4px' }}>
                            {swtChecked ? '出勤' : '缺席'}
                          </span>
                          状态？
                        </div>
                      ),
                      className: 'editModal',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: async () => {
                        const stu: any = [].map.call(selectedRows, (item: any) => {
                          return {
                            SRCCQZT: item.CQZT,
                            NOWCQZT: swtChecked ? '出勤' : '缺席',
                            XSJBSJId: item.XSJBSJ?.id,
                          };
                        });
                        const res = await createKHKQXG({
                          CQRQ: day!,
                          /** 申请人ID */
                          SQRId: userId,
                          /** 节次ID */
                          XXSJPZId: periodId!,
                          /** 班级ID */
                          KHBJSJId: classId!,
                          /** 学校ID */
                          XXJBSJId: currentUser?.xxId,
                          students: stu,
                        });
                        if (res.status === 'ok') {
                          message.success('学生考勤变更申请成功');
                          onCleanSelected();
                          getStuData(classId, periodId);
                          setVisible(false);
                          refresh?.();
                        }
                      },
                    });
                  }}
                >
                  批量更改
                </a>
              </Space>
            );
          }}
          search={false}
          options={{
            setting: false,
            fullScreen: false,
            density: false,
            reload: false,
          }}
        />
      </Modal>
    </div>
  );
};

export default NewAdd;
