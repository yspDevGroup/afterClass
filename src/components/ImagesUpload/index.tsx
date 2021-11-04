import { useEffect, useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAuthorization } from '@/utils/utils';
import upload from '@/assets/upload.png';
import styles from './index.less';


const ImagesUpload = (props: {
  img?: string;
  onValueChange: (value: string) => void;
  readonly?: boolean;
}) => {
  const { img, onValueChange, readonly = false } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>(img);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState<any>('');
  const [fileList, setFileList] = useState<any>([]);

  useEffect(() => {
    // setImgUrl(true);
  }, [img]);

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('上传的文件类型有误');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小超过2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      // setLoading(true);
      // return;
    }
    if (info.file.status === 'done') {
      const code = info.file.response;
      if (code.status === 'ok') {
        message.success('上传成功');
        // setLoading(false);
        let urlStr = '';
        info.fileList.forEach((item: any)=>{
          if(item.response?.status === 'ok'){
            urlStr = urlStr + item.response.data +';';
          }
        })
        onValueChange(urlStr);
      } else {
        message.success('上传失败');
        // setLoading(false);
      }
      // getBase64(info.file.originFileObj, (imageUrl: string) => {
      //   setImgUrl(imageUrl);
      //   setLoading(false);
      //   onValueChange?.(imageUrl);
      // });
    }
    setFileList(info.fileList);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj,()=>{});
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>
        <img src={upload} alt="avatar" style={{ width: '35%',marginBottom: 5 }} />
        <p style={{color: '#999999',fontSize: 10}}>添加图片</p>
      </div>
    </div>
  );
  return (
    <>
      <Upload
        name="image"
        accept = 'image/*'
        className={styles.upload}
        listType="picture-card"
        action="/api/upload/uploadFile?type=badge&plat=school"
        headers={{
          authorization: getAuthorization()
        }}
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        maxCount={9}
        multiple
        isImageUrl={()=>{
          return true
        }}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default ImagesUpload;
