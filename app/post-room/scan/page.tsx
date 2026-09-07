'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function DeliveryScanPage() {
  const [scanMode, setScanMode] = useState('qr'); // 'qr' or 'photo'
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Mock delivery database for QR lookup
  const deliveryDatabase = {
    'PKG-2024-0125': {
      id: 'PKG-2024-0125',
      trackingNumber: 'FX123456789',
      sender: 'Tech Solutions Inc.',
      recipient: 'John Smith',
      department: 'IT Department',
      status: 'pending-delivery',
      description: 'Technical documentation and contracts'
    },
    'PKG-2024-0126': {
      id: 'PKG-2024-0126',
      trackingNumber: 'UPS987654321',
      sender: 'Office Supplies Direct',
      recipient: 'Sarah Johnson',
      department: 'Marketing',
      status: 'pending-delivery',
      description: 'Marketing materials and promotional items'
    },
    'FX123456789': {
      id: 'PKG-2024-0125',
      trackingNumber: 'FX123456789',
      sender: 'Tech Solutions Inc.',
      recipient: 'John Smith',
      department: 'IT Department',
      status: 'pending-delivery',
      description: 'Technical documentation and contracts'
    },
    'UPS987654321': {
      id: 'PKG-2024-0126',
      trackingNumber: 'UPS987654321',
      sender: 'Office Supplies Direct',
      recipient: 'Sarah Johnson',
      department: 'Marketing',
      status: 'pending-delivery',
      description: 'Marketing materials and promotional items'
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      if (scanMode === 'qr') {
        startQRScanning();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startQRScanning = () => {
    const scanInterval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Mock QR detection - in real implementation, use a QR library like qr-scanner
        const mockQRDetection = Math.random();
        if (mockQRDetection > 0.98) { // Simulate successful QR detection
          const mockQRCodes = ['PKG-2024-0125', 'PKG-2024-0126', 'FX123456789', 'UPS987654321'];
          const detectedCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
          
          handleQRDetected(detectedCode);
          clearInterval(scanInterval);
        }
      }
    }, 500);

    // Auto-stop scanning after 30 seconds if no QR detected
    setTimeout(() => {
      clearInterval(scanInterval);
    }, 30000);
  };

  const handleQRDetected = (qrCode) => {
    const deliveryInfo = deliveryDatabase[qrCode];
    if (deliveryInfo) {
      setScannedResult({
        type: 'qr',
        code: qrCode,
        delivery: deliveryInfo,
        timestamp: new Date().toLocaleString()
      });
      
      // Add to scan history
      setScanHistory(prev => [
        { ...deliveryInfo, scanType: 'QR Code', timestamp: new Date().toLocaleString() },
        ...prev.slice(0, 9)
      ]);
      
      stopCamera();
    } else {
      alert(`QR Code detected: ${qrCode}, but no matching delivery found in system.`);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Mock photo processing delay
      setTimeout(() => {
        setCapturedPhoto(photoData);
        setScannedResult({
          type: 'photo',
          photo: photoData,
          timestamp: new Date().toLocaleString(),
          analysis: 'Package photo captured successfully. Manual identification required.'
        });
        
        // Add to scan history
        setScanHistory(prev => [
          { 
            id: `PHOTO-${Date.now()}`, 
            scanType: 'Photo Capture', 
            timestamp: new Date().toLocaleString(),
            status: 'photo-captured',
            description: 'Package photo documentation'
          },
          ...prev.slice(0, 9)
        ]);
        
        setIsProcessing(false);
        stopCamera();
      }, 2000);
    }
  };

  const resetScan = () => {
    setScannedResult(null);
    setCapturedPhoto(null);
    setIsProcessing(false);
  };

  const markAsDelivered = () => {
    if (scannedResult && scannedResult.delivery) {
      alert(`Package ${scannedResult.delivery.id} marked as delivered!`);
      resetScan();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* PWA Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/post-room" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
                <i className="ri-arrow-left-line text-white"></i>
              </Link>
              <h1 className="text-lg font-bold">Delivery Scanner</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-300">{isScanning ? 'Scanning' : 'Ready'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Scan Mode Toggle */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Scan Mode</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setScanMode('qr')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                scanMode === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <i className="ri-qr-code-line mr-2"></i>
              QR Code
            </button>
            <button
              onClick={() => setScanMode('photo')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                scanMode === 'photo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <i className="ri-camera-line mr-2"></i>
              Photo
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="relative aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                {scanMode === 'qr' && (
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 opacity-75 animate-pulse"></div>
                  </div>
                )}
                
                {scanMode === 'photo' && (
                  <div className="absolute inset-4 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <i className="ri-camera-line text-4xl mb-2"></i>
                      <p className="text-sm">Position package in frame</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="ri-loader-4-line text-4xl animate-spin mb-4"></i>
                  <p className="text-lg">Processing image...</p>
                  <p className="text-sm text-gray-300">Please wait</p>
                </div>
              </div>
            )}

            {/* No Camera State */}
            {!isScanning && !scannedResult && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <i className="ri-camera-off-line text-6xl mb-4"></i>
                  <p className="text-lg">Camera not active</p>
                  <p className="text-sm">Press start to begin scanning</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="p-4 border-t border-gray-700">
            {!isScanning && !scannedResult && (
              <button
                onClick={startCamera}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-camera-line mr-2"></i>
                Start {scanMode === 'qr' ? 'QR Scanner' : 'Camera'}
              </button>
            )}

            {isScanning && (
              <div className="flex space-x-3">
                {scanMode === 'photo' && (
                  <button
                    onClick={capturePhoto}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    <i className="ri-camera-fill mr-2"></i>
                    Capture Photo
                  </button>
                )}
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-stop-line mr-2"></i>
                  Stop Scanning
                </button>
              </div>
            )}

            {scannedResult && (
              <div className="flex space-x-3">
                <button
                  onClick={resetScan}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Scan Again
                </button>
                {scannedResult.delivery && (
                  <button
                    onClick={markAsDelivered}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Mark Delivered
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scan Result */}
        {scannedResult && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <i className={`${scannedResult.type === 'qr' ? 'ri-qr-code-line' : 'ri-image-line'} mr-2 text-green-400`}></i>
              Scan Result
            </h3>

            {scannedResult.type === 'qr' && scannedResult.delivery && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Package ID:</span>
                  <span className="text-white font-medium">{scannedResult.delivery.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracking:</span>
                  <span className="text-white font-medium">{scannedResult.delivery.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white font-medium">{scannedResult.delivery.sender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white font-medium">{scannedResult.delivery.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department:</span>
                  <span className="text-white font-medium">{scannedResult.delivery.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    {scannedResult.delivery.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {scannedResult.type === 'photo' && (
              <div className="space-y-3">
                <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={scannedResult.photo}
                    alt="Captured package"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-300 text-sm">{scannedResult.analysis}</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
              Scanned at {scannedResult.timestamp}
            </div>
          </div>
        )}

        {/* Recent Scans */}
        {scanHistory.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Recent Scans</h3>
            <div className="space-y-2">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className={`${scan.scanType === 'QR Code' ? 'ri-qr-code-line' : 'ri-camera-line'} text-gray-400`}></i>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {scan.id || scan.description}
                      </p>
                      <p className="text-gray-400 text-xs">{scan.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{scan.scanType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}