import React, {useEffect, useState} from "react";
import "./ImageViewer.css";
import * as ImageAction from "../actions";
import {getHDImageUrl} from "../utils/helper";

const ImageViewer = ({ imagePath }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(1);
  const [showZoomedImg, setShowZoomedImg] = useState(false);
  const [clickFlag, setClickFlag] = useState(false);
  const [startPoint, setStartPoint] = useState({
    x: 0,
    y: 0,
  });
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    imgX: 0,
    imgY: 0,
    width: 512,
    height: 512,
  });
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
    console.log("onMouseDown");
    e.preventDefault();
    setStartPoint({
      x : e.clientX,
      y : e.clientY,
    });
    addListeners();
    setDragState({
      dragStartIndex: imgIndex,
      dragStart: e.screenX,
      dragging: true
    });
  }

  const onMouseMove = (e) => {
    e.preventDefault();
    if (showZoomedImg) {
      setCrop({
        ...crop,
        x: e.pageX - crop.imgX,
        y: e.pageY - crop.imgY,
      });
    }
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
    console.log("onMouseUp");
    // monitoring mousedown start point in order to find out the offset of mousedown and mouseup,
    // in order to determine the mousedown behaviour is for drag or click
    if (startPoint.x && startPoint.y) {
      let difX = e.clientX - startPoint.x;
      let difY = e.clientY - startPoint.y;
      let difD = Math.sqrt(difX * difX + difY * difY)
      // (offset in [0, 5] is click, otherwise is drag)
      setClickFlag(difD >= 0 && difD <= 5);
    }
    removeListeners();
    setDragState({...dragState, dragging: false});
  }

  const onClick = (e) => {
    console.log("onClick");
    if (dragState.dragging) return;
    console.log("click", clickFlag, showZoomedImg);
    if (clickFlag || showZoomedImg) {
      setShowZoomedImg(!showZoomedImg);
      if (showZoomedImg) {
        setCrop({
          ...crop,
          x: e.pageX - crop.imgX,
          y: e.pageY - crop.imgY,
        });
      }
    }
    setClickFlag(false);
  };

  const onLoad = (e) => {
    // loaded the image
    window.dispatchEvent(new Event('resize'));
    // get the img height and width
    setCrop({
      ...crop,
      imgX: e.currentTarget.x,
      imgY: e.currentTarget.y,
      width: e.currentTarget.width,
      height: e.currentTarget.height,
    })
  };

  return (
    <div className="image-view-container">
      <img
        className="image-360"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onLoad={onLoad}
        draggable={!showZoomedImg}
        // the src image will be shown determined if the function is for zoom or for 360 view
        src={showZoomedImg ?
          `${getHDImageUrl(imagePath, imgIndex + 1, crop.x, crop.y, crop.width, crop.height, "1k")}` :
          ImageAction.getImageImportByIndex(imagePath, imgIndex + 1)
        }
        alt="" />
    </div>
  );
};

export default ImageViewer;
