// import React from 'react';
// import { Form } from 'antd';
// import BraftEditor from 'braft-editor';
import PageContainer from '@/components/PageContainer';

/**
 * 新增公告
 * @returns
 */
const EditAnnouncement = () => {
  return (
    <PageContainer>
      新增公告
      {/* <Form {...formItemLayout} form={form} initialValues={initialValues} onFinish={submit}>
        <Form.Item
          name="mainCon"
          rules={[
            {
              required: true,
              message: '请输入正文内容！',
            },
          ]}
        >
          <BraftEditor
            className="my-editor"
            placeholder="请输入正文内容"
            media={{
              uploadFn: upload,
            }}
            extendControls={extendControls}
          />
        </Form.Item>
      </Form> */}
    </PageContainer>
  );
};

export default EditAnnouncement;
