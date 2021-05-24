import ProFormFields from '@/components/ProFormFields';
import { Button, Drawer } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: {};
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
      name: 'LX',
      key: 'LX',
    },
    {
      type: 'input',
      readonly,
      label: '时长：',
      name: 'SC',
      key: 'SC',
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
    </div>
  );
};

export default AddCourse;
