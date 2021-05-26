import ProFormFields from '@/components/ProFormFields';
import { CourseType } from '@/constant';
import { Button, Drawer } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const AddCourse: FC<AddCourseProps> = ({ visible, onClose, readonly, formValues }) => {
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
      label: '课程名称：',
      name: 'KCMC',
      key: 'KCMC',
    },
    {
      type: 'select',
      readonly,
      label: '类型：',
      name: 'KCLX',
      key: 'KCLX',
      valueEnum: CourseType,
    },
    {
      type: 'input',
      readonly,
      label: '时长：',
      name: 'KCSC',
      key: 'KCSC',
    },
    {
      type: 'uploadImage',
      readonly,
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      upUrl: '',
      imageUrl: formValues?.KCFM,
    },
    {
      type: 'textArea',
      readonly,
      label: '简介：',
      name: 'KCMS',
      key: 'KCMS',
    },
  ];
  return (
    <div>
      <Drawer
        title="新增课程"
        width={480}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
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

export default AddCourse;
