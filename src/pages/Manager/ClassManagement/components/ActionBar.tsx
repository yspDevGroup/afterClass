import { deleteKHBJSJ, updateKHBJSJ } from "@/services/after-class/khbjsj";
import type { ActionType } from "@ant-design/pro-table";
import { Popconfirm } from "antd";
import { message } from "antd";
import { Divider } from "antd";
import React from "react";
import type { CourseItem } from "../data";

type propstype = {
  handleEdit: (data: CourseItem) => void;
  record: CourseItem;
  maintain: (type: string) => void;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  // setnames: () => void;
}

const ActionBar = (props: propstype) => {
  const { handleEdit, record, maintain, actionRef } = props;
  const shelf = (record: any) => {
    if(record.KHXSBJs.length===0){
      record.BJZT = '已下架'
      record.BMKSSJ=new Date(record.BMKSSJ);
      record.BMJSSJ=new Date(record.BMJSSJ);
      const res = updateKHBJSJ({ id: record.id }, record);
      new Promise((resolve) => {
        resolve(res);
      }).then((data: any) => {
        if (data.status === 'ok') {
          message.success('下架成功');
          actionRef.current?.reload();
        } else {
          message.error('下架失败，请联系管理员或稍后重试');
          actionRef.current?.reload();
        }
      })
    }else{
      message.error('下架失败，请先将所有学生清除');
    }
  }
  const release = (record: any) => {
    record.BJZT = '已发布'
    const res = updateKHBJSJ({ id: record.id }, record);
    new Promise((resolve) => {
      resolve(res);
    }).then((data: any) => {
      if (data.status === 'ok') {
        message.success('发布成功');
        actionRef.current?.reload();
      } else {
        message.error('发布失败，请联系管理员或稍后重试');
        actionRef.current?.reload();
      }
    })
  }
  switch (record.BJZT) {
    case '待发布':
    case '已下架':
      return (
        <>
          <a onClick={() => release(record)}>发布</a>
          <Divider type="vertical" />
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const params = { id: record.id };
                  const res = deleteKHBJSJ(params);
                  new Promise((resolve) => {
                    resolve(res);
                  }).then((data: any) => {
                    if (data.status === 'ok') {
                      message.success('删除成功');
                      actionRef.current?.reload();
                    } else {
                      message.error('删除失败');
                    }
                  });
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      );
      break;
    case '已排课':
      return (
        <>
          <a onClick={() => { maintain('startclass') }}>
            开班
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除之后，数据不可恢复，确定要删除吗?"
            onConfirm={async () => {
              try {
                if (record.id) {
                  const params = { id: record.id };
                  const res = deleteKHBJSJ(params);
                  new Promise((resolve) => {
                    resolve(res);
                  }).then((data: any) => {
                    if (data.status === 'ok') {
                      message.success('删除成功');
                    } else {
                      message.error('删除失败');
                    }
                  });
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      );
      break;
    case '已发布':
      return (
        <>
          <a onClick={() => shelf(record)}>
            下架
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
      break;
    default:
      return (
        <>
          <a onClick={() => handleEdit(record)}>查看</a>
        </>
      );
  }
}
export default ActionBar