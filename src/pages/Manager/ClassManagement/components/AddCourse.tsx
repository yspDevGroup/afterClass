/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, InputNumber, message } from 'antd';
import ProFormFields from '@/components/ProFormFields';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import styles from './AddCourse.less';
import moment from 'moment';
import { enHenceMsg } from '@/utils/utils';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getKHJSSJ } from '@/services/after-class/khjssj';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { useModel } from 'umi';

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
  kCID?: string;
};
const formLayout = {
  labelCol: { flex: '7em' },
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
  kCID,
}) => {
  const userRef = useRef(null);
  const [form, setForm] = useState<any>();
  const tableRef = useRef<ActionType>();
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [baoming, setBaoming] = useState<boolean>(false);
  const [kaike, setKaike] = useState<boolean>(false);
  // 教师
  const [teacherData, setTeacherData] = useState<any[]>([]);

  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');
  const [KCDate, setKCDate] = useState<any>([]);
  // 报名时间
  const [BMData, setBMData] = useState<any>();
  // 开课时间
  const [KKData, setKKData] = useState<any>();
  // 是否选择教辅
  const [choosenJf, setChoosenJf] = useState<boolean>(false);
  const [isJg, setIsJg] = useState<boolean>(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 选中机构课程的任课老师
  const [JGKCTeacherData, setJGKCTeacherData] = useState<any>([]);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      align: 'center',
    },
    {
      title: '名称',
      key: 'JCMC',
      dataIndex: 'JCMC',
      align: 'center',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '费用',
      dataIndex: 'JCFY',
      width: 80,
      align: 'center',
      renderFormItem: () => (<InputNumber min={0} />),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      hideInTable: readonly,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id||record.index);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.index !== record.index));
            action?.reload();
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const getChildren = () => {
    return (
      <EditableProTable<any>
        bordered
        rowKey="id"
        toolBarRender={false}
        request={async () => ({
          data: dataSource,
          total: dataSource.length,
          success: true,
        })}
        recordCreatorProps={readonly ? false : undefined}
        value={dataSource}
        onChange={setDataSource}
        actionRef={tableRef}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    )
  };
  const getJgTeacher = async (kcId: string) => {
    const res = await getKHKCSJ({
      kcId,
      XXJBSJId: currentUser?.xxId,
      XNXQId: curXNXQId
    });
    if (res?.status === 'ok') {
      const { KHKCJs } = res?.data;
      const teacherOption: any = [];
      KHKCJs?.forEach((item: any) => {
        teacherOption.push({
          label: item.KHJSSJ?.XM,
          value: item.KHJSSJId,
        });
      });
      setJGKCTeacherData(teacherOption);
    }
  };
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
  useEffect(() => {
    if (formValues) {
      const kcDate = KHKCAllData?.filter(
        (item: any) => item.SSJGLX === formValues?.KHKCSJ?.SSJGLX || formValues.SSJGLX,
      );
      // 如果后查询的课程列表不存在此记录，则加到第一个
      if (!kcDate?.find(n => n.value === formValues.KHKCSJId)) {
        kcDate?.unshift({
          KCMC: formValues.KHKCSJ?.KCMC,
          id: formValues.KHKCSJId
        })
      }
      setIsJg(formValues?.KHKCSJ?.SSJGLX === '机构课程' || formValues.SSJGLX === '机构课程');
      setKCDate(kcDate);
      if (
        new Date(formValues?.BMKSSJ).getTime() === new Date(BMData?.KSSJ || '').getTime() &&
        new Date(formValues?.BMJSSJ).getTime() === new Date(BMData?.JSSJ || '').getTime()
      ) {
        setBaoming(false);
      } else {
        setBaoming(true);
      }
      if (new Date(formValues?.KKRQ).getTime() === new Date(KKData?.KSSJ || '').getTime() &&
        new Date(formValues?.JKRQ).getTime() === new Date(KKData?.JSSJ || '').getTime()) {
        setKaike(false);
      } else {
        setKaike(true);
      }
      if (formValues.SSJGLX === '机构课程') {
        getJgTeacher(formValues.KHKCSJId);
      }
      if (formValues?.KHKCJCs?.length) {
        setChoosenJf(true);
        setDataSource(formValues?.KHKCJCs);
      }
    }
  }, [formValues]);
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
  const handleClose = () => {
    setKaike(false);
    setBaoming(false);
    setChoosenJf(false);
    setDataSource([]);
    onClose();
  };
  const onFinish = (values: any) => {
    let mertial: any[] = [];
    if (values?.dataSource?.length && choosenJf) {
      mertial = [].map.call(values?.dataSource, (item: any) => {
        return {
          KHBJSJId: formValues?.id,
          JCFY: item.JCFY,
          JCMC: item.JCMC
        }
      })
    }
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
        KHKCJCs: mertial
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
          handleClose();
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
          // 在切换的时候把选中的课程、主教师、副教师清空
          form.setFieldsValue({
            KHKCSJId: undefined,
            ZJS: undefined,
            FJS: undefined,
          });
          const { value } = values.target;
          const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === value);
          setKCDate(kcDate);
          setJGKCTeacherData([]);
          setIsJg(value === '机构课程');
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
        onChange: (values: any) => {
          if (isJg) {
            getJgTeacher(values);
          }
        },
      },
    },
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
      name: 'XQSJId',
      key: 'XQSJId',
      label: '所属校区:',
      disabled: readonly,
      rules: [{ required: true, message: '请填写所属校区' }],
      fieldProps: {
        options: campus,
      },
    },
    {
      type: 'group',
      key: 'group1',
      disabled: readonly,
      groupItems: [
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
      ]
    },
    {
      type: 'group',
      key: 'group2',
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
            // 创建机构课程的时 主班选择的是机构分配的任课老师
            options: isJg ? JGKCTeacherData : teacherData,
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
            // 创建机构课程的时 副班选择的是机构分配和学校一起的任课老师
            options: [...teacherData, ...JGKCTeacherData],
            optionFilterProp: 'label',
            allowClear: true,
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group3',
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
      type: 'checkbox',
      label: '教辅',
      name: 'KHKCJC',
      key: 'KHKCJC',
      value: choosenJf ? 'kcjc' : '',
      valueEnum: {
        'kcjc': { text: '包含教辅' },
      },
      disabled: readonly,
      onChange: (e: any) => {
        if (e?.length) {
          setChoosenJf(true);
        } else {
          setChoosenJf(false);
        }
      }
    },
    choosenJf ? {
      type: 'custom',
      text: '教辅材料',
      name: 'KHKCJCs',
      key: 'KHKCJCs',
      children: getChildren()
    } : '',
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
          disabled: readonly,
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                return setBaoming(true);
              }
              // 将按钮关闭的时候 传成默认时间段
              form.setFieldsValue({ BMSD: [BMData?.KSSJ, BMData?.JSSJ] });
              setBaoming(false);;
            },
            checked: baoming,
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
      hidden: !baoming,
      rules: [{ required: baoming, message: '请选择报名时段' }],
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
              if (item) {
                return setKaike(true);
              }
              // 将按钮关闭的时候 传成默认时间段
              form.setFieldsValue({ SKSD: [KKData?.KSSJ, KKData?.JSSJ] });
              return setKaike(false);
            },
            checked: kaike,
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
      hidden: !kaike,
      rules: [{ required: kaike, message: '请选择上课时间' }],
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
        width={580}
        onClose={handleClose}
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
              <Button onClick={handleSubmit} type="primary" style={{ marginRight: 16 }}>
                保存
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  setImageUrl('');
                }}

              >
                取消
              </Button>

            </div>
          )
        }
      >
        <ProFormFields
          onFinish={onFinish}
          setForm={setForm}
          formItems={formItems}
          formItemLayout={formLayout}
          values={
            formValues || {
              BJZT: '待开班',
            }
          }
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
