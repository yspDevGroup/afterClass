import ProFormFields from "@/components/ProFormFields";
import type { FormInstance } from "antd";
import type { NoticeItem } from "../data";

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
      label: '标题',
      name: 'BT',
      key: 'BT',
      fieldProps: {
        autocomplete: 'off',
      },
      rules: [{ required: true, message: '请填写名称' }],
    },
    {
      type: 'input',
      label: '状态',
      name: 'ZT',
      key: 'ZT',
      rules: [{ required: true, message: '请填写编号' }],
      fieldProps: {
        autocomplete: 'off',
      },
    },
    {
      type: 'textArea',
      label: '内容',
      name: 'NR',
      key: 'NR',
      rules: [{ required: true, message: '请填写编号' }],
      fieldProps: {
        rows:18
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
  )
}
export default Announcement