import React, { useRef, useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from './vfs_fonts.js';
import htmlToPdfmake from 'html-to-pdfmake';
import logo from './assets/react.png'

pdfMake.vfs = pdfFonts;

const MyPage = () => {
  const pageRef = useRef();
  const [base64Image, setBase64Image] = useState('');
  const imageUrl = logo;

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  useEffect(() => {
    // Convert the image to base64 when the component mounts
    convertImageToBase64(imageUrl)
      .then(base64 => {
        setBase64Image(base64);
      })
      .catch(error => {
        console.error('Error converting image to base64:', error);
      });
  }, [imageUrl]);

  const handleGeneratePdf = async () => {
    try {
      // Get the HTML content as a string
      const htmlContent = pageRef.current.innerHTML;

      // Convert HTML to PDFMake format
      const pdfMakeContent = htmlToPdfmake(htmlContent, {
        defaultStyles: {
          h1: { fontSize: 22, bold: true },
          h2: { fontSize: 18, bold: true },
          p: { fontSize: 12 },
        },
      });

      // Define the document content and styles, including the base64 image
      const documentDefinition = {
        content: [
          ...pdfMakeContent,
        ],
        defaultStyle: {
          fontSize: 12,
        },
      };

      // Generate the PDF
      pdfMake.createPdf(documentDefinition).download('webpage-content.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <div ref={pageRef}>
        {/* Your entire webpage content */}
        <h1 style={{ textAlign: 'center', color: '#333' }}>Welcome to My Page</h1>

        {base64Image && <img src={base64Image} alt="Base64 Image" width={100} />}
        
     
      </div>
      <button onClick={handleGeneratePdf}>Download Page as PDF</button>
    </div>
  );
};

export default MyPage;
