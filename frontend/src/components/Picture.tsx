import Image from 'next/image';

/**
 * define ImageInfo containing image url, width, height and alternate name
 */
interface ImageInfo {
    url: string;
    width: number;
    height: number;
    alt?: string;
}

/**
 * component picture, extends of image for better customization
 * @param ImageInfo
 * @returns <Image ...designated info />
 */
const Picture = ({url, width, height, alt = 'Logo'}: ImageInfo) => {
    return <Image src={url} alt={alt} width={width} height={height} />;
};

export default Picture;