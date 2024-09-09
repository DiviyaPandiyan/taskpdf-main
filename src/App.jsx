import React, { useRef, useState, useEffect, useCallback } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import logo from "./assets/paperz.png";

// Helper function to fetch and convert image to base64
const fetchImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch (error) {
    console.error("Error fetching or converting image:", error);
    throw error;
  }
};

// Helper function to convert Blob to Base64 string
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const MyPage = () => {
  const pageRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");

  // Load image as base64 once the component mounts
  useEffect(() => {
    const loadImage = async () => {
      try {
        const base64 = await fetchImageAsBase64(logo);
        setBase64Image(base64);
      } catch (error) {
        // Handle the error gracefully, possibly by showing a fallback image
        console.error("Image loading failed", error);
      }
    };

    loadImage();
  }, []);

  // Generate PDF from HTML content
  const handleGeneratePdf = useCallback(() => {
    if (!pageRef.current) {
      console.error("No content to generate PDF from");
      return;
    }

    const htmlContent = pageRef.current.innerHTML;
    const pdfMakeContent = htmlToPdfmake(htmlContent);

    const documentDefinition = {
      content: pdfMakeContent,
    };

    pdfMake.createPdf(documentDefinition).download("webpage-content.pdf");
  }, []);

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
      <button onClick={handleGeneratePdf} style={{ marginTop: "20px" }}>
        Download Page as PDF
      </button>
    </div>
  );
};

export default MyPage;
