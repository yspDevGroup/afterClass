<<<<<<< HEAD
=======
/* eslint-disable no-console */
>>>>>>> abc9bb3a7f5a2279fb610a19cfd70247a13e0980
import ProFormFields from '@/components/ProFormFields';
import { Button, Drawer } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
<<<<<<< HEAD
import type { RoomItem } from '../data';

type AddCourseProps = {
    visible: boolean;
    onClose: () => void;
    readonly?: boolean;
    formValues:  RoomItem;
};
const formLayout = {
    labelCol: {},
    wrapperCol: {},
};


const AddClass: FC<AddCourseProps> = ({ visible, onClose, readonly, formValues }) => {
    const [form, setForm] = useState<any>();

    const onFinish = (values: any) => {
        console.log('onFinish', values);
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
        },
        {
            type: 'select',
            readonly,
            label: '授课老师：',
            name: 'SKLS',
            key: 'SKLS',
        },
        {
            type: 'select',
            readonly,
            label: '助教老师：(可多选)',
            name: 'ZJLS',
            key: 'ZJLS',
        },
        {
            type: 'textArea',
            readonly,
            label: '简介：',
            name: 'JJ',
            key: 'JJ',
        },
    ];
    return (
        <>
            <Drawer
                title="新增课程"
                width={480}
                onClose={onClose}
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
        </>
    )
}

export default AddClass
=======

type AddClassProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const AddClass: FC<AddClassProps> = ({ visible, onClose, readonly, formValues }) => {
  const [form, setForm] = useState<any>();

  const onFinish = (values: any) => {
    console.log('onFinish131', values);
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
    },
    {
      type: 'select',
      readonly,
      label: '授课老师：',
      name: 'SKLS',
      key: 'SKLS',
    },
    {
      type: 'select',
      readonly,
      label: '助教老师：(可多选)',
      name: 'ZJLS',
      key: 'ZJLS',
      fieldProps: {
        mode: 'multiple',
      },
    },
    {
      type: 'textArea',
      readonly,
      label: '简介：',
      name: 'JJ',
      key: 'JJ',
    },
  ];
  return (
    <div>
      <Drawer
        title="新增班级"
        width={480}
        onClose={onClose}
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
>>>>>>> abc9bb3a7f5a2279fb610a19cfd70247a13e0980
