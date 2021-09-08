/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import moment from 'moment';
import { getDepUserList } from '@/services/after-class/wechat';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import { enHenceMsg } from '@/utils/utils';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getKHJSSJ } from '@/services/after-class/khjssj';

type AddCourseProps = {
  visible: boolean;
  onClose: () => void;
  readonly?: boolean;
  formValues?: Record<string, any>;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  mcData?: { label: string; value: string }[];
  names?: string;
  KHKCAllData?: any[];
  curXNXQId?: string;
  currentUser?: API.CurrentUser | undefined;
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
  curXNXQId,
  names,
  KHKCAllData,
  currentUser,
}) => {
  const userRef = useRef(null);
  const [form, setForm] = useState<any>();
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [baoming, setBaoming] = useState<boolean>(true);
  const [kaike, setKaike] = useState<boolean>(true);
  // 教师
  const [teacherData, setTeacherData] = useState<any[]>([]);
  // 校区名字
  const [xQItem, setXQLabelItem] = useState<any>('');

  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');
  const [KHDateAll, setKHDateAll] = useState<any>({});
  const [KCDate, setKCDate] = useState<any>([]);
  // 报名时间
  const [BMData, setBMData] = useState<any>();
  // 开课时间
  const [KKData, setKKData] = useState<any>();
  useEffect(() => {
    if (formValues) {
      setBaoming(false);
      setKaike(false);
      const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === formValues?.KHKCSJ?.SSJGLX);
      setKCDate(kcDate);
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
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const XQ: { label: any; value: any }[] = [];
      // 获取校区数据
      const resXQ = await getAllXQSJ({ XXJBSJId: currentUser?.xxId });
      if (resXQ.status === 'ok') {
        resXQ.data?.forEach((item: any) => {
          XQ.push({
            label: item.XQMC,
            value: item.id,
          });
        });
        setCampus(XQ);
      }

      // 获取教师
      const res = await getKHJSSJ({ JGId: currentUser?.xxId, page: 0, pageSize: 0 });
      if (res.status === 'ok') {
        const data = res.data?.rows;
        const teachOption: any = [];
        data?.forEach((item) => {
          teachOption.push({
            label: item.XM,
            value: item.id,
          });
        });
        setTeacherData(teachOption);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // 获取时间配置
        const resSJ = await getAllXXSJPZ({
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
          type: ['1', '2'],
        });

        if (resSJ.status === 'ok') {
          // 报名时间 [1]
          const BM = resSJ.data?.find((item) => item.TYPE === '1');
          // 上课时间 [2]
          const KK = resSJ.data?.find((item) => item.TYPE === '2');
          setBMData(BM);
          setKKData(KK);
        }
      }
    })();
  }, [curXNXQId]);
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
        KCTP: imageUrl || formValues?.KCTP,
        BMKSSJ: new Date(values?.BMSD ? values?.BMSD[0] : BMData?.KSSJ),
        BMJSSJ: new Date(values?.BMSD ? values?.BMSD[1] : BMData?.JSSJ),
        KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
        JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
        XNXQId: curXNXQId,
      };
      if (formValues?.id) {
        const ZJS = [
          {
            JSLX: '主教师',
            KHJSSJId: values.ZJS,
            KHBJSJId: formValues?.id,
          },
        ];
        const FJS = values.FJS.map((item: any) => {
          return {
            JSLX: '副教师',
            KHJSSJId: item,
            KHBJSJId: formValues?.id,
          };
        });
        delete options.BJZT;
        const params = {
          id: formValues?.id,
        };
        res = updateKHBJSJ(params, { ...options, KHBJJSs: [...ZJS, ...FJS] });
      } else {
        const ZJS = [
          {
            JSLX: '主教师',
            KHJSSJId: values.ZJS,
          },
        ];
        const FJS = values.FJS.map((item: any) => {
          return {
            JSLX: '副教师',
            KHJSSJId: item,
          };
        });
        res = createKHBJSJ({ ...options, KHBJJSs: [...ZJS, ...FJS] });
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
        } else {
          enHenceMsg(data.message);
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
      type: 'radio',
      disabled: readonly,
      label: '课程来源：',
      name: 'SSJGLX',
      key: 'SSJGLX',
      fieldProps: {
        options: [
          { value: '校内课程', label: '校内课程' },
          { value: '机构课程', label: '机构课程' },
        ],
        // 按照课程来源筛选课程
        onChange: (values: any) => {
          const { value } = values.target;
          const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === value);
          setKCDate(kcDate);
        },
      },
      rules: [{ required: true, message: '请选择课程来源' }],
    },
    {
      type: 'select',
      disabled: readonly,
      label: '课程名称：',
      name: 'KHKCSJId',
      key: 'KHKCSJId',
      rules: [{ required: true, message: '请填写课程名称' }],
      fieldProps: {
        options: KCDate.map((item: any) => {
          return { label: item.KCMC, value: item.id };
        }),
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
      name: 'XQSJId',
      key: 'XQSJId',
      label: '所属校区:',
      disabled: readonly,
      rules: [{ required: true, message: '请填写所属校区' }],
      fieldProps: {
        options: campus,
        onChange(_: any, option: any) {
          form.setFieldsValue({ NJS: undefined });
          setXQLabelItem(option?.label);
        },
      },
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
            showSearch: true,
            options: teacherData,
            optionFilterProp: 'label',
            allowClear: true,
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
            showSearch: true,
            options: teacherData,
            optionFilterProp: 'label',
            allowClear: true,
          },
        },
      ],
    },
    BMData?.id
      ? {
          type: 'divTab',
          text: `(默认报名时间段)：${BMData?.KSSJ} — ${BMData?.JSSJ}`,
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
          return defaults > BMData?.JSSJ || defaults < BMData?.KSSJ;
        },
      },
    },
    KKData?.id
      ? {
          type: 'divTab',
          text: `(默认上课时间段)：${KKData?.KSSJ} — ${KKData?.JSSJ}`,
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
      label: '上课时段:',
      name: 'SKSD',
      key: 'SKSD',
      width: '100%',
      hidden: kaike,
      rules: [{ required: !kaike, message: '请选择上课时间' }],
      disabled: readonly,
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return defaults < KKData?.KSSJ || defaults > KKData?.JSSJ;
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
      upurl: '/api/upload/uploadFile?type=badge&plat=school',
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
      <div ref={userRef} />
      <Drawer
        title={getTitle()}
        width={480}
        onClose={onClose}
        visible={visible}
        className={styles.courseStyles}
        destroyOnClose={true}
        maskClosable={names === 'chakan'}
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
              BJZT: '待开班',
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
