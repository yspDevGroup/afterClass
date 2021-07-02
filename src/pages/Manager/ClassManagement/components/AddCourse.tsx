/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Checkbox, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import { queryXQList } from '@/services/wechat/service';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import moment from 'moment';
import { getDepUserList, getSchDepList } from '@/services/after-class/wechat';
import { initWXAgentConfig, initWXConfig, showUserName } from '@/utils/wx';
import WWOpenDataCom from './WWOpenDataCom';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  mcData?: { label: string; value: string }[];
  names?: string;
  kcId?: string;
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
}) => {
  const userRef = useRef(null);
  const [form, setForm] = useState<any>();
  // 校区
  const [campus, setCampus] = useState<any>([]);
  // 年级
  const [grade, setGrade] = useState<any>();
  const [baoming, setBaoming] = useState<boolean>(true);
  const [kaike, setKaike] = useState<boolean>(true);
  // 教师
  const [teacherData, setTeacherData] = useState<any[]>([]);
  // 上课时间
  const [classattend, setClassattend] = useState<any>('');
  // 报名时间
  const [signup, setSignup] = useState<any>('');
  // 校区ID
  const [xQId, setXQId] = useState('');
  // 校区名字
  const [xQItem, setXQLabelItem] = useState<any>([]);

  // // 年级ID
  // const [nJID, setNJID] = useState([]);
  // 年级名字
  const [nJLabelItem, setNJLabelItem] = useState<any>([]);

  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (formValues) {
      setBaoming(false);
      setKaike(false);
    } else {
      setBaoming(true);
      setKaike(true);
    }
  }, [formValues]);

  // 获取报名时段和上课时段
  useEffect(() => {
    if (kcId) {
      const res = getKHKCSJ({ kcId });
      Promise.resolve(res).then((data: any) => {
        if (data.status === 'ok') {
          const arry = [];
          arry.push(data.data.BMKSSJ);
          arry.push(data.data.BMJSSJ);
          setSignup(arry);
          const erry = [];
          erry.push(data.data.JKRQ);
          erry.push(data.data.KKRQ);
          setClassattend(erry);
        }
      });
    }
  }, [kcId]);

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);

      // 获取教师
      const resTeacher = await getDepUserList({ id: '1', fetch_child: 1 });
      if (resTeacher.status === 'ok') {
        setTeacherData(resTeacher.data.userlist);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (teacherData.length) {
  //     setTimeout(() => {
  //       const wwList = document.querySelectorAll('.ww-open-data');
  //       wwList.forEach((ww) => {
  //         showUserName(ww as HTMLDivElement, ww.getAttribute('data-id') || '', true);
  //       });
  //       WWOpenData.bindAll(document.querySelectorAll('ww-open-data'));
  //     }, 0);
  //   }
  // }, [teacherData])

  useEffect(() => {
    (async () => {
      // 获取年级信息
      const currentXQ = await queryXQList();
      const XQ: { label: any; value: any }[] = [];
      const NJ = {};
      currentXQ?.map((item: any) => {
        XQ.push({
          label: item.name,
          value: item.id.toString(),
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
    if (formValues && names === 'chakan') {
      return '查看信息';
    }
    if (formValues) {
      return '编辑信息';
    }
    return '新增信息';
  };

  const onFinish = (values: any) => {
    new Promise((resolve, reject) => {
      let res = null;
      const options = {
        ...values,
        NJS: values.NJS?.toString(), // 年级ID
        NJSName: nJLabelItem?.toString(), // 年级名称
        FJS: values.FJS?.toString(), // 副班
        XQName: xQItem, // 校区名称
        KCTP: imageUrl,
      };

      if (formValues?.id) {
        const params = {
          id: formValues?.id,
        };

        res = updateKHBJSJ(params, options);
      } else {
        res = createKHBJSJ(options);
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
  const handleImageChange = (e: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
          setImageUrl(res.data);
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;

      message.error(`上传失败，${mass}`);
    }
  };
  const formItems: any[] = [
    {
      type: 'input',
      label: '班级名称：',
      name: 'BJMC',
      key: 'BJMC',
      readonly,
      rules: [{ required: true, message: '请填写班级名称' }],
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
      rules: [{ required: true, message: '请填写课程名称' }],
      fieldProps: {
        options: mcData,
      },
    },
    {
      type: 'inputNumber',
      readonly,
      label: '课时数：',
      name: 'KSS',
      key: 'KSS',
      rules: [{ required: true, message: '请填写课时数' }],
      fieldProps: {
        min: 0,
        max: 100,
      },
    },
    {
      type: 'inputNumber',
      readonly,
      label: '班级人数：',
      name: 'BJRS',
      key: 'BJRS',
      rules: [{ required: true, message: '请填写班级人数' }],
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
          rules: [{ required: true, message: '请填写费用' }],
          fieldProps: {
            autocomplete: 'off',
          },
        },
      ],
    },
    {
      type: 'select',
      name: 'XQ',
      key: 'XQ',
      label: '所属校区:',
      readonly,
      rules: [{ required: true, message: '请填写所属校区' }],
      fieldProps: {
        options: campus,
        onChange(value: any, option: any) {
          form.setFieldsValue({ NJS: undefined });
          setXQId(value);
          setXQLabelItem(option?.label);
        },
      },
    },
    {
      type: 'select',
      name: 'NJS',
      key: 'NJS',
      label: '适用年级:',
      rules: [{ required: true, message: '请填写适用年级' }],
      fieldProps: {
        mode: 'multiple',
        options: grade ? grade[xQItem] : [],
        onChange(value: any, option: any) {
          // setNJID(value);
          const njsIabel: any[] = [];
          option.map((item: any) => {
            njsIabel.push(item?.label);
          });
          setNJLabelItem(njsIabel);
        },
      },
      readonly,
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
          fieldProps: {
            virtual: false,
            options: teacherData.map((item) => {
              return {
                label: <WWOpenDataCom type="userName" openid={item.userid} />,
                value: item.userid,
              };
            }),
          },
        },
        {
          type: 'select',
          label: '副班：(多选)',
          name: 'FJS',
          key: 'FJS',
          readonly,
          fieldProps: {
            mode: 'multiple',
            virtual: false,
            options: teacherData.map((item) => {
              return {
                label: <WWOpenDataCom type="userName" openid={item.userid} />,
                value: item.userid,
              };
            }),
          },
        },
      ],
    },
    signup.length > 0
      ? {
          type: 'divTab',
          text: `(默认报名时间段)：${signup[0]} — ${signup[1]}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div',
      label: `单独设置报名时段：`,
      readonly,
      lineItem: [
        {
          type: 'switch',
          readonly,
          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setBaoming(true);
              }
              return setBaoming(false);
            },
            checked: !baoming,
          },
        },
      ],
    },
    {
      type: 'dateRange',
      label: `报名时段:`,
      name: 'BMSD',
      key: 'BMSD',
      readonly,
      width: '100%',
      hidden: baoming,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return defaults > signup[1] || defaults < signup[0];
        },
      },
    },
    classattend.length > 0
      ? {
          type: 'divTab',
          text: `(默认上课时间段)：${classattend[1]} — ${classattend[0]}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div1',
      readonly,
      label: `单独设置上课时段：`,
      lineItem: [
        {
          type: 'switch',
          readonly,
          fieldProps: {
            onChange: (item: any) => {
              if (item === false) {
                return setKaike(true);
              }
              return setKaike(false);
            },
            checked: !kaike,
          },
        },
      ],
    },
    {
      type: 'dateRange',
      label: '上课时间:',
      name: 'SKSD',
      key: 'SKSD',
      width: '100%',
      hidden: kaike,
      readonly,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return defaults > classattend[0] || defaults < classattend[1];
        },
      },
    },
    {
      type: 'uploadImage',
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      readonly,
      imagename: 'image',
      upurl: '/api/upload/uploadFile',
      imageurl: imageUrl || formValues?.KCTP,
      handleImageChange,
      accept: '.jpg, .jpeg, .png',
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
      <div ref={userRef}></div>
      <Drawer
        title={getTitle()}
        width={480}
        onClose={onClose}
        visible={visible}
        className={styles.courseStyles}
        destroyOnClose={true}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          names === 'chakan' ? null : (
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
          )
        }
      >
        <ProFormFields
          layout="vertical"
          onFinish={onFinish}
          setForm={setForm}
          formItems={formItems}
          formItemLayout={formLayout}
          values={
            formValues || {
              BJZT: '待发布',
              BMKSSJ: baoming,
              KKRQ: kaike,
            }
          }
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
