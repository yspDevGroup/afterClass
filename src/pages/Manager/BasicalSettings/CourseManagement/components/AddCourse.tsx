/* eslint-disable no-param-reassign */
import { useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import { CourseType } from '@/constant';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import type { ActionType } from '@ant-design/pro-table';

type AddCourseProps = {
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

const AddCourse: FC<AddCourseProps> = ({ visible, onClose, readonly, formValues, actionRef }) => {
  const [form, setForm] = useState<any>();
  const onFinish = (values: any) => {
    values.KCTP = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    new Promise((resolve, reject) => {
      let res = null;
      if (formValues?.id) {
        const params = {
          id: formValues?.id,
        };
        const options = values;
        res = updateKHKCSJ(params, options);
      } else {
        res = createKHKCSJ(values);
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
      options: CourseType,
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'cascader',
      cascaderItem: [
        {
          type: 'select',
          name: 'XNXQ',
          key: 'XNXQ',
          readonly,
          noStyle: true,
          width: 212,
	  
          valueEnum: {
            '2019~2020': '2019~2020',
            '2020~2021': '2020~2021',
            '2021~2022': '2021~2022',
          },
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              console.log('vluess111', event);
            },
          },
        },
        {
          type: 'select',
          name: 'XNXQ1',
          key: 'XNXQ2',
          readonly,
          noStyle: true,
          width: 212,
          request: async () => [
            { label: '第一学期', value: '1' },
            { label: '第二学期', value: '2' },
            { label: '第三学期', value: '3' },
          ],
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              console.log('vluess2222', event);
            },
          },
        },
      ],
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
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      upurl: '',
      imageurl: formValues?.KCTP,
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
