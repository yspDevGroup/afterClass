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
import { queryXNXQList } from '@/services/local-services/xnxq';

type AddCourseProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  formValues?: Record<string, any>;
  mcData?: { label: string; value: string }[];
  names?: string;
  KHKCAllData?: any[];
  curXNXQId?: string;
  currentUser?: CurrentUser | undefined;
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
  // ????????????????????????
  const [ClassData, setClassData] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  // ??????????????????
  const [choosenJf, setChoosenJf] = useState<boolean>(false);
  // ???????????????
  const [XzClass, setXzClass] = useState<any>([]);
  const [XzClassMC, setXzClassMC] = useState<any>([]);
  // ????????????
  const [TeacherType, setTeacherType] = useState<any>([]);
  // ??????????????????
  const [SYNJ, setSYNJ] = useState<any>([]);
  // ??????
  const [campus, setCampus] = useState<any>([]);
  // ????????????
  const [KKData, setKKData] = useState<any>();
  // ????????????Id
  const [XQSJIds, setXQSJIds] = useState();
  // ????????????
  const [FJData, setFJData] = useState<any>();
  // ??????Id
  const [FJSJIds, setFJSJIds] = useState<any>();
  // ??????????????????
  const [XNXQTime, setXNXQTime] = useState<any>();
  const [FbValues, setFbValues] = useState<string[]>([]);

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
      setIsJg(BjLists?.SSJGLX === '????????????');
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
  // ??????????????????
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
  // ?????????????????????????????????
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
  // ??????????????????
  useEffect(() => {
    (async () => {
      const res = await getAllFJSJ({
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok') {
        setFJData(res.data?.rows);
      }
      const result = await queryXNXQList(currentUser?.xxId);
      setXNXQTime(result?.current);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        // ??????????????????
        const resSJ = await getAllXXSJPZ({
          XNXQId: curXNXQId,
          XXJBSJId: currentUser?.xxId,
          type: ['2'],
        });

        if (resSJ.status === 'ok') {
          // ???????????? [2]
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
              JSLX: '?????????',
              JZGJBSJId: ZJS,
              KHBJSJId: formValues?.id,
            },
          ];
          FTeacher =
            FJS && FJS?.length
              ? FJS.map((item: any) => {
                  return {
                    JSLX: '?????????',
                    JZGJBSJId: item,
                    KHBJSJId: formValues?.id,
                  };
                })
              : undefined;
        } else {
          ZTeacher = [
            {
              JSLX: '?????????',
              JZGJBSJId: ZJS,
            },
          ];
          FTeacher =
            FJS && FJS?.length
              ? FJS.map((item: any) => {
                  return {
                    JSLX: '?????????',
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
          BJZT: '?????????',
          ISFW: 0,
          FY: values?.BMLX === 2 ? 0 : values?.BMLX,
          XNXQId: curXNXQId,
        };
        let res: any;
        if (formValues && CopyType === 'undefined') {
          // ??????
          res = await updateKHBJSJ({ id: formValues.id }, newData);
        } else if (formValues && CopyType === 'copy') {
          // ??????
          res = await createKHBJSJ(newData);
        } else {
          // ??????
          res = await createKHBJSJ(newData);
        }
        if (res.status === 'ok') {
          message.success('????????????');
          getData();
          setVisible(false);
        } else {
          message.error('????????????????????????????????????????????????');
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
            JSLX: '?????????',
            JZGJBSJId: ZJS,
            KHBJSJId: formValues?.id,
          },
        ];
        FTeacher =
          FJS && FJS?.length
            ? FJS.map((item: any) => {
                return {
                  JSLX: '?????????',
                  JZGJBSJId: item,
                  KHBJSJId: formValues?.id,
                };
              })
            : undefined;
      } else {
        ZTeacher = [
          {
            JSLX: '?????????',
            JZGJBSJId: ZJS,
          },
        ];
        FTeacher =
          FJS && FJS?.length
            ? FJS.map((item: any) => {
                return {
                  JSLX: '?????????',
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
        BJZT: '?????????',
        XNXQId: curXNXQId,
      };
      let res: any;
      if (formValues && CopyType === 'undefined') {
        // ??????
        res = await updateKHBJSJ({ id: formValues.id }, newData);
      } else if (formValues && CopyType === 'copy') {
        // ??????
        res = await createKHBJSJ(newData);
      } else {
        // ??????
        res = await createKHBJSJ(newData);
      }
      if (res.status === 'ok') {
        message.success('????????????');
        getData();
        setVisible(false);
      } else {
        message.error('????????????????????????????????????????????????');
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
    const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '????????????');
    setKCDate(kcDate);
    setTeacherType(true);
  }, [KHKCAllData]);
  useEffect(() => {
    setBJData({
      SSJGLX: '????????????',
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
      setIsJg(false);
      setFbValues([]);
      const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '????????????');
      setKCDate(kcDate);
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
      return '????????????';
    }
    if (formValues && names === 'copy') {
      return '????????????';
    }
    if (formValues) {
      return '????????????';
    }

    return '????????????';
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
      title: '??????',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      align: 'center',
    },
    {
      title: '??????',
      key: 'JCMC',
      dataIndex: 'JCMC',
      align: 'center',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },
    {
      title: '??????',
      dataIndex: 'JCFY',
      width: 80,
      align: 'center',
      renderFormItem: () => <InputNumber min={0} max={999} />,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },
    {
      title: '??????',
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
          ??????
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
          ??????
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
          label: '???????????????',
          name: 'SSJGLX',
          key: 'SSJGLX',
          fieldProps: {
            options: [
              { value: '????????????', label: '????????????' },
              { value: '????????????', label: '????????????' },
            ],
            // ??????????????????????????????
            onChange: (values: any) => {
              // ??????????????????????????????????????????????????????????????????
              form.setFieldsValue({
                KHKCSJId: undefined,
                ZJS: undefined,
              });
              setFbValues([]);
              const { value } = values.target;
              let kcDate: any;
              if (value === '????????????') {
                kcDate = KHKCAllData?.filter(
                  (item: any) => item.SSJGLX === '????????????' && item.KHKCSQs?.[0].ZT === 1,
                );
              } else {
                kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '????????????');
              }
              setKCDate(kcDate);
              setIsJg(value === '????????????');
            },
          },
          rules: [{ required: true, message: '?????????????????????' }],
        },
        {
          type: 'select',
          name: 'XQSJId',
          key: 'XQSJId',
          label: '???????????????',
          rules: [{ required: true, message: '?????????????????????' }],
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
          label: '???????????????',
          name: 'KHKCSJId',
          key: 'KHKCSJId',
          rules: [{ required: true, message: '?????????????????????' }],
          fieldProps: {
            options: KCDate.map((item: any) => {
              return { label: item.KCMC, value: item.id };
            }),
            onChange: (values: any) => {
              if (isJg) {
                setKcId(values);
              }
              form.setFieldsValue({ ZJS: undefined });
              setFbValues([]);
            },
          },
        },
        {
          type: 'input',
          label: '????????????',
          name: 'BJMC',
          key: 'BJMC',
          rules: [
            { required: true, message: '????????????????????????' },
            { max: 18, message: '????????? 18 ???' },
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
          label: '???????????????',
          name: 'KSS',
          key: 'KSS',
          rules: [
            { required: true, message: '??????????????????' },
            {
              pattern: new RegExp('^[0-9]*[1-9][0-9]*$'),
              message: '???????????????????????????',
            },
          ],
          fieldProps: {
            min: 0,
            max: 100,
          },
        },
        {
          type: 'reactnode',
          label: '???????????????',
          name: 'CDMC',
          key: 'CDMC',
          // rules: [{ required: TeacherType, message: '?????????????????????' }],
          children: (
            <Select
              showSearch
              allowClear
              placeholder="?????????"
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
      label: `???????????????`,
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                form.setFieldsValue({ ZJS: undefined });
                setFbValues([]);
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
      label: '?????????',
      name: 'ZJS',
      key: 'ZJS',
      hidden: !TeacherType,
      rules: [{ required: TeacherType, message: '?????????????????????' }],
      children: (
        <TeacherSelect
          // value={ }
          // isjg true ??????????????? ??????????????? 1 ??????????????? 2???????????????
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
      label: '?????????(??????)',
      name: 'FJS',
      key: 'FJS',
      hidden: !TeacherType,
      children: (
        <TeacherSelect
          value={FbValues}
          type={isJg ? 3 : 1}
          multiple={true}
          xxId={currentUser?.xxId}
          kcId={isJg ? kcId : undefined}
          onChange={(value: any) => {
            if (value?.length <= 3) {
              setFbValues(value);
              return value;
            }
            return '';
          }}
        />
      ),
    },
    KKData?.id
      ? {
          type: 'divTab',
          text: `(?????????????????????)???${KKData?.KSSJ} ??? ${KKData?.JSSJ}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'div',
      key: 'div1',
      label: `???????????????????????????`,
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                return setKaike(true);
              }
              // ???????????????????????? ?????????????????????
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
      label: '????????????:',
      name: 'SKSD',
      key: 'SKSD',
      width: '100%',
      hidden: !kaike,
      rules: [{ required: kaike, message: '?????????????????????' }],
      fieldProps: {
        disabledDate: (current: any) => {
          const defaults = moment(current).format('YYYY-MM-DD HH:mm:ss');
          return (
            defaults < moment(XNXQTime?.KSRQ).format('YYYY-MM-DD 00:00:00') ||
            defaults > moment(XNXQTime?.JSRQ).format('YYYY-MM-DD 23:59:59')
          );
        },
      },
    },
    {
      type: 'textArea',
      label: '?????????',
      name: 'BJMS',
      key: 'BJMS',
      placeholder: '?????????',
      children: <TextArea showCount maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} />,
    },
  ];
  const BMformItems: any[] = [
    {
      type: 'div',
      key: 'div1',
      label: `??????????????????`,
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
      label: '??????????????????',
      name: 'XzClassMC',
      key: 'XzClassMC',
      hidden: !xzb,
      rules: [{ required: xzb, message: '????????????????????????' }],
      children: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="????????????????????????"
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
      label: '??????????????????',
      name: 'BJRS',
      key: 'BJRS',
      rules: [
        { required: true, message: '????????????????????????' },
        { message: '?????????????????????????????????????????????????????????', pattern: /^([1-9]\d{0,3}|0)?$/ },
      ],
    },
  ];
  const JFformItems: any[] = [
    {
      type: 'radio',
      label: '???????????????',
      name: 'BMLX',
      key: 'BMLX',
      fieldProps: {
        options: [
          { value: 1, label: '???????????????' },
          { value: 0, label: '??????????????????' },
          { value: 2, label: '??????' },
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
      rules: [{ required: true, message: '?????????????????????' }],
    },
    {
      type: 'inputNumber',
      label: '?????????',
      name: 'FY',
      key: 'FY',
      hidden: BMLX,
      readonly: BMLX,
      rules: !BMLX
        ? [
            { required: true, message: '???????????????' },
            {
              message: '???????????????0??????????????????2?????????',
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
      label: '??????',
      name: 'KHKCJC',
      key: 'KHKCJC',
      value: choosenJf ? 'kcjc' : '',
      valueEnum: {
        kcjc: { text: '????????????' },
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
          text: '????????????',
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
            <Divider orientation="left">??????????????????</Divider>
            <div className={styles.box}>
              <p>???????????????{formValues?.KHKCSJ?.SSJGLX}</p>
              <p>???????????????{XQMC || '??????'} </p>
            </div>
            <div className={styles.box}>
              <p>???????????????{formValues?.KHKCSJ?.KCMC}</p>
              <p>???????????????{formValues?.BJMC}</p>
            </div>
            <div className={styles.box}>
              <p>
                ?????????
                {formValues?.ZJS ? (
                  <ShowName
                    type="userName"
                    openid={formValues?.ZJS?.WechatUserId}
                    XM={formValues?.ZJS?.XM}
                  />
                ) : (
                  <>???</>
                )}
              </p>
              <p>
                ?????????
                {formValues?.FJS.length !== 0 ? (
                  <>
                    {formValues?.KHBJJs.map((value: any) => {
                      if (value.JSLX === '?????????') {
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
                  <>???</>
                )}
              </p>
            </div>
            <div className={styles.box}>
              <p>???????????????{formValues?.KSS}</p>
              <p>
                ???????????????{formValues?.FJSJ?.FJMC || formValues?.KHPKSJs?.[0]?.FJSJ?.FJMC || '???'}
              </p>
            </div>
            <div className={styles.box}>
              <p>
                ???????????????{moment(formValues?.KKRQ).format('YYYY-MM-DD')} ~{' '}
                {moment(formValues?.JKRQ).format('YYYY-MM-DD')}
              </p>
            </div>
            <p className={styles.text}>???????????????{formValues?.BJMS}</p>
            <Divider orientation="left">????????????</Divider>
            {formValues?.BJLX === 1 ? (
              <p className={styles.text}>
                ??????????????????
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
                ???????????????
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
            <p className={styles.text}>??????????????????{formValues?.BJRS}</p>
            <Divider orientation="left">????????????</Divider>
            <p className={styles.text}>
              ???????????????
              {formValues?.BMLX === 0 ? (
                '??????????????????'
              ) : (
                <>{formValues?.BMLX === 1 ? '???????????????' : '??????'}</>
              )}
            </p>
            <p className={styles.text}>?????????{formValues?.FY}???</p>
            {formValues?.KHKCJCs.length ? (
              <>
                <Divider orientation="left">????????????</Divider>
                {formValues?.KHKCJCs.map((value: any) => {
                  return (
                    <div className={styles.box}>
                      <p>{value?.JCMC}</p>
                      <p>{value?.JCFY}???</p>
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
              <Step key="??????????????????" title="??????????????????" />
              <Step key="????????????" title="????????????" />
              <Step key="????????????" title="????????????" />
              {BMLX === false ? <Step key="????????????" title="????????????" /> : <></>}
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
                      BJZT: '?????????',
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
                    (??????????????????)???
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
                      BJZT: '?????????',
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
                      BJZT: '?????????',
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
                      BJZT: '?????????',
                    }
                  }
                />
                {choosenJf === false ? (
                  <div className={styles.noJF}>
                    <img src={noJF} alt="" />
                    <p>?????????????????????</p>
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
                    ?????????
                  </Button>
                )}
                <Button type="primary" onClick={() => next()} style={{ width: 72 }}>
                  {BMLX === false ? (
                    <> {Current < 3 ? '?????????' : '??????'}</>
                  ) : (
                    <> {Current < 2 ? '?????????' : '??????'}</>
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
