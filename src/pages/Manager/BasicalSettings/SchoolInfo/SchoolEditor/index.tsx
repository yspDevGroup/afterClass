import { useEffect, useState } from 'react';
import styles from './index.less';
import type { FormInstance} from 'antd';
import { Button, message, Select } from 'antd';
import { history, useModel } from 'umi';
import PageContainer from '@/components/PageContainer';
import CustomForm from '@/components/CustomForm';
import AvatarUpload from '@/components/AvatarUpload';
import type { FormItemType } from '@/components/CustomForm/interfice';
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
  const { refresh} = useModel('@@initialState');
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
  const [showCity, setShowCity] = useState<boolean>(true);
  const currentValue = props.location.state;
  // 上传成功后返回的图片地址
  const [imageUrl, setImageUrl] = useState('');

  const onSubmit = () => {
    editForm?.submit();
  };
  const requestData = () => {
    const ajax = new XMLHttpRequest();
    ajax.open(
      'get',
      '//datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json',
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
    values.XH = imageUrl || values.XH;
    values.XD = values?.XD?.toString();
    values.XZQHM = cityAdcode||values.XZQHM;
    values.XZQ = `${provinceVal?.label}${cityVal?.label ? `/${cityVal?.label}` : ''}${countyVal?.label ? `/${countyVal?.label}` : ''}`;
    if(values.XZQHM){
      const res = await updateXXJBSJ({
        id: values.id!,
      }, values);
      if (res.status === 'ok') {
        message.success('保存成功');
        refresh();
        history.push('/basicalSettings/schoolInfo');
      } else {
        const msg = res.message;
        message.error(msg);
      }
    }else{
      message.error('请选择政区域');
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
        `//datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value.value}_city.json`,
      );
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
          if (value.value === '810000' || value.value === '820000' || value.value === '710000') {
            setShowCity(false);
            setCityAdcode(value.value);
          } else {
            setCityAdcode(undefined);
            setShowCity(true);
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
        `//datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${value.value}_district.json`,
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
  const requestData1 = (XZQHM: string) => {
    const ajax = new XMLHttpRequest();
    ajax.open(
      'get',
      `//datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${XZQHM?.substring(0, 2)}0000_city.json`
    );
    ajax.send();
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        const data = JSON.parse(ajax.responseText);
        setSecondCity(data.rows);
      }
    };
  };
  const requestData2 = (XZQHM: string) => {
    const ajax = new XMLHttpRequest();
    ajax.open(
      'get',
      `//datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/${XZQHM?.substring(0, 4)}00_district.json`
    );
    ajax.send();
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        const data = JSON.parse(ajax.responseText);
        const newArr: any[] = [];
        data.rows.forEach((item: any) => {
          if (item.adcode.substring(0, 4) === XZQHM?.substring(0, 4)) {
            newArr.push(item);
          }
        });
        setCounty(newArr);
      }
    };
  };
  useEffect(() => {
    if (currentValue && currentValue.schoolInfo) {
      const current = currentValue.schoolInfo;
      setImageUrl(current.XH);
      const { XD, XZQHM, XZQ} = current;
      if (XZQHM === '810000' || XZQHM === '820000' || XZQHM === '710000') {
        setShowCity(false);
      }
      if(XZQHM){
        requestData1(XZQHM);
        requestData2(XZQHM);
      }
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
        ...current,
        XD: XD ? XD.split(',') : undefined
      });
    }
  }, [currentValue]);
  // 文件状态改变的回调
  const imageChange = (type: string, e?: any) => {
    if (e.file.status === 'done') {
      const mas = e.file.response.message;
      if (typeof e.file.response === 'object' && e.file.response.status === 'error') {
        message.error(`上传失败，${mas}`);
      } else {
        const res = e.file.response;
        if (res.status === 'ok') {
          message.success(`上传成功`);
         setImageUrl(res.data)
        }
      }
    } else if (e.file.status === 'error') {
      const mass = e.file.response.message;
      message.error(`上传失败，${mass}`);
    }
  };
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
          type: 'uploadImage',
          label: '校徽',
          name: 'XH',
          key: 'XH',
          imgWidth: 90,
          imgHeight: 90,
          imageurl: imageUrl,
          upurl: '/api/upload/uploadFile?type=badge&plat=agency',
          accept: '.jpg, .jpeg, .png',
          imagename: 'image',
          handleImageChange: (value: any) => {
            imageChange('ZP', value);
          }
        },
      ]
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'input',
          label: '英文名称',
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
          rules: [{ required: true, message: '该项不能为空，请选择' }],
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
          className:'ui-form-required',
          valuePropName: 'XZQHM',
          children: (
            <>
              <Select
                placeholder="请选择"
                labelInValue
                value={provinceVal}
                style={{ marginRight: 9 }}
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
              {showCity ? <>
                <Select
                  placeholder="请选择"
                  style={{ marginRight: 9 }}
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
              </> : ''}
            </>
          )
        },
        {
          type: 'input',
          label: '联系电话',
          name: 'LXDH',
          rules: [
            { required: true, message: '请输入联系电话' },
            { type: 'string', max: 32 },
            {
              pattern: new RegExp(/^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/),
              message: '填写的电话格式有误',
            },
          ],
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
