import React, {useEffect, useState} from "react";
import "./ImageViewer.css";
import * as ImageAction from "../actions/Images";

const ImageViewer = ({ imagePath }) => {
  const [imgIndex, setImgIndex] = useState(1);

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
