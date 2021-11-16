/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Drawer, InputNumber, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import moment from 'moment';
import { enHenceMsg } from '@/utils/utils';
import ProFormFields from '@/components/ProFormFields';
// import WWOpenDataCom from '@/components/WWOpenDataCom';

import { getAllXQSJ } from '@/services/after-class/xqsj';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
// import { getTeacherByClassId } from '@/services/after-class/khkcsj';
// import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';

import styles from './AddCourse.less';
import { useModel } from 'umi';
import TeacherSelect from '@/components/TeacherSelect';

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
  CopyType?: string;
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
  CopyType,
}) => {
  const { initialState } = useModel('@@initialState');
  const userRef = useRef(null);
  const [form, setForm] = useState<any>();
  const tableRef = useRef<ActionType>();
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [baoming, setBaoming] = useState<boolean>(false);
  const [kaike, setKaike] = useState<boolean>(false);
  // 教师
  // const [teacherData, setTeacherData] = useState<any[]>([]);
  // 选中机构课程的任课老师
  // const [JGKCTeacherData, setJGKCTeacherData] = useState<any>([]);
  const [KCDate, setKCDate] = useState<any>([]);
  const [kcId, setKcId] = useState<string | undefined>(undefined);
  // 报名时间
  const [BMData, setBMData] = useState<any>();
  // 开课时间
  const [KKData, setKKData] = useState<any>();
  // 是否选择教辅
  const [choosenJf, setChoosenJf] = useState<boolean>(false);
  const [isJg, setIsJg] = useState<boolean>(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

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
      renderFormItem: () => <InputNumber min={0} max={999} />,
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
            const judge = record.id ? record.id : record.index;
            action?.startEditable?.(judge);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(
              dataSource.filter((item) => {
                if (item.id) {
                  return item.id !== record.id;
                }
                return item.index !== record.index;
              }),
            );
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
    );
  };
  // const getJgTeacher = async (kcIdvalue: string) => {
  //   const res = await getTeacherByClassId({
  //     KHKCSJId: kcIdvalue,
  //     pageSize: 0,
  //     page: 0,
  //   });
  //   if (res.status === 'ok') {
  //     const { rows } = res?.data;
  //     const teacherOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =
  //       [];
  //     rows?.forEach((item: { XM: string; WechatUserId: string; id: any }) => {
  //       // 兼顾企微
  //       const label =
  //         item.XM === '未知' && item.WechatUserId ? (
  //           <WWOpenDataCom type="userName" openid={item.WechatUserId} />
  //         ) : (
  //           item.XM
  //         );
  //       teacherOption.push({
  //         label,
  //         value: item.id,
  //         WechatUserId: item.WechatUserId,
  //       });
  //     });
  //     setJGKCTeacherData(teacherOption);
  //   }
  // };
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
          const BM = resSJ.data?.find((item: any) => item.TYPE === '1');
          // 上课时间 [2]
          const KK = resSJ.data?.find((item: any) => item.TYPE === '2');
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
      if (!kcDate?.find((n) => n.value === formValues.KHKCSJId)) {
        kcDate?.unshift({
          KCMC: formValues.KHKCSJ?.KCMC,
          id: formValues.KHKCSJId,
        });
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
      if (
        new Date(formValues?.KKRQ).getTime() === new Date(KKData?.KSSJ || '').getTime() &&
        new Date(formValues?.JKRQ).getTime() === new Date(KKData?.JSSJ || '').getTime()
      ) {
        setKaike(false);
      } else {
        setKaike(true);
      }
      if (formValues.SSJGLX === '机构课程') {
        // getJgTeacher(formValues.KHKCSJId);
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
      // const res = await getAllJZGJBSJ({ XXJBSJId: currentUser?.xxId, page: 0, pageSize: 0 });
      // if (res.status === 'ok') {
      //   const data = res.data?.rows;
      //   const teachOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =
      //     [];
      //   data?.forEach((item: any) => {
      //     // 兼顾企微
      //     const label =
      //       item.XM === '未知' && item.WechatUserId ? (
      //         <WWOpenDataCom type="userName" openid={item.WechatUserId} />
      //       ) : (
      //         item.XM
      //       );
      //     teachOption.push({
      //       label,
      //       value: item.id,
      //       WechatUserId: item.WechatUserId,
      //     });
      //   });
      //   setTeacherData(teachOption);
      // }
    })();
  }, []);
  // 获取标题
  const getTitle = () => {
    if (formValues && names === 'chakan') {
      return '查看课程班';
    }
    if (formValues && names === 'copy') {
      return '新增课程班';
    }
    if (formValues) {
      return '编辑课程班';
    }

    return '新增课程班';
  };
  const handleClose = () => {
    setKaike(false);
    setBaoming(false);
    setChoosenJf(false);
    setDataSource([]);
    onClose();
  };
  const onFinish = (values: any) => {
    console.log('保存,', values);
    let mertial: any[] = [];
    if (values?.dataSource?.length && choosenJf) {
      mertial = [].map.call(values?.dataSource, (item: any) => {
        if (CopyType === 'copy') {
          return {
            JCFY: item.JCFY,
            JCMC: item.JCMC,
          };
        }
        return {
          KHBJSJId: formValues?.id,
          JCFY: item.JCFY,
          JCMC: item.JCMC,
        };
      });
    } else {
      mertial = [].map.call(dataSource, (item: any) => {
        if (CopyType === 'copy') {
          return {
            JCFY: item.JCFY,
            JCMC: item.JCMC,
          };
        }
        return {
          KHBJSJId: formValues?.id,
          JCFY: item.JCFY,
          JCMC: item.JCMC,
        };
      });
    }
    new Promise((resolve, reject) => {
      let res = null;
      const options = {
        ...values,
        KCTP: '',
        BMKSSJ: new Date(values?.BMSD ? values?.BMSD[0] : BMData?.KSSJ),
        BMJSSJ: new Date(values?.BMSD?.[1] ? values?.BMSD[1] : BMData?.JSSJ),
        KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
        JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
        XNXQId: curXNXQId,
        KHKCJCs: mertial,
      };
      if (CopyType === 'copy') {
        const ZJS = [
          {
            JSLX: '主教师',
            JZGJBSJId: values.ZJS,
          },
        ];
        const FJS =
          values?.FJS && values?.FJS?.length
            ? values.FJS.map((item: any) => {
                return {
                  JSLX: '副教师',
                  JZGJBSJId: item,
                };
              })
            : undefined;
        res = createKHBJSJ({ ...options, KHBJJSs: FJS ? [...ZJS, ...FJS] : [...ZJS] });
      } else if (formValues?.id) {
        const ZJS = [
          {
            JSLX: '主教师',
            JZGJBSJId: values.ZJS,
            KHBJSJId: formValues?.id,
          },
        ];
        const FJS =
          values?.FJS && values?.FJS?.length
            ? values.FJS.map((item: any) => {
              return {
                JSLX: '副教师',
                JZGJBSJId: item,
                KHBJSJId: formValues?.id,
              };
            })
            : undefined;
        delete options.BJZT;
        const params = {
          id: formValues?.id,
        };
        res = updateKHBJSJ(params, { ...options, KHBJJSs: FJS ? [...ZJS, ...FJS] : [...ZJS] });
      } else {
        const ZJS = [
          {
            JSLX: '主教师',
            JZGJBSJId: values.ZJS,
          },
        ];
        const FJS =
          values?.FJS && values?.FJS?.length
            ? values.FJS.map((item: any) => {
                return {
                  JSLX: '副教师',
                  JZGJBSJId: item,
                };
              })
            : undefined;
        res = createKHBJSJ({ ...options, KHBJJSs: FJS ? [...ZJS, ...FJS] : [...ZJS] });
      }

      resolve(res);
      reject(res);
    })
      .then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          handleClose();
          actionRef?.current?.reload();
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
          // setJGKCTeacherData([]);
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
            setKcId(values);
            // getJgTeacher(values);
          }
        },
      },
    },
    {
      type: 'input',
      label: '课程班名称',
      name: 'BJMC',
      key: 'BJMC',
      disabled: readonly,
      rules: [
        { required: true, message: '请填写课程班名称' },
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
          label: '课程班人数：',
          name: 'BJRS',
          key: 'BJRS',
          rules: [{ required: true, message: '请填写课程班人数' }],
        },
      ],
    },
    // {
    //   type: 'group',
    //   key: 'group2',
    //   disabled: readonly,
    //   groupItems: [
    //     {
    //       type: 'select',
    //       label: '主班：',
    //       name: 'ZJS',
    //       key: 'ZJS',
    //       disabled: readonly,
    //       rules: [{ required: true, message: '请选择班主任' }],
    //       fieldProps: {
    //         showSearch: true,
    //         // 创建机构课程的时 主班选择的是机构分配的任课老师
    //         options: isJg ? JGKCTeacherData : teacherData,
    //         optionFilterProp: 'label',
    //         allowClear: true,
    //         // optionItemRender(item: {label: string; value: string; WechatUserId?: string;}) {
    //         //   console.log('item==========1');
    //         //   console.log(item);
    //         //   console.log(authType);
    //         //   console.log('item==========2');
    //         //   if(authType === 'wechat' && item.label === '未知' && item.WechatUserId) {
    //         //     return <WWOpenDataCom type='userName' openid={item.WechatUserId} />
    //         //   }
    //         //   return item.label;
    //         // }
    //       },
    //     },
    //     {
    //       type: 'select',
    //       label: '副班：(多选)',
    //       name: 'FJS',
    //       key: 'FJS',
    //       disabled: readonly,
    //       fieldProps: {
    //         mode: 'multiple',
    //         showSearch: true,
    //         // 创建机构课程的时 副班选择的是机构分配和学校一起的任课老师
    //         options: [...teacherData, ...JGKCTeacherData],
    //         optionFilterProp: 'label',
    //         allowClear: true,
    //         optionItemRender(item: { label: string; value: string; WechatUserId?: string }) {
    //           if (
    //             initialState?.buildOptions.authType === 'wechat' &&
    //             item.label === '未知' &&
    //             item.WechatUserId
    //           ) {
    //             return <WWOpenDataCom type="userName" openid={item.WechatUserId} />;
    //           }
    //           return item.label;
    //         },
    //       },
    //     },
    //   ],
    // },

    {
      type: 'reactnode',
      label: '主班：',
      name: 'ZJS',
      key: 'ZJS',
      disabled: readonly,
      rules: [{ required: true, message: '请选择班主任' }],
      children: (
        <TeacherSelect
          // value={ }
          // isjg true 为机构课程 主班为单选 1 为校内课程 2为校外课程
          type={isJg ? 2 : 1}
          multiple={false}
          xxId={currentUser?.xxId}
          kcId={isJg ? kcId : undefined}
          onChange={(value: any) => {
            console.log('change', value);
            return value;
          }}
          disabled={readonly}
        />
      ),
    },
    {
      type: 'reactnode',
      label: '副班：(多选)',
      name: 'FJS',
      key: 'FJS',
      disabled: readonly,
      children: (
        <TeacherSelect
          // value={ }
          // isjg true 为机构课程 主班为单选 1 为校内课程 2为校外课程
          type={isJg ? 3 : 1}
          multiple={true}
          xxId={currentUser?.xxId}
          kcId={isJg ? kcId : undefined}
          onChange={(value: any) => {
            console.log('change', value);
            return value;
          }}
          disabled={readonly}
        />
      ),
    },

    //   fieldProps: {
    //     showSearch: true,
    //     // 创建机构课程的时 主班选择的是机构分配的任课老师
    //     options: isJg ? JGKCTeacherData : teacherData,
    //     optionFilterProp: 'label',
    //     allowClear: true,
    //     // optionItemRender(item: {label: string; value: string; WechatUserId?: string;}) {
    //     //   console.log('item==========1');
    //     //   console.log(item);
    //     //   console.log(authType);
    //     //   console.log('item==========2');
    //     //   if(authType === 'wechat' && item.label === '未知' && item.WechatUserId) {
    //     //     return <WWOpenDataCom type='userName' openid={item.WechatUserId} />
    //     //   }
    //     //   return item.label;
    //     // }
    //   },
    // },
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
          rules: [
            { required: true, message: '请填写费用' },
            { message: '请输入正确的费用', pattern: /^([1-9]\d{0,3}|0)(\.\d{1,2})?$/ },
          ],
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
        kcjc: { text: '包含教辅' },
      },
      disabled: readonly,
      onChange: (e: any) => {
        if (e?.length) {
          setChoosenJf(true);
        } else {
          setChoosenJf(false);
        }
      },
    },
    choosenJf
      ? {
        type: 'custom',
        text: '教辅材料',
        name: 'KHKCJCs',
        key: 'KHKCJCs',
        children: getChildren(),
      }
      : '',
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
              setBaoming(false);
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
      type: 'textArea',
      disabled: readonly,
      label: '简介：',
      rules: [{ required: true, message: '请输入班级课程安排' }],
      name: 'BJMS',
      key: 'BJMS',
    },
  ];

  console.log('readonly', readonly);

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
                }}
              >
                取消
              </Button>
            </div>
          )
        }
      >
        {/* <TeacherSelect
          type={3}
          multiple={false}
          xxId={currentUser?.xxId}
          kcId='8f15fa61-74a2-48cf-bb15-46d346ea3028'
          onChange={(value: any) => {
            console.log('change', value);
          }}
        /> */}
        <ProFormFields
          onFinish={onFinish}
          setForm={setForm}
          formItems={formItems}
          formItemLayout={formLayout}
          values={
            formValues || {
              BJZT: '未开班',
            }
          }
        />
      </Drawer>
    </div>
  );
};

export default AddCourse;
