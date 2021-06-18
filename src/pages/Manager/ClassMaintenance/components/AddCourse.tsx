/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllNJSJ } from '@/services/after-class/njsj';
import { queryXQList } from '@/services/wechat/service';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import moment from 'moment';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  mcData?: { label: string; value: string }[];
  names?: string;
  kcId: string;
  classattend: string[];
  signup: string[]
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const AddCourse: FC<AddCourseProps> = ({
  visible,
  onClose,
  readonly,
  formValues,
  actionRef,
  mcData,
  names,
  kcId,
  classattend,
  signup
}) => {
  const [form, setForm] = useState<any>();
  // 校区
  const [campus, setCampus] = useState<any>([]);
  // 年级
  const [grade, setGrade] = useState<any>();
  const [xQItem, setXQItem] = useState<any>([]);
  const [baoming, setBaoming] = useState<boolean>(true);
  const [kaike, setKaike] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      // 从企微获取校区年级信息
      const currentXQ = await queryXQList();
      const XQ: { label: any; value: any }[] = [];
      const NJ = {};
      currentXQ?.map((item: any) => {
        XQ.push({
          label: item.name,
          value: item.id,
        });
        NJ[item.name] = item.njList.map((njItem: any) => ({
          label: njItem.name,
          value: njItem.id,
        }));
      });
      setCampus(XQ);
      setGrade(NJ);
    })();
  }, []);
  // 获取标题
  const getTitle = () => {
    if (formValues && names === 'bianji') {
      return '编辑信息';
    }
    if (formValues && names === 'chakan') {
      return '查看信息';
    }
    return '新增信息';
  };

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
          message.error(`保存失败，${data.message}`);
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
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'select',
      readonly,
      label: '课程名称：',
      name: 'KHKCSJId',
      key: 'KHKCSJId',
      fieldProps: {
        options: mcData,
      },
    },
    {
      type: 'inputNumber',
      readonly,
      label: '课时数：',
      name: 'KCSC',
      key: 'KCSC',
      fieldProps: {
        min: 0,
        max: 100,
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
            disabled: true,
            autocomplete: 'off',
          },
        },
        {
          type: 'inputNumber',
          label: '费用：',
          name: 'FY',
          key: 'FY',
          readonly,
          fieldProps: {
            autocomplete: 'off',
          },
        },
      ],
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
            mode: 'multiple',
          },
        },
      ],
    },
    {
      type: 'select',
      name: 'XQ',
      key: 'XQ',
      label: '所属校区',
      readonly,
      fieldProps: {
        options: campus,
        onChange(value: any) {
          setXQItem(value);
        },
      },
    },
    {
      type: 'select',
      name: 'njIds',
      key: 'njIds',
      label: '适用年级',
      fieldProps: {
        mode: 'multiple',
        options: grade ? grade[xQItem] : [],
      },
      readonly,
    },
    {
      type: 'div',
      key: 'div',
      label: '单独设置报名时段：',
      lineItem: [
        {
          type: 'switch',

          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setBaoming(true);
              }
              return setBaoming(false);
            },
            defaultValue: false,
          }
        }
      ]
    },

    {
      type: 'dateRange',
      label: '报名时段:',
      name: 'BMSD',
      key: 'BMSD',
      width: '100%',
      hidden: baoming,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss')
          return defaults > signup[1] || defaults < signup[0]
        }
      },
    },
    {
      type: 'div',
      key: 'div1',
      label: '单独设置上课时段：',
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setKaike(true);
              }
              return setKaike(false);
            },
            defaultValue: false,
          },
        },

      ]
    },
    {
      type: 'dateRange',
      label: '上课时间:',
      name: 'SKSD',
      key: 'SKSD',
      width: '100%',
      hidden: kaike,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss')
          return defaults > classattend[0] || defaults < classattend[1]
        }
      },
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
        title={getTitle()}
        width={480}
        onClose={onClose}
        visible={visible}
        className={styles.courseStyles}
        destroyOnClose={true}
        bodyStyle={{ paddingBottom: 80 }}
        footer={(names === 'chakan') ? null :
          (<div
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
          </div>)
        }
      >
        <ProFormFields
          layout="vertical"
          onFinish={onFinish}
          setForm={setForm}
          formItems={formItems}
          formItemLayout={formLayout}
          values={formValues
            
            || {
            BJZT: '待发布', 
            BMKSSJ: baoming,
            KKRQ: kaike,
          }}
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
