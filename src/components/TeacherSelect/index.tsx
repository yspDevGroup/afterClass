/*
 * @Author: your name
 * @Date: 2021-11-15 13:41:03
 * @LastEditTime: 2021-12-10 12:31:08
 * @LastEditors: zpl
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \afterClass\src\components\TeacherSelect\index.tsx
 */

import React, { useState, useEffect } from 'react';
import { Modal, TreeSelect } from 'antd';
import { history } from 'umi';
import ShowName from '@/components/ShowName';
import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';
import { getTeacherByClassId } from '@/services/after-class/khkcsj';
import { getAgencyTeachers } from '@/services/after-class/xxjbsj';

type TeacherSelectProps = {
  xxId: string;
  multiple: boolean;
  value?: string | string[];
  kcId?: string | undefined; // 如果是机构课程的话 请求机构的教师
  type: number; // 1 学校老师 2机构老师 3 机构和学校老师
  onChange: any;
  disabled?: boolean; // 禁用
};

const TeacherSelect = (props: TeacherSelectProps) => {
  const { multiple, value, type, kcId, xxId, onChange, disabled } = props;

  const [xxTeacher, setXXTeacher] = useState<any>();
  const [JGTeacher, setJGTeacher] = useState<any>();
  const [treeData, setTreeData] = useState<any>();

  const getLable = (GH: string) => {
    if (GH !== null && GH.length > 4) {
      return `~${GH.substring(GH.length - 4)}`;
    }
      return `~ ${GH}`;

  };

  const getTeacherList = async () => {
    const response = await getAllJZGJBSJ({
      XXJBSJId: xxId,
      page: 0,
      pageSize: 0,
    });
    if (response.status === 'ok') {
      const data: any = {
        title: '',
        value: '0-0',
        key: '0-0',
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        children: [],
      };

      response.data?.rows?.forEach((item: any, index: number) => {
        if (index === 0) {
          data.title = item.XXMC;
        }
        const label = <ShowName XM={item.XM} type="userName" openid={item.WechatUserId} />;
        data.children.push({
          title: (
            <>
              <>{label}</>
              <>{getLable(item.GH)}</>
            </>
          ),
          value: item.id,
          key: item?.XM + item?.WechatUserId,
          WechatUserId: item.WechatUserId,
        });
      });

      setXXTeacher(data);
      // console.log('学校', data);
    }
  };
  const getJgTeachers = async () => {
    const res = await getAgencyTeachers({
      XXJBSJId: xxId,
    });
    console.log(res,'res-------')
    if (res.status === 'ok') {
      // const { rows } = res?.data;
      //   const teacherOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =[];
      const data: any = {
        title: '',
        value: '0-1',
        key: '0-1',
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        children: [],
      };
      res?.data?.forEach(
        (
          item: { XM: string; WechatUserId: string; id: any; KHJYJG: any; GH: string },
          index: number,
        ) => {
          if (index === 0) {
            data.title = item.KHJYJG?.QYMC;
          }
          // 兼顾企微
          const label = <ShowName XM={item.XM} type="userName" openid={item.WechatUserId} />;
          data.children.push({
            title: (
              <>
                <>{label}</>
                <>{getLable(item.GH)}</>
              </>
            ),
            value: item?.id,
            key: item?.XM + item?.WechatUserId,
            WechatUserId: item?.WechatUserId,
          });
        },
      );
      console.log(data,'data-------')
      setJGTeacher(data);
    }
  };
  const getJgTeacher = async () => {
    const res = await getTeacherByClassId({
      KHKCSJId: kcId!,
      pageSize: 0,
      page: 0,
    });
    if (res.status === 'ok') {
      const { rows } = res?.data;
      //   const teacherOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =[];
      const data: any = {
        title: '',
        value: '0-1',
        key: '0-1',
        checkable: false,
        disableCheckbox: true,
        selectable: false,
        children: [],
      };
      rows?.forEach(
        (
          item: { XM: string; WechatUserId: string; id: any; KHJYJG: any; GH: string },
          index: number,
        ) => {
          if (index === 0) {
            data.title = item.KHJYJG?.QYMC;
          }
          // 兼顾企微
          const label = <ShowName XM={item.XM} type="userName" openid={item.WechatUserId} />;
          data.children.push({
            title: (
              <>
                <>{label}</>
                <>{getLable(item.GH)}</>
              </>
            ),
            value: item?.id,
            key: item?.XM + item?.WechatUserId,
            WechatUserId: item?.WechatUserId,
          });
        },
      );
      setJGTeacher(data);
    }
  };

  useEffect(() => {
    getTeacherList();
    //   getJgTeacher();
    getJgTeachers();
  }, []);

  useEffect(() => {
    if (kcId) {
      getJgTeacher();
    } else {
      setJGTeacher(undefined);
    }
  }, [kcId]);

  useEffect(() => {
    if (type === 1 && xxTeacher) {
      setTreeData([xxTeacher]);
    } else if (type === 2) {
      if (kcId && JGTeacher) {
        setTreeData([JGTeacher]);
      } else {
        setTreeData([]);
      }
    } else if (type === 3 && kcId && xxTeacher) {
      if (!JGTeacher) {
        setTreeData([xxTeacher]);
      } else {
        setTreeData([JGTeacher, xxTeacher]);
      }
    }else if (type === 4 && xxTeacher) {
      if (!JGTeacher) {
        setTreeData([xxTeacher]);
      } else {
        setTreeData([JGTeacher, xxTeacher]);
      }
    }
  }, [xxTeacher, JGTeacher, type]);

  return (
    <div>
      {treeData?.children?.length === 0 ? (
        <>
          <div
            className="ant-select ant-select-single ant-select-allow-clear ant-select-show-arrow ant-select-show-search"
            onClick={() => {
              Modal.info({
                title: '未获取到学校教师，请先进行教师维护',
                width: '450px',
                okText: '去设置',
                onOk() {
                  history.push('/basicalSettings/teacherManagement');
                },
              });
            }}
          >
            <div className="ant-select-selector">
              <span className="ant-select-selection-search">
                <input readOnly type="search" className="ant-select-selection-search-input" />
              </span>
              <span className="ant-select-selection-placeholder">请选择</span>
            </div>
            <span className="ant-select-arrow" unselectable="on" aria-hidden="true">
              <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="down"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
                </svg>
              </span>
            </span>
          </div>
        </>
      ) : (
        <TreeSelect
          treeDefaultExpandedKeys={['0-0', '0-1']}
          disabled={disabled}
          treeData={treeData}
          multiple={multiple}
          value={value}
          onChange={onChange}
          treeCheckable={multiple}
          showSearch
          placeholder="选择教师"
          style={{
            width: '100%',
          }}
          treeNodeFilterProp="key"
        />
      )}
    </div>
  );
};
export default TeacherSelect;
