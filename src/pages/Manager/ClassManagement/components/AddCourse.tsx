import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllNJSJ } from '@/services/after-class/njsj';
import { getAllKHKCSJ } from '@/services/after-class/khkcsj';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  xn?: string;
  xq?: string;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const AddCourse: FC<AddCourseProps> = ({ visible, onClose, readonly, formValues, actionRef,xn,xq }) => {
  const [form, setForm] = useState<any>();
  const [njData, setNjData] = useState<{ label: string; value: string; }[]>([]);
  const [mcData, setmcData] = useState<{ label: string; value: string; }[]>([]);
  // 获取年级数据
  useEffect(() => {
    const res = getAllNJSJ();
    Promise.resolve(res).then((data: any) => {
      if (data.status === 'ok') {
        const njArry: { label: string; value: string; }[] = []
        data.data.map((item: any) => {
            return njArry.push({
            label: item.NJMC,
            value: item.id
          })
        })
        setNjData(njArry);
      }
    })
  }, []);
  // 获取课程名称
  useEffect(() => {
    const res = getAllKHKCSJ({name:'',xn,xq,page:0,pageCount:0});
    Promise.resolve(res).then((data: any) => {
      if (data.status === 'ok') {
        const njArry: { label: string; value: string; }[] = []
        data.data.map((item: any) => {
            return njArry.push({
            label: item.KCMC,
            value: item.id
          })
        })
        setmcData(njArry);
      }
    })
  }, [])

  const onFinish = (values: any) => {
    new Promise((resolve, reject) => {
      let res = null;
      if (formValues?.id) {
        const params = {
          id: formValues?.id,
        };
        const options = values;
        res = updateKHBJSJ(params, options);
      } else {
        res = createKHBJSJ(values);
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
      label: '班级名称：',
      name: 'BJMC',
      key: 'BJMC',
      readonly,
    },
    {
      type: 'select',
      readonly,
      label: '课程名称：',
      name: 'KHKCSJId',
      key: 'KHKCSJId',
      fieldProps: {
        options: mcData
      },
    },
    {
      type: 'group',
      readonly,
      groupItems: [
        {
          type: 'input',
          label: '状态：',
          name: 'BJZT',
          key: 'BJZT',
          fieldProps: {
            disabled: true
          }
        },
        {
          type: 'input',
          label: '费用：',
          name: 'FY',
          key: 'FY',
          readonly,
        },
      ]
    },
    {
      type: 'group',
      readonly,
      groupItems: [
        {
          type: 'select',
          label: '主班：',
          name: 'ZJS',
          key: 'ZJS',
          readonly,
        },
        {
          type: 'select',
          label: '副班：(多选)',
          name: 'FJS',
          key: 'FJS',
          readonly,
          fieldProps: {
            mode: "multiple"
          }
        },
      ]
    },
    {
      type: 'select',
      name: 'njIds',
      key:'njIds',
      label: '适用年级',
      fieldProps: {
        mode: 'multiple',
        options: njData
      },
      readonly,

    },
    {
      type: 'uploadImage',
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      readonly,
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
        title={formValues ? '编辑信息' : "新增信息"}
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
          values={formValues || { BJZT: '待发布' }}
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
