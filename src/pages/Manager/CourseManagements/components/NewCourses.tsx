/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import ProFormFields from '@/components/ProFormFields';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { createKHKCSJ, updateKHKCSJ } from '@/services/after-class/khkcsj';
import { getAllXNXQ } from '@/services/after-class/xnxq';
import type { ActionType } from '@ant-design/pro-table/lib/typing';
import { message } from 'antd';
import { Button, Drawer } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import type { classType } from '../data';
import styles from './index.less';

type PropsType = {
  current?: classType;
  onClose?: () => void;
  readonly?: boolean;
  visible?: boolean;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
};
const formLayout = {
  labelCol: {},
  wrapperCol: {},
};

const NewCourses = (props: PropsType) => {
  const { current, onClose, visible, actionRef } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [form, setForm] = useState<any>();
  const [XNData, setXNData] = useState<any>([]);
  const [XQData, setXQData] = useState<any>([]);
  const [XN, setXN] = useState<any>();
  const [XQ, setXQ] = useState<any>();
  const [baoming, setBaoming] = useState<boolean>(true);
  const [kaike, setKaike] = useState<boolean>(true);

  const imgurl = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

  const Close=()=>{
    setBaoming(true);
    setKaike(true);
    onClose!();
  }

  useEffect(() => {
    async function fetchData() {
      const res = await getAllXNXQ({});
      if (res.status === 'ok') {
        const xnxqAllData = res.data;
        const xnData: any[] = [];
        xnxqAllData?.map((item: any) => xnData.push(item.XN));

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
          xnxqAllData?.map((xnxqItem: any) => {
            if (item === xnxqItem.XN) {
              return xqData.push({ label: xnxqItem.XQ, value: xnxqItem.XQ });
            }
            return ''
          });
          xq[`${item}`] = xqData;
          xn.push({ label: item, value: item });
          return ''
        });
        setXNData(xn);
        setXQData(xq);
      } else {
        console.log(res.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const res = getAllKHKCLX({ name: '' });
    Promise.resolve(res).then((data) => {
      if (data.status === 'ok') {
        const opt: any[] = [];
        data.data?.map((item: any) => {
          return opt.push({
            label: item.KCLX,
            value: item.id,
          });
        });
        setOptions(opt);
      }
    });
  }, []);
  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values: any) => {
    new Promise((resolve, reject) => {
      let res = null;
      if (current?.id) {
        const params = {
          id: current?.id,
        };
        const optionse = { ...values, KCTP: imgurl };
        res = updateKHKCSJ(params, optionse);
      } else {
        if (values.KKRQ) {
          values.JKRQ = values.KKRQ[1];
          values.KKRQ = values.KKRQ[0];
        }
        if (values.BMKSSJ) {
          values.BMJSSJ = moment(values.BMKSSJ[1]);
          values.BMKSSJ = moment(values.BMKSSJ[0]);
        }
        res = createKHKCSJ({ ...values, KCTP: imgurl });
      }
      resolve(res);
      reject(res);
    })
      .then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          onClose!();
          actionRef?.current?.reload();
        } else {
          message.error('保存失败');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',
      fieldProps: {
        autocomplete: 'off'
      }
    },
    {
      type: 'input',
      label: '名称:',
      name: 'KCMC',
      key: 'KCMC',
      width: '100%',
      fieldProps: {
        autocomplete: 'off'
      }
    },
    {
      type: 'select',
      label: '课程类型:',
      name: 'KHKCLXId',
      key: 'KHKCLXId',
      options,
    },
    {
      type: 'select',
      label: '课程状态:',
      name: 'KCZT',
      key: 'KCZT',
      valueEnum: {
        待发布: '待发布',
        已发布: '已发布',
        已下架: '已下架',
        已结课: '已结课',
      },
    },
    // {
    //   type: 'dateRange',
    //   label: '开课日期-结课日期:',
    //   name: 'KKRQ',
    //   key: 'KKRQ',
    //   width: '100%',
    // },
    {
      type: 'div',
      key: 'div',
      label: '单独设置报名时段：',
      lineItem:[
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
      type: 'dateTimeRange',
      label: '报名时间:',
      name: 'BMKSSJ',
      key: 'BMKSSJ',
      width: '100%',
      hidden:  baoming ,
      fieldProps:{
        // disabledDate={disabledDate},
        format: 'YYYY-MM-DD HH:mm',
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
      name: 'KKRQ',
      key: 'KKRQ',
      width: '100%',
      hidden: kaike,
      fieldProps:{
        // disabledDate={disabledDate}
      },
    },
    {
      type: 'cascader',
      label: '学年学期：',
      key: 'XNXQ',
      cascaderItem: [
        {
          type: 'select',
          width: '100%',
          name: 'XN',
          key: 'XN',
          placeholder: '请选择学年',
          noStyle: true,
          options: XNData,
          fieldProps: {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setXN(event);
              setXQ(XQData[`${event}`]);
            },
          },
        },
        {
          type: 'select',
          name: 'XQ',
          width: '100%',
          key: 'XQ',
          placeholder: '请选择学期',
          noStyle: true,
          options: XQ,
        },
      ],
    },
    {
      type: 'uploadImage',
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      upurl: '', // 上传地址
      imageurl: current?.KCTP, // 回显地址
      imagename: 'file', // 发到后台的文件参数名
      accept: '.jpg, .jpeg, .png', // 接受上传的文件类型
      data: {}, // 上传所需额外参数或返回上传额外参数的方法
    },
    {
      type: 'textArea',
      label: '备 注:',
      name: 'KCMS',
      key: 'KCMS',
    },
  ];
  return (
    <>
      <Drawer
        title={current ? '编辑课程' : '新增课程'}
        width={480}
        onClose={Close}
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
            <Button onClick={Close} style={{ marginRight: 16 }}>
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
          setForm={setForm}
          onFinish={onFinish}
          values={XN ? { XQ: XQData[XN][0].label } : (() => {
            if (current) {
              const { KHKCLX, ...info } = current;
              return {
                KCLXId: KHKCLX?.id,
                ...info,
              };
            }
            return undefined;
          })()}
          formItems={formItems}
          formItemLayout={formLayout}
        />
      </Drawer>
    </>
  );
};

export default NewCourses;
