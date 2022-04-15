/*
 * @description:
 * @author: Wu Zhan
 * @Date: 2022-04-15 09:02:57
 * @LastEditTime: 2022-04-15 17:43:21
 * @LastEditors: Wu Zhan
 */
import { message, Spin, Select } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getParent, bindParent } from '@/services/after-class/parent';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ModalForm } from '@ant-design/pro-form';
const { Option } = Select;

const SelectParent = (props: {
  id: string;
  XXJBSJId: string;
  onRefresh: () => void;
  ParentIds: string[] | undefined;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { id, XXJBSJId, onRefresh, ParentIds } = props;
  const formRef = useRef<ProFormInstance<any>>();
  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const getLable = (GH: string) => {
    if (GH !== null && GH.length > 4) {
      return `~${GH.substring(GH.length - 4)}`;
    }
    return `~ ${GH}`;
  };
  const [parentList, setParentList] = useState<any[]>([]);

  const onFinish = async (values: { ParentIds: [] | undefined }) => {
    const param = {
      XXJBSJId: XXJBSJId,
      XSJBSJId: id,
      ParentIds: values?.ParentIds,
    };
    const res = await bindParent(param);
    if (res.status === 'ok') {
      message.success('绑定成功');
      setVisible(false);
      onRefresh?.();
    } else {
      message.error(res.message);
    }
  };
  const getAllParent = async () => {
    setLoading(true);
    const res = await getParent({});
    if (res?.status === 'ok' && res?.data) {
      console.log('res', res);
      setParentList(res?.data);
    } else {
      message.error(res.message);
      setParentList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      getAllParent();
      formRef.current?.setFieldsValue({ ParentIds });
    }
  }, [visible]);

  return (
    <Spin spinning={loading}>
      <ModalForm
        key={id}
        formRef={formRef}
        title={'绑定家长'}
        visible={visible}
        trigger={
          <a
            onClick={() => {
              setVisible(true);
            }}
          >
            绑定家长
          </a>
        }
        submitter={{
          searchConfig: {
            submitText: '提交',
            resetText: '取消',
          },
          render: (_props, defaultDoms) => {
            return [defaultDoms[1], defaultDoms[0]];
          },
        }}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: () => {
            setVisible(false);
          },
        }}
        onFinish={onFinish}
        layout="horizontal"
        {...formLayout}
      >
        <ProForm.Item
          label="选择家长："
          rules={[{ required: false, message: '请选择家长' }]}
          name="ParentIds"
          key="ParentIds"
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="请选择家长"
            showSearch
            optionFilterProp="label"
          >
            {parentList.map((item: any) => {
              return (
                <Option value={item.id} label={`${item.XM}${getLable(item.LXDH)}`}>{`${
                  item.XM
                }${getLable(item.LXDH)}`}</Option>
              );
            })}
          </Select>
        </ProForm.Item>
      </ModalForm>
    </Spin>
  );
};

export default SelectParent;
