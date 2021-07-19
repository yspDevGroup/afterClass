import ProFormFields from '@/components/ProFormFields';
import type { FormInstance } from 'antd';
import type { NoticeItem } from '../data';

type PropsType = {
  current?: NoticeItem;
  setForm?: React.Dispatch<React.SetStateAction<FormInstance<any> | undefined>>;
};
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const Announcement = (props: PropsType) => {
  const { current, setForm } = props;
  const formItems: any[] = [
    {
      type: 'input',
      hidden: true,
      name: 'id',
      key: 'id',
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      type: 'input',
      label: '标题',
      name: 'BT',
      key: 'BT',
      fieldProps: {
        autocomplete: 'off',
      },
      rules: [{ required: true, message: '请填写标题' }],
    },
    {
      type: 'select',
      label: '状态',
      name: 'ZT',
      key: 'ZT',
      rules: [{ required: true, message: '请填选择状态' }],
      options: [
        {
          label: '拟稿',
          value: '拟稿',
        },
        {
          label: '发布',
          value: '发布',
        },
        {
          label: '报名通知',
          value: '报名通知',
        },
      ],
    },
    {
      type: 'textArea',
      label: '内容',
      name: 'NR',
      key: 'NR',
      rules: [{ required: true, message: '请填写内容' }],
      fieldProps: {
        rows: 5,
      },
    },
  ];
  return (
    <>
      <ProFormFields
        layout="horizontal"
        setForm={setForm}
        values={current}
        formItems={formItems}
        formItemLayout={formLayout}
      />
    </>
  );
};
export default Announcement;
