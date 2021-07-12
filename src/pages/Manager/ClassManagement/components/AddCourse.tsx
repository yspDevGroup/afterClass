import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import { queryXQList } from '@/services/wechat/service';
// import { getKHKCSJ } from '@/services/after-class/khkcsj';
import moment from 'moment';
import { getDepUserList } from '@/services/after-class/wechat';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import WWOpenDataCom from './WWOpenDataCom';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  mcData?: { label: string; value: string }[];
  names?: string;
  KHKCAllData?: any[];
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
  KHKCAllData,
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
  // 校区名字
  const [xQItem, setXQLabelItem] = useState<any>('');

  // // 年级ID
  // const [nJID, setNJID] = useState([]);
  // 年级名字
  const [nJLabelItem, setNJLabelItem] = useState<any>([]);

  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');
  const [KHDateAll, setKHDateAll] = useState<any>({});

  useEffect(() => {
    if (formValues) {
      setBaoming(false);
      setKaike(false);
      // 在课程的数据里筛选出当前课程的相关时间
      const khDate = KHKCAllData?.find((item: any) => item.id === formValues?.KHKCSJ?.id);
      setKHDateAll(khDate);
    } else {
      setBaoming(true);
      setKaike(true);
      setKHDateAll({});
    }
  }, [formValues]);

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

  useEffect(() => {
    (async () => {
      // 获取年级信息
      const currentXQ = await queryXQList();
      const XQ: { label: any; value: any }[] = [];
      const NJ = {};
      currentXQ?.forEach((item: any) => {
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
      if (formValues?.id) {
        setXQLabelItem(formValues?.NJSName?.toString());
      } else {
        setXQLabelItem('');
      }
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
        NJS: values.NJS?.toString() || formValues?.NJSID.toString(), // 年级ID
        NJSName: nJLabelItem?.toString() || formValues?.NJSName.toString(), // 年级名称
        FJS: values.FJS?.toString(), // 副班
        XQ: values.XQ?.toString() || formValues?.XQID.toString(), // 校区ID
        XQName: xQItem || formValues?.XQName.toString(), // 校区名称
        KCTP: imageUrl || formValues?.KCTP,
        BMKSSJ: new Date(values?.BMSD ? values?.BMSD[0] : KHDateAll?.BMKSSJ),
        BMJSSJ: new Date(values?.BMSD ? values?.BMSD[1] : KHDateAll?.BMJSSJ),
        KKRQ: values?.SKSD ? values?.SKSD[0] : KHDateAll?.KKRQ,
        JKRQ: values?.SKSD ? values?.SKSD[1] : KHDateAll?.JKRQ,
      };

      if (formValues?.id) {
        delete options.BJZT;
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
          setImageUrl('');
        } else if (data.message!.indexOf('token') > -1) {
          message.error('身份验证过期，请重新登录');
        } else if (data.message!.indexOf('Validation') > -1) {
          message.error('已存在该数据，请勿重复添加');
        } else {
          message.error(`${data.message},请联系管理员或稍后再试`);
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
      disabled: readonly,
      rules: [
        { required: true, message: '请填写班级名称' },
        { max: 18, message: '最长为 18 位' },
      ],
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'select',
      disabled: readonly,
      label: '课程名称：',
      name: 'KHKCSJId',
      key: 'KHKCSJId',
      rules: [{ required: true, message: '请填写课程名称' }],
      fieldProps: {
        options: mcData,
        onChange: (value: any) => {
          const khDate = KHKCAllData?.find((item: any) => item.id === value);
          setKHDateAll(khDate);
        },
      },
    },
    {
      type: 'inputNumber',
      disabled: readonly,
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
      disabled: readonly,
      label: '班级人数：',
      name: 'BJRS',
      key: 'BJRS',
      rules: [{ required: true, message: '请填写班级人数' }],
    },
    {
      type: 'group',
      disabled: readonly,
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
          disabled: readonly,
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
      disabled: readonly,
      rules: [{ required: true, message: '请填写所属校区' }],
      fieldProps: {
        options: campus,
        onChange(value: any, option: any) {
          form.setFieldsValue({ NJS: undefined });
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
        onChange(_: any, option: any) {
          const njsIabel: any[] = [];
          option?.forEach((item: any) => {
            njsIabel.push(item?.label);
          });
          setNJLabelItem(njsIabel);
        },
      },
      disabled: readonly,
    },
    {
      type: 'group',
      disabled: readonly,
      groupItems: [
        {
          type: 'select',
          label: '主班：',
          name: 'ZJS',
          key: 'ZJS',
          disabled: readonly,
          rules: [{ required: true, message: '请选择班主任' }],
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
          disabled: readonly,
          rules: [{ required: true, message: '请选择副班主任' }],
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
    KHDateAll?.id
      ? {
          type: 'divTab',
          text: `(默认报名时间段)：${KHDateAll?.BMKSSJ?.slice(0, 10)} — ${KHDateAll?.BMJSSJ?.slice(
            0,
            10,
          )}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div',
      label: `单独设置报名时段：`,
      disabled: readonly,
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
      disabled: readonly,
      width: '100%',
      hidden: baoming,
      rules: [{ required: !baoming, message: '请选择报名时段' }],
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return defaults > KHDateAll?.BMJSSJ || defaults < KHDateAll?.BMKSSJ;
        },
      },
    },
    KHDateAll?.id
      ? {
          type: 'divTab',
          text: `(默认上课时间段)：${KHDateAll?.KKRQ} — ${KHDateAll?.JKRQ}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div1',
      disabled: readonly,
      label: `单独设置上课时段：`,
      lineItem: [
        {
          type: 'switch',
          disabled: readonly,
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
      rules: [{ required: !kaike, message: '请选择上课时间' }],
      disabled: readonly,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return defaults < formValues?.KKRQ || defaults > formValues?.JKRQ;
        },
      },
    },
    {
      type: 'uploadImage',
      label: '封面：',
      name: 'KCTP',
      key: 'KCTP',
      disabled: readonly,
      imagename: 'image',
      upurl: '/api/upload/uploadFile',
      imageurl: imageUrl || formValues?.KCTP,
      handleImageChange,
      accept: '.jpg, .jpeg, .png',
    },
    {
      type: 'textArea',
      disabled: readonly,
      label: '简介：',
      name: 'BJMS',
      key: 'BJMS',
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
        maskClosable={false}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          names === 'chakan' ? null : (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={() => {
                  onClose();
                  setImageUrl('');
                }}
                style={{ marginRight: 16 }}
              >
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
