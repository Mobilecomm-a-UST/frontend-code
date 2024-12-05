import React, { useEffect, useRef, useState } from "react";

const AddWatermark = (props) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [watermarkedImage, setWatermarkedImage] = useState(null);
    const [latitude ,setLatitude] = useState('')
    const [longitude , setLongitude] = useState('')
    const canvasRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const addWatermark = () => {
        if (!selectedImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the original image on the canvas
            ctx.drawImage(img, 0, 0);


            // Define watermark details
            const today = new Date().toLocaleString();

            // Set watermark text styles
            ctx.font = "40px Arial";
            ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Semi-transparent white
            ctx.textAlign = "right";

            // Add watermark text to bottom-right corner
            const margin = 20;
            const x = canvas.width - margin;
            const y = canvas.height - margin;

            //   // Add text watermark
            // ctx.fillText(`<div></div>Watermark Text `, canvas.width - 20, canvas.height - 20);

          
            ctx.fillText(latitude,x- 30, y - 80); // Add latitude
            ctx.fillText(longitude, x - 30, y - 40); // Add longitude
            ctx.fillText(today, x - 30, y); // Add today's date

            const quality = 0.8; // Compression quality (0.0 to 1.0)
            let dataURL = canvas.toDataURL("image/jpeg", quality);

            // Ensure the size is under 2MB
            while (dataURL.length > 2 * 1024 * 1024) {
                dataURL = canvas.toDataURL("image/jpeg", quality - 0.1);
            }

            // Save the compressed image
                 // const link = document.createElement("a");
                // link.href = dataURL;
                // link.download = "compressed-watermarked-image.jpg";
                // link.click();

            // If you want to use an image as a watermark
            // const watermark = new Image();
            // watermark.src = "path/to/watermark.png";
            // watermark.onload = () => {
            //   ctx.drawImage(watermark, canvas.width - 120, canvas.height - 120, 100, 100);
            // };
            // Get the watermarked image as a data URL


            const watermarkedDataURL = canvas.toDataURL();
            setWatermarkedImage(watermarkedDataURL);
        };

        img.src = selectedImage;
    };

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(`Latitude: ${position.coords.latitude.toFixed(4)}°`);
            setLongitude(`Longitude: ${position.coords.longitude.toFixed(4)}°`);
          });
    },[])

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Watermark Image</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <br />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            {selectedImage && (
                <>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ maxWidth: "300px", marginTop: "10px" }}
                    />
                    <br />
                    <button onClick={addWatermark}>Add Watermark</button>
                </>
            )}
            {watermarkedImage && (
                <>
                    <h3>Watermarked Image:</h3>
                    <img
                        src={watermarkedImage}
                        alt="Watermarked"
                        style={{ maxWidth: "800px", marginTop: "10px" }}
                    />
                    <a href={watermarkedImage} download="watermarked-image.png">
                        Download Image
                    </a>
                </>
            )}
        </div>
    );
};

export default React.memo(AddWatermark);
