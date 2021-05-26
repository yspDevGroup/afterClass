import React, { useState } from 'react';
import { Button, message, Upload } from 'antd';
import styles from './UploadImage.less';

const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState();
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrls: any) => {
        setImageUrl(imageUrls);
      });
    }
  };
  return (
    <div className={styles.uploadStyles}>
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        <div className={styles.defImgStyles}>
          <div className={styles.icon} />
        </div>
      )}
      <div className={styles.uploadButStyles}>
        <Upload
          showUploadList={false}
          name="avatar"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <Button type="primary">上传</Button>
        </Upload>
        <Button style={{ marginTop: 8 }}>重置</Button>
      </div>
    </div>
  );
};

export default UploadImage;
