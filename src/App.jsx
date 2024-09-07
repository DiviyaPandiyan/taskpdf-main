import React, { useRef, useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import logo from './assets/paperz.png';

const MyPage = () => {
  const pageRef = useRef();
  const [base64Image, setBase64Image] = useState('');

  // Convert the image to base64 when the component mounts
  useEffect(() => {
    const convertImageToBase64 = (imageUrl) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        setBase64Image(canvas.toDataURL('image/jpeg')); // Convert image to base64
      };
      img.src = imageUrl;
    };

    convertImageToBase64(logo);
  }, []);

  // Handle PDF generation
  const handleGeneratePdf = () => {
    const htmlContent = pageRef.current.innerHTML;
    const pdfMakeContent = htmlToPdfmake(htmlContent, {
      defaultStyles: {
        h1: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
        img: { alignment: 'center', margin: [0, 20, 0, 20] },
      },
    });

    const documentDefinition = { content: pdfMakeContent };
    pdfMake.createPdf(documentDefinition).download('webpage-content.pdf');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div ref={pageRef}>
        <h1>Welcome</h1>
        {base64Image && <img src={base64Image} alt="Logo" width={100} style={{ marginBottom: '20px' }} />}
      </div>
      <button onClick={handleGeneratePdf}>Download Page as PDF</button>
    </div>
  );
};

export default MyPage;
