import { Button, Divider, message, Modal, Select, Input } from 'antd';
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
  BmLists,
  JfLists,
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
  // 指定教师
  const [TeacherType, setTeacherType] = useState<boolean>(false);
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [campusId, setCampusId] = useState<string>();
  // 开课时间
  const [KKData, setKKData] = useState<any>();
  // 场地信息
  const [FJData, setFJData] = useState<any>();
  // 场地Id
  const [FJSJIds, setFJSJIds] = useState<any>();
  const [classData, setClassData] = useState<any[]>();

  const formLayout = {
    labelCol: { flex: '7em' },
    wrapperCol: {},
  };

  /**
   * 获取课程类型数据
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
    // 获取课程类型
    getKCLXData();
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
          // 上课时间 [2]
          const KK = resSJ.data?.find((item: any) => item.TYPE === '2');
          setKKData(KK);
        }
      }
    })();
  }, [curXNXQId]);

  useEffect(() => {
    if (formValues) {
      setIsJg(BjLists?.SSJGLX === '机构课程');
      // if(BmLists?.XzClassMC?.length){
      //   setClassData(BmLists.XzClassMC)
      // }

      // 设置默认值
      setFJSJIds(BjLists?.CDMCId);
      setKcId(BjLists?.KHKCSJId);
      setCampusId(BjLists.XQSJId);
      if (BjLists?.ZJS) {
        setTeacherType(true);
      } else {
        setTeacherType(false);
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

  // 获取课程适用年级和班级
  const getBJData = async () => {
    if (kcId && campusId) {
      const res = await getKHKCSJ({
        kcId,
        // XXJBSJId:currentUser?.xxId,
        // XNXQId: curXNXQId,
      });
      if (res?.status === 'ok') {
        const newArr: any = [];
        res.data?.NJSJs.forEach((value: any) => {
          newArr.push(value.id);
        });
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
    if (KCLXMC === '校内辅导' && kcId && campusId) {
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
      let newData: any = {};
      if (FJSJIds) {
        newData = {
          ...info,
          BJIds: BJIds ? [BJIds] : undefined,
          // eslint-disable-next-line no-nested-ternary
          KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          BJZT: '未开班',
          ISFW: 1,
          FJSJId: FJSJIds,
          XNXQId: curXNXQId,
        };
      } else {
        newData = {
          ...info,
          BJIds: BJIds ? [BJIds] : undefined,
          // eslint-disable-next-line no-nested-ternary
          KHBJJSs: TeacherType ? (FTeacher ? [...ZTeacher, ...FTeacher] : [...ZTeacher]) : [],
          KKRQ: values?.SKSD ? values?.SKSD[0] : KKData?.KSSJ,
          JKRQ: values?.SKSD ? values?.SKSD[1] : KKData?.JSSJ,
          BJZT: '未开班',
          ISFW: 1,
          XNXQId: curXNXQId,
          FJSJId: null,
        };
      }
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
    if (visible) {
      if (campus?.length) {
        let id = campus?.find((item: any) => item.label === '本校')?.value;
        if (!id) {
          id = campus[0].value;
        }
        setCampusId(id);
        setBJData({
          SSJGLX: '校内课程',
          XQSJId: id,
        });
      }
    }

    if (visible === false && form) {
      setBmCurrent(0);
      form.resetFields();
      setTeacherType(false);
    }
  }, [visible]);

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

  const formItems: any[] = [
    {
      type: 'group',
      key: 'group0',
      groupItems: [
        {
          type: 'select',
          label: '课程类型：',
          name: 'KCLX',
          key: 'KCLX',
          fieldProps: {
            options: KCLXData,
            onChange: (value: string) => {
              setKCLXMC(value);

              if (value === '校内辅导') {
                setIsJg(false);
                form?.setFieldsValue({
                  SSJGLX: '校内课程',
                });
              }
              // setClassData([]);
              form?.setFieldsValue({
                KHKCSJId: undefined,
                ZJS: undefined,
                FJS: undefined,
                BJIds: undefined,
              });
            },
          },
          rules: [{ required: true, message: '请选择课程类型' }],
        },
        {
          type: 'radio',
          label: '课程来源：',
          name: 'SSJGLX',
          key: 'SSJGLX',
          fieldProps: {
            disabled: KCLXMC === '校内辅导',
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

              // let kcData: any;
              // if (value === '机构课程') {
              //   kcData = KHKCAllData?.filter((item: any) => item.SSJGLX === '机构课程' && item.KHKCSQs?.[0].ZT === 1);
              // } else {
              //   kcData = KHKCAllData?.filter((item: any) => item.SSJGLX === '校内课程');
              // }
              // // if(KCLXMC){
              // //  kcData= kcData.filter((item: any)=>{
              // //     return item?.KHKCLX?.KCTAG===KCLXMC
              // //   })
              // // }
              // setKCDate(kcData);
              setIsJg(value === '机构课程');
            },
          },
          rules: [{ required: true, message: '请选择课程来源' }],
        },
      ],
    },
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'select',
          label: '选择课程：',
          name: 'KHKCSJId',
          key: 'KHKCSJId',
          rules: [{ required: true, message: '请选择课程' }],
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
                // KHKCSJId: undefined,
                // ZJS: undefined,
                // FJS: undefined,
                BJIds: undefined,
              });
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
          type: 'select',
          name: 'XQSJId',
          key: 'XQSJId',
          label: '所属校区：',
          rules: [{ required: true, message: '请填写所属校区' }],
          fieldProps: {
            options: campus,
            onChange: (value: any) => {
              // setClassData([]);
              setCampusId(value);
            },
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
                form?.setFieldsValue({ ZJS: undefined, FJS: undefined });
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
    {
      type: 'select',
      label: '适用行政班：',
      name: 'BJIds',
      key: 'BJIds',
      placeholder: '请选择适用行政班：',
      hidden: KCLXMC != '校内辅导',
      rules: [{ required: KCLXMC === '校内辅导', message: '请选择适用行政班：' }],
      fieldProps: {
        options: classData?.map((item: any) => {
          return {
            value: item.id,
            label: `${item.NJSJ.XD}${item.NJSJ.NJMC}${item.BJ}`,
          };
        }),
      },
    },
    {
      type: 'textArea',
      label: '简介：',
      rules: [{ required: true, message: '请输入班级课程安排' }],
      name: 'BJMS',
      key: 'BJMS',
      placeholder: '请输入班级课程安排',
      children: <TextArea showCount maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} />,
    },
  ];

  // 修改 KCData
  useEffect(() => {
    if (KHKCAllData?.length) {
      const kcDate = KHKCAllData?.filter((item: any) => {
        if (isJg) {
          if (KCLXMC) {
            return item.SSJGLX === '机构课程' && item.KHKCLX.KCTAG === KCLXMC;
          }
          return item.SSJGLX === '机构课程';
        } else {
          if (KCLXMC) {
            return item.SSJGLX === '校内课程' && item.KHKCLX.KCTAG === KCLXMC;
          }
          return item.SSJGLX === '校内课程';
        }
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
        width={formValues && names === 'chakan' ? 450 : 800}
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
                  保存
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
                  取消
                </Button>,
              ]
        }
        maskClosable={false}
      >
        {formValues && names === 'chakan' ? (
          <div className={styles.see}>
            <p>课程来源：{formValues?.KHKCSJ?.SSJGLX}</p>
            <p>所属校区：{XQMC || '本校'} </p>
            <p>课程名称：{formValues?.KHKCSJ?.KCMC}</p>
            <p>班级名称：{formValues?.BJMC}</p>
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
            <p>场地名称：{formValues?.FJSJ?.FJMC || '—'}</p>
            <p className={styles.text}>班级简介：{formValues?.BJMS}</p>
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
          <div className={styles.wrap}>
            <ProFormFields
              onFinish={onFinish}
              setForm={setForm}
              formItems={formItems}
              formItemLayout={formLayout}
              values={
                BJData || {
                  BJZT: '未开班',
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
