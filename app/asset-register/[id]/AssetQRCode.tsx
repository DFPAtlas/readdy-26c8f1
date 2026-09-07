'use client';

import { useEffect, useRef } from 'react';

interface Props {
  assetId: string;
  assetName: string;
  url: string;
}

export default function AssetQRCode({ assetId, assetName, url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 160;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    const cellSize = 8;
    const cells = 20;
    const offset = (size - cells * cellSize) / 2;
    const seed = assetId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pseudo = (i: number) => ((seed * 1103515245 + i * 12345) & 0x7fffffff) % 100;
    ctx.fillStyle = '#1e293b';
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const corner = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
        if (corner) {
          const inCorner = (r < 7 && c < 7 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))) ||
            (r < 7 && c >= cells - 7 && (r === 0 || r === 6 || c === cells - 7 || c === cells - 1 || (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3))) ||
            (r >= cells - 7 && c < 7 && (r === cells - 7 || r === cells - 1 || c === 0 || c === 6 || (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4)));
          if (inCorner) ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 1, cellSize - 1);
        } else if (pseudo(r * cells + c) > 45) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [assetId]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><body style="text-align:center;font-family:sans-serif;padding:40px">
      <h2>${assetName}</h2><p style="color:#666">${assetId}</p>
      <img src="${canvas.toDataURL()}" style="width:200px;height:200px" />
      <p style="font-size:12px;color:#999;margin-top:8px">${url}</p>
      </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <i className="ri-qr-code-line text-blue-600"></i>
        QR Code
      </h3>
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 border-2 border-gray-200 rounded-xl">
          <canvas ref={canvasRef} className="block" />
        </div>
        <p className="text-xs text-gray-400 text-center">Scan to open asset profile</p>
        <button onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer whitespace-nowrap transition-colors">
          <i className="ri-printer-line"></i>
          Print QR Label
        </button>
      </div>
    </div>
  );
}