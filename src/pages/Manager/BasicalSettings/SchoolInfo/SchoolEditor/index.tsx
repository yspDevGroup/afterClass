import { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, FormInstance, message, Select } from 'antd';
import { history } from 'umi';
import PageContainer from '@/components/PageContainer';
import CustomForm from '@/components/CustomForm';
import AvatarUpload from '@/components/AvatarUpload';
import { FormItemType } from '@/components/CustomForm/interfice';
import { updateXXJBSJ } from '@/services/after-class/xxjbsj';

const { Option } = Select;
const formItemLayout = {
  labelCol: { flex: '7em' },
  wrapperCol: { flex: 'auto' }
};

const schoolLevel = [
  {
    value: '幼儿园',
    text: '幼儿园'
  },
  {
    value: '小学',
    text: '小学'
  },
  {
    value: '初中',
    text: '初中'
  },
  {
    value: '高中',
    text: '高中'
  },
];

const SchoolEditor = (props: any) => {
  const [editForm, setEditForm] = useState<FormInstance<any>>();
  const [info, setInfo] = useState<any>();
  const [xhimg, setXhimg] = useState<any>();
  const [cities, setCities] = useState<any>();
  const [cityAdcode, setCityAdcode] = useState<string>();
  const [secondCity, setSecondCity] = useState<any>();
  const [county, setCounty] = useState<any>();
  const [provinceVal, setProvinceVal] = useState<any>();
  const [cityVal, setCityVal] = useState<any>();
  const [countyVal, setCountyVal] = useState<any>();
  const currentValue = props.location.state;

  const onSubmit = () => {
    editForm?.submit();
  };
  const requestData = () => {
    const ajax = new XMLHttpRequest();
    ajax.open(
      'get',
      'http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json',
    );
    ajax.send();
    // eslint-disable-next-line func-names
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        const data = JSON.parse(ajax.responseText);
        setCities(data.rows);
      }
    };
  };
  useEffect(() => {
    requestData();
  }, []);
  const onFinish = async (values: any) => {
    values.XH = xhimg ? xhimg : values.XH;
    values.XD = values?.XD?.toString();
    values.XZQHM = cityAdcode;
    values.XZQ = `${provinceVal?.label}${cityVal?.label ? `/${cityVal?.label}` : ''}${countyVal?.label ? `/${countyVal?.label}` : ''}`;
    const res = await updateXXJBSJ({
      id: values.id!,
    }, values);
    if (res.status === 'ok') {
      message.success('保存成功');
      history.push('/basicalSettings/schoolInfo');
    } else {
      let msg = res.message;
      message.error(msg);
    }
  };
  const onCancelClick = () => {
    history.go(-1);
  };
  const handleChange = (type: string, value: any) => {
    if (type === 'cities') {
      const ajax = new XMLHttpRequest();
      ajax.open(
        'get',
        `http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value.value}_city.json`,
      );
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
          if (value.value === '810000' || value.value === '820000' || value.value === '710000') {
            setCityAdcode(value.value);
          } else {
            setCityAdcode(undefined);
          }
          const data = JSON.parse(ajax.responseText);
          setSecondCity(data.rows);
          setProvinceVal({
            value: value.value,
            label: value.label,
            key: value.value
          });
          setCityVal({});
          setCountyVal({});
          setCounty([]);
        }
      };
    } else if (type === 'secondCity') {
      const ajax = new XMLHttpRequest();
      ajax.open(
        'get',
        `http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value.value}_district.json`,
      );
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
          const newArr: any[] = [];
          const data = JSON.parse(ajax.responseText);
          data.rows.forEach((item: any) => {
            if (item.adcode.substring(0, 4) === value.value.substring(0, 4)) {
              newArr.push(item);
            }
          });
          setCounty(newArr);
          setCityVal({
            value: value.value,
            label: value.label,
            key: value.value
          });
          setCountyVal({});
          setCityAdcode(undefined);
        }
      };
    } else if (type === 'county') {
      setCityAdcode(value.value);
      setCountyVal({
        value: value.value,
        label: value.label,
        key: value.value
      });
    }
  };
  useEffect(() => {
    if (currentValue) {
      const current = currentValue.schoolInfo;
      const { XD, XZQHM, XZQ, ...info } = current;
      setProvinceVal({
        value: `${XZQHM?.substring(0, 2)}0000`,
        label: XZQ?.split('/')[0],
        key: `${XZQHM?.substring(0, 2)}0000`
      });
      setCityVal({
        value: `${XZQHM?.substring(0, 4)}00`,
        label: XZQ?.split('/')[1],
        key: `${XZQHM?.substring(0, 4)}00`
      });
      setCountyVal({
        value: XZQHM,
        label: XZQ?.split('/')[2],
        key: XZQHM
      });
      setInfo({
        ...info,
        XD: XD? XD.split(','): undefined
      });
    }
  }, [currentValue]);
  // 表单元素
  const EditItems: FormItemType[] = [
    {
      type: 'group',
      key: 'group1',
      cls: 'ui-groupLine',
      groupItems: [
        {
          type: 'input',
          label: 'id',
          name: 'id',
          key: 'id',
          hidden: true,
        },
        {
          type: 'input',
          label: '学校名称',
          name: 'XXMC',
          key: 'XXMC',
          rules: [{ required: true, message: '该项不能为空，请输入' }],
          span: 12
        },
        {
          type: 'custom',
          label: '校徽',
          name: 'XH',
          key: 'XH',
          span: 12,
          cls: 'ui-schoolLogo',
          valuePropName: 'img',
          children: (
            <AvatarUpload
              onValueChange={(value: string) => {
                setXhimg(value === '' ? null : value);
              }}
            />
          )
        }
      ]
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'input',
          label: '学校英文名称',
          name: 'XXYWMC',
          key: 'XXYWMC',
          span: 12
        }
      ]
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'select',
          label: '学段',
          name: 'XD',
          key: 'XD',
          items: schoolLevel,
          mode: 'multiple',
          span: 12
        },
        {
          type: 'input',
          label: '联系人',
          name: 'LXR',
          rules: [{ required: true, message: '该项不能为空，请输入' }],
          key: 'LXR'
        },
      ]
    },
    {
      type: 'group',
      key: 'group5',
      groupItems: [
        {
          type: 'custom',
          label: '行政区域',
          name: 'XZQHM',
          key: 'XZQHM',
          span: 12,
          valuePropName: 'XZQHM',
          children: (
            <>
              <Select
                placeholder="请选择"
                labelInValue
                value={provinceVal}
                style={{ width: 120, marginRight: 10 }}
                onChange={(value: any) => {
                  handleChange('cities', value);
                }}
              >
                {cities?.map((item: any) => {
                  return (
                    <Option value={item.adcode} key={item.name}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              <Select
                placeholder="请选择"
                style={{ width: 120, marginRight: 10 }}
                labelInValue
                value={cityVal}
                onChange={(value: any) => {
                  handleChange('secondCity', value);
                }}
              >
                {secondCity?.map((item: any) => {
                  return (
                    <Option value={item.adcode} key={item.name}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              <Select
                style={{ width: 120 }}
                placeholder="请选择"
                labelInValue
                value={countyVal}
                onChange={(value: any) => {
                  handleChange('county', value);
                }}
              >
                {county?.map((item: any) => {
                  return (
                    <Option value={item.adcode} key={item.adcode}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </>
          )
        },
        {
          type: 'input',
          label: '联系电话',
          name: 'LXDH',
          rules: [{ required: true, message: '该项不能为空，请输入' }],
          key: 'LXDH'
        },
      ]
    },
    {
      type: 'group',
      key: 'group6',
      groupItems: [
        {
          type: 'input',
          label: '学校地址',
          name: 'XXDZ',
          rules: [{ required: true, message: '该项不能为空，请输入' }],
          key: 'XXDZ'
        },
        {
          type: 'input',
          label: '电子邮箱',
          name: 'DZXX',
          key: 'DZXX'
        },
      ]
    },
    {
      type: 'group',
      key: 'group10',
      groupItems: [
        {
          type: 'input',
          label: '官方网站',
          name: 'ZYDZ',
          key: 'ZYDZ',
        },
        {
          type: 'input',
          label: '邮政编码',
          name: 'XXYZBM',
          key: 'XXYZBM'
        },
      ]
    },
    {
      type: 'group',
      key: 'group11',
      groupItems: [
        {
          type: 'textArea',
          label: '学校简介',
          showCount: true,
          maxLength: 255,
          rules: [{ required: true, message: '该项不能为空，请输入' }, {
            max: 255,
            message: '学校简介不应超过255个字符'
          }],
          name: 'LSYG',
          key: 'LSYG'
        }
      ]
    }
  ];
  return (
    <PageContainer>
      <div className={styles.schoolEditorPages}>
        {/* form表单 */}
        <div className={styles.schoolEditor}>
          <div className={styles.smalldiv}>
            <CustomForm
              onFinish={onFinish}
              values={info}
              formItems={EditItems}
              formLayout={formItemLayout}
              hideBtn={true}
              setForm={(form: FormInstance<any>) => setEditForm(form)}
            />
          </div>
        </div>
        {/* 尾部保存和取消按钮 */}
        <div className={styles.schoolEditorFooter}>
          <Button type="primary" onClick={onSubmit}>
            保存
          </Button>
          <Button onClick={onCancelClick}>取消</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SchoolEditor;
