import { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import IconFont from '@/components/CustomIcon';
import { getAuthorization } from '@/utils/utils';
import styles from './index.less';

const ImagesUpload = (props: {
  img?: string;
  onValueChange: (value: string) => void;
  readonly?: boolean;
}) => {
  const { img, onValueChange } = props;
  // const [loading, setLoading] = useState<boolean>(false);
  // const [imgUrl, setImgUrl] = useState<string | undefined>(img);
  // const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  // const [previewImage, setPreviewImage] = useState<any>('');
  // const [previewTitle, setPreviewTitle] = useState<any>('');
  const [fileList, setFileList] = useState<any>([]);

  useEffect(() => {
    // setImgUrl(true);
  }, [img]);

  // const getBase64 = (img: any, callback: any) => {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // };

  const handleBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('上传的文件类型有误');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('文件大小超过5MB');
      return false;
    }
    return isJpgOrPng && isLt5M;
  };

  // const handleCancel = () => {
  //   setPreviewVisible(false);
  //   setPreviewImage('')
  // };

  const handleChange = (info: any) => {
    console.log('info: ', info);
    if (info.file.status === 'uploading') {
      // setLoading(true);
      // return;
    }
    if (info.file.status === 'done') {
      const code = info.file.response;
      if (code.status === 'ok') {
        message.success('上传成功');
        let urlStr = '';
        info.fileList.forEach((item: any) => {
          if (item.response?.status === 'ok') {
            urlStr = `${urlStr + item.response.data};`;
          }
        });
        onValueChange(urlStr);
      } else {
        message.success('上传失败');
        info?.event?.currentTarget?.onerror(code);
      }
    }
    setFileList(info.fileList?.filter((item: any) => (item.status ? true : false)));
  };

  // const handlePreview = async (file: any) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj, () => { });
  //   }
  //   setPreviewImage(file.response.data);
  //   setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  //   setPreviewVisible(true);
  // };

  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>
        <IconFont
          className={styles.iconStyle}
          type={'icon-xiangji'}
          style={{ fontSize: 30, color: '#999' }}
        />
        <p style={{ color: '#999', fontSize: 10 }}>添加图片</p>
      </div>
    </div>
  );
  return (
    <>
      <Upload
        name="image"
        accept="image/*"
        className={styles.upload}
        listType="picture-card"
        action="/api/upload/uploadFile?type=badge&plat=school"
        headers={{
          authorization: getAuthorization(),
        }}
        fileList={fileList}
        // onPreview={handlePreview}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        maxCount={9}
        multiple
        showUploadList={{ showPreviewIcon: false }}
        isImageUrl={() => {
          return true;
        }}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      {/* <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        closable={false}
        className={styles.modal}
      >
        <img style={{ width: '100%' }} src={previewImage || noData} />
      </Modal> */}
    </>
  );
};
export default ImagesUpload;
