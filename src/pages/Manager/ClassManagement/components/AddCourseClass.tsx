import { Button, Divider, InputNumber, message, Modal, Select, Steps, Input } from 'antd';
import type { FC } from 'react';
import { useRef } from 'react';
import styles from './AddCourse.less';
import { useEffect, useState } from 'react';
import ProFormFields from '@/components/ProFormFields';
import TeacherSelect from '@/components/TeacherSelect';
import moment from 'moment';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getAllXQSJ, getXQSJ } from '@/services/after-class/xqsj';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { getSchoolClasses } from '@/services/after-class/bjsj';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import ShowName from '@/components/ShowName';
import noJF from '@/assets/noJF.png';
import { getAllFJSJ } from '@/services/after-class/fjsj';

type AddCourseProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  formValues?: Record<string, any>;
  mcData?: { label: string; value: string }[];
  names?: string;
  KHKCAllData?: any[];
  curXNXQId?: string;
  currentUser?: API.CurrentUser | undefined;
  kCID?: string;
  CopyType?: string;
  getData: (origin?: string | undefined) => Promise<void>;
  BjLists: any;
  BmLists: any;
  JfLists: any;
};
const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;
const AddCourseClass: FC<AddCourseProps> = ({
  visible,
  setVisible,
  formValues,
  curXNXQId,
  KHKCAllData,
  currentUser,
  CopyType,
  getData,
  BjLists,
  BmLists,
  JfLists,
  names,
}) => {
  const [form, setForm] = useState<any>();
  const [Current, setBmCurrent] = useState(0);
  const tableRef = useRef<ActionType>();
  const [KCDate, setKCDate] = useState<any>([]);
  const [isJg, setIsJg] = useState<boolean>(false);
  const [kcId, setKcId] = useState<string | undefined>(undefined);
  const [kaike, setKaike] = useState<boolean>(false);
  const [xzb, setXzb] = useState<boolean>(false);
  const [BJData, setBJData] = useState<any>();
  const [BMData, setBMData] = useState<any>();
  const [JFData, setJFData] = useState<any>();
  const [BMLX, setBMLX] = useState<boolean>(false);
  const [XQMC, setXQMC] = useState<string>();
  // 课程所有适用班级
  const [ClassData, setClassData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // 是否选择教辅
  const [choosenJf, setChoosenJf] = useState<boolean>(false);
  // 适用行政班
  const [XzClass, setXzClass] = useState<any>([]);
  const [XzClassMC, setXzClassMC] = useState<any>([]);
  // 指定教师
  const [TeacherType, setTeacherType] = useState<any>([]);
  // 课程适用年级
  const [SYNJ, setSYNJ] = useState<any>([]);
  // 校区
  const [campus, setCampus] = useState<any>([]);
  // 开课时间
  const [KKData, setKKData] = useState<any>();
  // 校区数据Id
  const [XQSJIds, setXQSJIds] = useState();
  // 场地信息
  const [FJData, setFJData] = useState<any>();
  // 场地Id
  const [FJSJIds, setFJSJIds] = useState<any>();

  const formLayout = {
    labelCol: { flex: '7em' },
    wrapperCol: {},
  };
  useEffect(() => {
    if (formValues) {
      const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === BjLists?.SSJGLX);
      setFJSJIds(BjLists?.CDMCId);
      setKCDate(kcDate);
      setKcId(BjLists?.KHKCSJId);
      setIsJg(BjLists?.SSJGLX === '机构课程');
      setBJData(BjLists);
      setBMData(BmLists);
      setXzClassMC(BmLists?.XzClassMC);
      setJFData(JfLists);
      setXzClass(BmLists?.BJIds);
      setSYNJ(
        formValues?.KHKCSJ?.NJSJs.sort((a: any, b: any) => {
          return a.NJ - b.NJ;
        }),
      );

      if (BmLists.BJLX === 1) {
        setXzb(true);
      } else {
        setXzb(false);
      }
      if (JfLists.BMLX === 2) {
        setBMLX(true);
      }
      if (formValues?.KHKCJCs?.length) {
        setChoosenJf(true);
        setDataSource(formValues?.KHKCJCs);
      }
      if (
        new Date(BjLists?.SKSD[0]).getTime() === new Date(KKData?.KSSJ || '').getTime() &&
        new Date(BjLists?.SKSD[1]).getTime() === new Date(KKData?.JSSJ || '').getTime()
      ) {
        setKaike(false);
      } else {
        setKaike(true);
      }
      if (BjLists.ZJS) {
        setTeacherType(true);
      } else {
        setTeacherType(false);
      }
    }
  }, [formValues]);
  // 获取校区数据
  useEffect(() => {
    (async () => {
      const XQ: { label: any; value: any }[] = [];
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
    })();
  }, []);
  // 获取课程适用年级和班级
  useEffect(() => {
    (async () => {
      if (BJData?.KHKCSJId) {
        const res = await getKHKCSJ({
          kcId: BJData?.KHKCSJId,
        });
        if (res.status === 'ok') {
          setSYNJ(res.data?.NJSJs);
          const newArr: any = [];
          res.data?.NJSJs.forEach((value: any) => {
            newArr.push(value.id);
          });

          const result = await getSchoolClasses({
            XXJBSJId: currentUser?.xxId,
            XNXQId: curXNXQId!,
            njId: newArr,
            XQSJId: XQSJIds,
          });
          if (result.status === 'ok') {
            setClassData(result?.data?.rows);
          }
        }
      }
    })();
  }, [BJData, XQSJIds]);
  // 获取场地信息
  useEffect(() => {
    (async () => {
      const res = await getAllFJSJ({
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok') {
        setFJData(res.data?.rows);
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
          type: [ '2'],
        });

        if (resSJ.status === 'ok') {
          // 上课时间 [2]
          const KK = resSJ.data?.find((item: any) => item.TYPE === '2');
          setKKData(KK);
        }
      }
    })();
  }, [curXNXQId]);
  const onFinish = async (values: any) => {
    if (Current === 0) {
      let newData = {};
      if (FJSJIds) {
        newData = {
          ...values,
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          FJSJId: FJSJIds,
        };
      } else {
        newData = {
          ...values,
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          FJSJId: null,
        };
      }
      setXQSJIds(values.XQSJId);
      setBJData(newData);
      setBmCurrent(Current + 1);
    } else if (Current === 1) {
      const newData = {
        ...values,
        ...BJData,
        BJIds: xzb ? XzClass : [],
        XzClassMC: xzb ? XzClassMC : [],
        BJLX: xzb ? 1 : 0,
      };

      setBmCurrent(Current + 1);
      setBMData(newData);
    } else if (Current === 2) {
      const newDatas = {
        ...BMData,
        ...values,
      };
      if (values?.BMLX === 2) {
        const { ZJS, FJS, ...info } = newDatas;
        let ZTeacher;
        let FTeacher;
        if (formValues && CopyType === 'undefined') {
          ZTeacher = [
            {
              JSLX: '主教师',
              JZGJBSJId: ZJS,
              KHBJSJId: formValues?.id,
            },
          ];
          FTeacher =
            FJS && FJS?.length
              ? FJS.map((item: any) => {
                  return {
                    JSLX: '副教师',
                    JZGJBSJId: item,
                    KHBJSJId: formValues?.id,
                  };
                })
              : undefined;
        } else {
          ZTeacher = [
            {
              JSLX: '主教师',
              JZGJBSJId: ZJS,
            },
          ];
          FTeacher =
            FJS && FJS?.length
              ? FJS.map((item: any) => {
                  return {
                    JSLX: '副教师',
                    JZGJBSJId: item,
                  };
                })
              : undefined;
        }
        const newData = {
          ...info,
          // eslint-disable-next-line no-nested-ternary
          KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
          KHKCJCs: [],
          BJZT: '未开班',
          ISFW: 0,
          XNXQId: curXNXQId,
        };

        let res: any;
        if (formValues && CopyType === 'undefined') {
          // 编辑
          res = await updateKHBJSJ({ id: formValues.id }, newData);
        } else if (formValues && CopyType === 'copy') {
          // 复制
          res = await createKHBJSJ(newData);
        } else {
          // 新建
          res = await createKHBJSJ(newData);
        }
        if (res.status === 'ok') {
          message.success('提交成功');
          getData();
          setVisible(false);
        } else {
          message.error('提交失败，请联系管理员或稍后重试');
        }
      } else {
        setJFData(newDatas);
        setBmCurrent(Current + 1);
      }
    } else if (Current === 3) {
      let mertial: any[] = [];
      if (dataSource?.length && choosenJf) {
        mertial = [].map.call(dataSource, (item: any) => {
          if (formValues && CopyType === 'undefined') {
            return {
              KHBJSJId: formValues?.id,
              JCFY: item.JCFY,
              JCMC: item.JCMC,
            };
          }
          return {
            JCFY: item.JCFY,
            JCMC: item.JCMC,
          };
        });
      }
      const { ZJS, FJS, ...info } = JFData;
      let ZTeacher;
      let FTeacher;
      if (formValues && CopyType === 'undefined') {
        ZTeacher = [
          {
            JSLX: '主教师',
            JZGJBSJId: ZJS,
            KHBJSJId: formValues?.id,
          },
        ];
        FTeacher =
          FJS && FJS?.length
            ? FJS.map((item: any) => {
                return {
                  JSLX: '副教师',
                  JZGJBSJId: item,
                  KHBJSJId: formValues?.id,
                };
              })
            : undefined;
      } else {
        ZTeacher = [
          {
            JSLX: '主教师',
            JZGJBSJId: ZJS,
          },
        ];
        FTeacher =
          FJS && FJS?.length
            ? FJS.map((item: any) => {
                return {
                  JSLX: '副教师',
                  JZGJBSJId: item,
                };
              })
            : undefined;
      }
      const newData = {
        ...info,
        // eslint-disable-next-line no-nested-ternary
        KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
        KHKCJCs: choosenJf ? mertial : [],
        ISFW: 0,
        BJZT: '未开班',
        XNXQId: curXNXQId,
      };
      let res: any;
      if (formValues && CopyType === 'undefined') {
        // 编辑
        res = await updateKHBJSJ({ id: formValues.id }, newData);
      } else if (formValues && CopyType === 'copy') {
        // 复制
        res = await createKHBJSJ(newData);
      } else {
        // 新建
        res = await createKHBJSJ(newData);
      }
      if (res.status === 'ok') {
        message.success('提交成功');
        getData();
        setVisible(false);
      } else {
        message.error('提交失败，请联系管理员或稍后重试');
      }
    }
  };
  useEffect(() => {
    if (formValues && names === 'chakan') {
      (async () => {
        const res = await getXQSJ({
          id: formValues?.XQSJId,
        });
        if (res.status === 'ok') {
          setXQMC(res.data?.XQMC);
        }
      })();
    }
  }, [formValues]);
  useEffect(() => {
    const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '校内课程');
    setKCDate(kcDate);
    setTeacherType(true);
  }, [KHKCAllData]);
  useEffect(() => {
    setBJData({
      SSJGLX: '校内课程',
    });
    if (visible === false && form) {
      setBmCurrent(0);
      form.resetFields();
      setFJSJIds(undefined);
      setBMData({});
      setJFData({});
      setChoosenJf(false);
      setXzb(false);
      setKaike(false);
      setBMLX(false);
      setTeacherType(true);
      setDataSource([]);
    }
  }, [visible]);

  const next = () => {
    form.submit();
  };
  const prev = () => {
    setBmCurrent(Current - 1);
  };
  const getTitle = () => {
    if (formValues && names === 'chakan') {
      return '班级详情';
    }
    if (formValues && names === 'copy') {
      return '复制班级';
    }
    if (formValues) {
      return '编辑班级';
    }

    return '新增班级';
  };
  const handleChange = (value: any, key: any) => {
    const newArr: any = [];
    const XZBMCArr: any = [];
    key.forEach((item: any) => {
      newArr.push(item.key);
      XZBMCArr.push(item.value);
    });
    setXzClass(newArr);
    setXzClassMC(XZBMCArr);
  };
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
      // hideInTable: readonly,
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

  const readonly = false;
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

  const formItems: any[] = [
    {
      type: 'group',
      key: 'group0',
      groupItems: [
        {
          type: 'radio',
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
              let kcDate: any;
              if (value === '机构课程') {
                kcDate = KHKCAllData?.filter(
                  (item: any) => item.SSJGLX === '机构课程' && item.KHKCSQs?.[0].ZT === 1,
                );
              } else {
                kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '校内课程');
              }
              setKCDate(kcDate);
              setIsJg(value === '机构课程');
            },
          },
          rules: [{ required: true, message: '请选择课程来源' }],
        },
        {
          type: 'select',
          name: 'XQSJId',
          key: 'XQSJId',
          label: '所属校区：',
          rules: [{ required: true, message: '请填写所属校区' }],
          fieldProps: {
            options: campus,
          },
        },
      ],
    },

    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'select',
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
              }
            },
          },
        },
        {
          type: 'input',
          label: '班级名称',
          name: 'BJMC',
          key: 'BJMC',
          rules: [
            { required: true, message: '请填写课程班名称' },
            { max: 18, message: '最长为 18 位' },
          ],
          fieldProps: {
            autocomplete: 'off',
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'inputNumber',
          label: '课时数：',
          name: 'KSS',
          key: 'KSS',
          rules: [
            { required: true, message: '请填写课时数' },
            {
              pattern: new RegExp('^[0-9]*[1-9][0-9]*$'),
              message: '请填写正确的课时数',
            },
          ],
          fieldProps: {
            min: 0,
            max: 100,
          },
        },
        {
          type: 'reactnode',
          label: '场地名称：',
          name: 'CDMC',
          key: 'CDMC',
          // rules: [{ required: TeacherType, message: '请选择场地名称' }],
          children: (
            <Select
              showSearch
              allowClear
              placeholder="请选择"
              optionFilterProp="children"
              onChange={(value, key: any) => {
                setFJSJIds(key?.key);
              }}
            >
              {FJData?.map((value: any) => {
                return (
                  <Option value={value?.FJMC} key={value?.id}>
                    {value?.FJMC}
                  </Option>
                );
              })}
            </Select>
          ),
        },
      ],
    },
    {
      type: 'div',
      key: 'div1',
      label: `指定教师：`,
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                form.setFieldsValue({ ZJS: undefined, FJS: undefined });
                return setTeacherType(true);
              }
              return setTeacherType(false);
            },
            checked: TeacherType,
          },
        },
      ],
    },
    {
      type: 'reactnode',
      label: '主班：',
      name: 'ZJS',
      key: 'ZJS',
      hidden: !TeacherType,
      rules: [{ required: TeacherType, message: '请选择主班教师' }],
      children: (
        <TeacherSelect
          // value={ }
          // isjg true 为机构课程 主班为单选 1 为校内课程 2为校外课程
          type={isJg ? 2 : 1}
          multiple={false}
          xxId={currentUser?.xxId}
          kcId={isJg ? kcId : undefined}
          onChange={(value: any) => {
            return value;
          }}
        />
      ),
    },
    {
      type: 'reactnode',
      label: '副班：(多选)',
      name: 'FJS',
      key: 'FJS',
      hidden: !TeacherType,
      children: (
        <TeacherSelect
          type={isJg ? 3 : 1}
          multiple={true}
          xxId={currentUser?.xxId}
          kcId={isJg ? kcId : undefined}
          onChange={(value: any) => {
            return value;
          }}
        />
      ),
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
      label: `单独设置上课时段：`,
      lineItem: [
        {
          type: 'switch',
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
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return (
            defaults < moment(KKData?.KSSJ).format('YYYY-MM-DD 00:00:00') ||
            defaults > moment(KKData?.JSSJ).format('YYYY-MM-DD 23:59:59')
          );
        },
      },
    },
    {
      type: 'textArea',
      label: '简介：',
      name: 'BJMS',
      key: 'BJMS',
      placeholder: '请输入',
      children: <TextArea showCount maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} />,
    },
  ];
  const BMformItems: any[] = [
    {
      type: 'div',
      key: 'div1',
      label: `指定行政班：`,
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                return setXzb(true);
              }
              form.setFieldsValue({ XzClassMC: [] });
              return setXzb(false);
            },
            checked: xzb,
          },
        },
      ],
    },
    {
      type: 'reactnode',
      label: '适用行政班：',
      name: 'XzClassMC',
      key: 'XzClassMC',
      hidden: !xzb,
      rules: [{ required: xzb, message: '请选择适用行政班' }],
      children: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="请选择适用行政班"
          onChange={handleChange}
        >
          {ClassData?.map((item: any) => {
            return (
              <Option
                key={item.id}
                value={`${item.NJSJ.XD}${item.NJSJ.NJMC}${item.BJ}`}
              >{`${item.NJSJ.XD}${item.NJSJ.NJMC}${item.BJ}`}</Option>
            );
          })}
        </Select>
      ),
    },
    {
      type: 'inputNumber',
      label: '课程班人数：',
      name: 'BJRS',
      key: 'BJRS',
      rules: [
        { required: true, message: '请填写课程班人数' },
        { message: '人数应为正整数，且最大人数不得超过一万', pattern: /^([1-9]\d{0,3}|0)?$/ }
      ],
    }
  ];
  const JFformItems: any[] = [
    {
      type: 'radio',
      label: '缴费模式：',
      name: 'BMLX',
      key: 'BMLX',
      fieldProps: {
        options: [
          { value: 1, label: '缴费即报名' },
          { value: 0, label: '先报名后缴费' },
          { value: 2, label: '免费' },
        ],
        onChange: (e: any) => {
          if (e.target.value === 2) {
            form.setFieldsValue({ FY: 0 });
            setBMLX(true);
          } else {
            setBMLX(false);
            form.setFieldsValue({ FY: '' });
          }
        },
      },
      rules: [{ required: true, message: '请选择缴费模式' }],
    },
    {
      type: 'inputNumber',
      label: '费用：',
      name: 'FY',
      key: 'FY',
      readonly: BMLX,
      rules: !BMLX
        ? [
            { required: true, message: '请填写费用' },
            {
              message: '费用应大于0，且最多支持2位小数',
              pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
            },
          ]
        : [],
      fieldProps: {
        autocomplete: 'off',
      },
    },
  ];
  const JCformItems: any[] = [
    {
      type: 'checkbox',
      label: '教辅',
      name: 'KHKCJC',
      key: 'KHKCJC',
      value: choosenJf ? 'kcjc' : '',
      valueEnum: {
        kcjc: { text: '包含教辅' },
      },
      onChange: (e: any) => {
        if (e?.length) {
          setChoosenJf(true);
        } else {
          setChoosenJf(false);
          setDataSource([]);
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
  ];
  return (
    <>
      <Modal
        title={getTitle()}
        visible={visible}
        className={styles.AddCourseClass}
        onOk={() => {
          setVisible(false);
        }}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
        maskClosable={false}
      >
        {formValues && names === 'chakan' ? (
          <div className={styles.see}>
            <Divider orientation="left">班级基本设置</Divider>
            <div className={styles.box}>
              <p>课程来源：{formValues?.KHKCSJ?.SSJGLX}</p>
              <p>所属校区：{XQMC || '本校'} </p>
            </div>
            <div className={styles.box}>
              <p>课程名称：{formValues?.KHKCSJ?.KCMC}</p>
              <p>班级名称：{formValues?.BJMC}</p>
            </div>
            <div className={styles.box}>
              <p>
                主班：
                {formValues?.ZJS ? (
                  <ShowName
                    type="userName"
                    openid={formValues?.ZJS?.WechatUserId}
                    XM={formValues?.ZJS?.XM}
                  />
                ) : (
                  <>—</>
                )}
              </p>
              <p>
                副班：
                {formValues?.FJS.length !== 0 ? (
                  <>
                    {formValues?.KHBJJs.map((value: any) => {
                      if (value.JSLX === '副教师') {
                        return (
                          <span style={{ marginRight: 5 }}>
                            <ShowName
                              type="userName"
                              openid={value?.JZGJBSJ?.WechatUserId}
                              XM={value?.JZGJBSJ?.XM}
                            />
                          </span>
                        );
                      }
                      return '';
                    })}
                  </>
                ) : (
                  <>—</>
                )}
              </p>
            </div>
            <div className={styles.box}>
              <p>课时数：{formValues?.KSS}</p>
              <p>场地名称：{formValues?.FJSJ?.FJMC || formValues?.KHPKSJs?.[0]?.FJSJ?.FJMC || '—'}</p>
            </div>
            <div className={styles.box}>
              <p>
                开课时段：{moment(formValues?.KKRQ).format('YYYY-MM-DD')} ~{' '}
                {moment(formValues?.JKRQ).format('YYYY-MM-DD')}
              </p>
            </div>
            <p className={styles.text}>班级简介：{formValues?.BJMS}</p>
            <Divider orientation="left">报名设置</Divider>
            {formValues?.BJLX === 1 ? (
              <p className={styles.text}>
                适用行政班：
                {formValues?.BJSJs.map((value: any) => {
                  return (
                    <span style={{ marginRight: 5 }}>
                      {value?.NJSJ?.XD}
                      {value?.NJSJ?.NJMC}
                      {value?.BJ}
                    </span>
                  );
                })}
              </p>
            ) : (
              <p className={styles.text}>
                适用年级：
                {SYNJ?.map((value: any) => {
                  return (
                    <span style={{ marginRight: 5 }}>
                      {value?.XD}
                      {value?.NJMC}
                    </span>
                  );
                })}
              </p>
            )}
            <p className={styles.text}>课程班人数：{formValues?.BJRS}</p>
            <Divider orientation="left">缴费设置</Divider>
            <p className={styles.text}>
              缴费模式：
              {formValues?.BMLX === 0 ? (
                '先报名后缴费'
              ) : (
                <>{formValues?.BMLX === 1 ? '缴费即报名' : '免费'}</>
              )}
            </p>
            <p className={styles.text}>费用：{formValues?.FY}元</p>
            {formValues?.KHKCJCs.length ? (
              <>
                <Divider orientation="left">教辅教材</Divider>
                {formValues?.KHKCJCs.map((value: any) => {
                  return (
                    <div className={styles.box}>
                      <p>{value?.JCMC}</p>
                      <p>{value?.JCFY}元</p>
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <>
            <Steps current={Current}>
              <Step key="班级基本设置" title="班级基本设置" />
              <Step key="报名设置" title="报名设置" />
              <Step key="缴费设置" title="缴费设置" />
              {BMLX === false ? <Step key="教辅教材" title="教辅教材" /> : <></>}
            </Steps>
            {Current === 0 ? (
              <div className={styles.wrap}>
                <ProFormFields
                  onFinish={onFinish}
                  setForm={setForm}
                  formItems={formItems}
                  formItemLayout={formLayout}
                  values={
                    BJData || {
                      BJZT: '未开班',
                    }
                  }
                />
              </div>
            ) : (
              <></>
            )}
            {Current === 1 ? (
              <div className={styles.wraps}>
                {SYNJ ? (
                  <p>
                    (默认招生范围)：
                    {SYNJ?.map((value: any) => {
                      return (
                        <span style={{ marginRight: 5 }}>
                          {value?.XD}
                          {value?.NJMC}
                        </span>
                      );
                    })}
                  </p>
                ) : (
                  <></>
                )}
                <ProFormFields
                  onFinish={onFinish}
                  setForm={setForm}
                  formItems={BMformItems}
                  formItemLayout={formLayout}
                  values={
                    BMData || {
                      BJZT: '未开班',
                    }
                  }
                />
              </div>
            ) : (
              <></>
            )}
            {Current === 2 ? (
              <div className={styles.wraps}>
                <ProFormFields
                  onFinish={onFinish}
                  setForm={setForm}
                  formItems={JFformItems}
                  formItemLayout={formLayout}
                  values={
                    JFData || {
                      BJZT: '未开班',
                    }
                  }
                />
              </div>
            ) : (
              <></>
            )}
            {Current === 3 ? (
              <div className={styles.wrap3}>
                <ProFormFields
                  onFinish={onFinish}
                  setForm={setForm}
                  formItems={JCformItems}
                  formItemLayout={formLayout}
                  values={
                    formValues || {
                      BJZT: '未开班',
                    }
                  }
                />
                {choosenJf === false ? (
                  <div className={styles.noJF}>
                    <img src={noJF} alt="" />
                    <p>该课程暂无教辅</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}

            <div className={styles.stepsAction}>
              <div className="steps-action">
                {Current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    上一步
                  </Button>
                )}
                <Button type="primary" onClick={() => next()} style={{ width: 72 }}>
                  {BMLX === false ? (
                    <> {Current < 3 ? '下一步' : '提交'}</>
                  ) : (
                    <> {Current < 2 ? '下一步' : '提交'}</>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
export default AddCourseClass;
