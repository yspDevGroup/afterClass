/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Descriptions, Drawer, Tag, Image, Table, message, Input } from 'antd';
import classes from './index.less';
import type { FormItemType } from '@/components/CustomForm/interfice';
import CustomForm from '@/components/CustomForm';
import moment from 'moment';
import { defImg } from '@/constant';
import { getJZGJBSJ } from '@/services/after-class/jzgjbsj';
import ShowName from '@/components/ShowName';

const { TextArea } = Input;
/**
 * 课程详情
 * @returns
 */
const formItemLayout = {
  labelCol: { flex: '8em' },
  wrapperCol: { flex: 'auto' },
};
const SchoolInfo = (props: { onSchoolInfoClose: any; visibleSchoolInfo: boolean; info: any }) => {
  const { onSchoolInfoClose, visibleSchoolInfo, info } = props;
  const [visibleTeacher, setVisibleTeacher] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<any>();
  const onTeacherClose = () => {
    setVisibleTeacher(false);
  };
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      render: (text: any, record: any) => (
        <ShowName type="userName" openid={record?.WechatUserId} XM={record?.XM} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <a
            onClick={async () => {
              const jsId = record?.id;
              const res = await getJZGJBSJ({
                id: jsId,
              });
              if (res.status === 'ok') {
                setTeacher(res.data);
                setVisibleTeacher(true);
              } else {
                message.error(res.message);
              }
            }}
          >
            详情
          </a>
        );
      },
    },
  ];
  const basicForm: FormItemType[] = [
    {
      type: 'input',
      label: 'id',
      name: 'id',
      key: 'id',
      hidden: true,
    },
    {
      type: 'input',
      label: 'KHJYJGId',
      name: 'KHJYJGId',
      key: 'KHJYJGId',
      hidden: true,
    },
    {
      type: 'group',
      key: 'group1',
      groupItems: [
        {
          type: 'uploadImage',
          label: '个人照片',
          name: 'ZP',
          key: 'ZP',
          imgWidth: 100,
          imgHeight: 100,
          imageurl: teacher?.ZP,
          upurl: '/api/upload/uploadFile?type=badge&plat=agency',
          accept: '.jpg, .jpeg, .png',
          imagename: 'image',
        },
        {
          type: 'uploadImage',
          label: '资格证书',
          name: 'ZGZS',
          key: 'ZGZS',
          imgWidth: 100,
          imgHeight: 100,
          imageurl: teacher?.ZGZS,
          upurl: '/api/upload/uploadFile?type=badge&plat=agency',
          accept: '.jpg, .jpeg, .png',
          imagename: 'image',
        },
      ],
    },
    {
      type: 'group',
      key: 'group2',
      groupItems: [
        {
          type: 'input',
          label: '姓名',
          name: 'XM',
          key: 'XM',
          placeholder: '—',
        },
        {
          type: 'input',
          label: '资格证书编号',
          name: 'ZGZSBH',
          key: 'ZGZSBH',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group3',
      groupItems: [
        {
          type: 'input',
          label: '性别',
          span: 12,
          name: 'XBM',
          key: 'XBM',
        },
        {
          type: 'input',
          label: '学历',
          span: 12,
          name: 'XL',
          key: 'XL',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group4',
      groupItems: [
        {
          type: 'input',
          label: '民族',
          name: 'MZM',
          key: 'MZM',
          placeholder: '—',
        },
        {
          type: 'input',
          label: '毕业院校',
          name: 'BYYX',
          key: 'BYYX',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group6',
      groupItems: [
        {
          type: 'time',
          subtype: 'date',
          label: '出生日期',
          name: 'CSRQ',
          key: 'CSRQ',
          placeholder: '—',
        },
        {
          type: 'input',
          label: '专业',
          name: 'SXZY',
          key: 'ZY',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group7',
      groupItems: [
        {
          type: 'input',
          label: '联系电话',
          name: 'LXDH',
          key: 'LXDH',
          placeholder: '—',
        },
        {
          type: 'inputNumber',
          label: '教龄（年）',
          name: 'JL',
          key: 'JL',
          max: 100,
          min: 1,
          formatter: (value: number) => `${Math.round(value)}`,
        },
      ],
    },
    {
      type: 'group',
      key: 'group8',
      groupItems: [
        {
          type: 'input',
          key: 'SFZJLXM',
          name: 'SFZJLXM',
          placeholder: '—',
          label: '证件类型',
        },
        {
          type: 'input',
          label: '教授科目',
          name: 'JSKM',
          key: 'JSKM',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group9',
      groupItems: [
        {
          type: 'input',
          key: 'SFZJH',
          name: 'SFZJH',
          label: '证件号码',
          placeholder: '—',
        },
        {
          type: 'input',
          label: '电子邮箱',
          name: 'DZXX',
          key: 'DZXX',
          placeholder: '—',
        },
      ],
    },
    {
      type: 'group',
      key: 'group10',
      groupItems: [
        {
          type: 'textArea',
          label: '个人简介',
          name: 'BZ',
          key: 'BZ',
          placeholder: '—',
        },
      ],
    },
  ];
  return (
    <div>
      <Drawer
        width={480}
        title="课程详情"
        placement="right"
        onClose={onSchoolInfoClose}
        visible={visibleSchoolInfo}
        className={classes.KcDatas}
      >
        <Descriptions className={classes.drawerstyle} layout="vertical" column={1}>
          <Descriptions.Item label="课程名称">{info?.KCMC}</Descriptions.Item>
          <Descriptions.Item label="课程类型">{info?.KHKCLX?.KCTAG}</Descriptions.Item>
          <Descriptions.Item label="课程来源">{info.SSJGLX}</Descriptions.Item>
          <Descriptions.Item label="适用年级">
            {info?.NJSJs?.map((item: any) => {
              return <Tag key={item.id}>{`${item.XD}${item.NJMC}`}</Tag>;
            })}
          </Descriptions.Item>
          <Descriptions.Item label="课程封面">
            <Image width={110} height={72} src={info?.KCTP} fallback={defImg} />
          </Descriptions.Item>
          <Descriptions.Item label="课程简介">  <TextArea style={{ color: '#333' }} value={info?.KCMS || '——'} allowClear bordered={false} disabled autoSize /> </Descriptions.Item>
        </Descriptions>
        <Table
          style={{ display: info?.SSJGLX === '机构课程' ? 'initial' : 'none' }}
          dataSource={info?.KHKCJs}
          columns={columns}
          pagination={false}
          size="small"
          title={() => '任课教师列表'}
        />
      </Drawer>
      <Drawer
        width={680}
        title="教师详情"
        placement="right"
        onClose={onTeacherClose}
        visible={visibleTeacher}
      >
        <div className={classes.forms}>
          <CustomForm
            values={(() => {
              if (teacher) {
                const { CSRQ, XBM, ...rest } = teacher;
                return {
                  CSRQ: CSRQ ? moment(CSRQ) : '',
                  XBM: XBM?.substring(0, 1),
                  ...rest,
                };
              }
            })()}
            formDisabled={true}
            formItems={basicForm}
            formLayout={formItemLayout}
            hideBtn={true}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default SchoolInfo;
