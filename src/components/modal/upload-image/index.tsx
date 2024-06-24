import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Col, Image, Modal, Row, Spin, Typography, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import React, { Dispatch, SetStateAction, useEffect, useState, FunctionComponent } from 'react';

interface IUploadImageRequestProps {
  item: any;
  uploadImageAction: (
    file: any,
    image: Array<IUploadImage>,
    setImage: Dispatch<SetStateAction<Array<IUploadImage>>>,
    attributeId: number,
  ) => void;
  images: Array<any>;
  handleDeleteImage: (
    attributeId: number,
    imageId: number,
    image: Array<IUploadImage>,
    setImage: Dispatch<SetStateAction<Array<IUploadImage>>>,
  ) => void;
  previewOpen: boolean;
  previewTitle: string;
  previewImage: string;
  handleCancel: () => void;
  handlePreviews: (file: UploadFile) => Promise<void>;
}

export interface IUploadImage {
  url: string;
  id: number;
  attributeId: number;
  status: string;
}

const UploadImageRequest: FunctionComponent<IUploadImageRequestProps> = ({
  item,
  uploadImageAction,
  images,
  handleDeleteImage,
  previewOpen,
  previewTitle,
  previewImage,
  handleCancel,
  handlePreviews,
}) => {
  const [image, setImage] = useState<Array<any>>([]);

  useEffect(() => {
    setImage(images);
  }, []);

  const uploadButtonForAttribute = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Card className="fullContent">
      <Row className="fullContent">
        <Col span={24}>
          <Row className="fullContent">
            <Col span={24}>
              <Typography.Text>{item.name}</Typography.Text>
            </Col>
            <Col span={24}>
              <Upload
                accept=".jpeg,.png,.jpg"
                listType="picture-card"
                fileList={image}
                showUploadList={true}
                customRequest={(e: any) => uploadImageAction(e, image, setImage, item.id)}
                onRemove={(file: any) => handleDeleteImage(file.attributeId, file.id, image, setImage)}
                maxCount={10}
                onPreview={handlePreviews}
              >
                {image.length >= 10 ? null : uploadButtonForAttribute}
              </Upload>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default UploadImageRequest;
