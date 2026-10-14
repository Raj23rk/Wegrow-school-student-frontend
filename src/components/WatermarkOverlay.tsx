import React from 'react';

interface WatermarkProps {
  studentName: string;
  rollNumber: string;
}

export const WatermarkOverlay: React.FC<WatermarkProps> = ({ studentName, rollNumber }) => {
  const token = `${studentName} • ${rollNumber} • VIEW ONLY`;
  const items = Array.from({ length: 48 }, (_, i) => i);

  return (
    <div className="watermark-overlay" aria-hidden="true">
      {items.map((i) => (
        <span key={i} className="watermark-token">
          {token}
        </span>
      ))}
    </div>
  );
};
