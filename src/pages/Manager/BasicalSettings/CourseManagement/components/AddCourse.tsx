import ProFormFields from '@/components/ProFormFields';
import { Button, Drawer } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import React from 'react';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
};
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const AddCourse: FC<AddCourseProps> = ({ visible, onClose }) => {
  const [form, setForm] = useState<any>();

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  };

  const handleSubmit = () => {
    form.submit();
  };

  const formItems = () => [];
  return (
    <div>
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
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
