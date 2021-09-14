/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Descriptions, Drawer, Tag, Image, Table } from 'antd';
import classes from './index.less';
import { history } from 'umi';

/**
 * 课程详情
 * @returns
 */
const SchoolInfo = (props: { onSchoolInfoClose: any; visibleSchoolInfo: boolean; info: any }) => {
  const { onSchoolInfoClose, visibleSchoolInfo, info } = props;
  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHJSSJ?.XM;
      },
    },
    {
      title: '联系电话',
      dataIndex: 'LXDH',
      key: 'LXDH',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHJSSJ?.LXDH;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'DZXX',
      key: 'DZXX',
      align: 'center',
      render: (text: any, record: any) => {
        return record?.KHJSSJ?.DZXX;
      },
    },
    {
      title: '操作',
      dataIndex: 'opthion',
      key: 'opthion',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <a
            onClick={() => {
              history.push({
                pathname: `/teacherManagement/detail`,
                state: {
                  type: 'detail',
                  data: record,
                },
              });
            }}
          >
            详情
          </a>
        );
      },
    },
  ];
  return (
    <div>
      <Drawer
        width={480}
        title="课程详情"
        placement="right"
        closable={false}
        onClose={onSchoolInfoClose}
        visible={visibleSchoolInfo}
      >
        <Descriptions className={classes.drawerstyle} layout="vertical" column={1}>
          <Descriptions.Item label="课程名称">{info?.KCMC}</Descriptions.Item>
          <Descriptions.Item label="课程类型">{info?.KHKCLX?.KCTAG}</Descriptions.Item>
          <Descriptions.Item label="课程来源">{info.SSJGLX}</Descriptions.Item>
          <Descriptions.Item label="适用年级">
            {info?.NJSJs?.map((item: any) => {
              return (
                <Tag key={item.id}>
                  {item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}
                </Tag>
              );
            })}
          </Descriptions.Item>
          <Descriptions.Item label="课程封面">
            <Image width={110} height={72} src={info?.KCTP} />
          </Descriptions.Item>
          <Descriptions.Item label="课程简介">{info?.KCMS}</Descriptions.Item>
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
    </div>
  );
};

export default SchoolInfo;
