import React, {useEffect, useState} from "react";
import "./ImageViewer.css";
import * as ImageAction from "../actions";

const ImageViewer = ({ imagePath }) => {
  const [imgIndex, setImgIndex] = useState(1);
  const [totalImages, setTotalImages] = useState(1);

  useEffect(() => {
    const totalNumOfImages = ImageAction.getTotalNumOfImages(imagePath);
    setTotalImages(totalNumOfImages);
  }, []);

  return (
    <div className="image-view-container">
      <img
        className="image-360"
        src={ImageAction.getImageImportByIndex(imagePath, imgIndex)}
      />
    </div>
  );
};

export default ImageViewer;
