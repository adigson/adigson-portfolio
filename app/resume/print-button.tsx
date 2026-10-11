"use client";

export default function PrintButton() {
  return (
    <button className="print-button" onClick={() => window.print()} type="button">
      Print / Save as PDF
    </button>
  );
}
