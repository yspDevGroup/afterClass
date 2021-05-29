/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import { CourseStatus } from '@/constant';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { getAllKHKCLX } from '@/services/after-class/khkclx';

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
  const [XNData, setXNData] = useState<any>([]);
  const [XQData, setXQData] = useState<any>([]);
  const [XQ, setXQ] = useState<any>();
  const [kcTypeData, setKcTypeData] = useState<any>([]);
  useEffect(() => {
    Promise.resolve(getAllXNXQ()).then((data: any) => {
      if (data.status === 'ok') {
        const xnxqAllData = data.data;
        const xnData: any[] = [];
        xnxqAllData.map((item: any) => xnData.push(item.XN));

        // 数组去重
        const unique = (ary: any) => {
          const s = new Set(ary);
          return Array.from(s);
        };

        const xnDataKey = unique(xnData);

        const xq = {};
        const xn: { label: any; value: any }[] = [];
        xnDataKey.map((item: any) => {
          const xqData: { label: any; value: any }[] = [];
          xnxqAllData.map((xnxqItem: any) => {
            if (item === xnxqItem.XN) {
              xqData.push({ label: xnxqItem.XQ, value: xnxqItem.XQ });
            }
          });
          xq[`${item}`] = xqData;
          xn.push({ label: item, value: item });
        });
        setXNData(xn);
        setXQData(xq);
      }
    });
    Promise.resolve(getAllKHKCLX({ name: '' })).then((data: any) => {
      if (data.status === 'ok') {
        const kcType: any = [];
        data.data.map((item: any) => {
          kcType.push({ label: item.KCLX, value: item.id });
        });
        setKcTypeData(kcType);
      }
    });
  }, []);

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
      name: 'KHKCLXId',
      key: 'KHKCLXId',
      options: kcTypeData,
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'cascader',
      cascaderItem: [
        {
          type: 'select',
          width: '100%',
          name: 'XN',
          key: 'XN',
          readonly,
          noStyle: true,
          options: XNData,
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setXQ(XQData[`${event}`]);
            },
          },
        },
        {
          type: 'select',
          name: 'XQ',
          width: '100%',
          key: 'XQ',
          readonly,
          noStyle: true,
          options: XQ,
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
      type: 'select',
      label: '状态：',
      name: 'KCZT',
      key: 'KCZT',
      readonly,
      options: CourseStatus,
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
        className={styles.courseStyles}
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
