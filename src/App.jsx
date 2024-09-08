import React, { useRef, useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import logo from "./assets/paperz.png";

const MyPage = () => {
  const pageRef = useRef();
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    // Convert image file to base64
    const convertImageFileToBase64 = (file) => {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result);
      reader.readAsDataURL(file);
    };

    // Fetch and convert the image to base64
    fetch(logo)
      .then((res) => res.blob())
      .then((blob) => convertImageFileToBase64(blob));
  }, []);

  // Generate PDF
  const handleGeneratePdf = () => {
    const htmlContent = pageRef.current.innerHTML;
    const pdfMakeContent = htmlToPdfmake(htmlContent);

    const documentDefinition = {
      content: pdfMakeContent
    };

    pdfMake.createPdf(documentDefinition).download("webpage-content.pdf");
  };
  return(
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div ref={pageRef}>
        <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Welcome</h1>
        {base64Image && (
          <img
            src={base64Image}
            alt="Logo"
            width={100}
            style={{ marginBottom: "20px", textAlign: "center" }}
          />
        )}
        
      </div>
      <button onClick={handleGeneratePdf}>Download Page as PDF</button>
    </div>
  );
};

export default MyPage;
