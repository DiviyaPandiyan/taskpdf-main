import React, { useRef, useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import logo from "./assets/paperz.png";

const MyPage = () => {
  const pageRef = useRef();
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    // Fetch and convert the image to base64
    const fetchAndConvertImage = async () => {
      try {
        const response = await fetch(logo);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setBase64Image(reader.result);
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching or converting image:", error);
      }
    };

    fetchAndConvertImage();
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

  return (
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