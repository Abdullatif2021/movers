import React from 'react';
import { modalSizes } from 'constants/modalSizes';
import { Image as AntdImage, ImageProps as AntdImageProps } from 'antd';

interface ImageProps extends AntdImageProps {
  size?: 'xx_small' | 'x_small' | 'small' | 'medium' | 'large';
}

export const Image: React.FC<ImageProps> = ({ size = 'medium', children, ...props }) => {
  const imageSize = Object.entries(modalSizes).find((sz) => sz[0] === size)?.[1];

  return <AntdImage width={imageSize} {...props} />;
};
