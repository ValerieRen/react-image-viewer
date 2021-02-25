import React, {useEffect, useState} from "react";
import "./ImageViewer.css";
import * as ImageAction from "../actions";

const ImageViewer = ({ imagePath }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(1);
  const [dragState, setDragState] = useState({
    dragging: false,
    dragStart: 0,
    dragStartIndex: 0
  });

  useEffect(() => {
    const totalNumOfImages = ImageAction.getTotalNumOfImages(imagePath);
    setTotalImages(totalNumOfImages);
  }, []);

  const addListeners = () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  const removeListeners = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  const onMouseDown = (e) => {
    e.preventDefault();
    addListeners();
    setDragState({
      dragStartIndex: imgIndex,
      dragStart: e.screenX,
      dragging: true
    });
  }

  const onMouseMove = (e) => {
    e.preventDefault();
    if (!dragState.dragging) return;
    const currentPosition = e.screenX;
    const widthPerImage = 360 / totalImages;
    let dx = (currentPosition - dragState.dragStart) / widthPerImage;
    let index = Math.floor(dx) % totalImages;
    if (index < 0) {
      index = totalImages + index - 1;
    }
    index = (index + dragState.dragStartIndex) % totalImages;
    if (index !== imgIndex) {
      setImgIndex(index);
    }
  }

  const onMouseUp = (e) => {
    e.preventDefault();
    removeListeners();
    setDragState({...dragState, dragging: false});
  }

  return (
    <div className="image-view-container">
      <img
        className="image-360"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        src={ImageAction.getImageImportByIndex(imagePath, imgIndex + 1)}
      />
    </div>
  );
};

export default ImageViewer;
