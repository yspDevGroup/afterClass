/* eslint-disable no-console */
import ProFormFields from '@/components/ProFormFields';
import { AssistantTeacher, ClassLocation, Teacher } from '@/constant';
import { createKHPKSJ, updateKHPKSJ } from '@/services/after-class/khpksj';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Drawer, message } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

type AddClassProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const AddClass: FC<AddClassProps> = ({ visible, onClose, readonly, formValues, actionRef }) => {
  const [form, setForm] = useState<any>();

  const onFinish = (values: any) => {
    new Promise((resolve, reject) => {
      let res = null;
      if (formValues?.id) {
        const params = {
          id: formValues?.id,
        };
        const options = values;
        res = updateKHPKSJ(params, options);
      } else {
        res = createKHPKSJ({},values);
      }
      resolve(res);
      reject(res);
    })
      .then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          onClose();
          actionRef?.current?.reload();
        } else {
          message.error('保存失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleSubmit = () => {
    form.submit();
  };

  const formItems: any[] = [
    {
      type: 'input',
      readonly,
      label: '班级名称：',
      name: 'BJMC',
      key: 'BJMC',
    },
    {
      type: 'select',
      readonly,
      label: '上课地点：',
      name: 'SKDD',
      key: 'SKDD',
      valueEnum: ClassLocation,
    },
    {
      type: 'select',
      readonly,
      label: '授课老师：',
      name: 'ZJS',
      key: 'ZJS',
      valueEnum: Teacher,
    },
    {
      type: 'select',
      readonly,
      label: '助教老师：(可多选)',
      name: 'FJS',
      key: 'FJS',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: AssistantTeacher,
    },
    {
      type: 'textArea',
      readonly,
      label: '简介：',
      name: 'BJMS',
      key: 'BJMS',
    },
  ];
  return (
    <div>
      <Drawer
        title="新增班级"
        width={480}
        onClose={onClose}
        destroyOnClose={true}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 16 }}>
              取消
            </Button>
            <Button onClick={handleSubmit} type="primary">
              保存
            </Button>
          </div>
        }
      >
        <ProFormFields
          layout="vertical"
          onFinish={onFinish}
          setForm={setForm}
          formItems={formItems}
          formItemLayout={formLayout}
          values={formValues}
        />
      </Drawer>
    </div>
  );
};

export default AddClass;
