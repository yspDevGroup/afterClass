/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { useModel } from 'umi';
import { Popconfirm, message, Divider, Modal, Form, Input } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { cancleClass, deleteKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import type { CourseItem } from '../data';
import { enHenceMsg } from '@/utils/utils';
// import EllipsisHint from '@/components/EllipsisHint';

type propstype = {
  handleEdit: (data: CourseItem) => void;
  record: any;
  actionRef: React.MutableRefObject<ActionType | undefined>;
};

const { TextArea } = Input;
const ActionBar = (props: propstype) => {
  const { handleEdit, record, actionRef } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);

  const shelf = (recorde: any) => {
    if (recorde.xs_count === 0) {
      const res = updateKHBJSJ({ id: recorde.id }, { BJZT: '待开班' });
      new Promise((resolve) => {
        resolve(res);
      }).then((data: any) => {
        if (data.status === 'ok') {
          message.success('取消成功');
          actionRef.current?.reload();
        } else {
          message.error('取消失败，请联系管理员或稍后重试');
          actionRef.current?.reload();
        }
      });
    } else {
      message.warning('有学生报名时，此课程班不能取消开班');
    }
  };
  const release = (records: any) => {
    const res = updateKHBJSJ({ id: records.id }, { BJZT: '已开班' });
    new Promise((resolve) => {
      resolve(res);
    }).then((data: any) => {
      if (data.status === 'ok') {
        message.success('开班成功');
        actionRef.current?.reload();
      } else {
        message.error('开班失败，请联系管理员或稍后重试');
        actionRef.current?.reload();
      }
    });
  };

  const handleSubmit = async (param: any) => {
    const { MSG } = param;
    try {
      const res = await cancleClass({
        KHBJSJId: record?.id,
        JZGJBSJId: currentUser?.JSId || testTeacherId,
        BZ: '',
        deviceIp: '117.36.118.42',
        MSG,
      });
      if (res.status === 'ok') {
        const result = updateKHBJSJ({ id: record.id }, { BJZT: '待开班' });
        if ((await result).status === 'ok') {
          message.success('取消班级成功，课程费用已原路返还');
          actionRef.current?.reload();
          setVisible(false);
        }
      } else {
        message.warning(res.message);
      }
    } catch (err) {
      message.error('取消开班出现错误，请联系管理员或稍后重试。');
    }
  };

  switch (record.BJZT) {
    case '待开班':
    case '已取消':
      return (
        <>
          {record.pk_count ? (
            <>
              <Popconfirm
                title="开班后该课程班家长可见，确定开班?"
                onConfirm={() => release(record)}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>开班</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then((data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          actionRef.current?.reload();
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ) : (
            <>
              <a onClick={() => handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="删除之后，数据不可恢复，确定要删除吗?"
                onConfirm={async () => {
                  try {
                    if (record.id) {
                      const params = { id: record.id };
                      const res = deleteKHBJSJ(params);
                      new Promise((resolve) => {
                        resolve(res);
                      }).then((data: any) => {
                        if (data.status === 'ok') {
                          message.success('删除成功');
                          actionRef.current?.reload();
                        } else {
                          enHenceMsg(data.message);
                        }
                      });
                    }
                  } catch (err) {
                    message.error('删除失败，请联系管理员或稍后重试。');
                  }
                }}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <a>删除</a>
              </Popconfirm>
            </>
          )}
        </>
      );
      break;
    case '已开班':
      return (
        <>
          {new Date(record?.BMJSSJ).getTime() >= new Date().getTime() &&
          record?.xs_count > 0 &&
          record?.xs_count < record?.BJRS ? (
            <>
              {' '}
              <a
                onClick={() => {
                  setVisible(true);
                }}
              >
                取消开班
              </a>
              <Modal
                title="取消开班"
                visible={visible}
                onOk={() => {
                  form.submit();
                }}
                onCancel={() => {
                  setVisible(false);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Form
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 15 }}
                  form={form}
                  initialValues={{
                    MSG: `您所选的${record?.KHKCSJ?.KCMC}-${record?.BJMC}，由于报名人数不足，已关闭该班级；相关课程费用将全额原路返还，请知悉。`,
                  }}
                  onFinish={handleSubmit}
                  layout="horizontal"
                >
                  <Form.Item
                    label="取消说明"
                    name="MSG"
                    rules={[
                      {
                        required: true,
                        message: '请输入取消说明！',
                      },
                    ]}
                  >
                    <TextArea rows={4} maxLength={200} />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          ) : (
            <Popconfirm
              title="取消后该课程班家长不可见，确定取消开班?"
              onConfirm={() => shelf(record)}
              okText="确定"
              cancelText="取消"
              placement="topRight"
            >
              <a>取消开班</a>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
      break;
    default:
      return (
        <>
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
  }
};
export default ActionBar;
