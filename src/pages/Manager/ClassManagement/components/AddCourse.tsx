/* eslint-disable no-nested-ternary */
import { Button, message, Modal, Select, Input, Tooltip } from 'antd';
import type { FC } from 'react';
import styles from './AddCourse.less';
import { useEffect, useState } from 'react';
import ProFormFields from '@/components/ProFormFields';
import TeacherSelect from '@/components/TeacherSelect';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import { getAllXQSJ, getXQSJ } from '@/services/after-class/xqsj';
import { createKHBJSJ, updateKHBJSJ } from '@/services/after-class/khbjsj';
import ShowName from '@/components/ShowName';
import { getAllFJSJ } from '@/services/after-class/fjsj';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { getSchoolClasses } from '@/services/after-class/bjsj';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
};
const { Option } = Select;
const { TextArea } = Input;
const AddServiceClass: FC<AddCourseProps> = ({
  visible,
  setVisible,
  formValues,
  curXNXQId,
  KHKCAllData,
  currentUser,
  CopyType,
  getData,
  BjLists,
  names,
}) => {
  const [form, setForm] = useState<any>();
  const [Current, setBmCurrent] = useState(0);
  const [KCDate, setKCDate] = useState<any>([]);
  const [KCLXData, setKCLXData] = useState<any[]>([]);
  const [KCLXMC, setKCLXMC] = useState<string>();
  const [isJg, setIsJg] = useState<boolean>(false);
  const [kcId, setKcId] = useState<string | undefined>(undefined);
  const [BJData, setBJData] = useState<any>();
  const [XQMC, setXQMC] = useState<string>();
  // ????????????
  const [TeacherType, setTeacherType] = useState<boolean>(false);
  // ????????????
  const [PKType, setPKType] = useState<boolean>(false);
  // ??????
  const [campus, setCampus] = useState<any>([]);
  const [campusId, setCampusId] = useState<string>();
  // ????????????
  const [KKData, setKKData] = useState<any>();
  // ????????????
  const [FJData, setFJData] = useState<any>();
  // ??????Id
  const [FJSJIds, setFJSJIds] = useState<any>();
  const [classData, setClassData] = useState<any[]>();
  // ??????????????????
  const [Range, setRange] = useState<any>([]);
  const [FbValues, setFbValues] = useState<string[]>([]);

  const formLayout = {
    labelCol: { flex: '7em' },
    wrapperCol: {},
  };

  /**
   * ????????????????????????
   */
  const getKCLXData = async () => {
    const res = await getAllKHKCLX({});
    if (res.status === 'ok') {
      const KCLXItem: any = res.data?.map((item: any) => ({
        value: item.KCTAG,
        label: item.KCTAG,
      }));
      setKCLXData(KCLXItem);
    }
  };

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

  // ??????????????????
  useEffect(() => {
    (async () => {
      const res = await getAllFJSJ({
        XXJBSJId: currentUser?.xxId,
      });
      if (res.status === 'ok') {
        setFJData(res.data?.rows);
      }
    })();
    // ??????????????????
    getKCLXData();
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

  useEffect(() => {
    if (formValues) {
      setIsJg(BjLists?.SSJGLX === '????????????');
      // if(BmLists?.XzClassMC?.length){
      //   setClassData(BmLists.XzClassMC)
      // }

      // ???????????????
      setFJSJIds(BjLists?.CDMCId);
      setKcId(BjLists?.KHKCSJId);
      setCampusId(BjLists.XQSJId);
      if (BjLists?.ZJS) {
        setTeacherType(true);
      } else {
        setTeacherType(false);
      }
      if (BjLists?.ISZB === 1) {
        setPKType(true);
      } else {
        setPKType(false);
      }

      if (BjLists?.KCLX) {
        setKCLXMC(BjLists.KCLX);
      }
      setBJData(BjLists);
    }
    if (formValues && names === 'chakan') {
      (async () => {
        const res = await getXQSJ({
          id: formValues?.XQSJId,
        });
        if (res.status === 'ok') {
          setXQMC(res?.data?.XQMC);
        }
      })();
    }
  }, [formValues]);
  // ?????????????????????????????????
  const getBJData = async () => {
    if (kcId && campusId) {
      const res = await getKHKCSJ({
        kcId,
        // XXJBSJId:currentUser?.xxId,
        // XNXQId: curXNXQId,
      });
      if (res?.status === 'ok') {
        const newArrs: any = [];
        const newArr: any = [];
        res.data?.NJSJs.forEach((value: any) => {
          newArr.push(value.id);
          newArrs.push(value?.NJMC);
        });
        setRange(newArrs.toString().replaceAll(',', '???'));
        const result = await getSchoolClasses({
          XXJBSJId: currentUser?.xxId,
          XNXQId: curXNXQId,
          njId: newArr,
          XQSJId: campusId,
        });
        if (result.status === 'ok') {
          setClassData(result.data.rows);
        }
      }
    }
  };

  useEffect(() => {
    if (kcId && campusId) {
      getBJData();
    }
  }, [KCLXMC, kcId, campusId]);

  const onFinish = async (values: any) => {
    if (Current === 0) {
      const { ZJS, FJS, BJIds, ...info } = values;
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
      let newData: any = {};
      if (FJSJIds) {
        newData = {
          ...info,
          BJIds,
          KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          BJZT: '?????????',
          ISFW: 1,
          ISZB: PKType === false ? 0 : 1,
          BJRS: PKType === false ? null : values?.BJRS,
          FJSJId: FJSJIds,
          XNXQId: curXNXQId,
        };
      } else {
        newData = {
          ...info,
          BJIds,
          KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          BJZT: '?????????',
          ISFW: 1,
          ISZB: PKType === false ? 0 : 1,
          BJRS: PKType === false ? null : values?.BJRS,
          XNXQId: curXNXQId,
          FJSJId: null,
        };
      }
      let res: any;
      if (formValues && CopyType === 'undefined') {
        // ??????
        if (PKType === false) {
          const { KCMC } = KCDate?.find((value: any) => value?.id === values?.KHKCSJId);
          let BJMC: any;
          if (Array.isArray(values?.BJIds)) {
            BJMC = classData?.find((value: any) => value?.id === values?.BJIds[0]);
          } else {
            BJMC = classData?.find((value: any) => value?.id === values?.BJIds);
          }
          newData.BJMC = `${KCMC}${BJMC?.NJSJ?.NJMC}${BJMC?.BJ}`;
        }
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
    if (visible) {
      if (campus?.length) {
        let id = campus?.find((item: any) => item.label === '??????')?.value;
        if (!id) {
          id = campus[0].value;
        }
        setCampusId(id);
        setBJData({
          SSJGLX: '????????????',
          XQSJId: id,
        });
      }
    }

    if (visible === false && form) {
      setBmCurrent(0);
      form.resetFields();
      setTeacherType(false);
      setPKType(false);
      setIsJg(false);
      const kcDate = KHKCAllData?.filter((item: any) => item.SSJGLX === '????????????');
      setKCDate(kcDate);
    }
  }, [visible]);

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

  const formItems: any[] = [
    {
      type: 'group',
      key: 'group0',
      groupItems: [
        {
          type: 'select',
          label: '???????????????',
          name: 'KCLX',
          key: 'KCLX',
          fieldProps: {
            options: KCLXData,
            onChange: (value: string) => {
              setKCLXMC(value);

              if (value === '????????????') {
                setIsJg(false);
                setPKType(false);
                form?.setFieldsValue({
                  SSJGLX: '????????????',
                });
              }
              setClassData([]);
              form?.setFieldsValue({
                KHKCSJId: undefined,
                ZJS: undefined,
                BJIds: undefined,
              });
              setFbValues([]);
              setKcId(undefined);
            },
          },
          rules: [{ required: true, message: '?????????????????????' }],
        },
        {
          type: 'radio',
          label: '???????????????',
          name: 'SSJGLX',
          key: 'SSJGLX',
          fieldProps: {
            disabled: KCLXMC === '????????????',
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
              setIsJg(value === '????????????');
            },
          },
          rules: [{ required: true, message: '?????????????????????' }],
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
          rules: [{ required: true, message: '???????????????' }],
          fieldProps: {
            options: KCDate.map((item: any) => {
              return { label: item.KCMC, value: item.id };
            }),
            onChange: (values: any) => {
              // if (isJg) {
              setKcId(values);
              // setClassData([]);
              // }
              form?.setFieldsValue({
                BJIds: undefined,
                ZJS: undefined,
              });
              setFbValues([]);
            },
          },
        },
        {
          type: 'select',
          name: 'XQSJId',
          key: 'XQSJId',
          label: '???????????????',
          rules: [{ required: true, message: '?????????????????????' }],
          fieldProps: {
            options: campus,
            onChange: (value: any) => {
              // setClassData([]);
              setCampusId(value);
            },
          },
        },
      ],
    },
    {
      type: 'group',
      key: 'group9',
      groupItems: [
        {
          type: 'inputNumber',
          label: '???????????????',
          name: 'KSS',
          key: 'KSS',
          rules: [
            { required: true, message: '?????????????????????' },
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
        {},
      ],
    },
    {
      type: 'group',
      key: 'group6',
      groupItems: [
        {
          type: 'div',
          key: 'div1',
          label: (
            <span style={{ marginLeft: 11 }}>
              ????????????{' '}
              <Tooltip
                overlayClassName={styles?.tooltips1}
                title="???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
              >
                <QuestionCircleOutlined />
              </Tooltip>
              ???
            </span>
          ),
          lineItem: [
            {
              type: 'switch',
              fieldProps: {
                disabled: KCLXMC === '????????????',
                onChange: (item: any) => {
                  form?.setFieldsValue({
                    BJIds: undefined,
                  });
                  if (item) {
                    form?.setFieldsValue({ BJRS: undefined, BJMC: undefined });
                    return setPKType(true);
                  }
                  return setPKType(false);
                },
                checked: PKType,
              },
            },
          ],
        },
        PKType === false
          ? {
              type: 'divTab',
              text: `????????????????????????????????????????????????????????????????????????`,
              style: { marginBottom: 8, marginLeft: '-185px', color: '#2E83EC' },
            }
          : {
              type: 'inputNumber',
              label: '???????????????',
              name: 'BJRS',
              key: 'BJRS',
              rules: [
                { required: true, message: '????????????????????????' },
                {
                  message: '?????????????????????????????????????????????????????????',
                  pattern: /^([1-9]\d{0,3}|0)?$/,
                },
              ],
            },
      ],
    },
    PKType === true && kcId
      ? {
          type: 'divTab',
          text: `(??????????????????)???${Range}`,
          style: { marginBottom: 8, color: '#bbbbbb' },
        }
      : '',
    {
      type: 'reactnode',
      label: '??????????????????',
      name: 'BJIds',
      key: 'BJIds',
      rules: [{ required: true, message: '????????????????????????' }],
      children: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="????????????????????????"
          defaultValue={formValues?.BJIds}
          // onChange={handleChange}
        >
          {classData?.map((item: any) => {
            return <Option value={item.id}>{`${item.NJSJ.XD}${item.NJSJ.NJMC}${item.BJ}`}</Option>;
          })}
        </Select>
      ),
    },
    PKType === true
      ? {
          type: 'group',
          key: 'group7',
          groupItems: [
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
        }
      : '',
    {
      type: 'div',
      key: 'div1',
      label: (
        <span style={{ marginLeft: 11 }}>
          ????????????{' '}
          <Tooltip
            overlayClassName={styles?.tooltips2}
            title="???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      "
          >
            <QuestionCircleOutlined />
          </Tooltip>
          ???
        </span>
      ),
      lineItem: [
        {
          type: 'switch',
          fieldProps: {
            onChange: (item: any) => {
              if (item) {
                form?.setFieldsValue({ ZJS: undefined });
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
    {
      type: 'textArea',
      label: '?????????',
      name: 'BJMS',
      key: 'BJMS',
      placeholder: '?????????',
      children: <TextArea showCount maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} />,
    },
  ];

  // ?????? KCData
  useEffect(() => {
    if (KHKCAllData?.length) {
      const kcDate = KHKCAllData?.filter((item: any) => {
        if (isJg) {
          if (KCLXMC) {
            return item.SSJGLX === '????????????' && item.KHKCLX.KCTAG === KCLXMC;
          }
          return item.SSJGLX === '????????????';
        }
        if (KCLXMC) {
          return item.SSJGLX === '????????????' && item.KHKCLX.KCTAG === KCLXMC;
        }
        return item.SSJGLX === '????????????';
      });
      setKCDate(kcDate);
    }
  }, [KHKCAllData, isJg, KCLXMC]);

  return (
    <>
      <Modal
        title={getTitle()}
        visible={visible}
        className={styles.AddServiceClass}
        destroyOnClose
        onCancel={() => {
          setVisible(false);
          setTeacherType(false);
          setClassData([]);
          setKCLXMC('');
        }}
        width={formValues && names === 'chakan' ? 700 : 800}
        footer={
          formValues && names === 'chakan'
            ? null
            : [
                <Button
                  key="baocun"
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                >
                  ??????
                </Button>,
                <Button
                  key="cancel"
                  onClick={() => {
                    setVisible(false);
                    setTeacherType(false);
                    setClassData([]);
                    setKCLXMC('');
                  }}
                >
                  ??????
                </Button>,
              ]
        }
        maskClosable={false}
      >
        {formValues && names === 'chakan' ? (
          <div className={styles.see}>
            <div className={styles.box}>
              <p>???????????????{formValues?.KHKCSJ?.KHKCLX?.KCTAG}</p>
              <p>???????????????{formValues?.KHKCSJ?.SSJGLX}</p>
            </div>
            <div className={styles.box}>
              <p>???????????????{formValues?.KHKCSJ?.KCMC}</p>
              <p>???????????????{XQMC || '??????'} </p>
            </div>
            <div className={styles.box}>
              <p>???????????????{formValues?.KSS}</p>
            </div>
            <div className={styles.box}>
              <p>???????????????{formValues?.ISZB === 0 ? '???' : '???'}</p>
              {formValues?.BJRS ? <p>???????????????{formValues?.BJRS}</p> : <></>}
            </div>
            <p style={{ paddingRight: 60 }}>
              ??????????????????
              {formValues?.BJSJs?.length !== 0 ? (
                <>
                  {formValues?.BJSJs?.map((value: any, index: number) => {
                    if (index === formValues?.BJSJs?.length - 1) {
                      return (
                        <span>
                          {' '}
                          {value?.NJSJ?.XD}
                          {value?.NJSJ?.NJMC}
                          {value?.BJ}
                        </span>
                      );
                    }
                    return (
                      <span>
                        {' '}
                        {value?.NJSJ?.XD}
                        {value?.NJSJ?.NJMC}
                        {value?.BJ}???
                      </span>
                    );
                  })}
                </>
              ) : (
                '???'
              )}{' '}
            </p>
            <div className={styles.box}>
              <p>???????????????{formValues?.BJMC}</p>
              <p>
                ???????????????{formValues?.FJSJ?.FJMC || formValues?.KHPKSJs?.[0]?.FJSJ?.FJMC || '???'}
              </p>
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
            <p className={styles.text}>???????????????{formValues?.BJMS}</p>
          </div>
        ) : (
          <div className={styles.wrap}>
            <ProFormFields
              onFinish={onFinish}
              setForm={setForm}
              formItems={formItems}
              formItemLayout={formLayout}
              values={
                BJData || {
                  BJZT: '?????????',
                  XQSJId: campusId,
                }
              }
            />
          </div>
        )}
      </Modal>
    </>
  );
};
export default AddServiceClass;
