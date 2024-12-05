import React, { useState, useEffect } from "react";
import axios from "axios";
import { takeWhile } from "rxjs/operators";

const ImageComponent = ({ SRNumber, dataService, sanitizer }) => {
  const [imageDataSOne, setImageDataSOne] = useState([]);
  const [imageIcon, setImageIcon] = useState(true);
  const [alive, setAlive] = useState(true);

  const getImageErrorHandle = () => {
    // Define your error handling logic
    return [{ imgData: null, block: "Error", sector: null, number: null }];
  };

  const getImageSOne = () => {
    const blockName = `S1`;
    const formData = { SRNumber, block: blockName };

    dataService
      .imagePhysicalAT_SOne(blockName, formData)
      .pipe(takeWhile(() => alive))
      .subscribe(
        (d) => {
          if (d.Status === true) {
            const imgArray = d.Data.map((obj) => {
              const bufferView = new Uint8Array(obj.data.data);
              const blobData = URL.createObjectURL(new Blob([bufferView], { type: "image/jpeg" }));
              const imgDataBlob = sanitizer.bypassSecurityTrustUrl(blobData); // Modify if using a React-compatible sanitizer
              return {
                imgData: imgDataBlob,
                block: obj.block,
                sector: obj.sector,
                number: obj.number,
              };
            });
            setImageDataSOne(imgArray);
            setImageIcon(false);
          } else {
            setImageDataSOne(getImageErrorHandle());
            setImageIcon(true);
          }
        },
        (error) => {
          console.error("Error fetching image data:", error);
          setImageDataSOne(getImageErrorHandle());
          setImageIcon(true);
        }
      );
  };

  useEffect(() => {
    getImageSOne();

    // Cleanup to mark component as unmounted
    return () => {
      setAlive(false);
    };
  }, [SRNumber]);

  return (
    <div>
      {imageIcon ? (
        <p>No Image Available</p>
      ) : (
        imageDataSOne.map((img, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <p>Block: {img.block}</p>
            <p>Sector: {img.sector}</p>
            <p>Number: {img.number}</p>
            <img src={img.imgData} alt={`Image ${index}`} style={{ maxWidth: "100%" }} />
          </div>
        ))
      )}
    </div>
  );
};

export default ImageComponent;
