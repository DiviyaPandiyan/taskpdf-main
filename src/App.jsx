import React, { useRef, useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import logo from './assets/paperz.png';

const MyPage = () => {
  const pageRef = useRef();
  const [base64Image, setBase64Image] = useState('');

  // Convert the image to base64 format
  useEffect(() => {
    const convertImageToBase64 = (imageUrl) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setBase64Image(canvas.toDataURL('image/jpeg')); // JPEG format for compatibility
      };
      img.src = imageUrl;
    };

    convertImageToBase64(logo); // Convert the logo image when the component mounts
  }, []);

  // Handle PDF generation with the base64 image and welcome text using useRef
  const handleGeneratePdf = () => {
    // Get the HTML content as a string
    const htmlContent = pageRef.current.innerHTML;

    // Convert HTML to PDFMake format with custom styles
    const pdfMakeContent = htmlToPdfmake(htmlContent, {
      defaultStyles: {
        h1: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
        img: { alignment: 'center', margin: [0, 20, 0, 20] },
      },
    });

    // Define the document content and styles
    const documentDefinition = {
      content: pdfMakeContent,
    };

    // Generate the PDF
    pdfMake.createPdf(documentDefinition).download('webpage-content.pdf');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Content to be captured using useRef */}
      <div ref={pageRef}>
        {/* Display the welcome text */}
        <h1 style={{ marginBottom: '20px' }}>Welcome</h1>

        {/* Display the image on the webpage */}
        {base64Image && (
          <img
            src={base64Image}
            alt="Logo"
            width={100}
            style={{ marginBottom: '20px' }}
          />
        )}
      </div>

      {/* Button to generate and download the PDF */}
      <button onClick={handleGeneratePdf}>Download Page as PDF</button>
    </div>
  );
};

export default MyPage;
