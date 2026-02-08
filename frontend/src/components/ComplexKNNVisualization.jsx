
import React, { useRef, useEffect, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Cell } from 'recharts';

const ComplexKNNVisualization = ({ data, isClassification }) => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('scatter'); // scatter, error, matrix/residuals

  // --- Canvas Drawing Logic for Scatter Plot ---
  useEffect(() => {
    if (activeTab !== 'scatter' || !canvasRef.current || !data) return;


    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Padding
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Find min/max for scaling
    // X is assumed to be [[x1, x2], ...] from backend (either 2 selected features or PCA)
    const X = data.X;
    const y = data.y;

    if (!X || X.length === 0) return;

    const xValues = X.map(p => p[0]);
    const yValues = X.map(p => p[1]);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;

    // Helper to map coordinates
    const mapX = (val) => padding + ((val - xMin) / xRange) * plotWidth;
    const mapY = (val) => height - padding - ((val - yMin) / yRange) * plotHeight;

    // Draw Axes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Y Axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);

    // X Axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Points
    X.forEach((point, i) => {
      const cx = mapX(point[0]);
      const cy = mapY(point[1]);
      const target = y[i];

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);

      if (isClassification) {
        // Color based on class
        // Simple hashing for colors if classes are arbitrary strings
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        // Try to map classes if provided, else hash
        let colorIndex = 0;
        if (data.classes) {
          colorIndex = data.classes.indexOf(String(target));
          if (colorIndex === -1) colorIndex = 0; // Fallback
        }
        ctx.fillStyle = colors[colorIndex % colors.length];
      } else {
        // Regression: Color gradient based on value? 
        // For simple visualization, let's just use a single color or map value to intensity
        // For now, static color
        ctx.fillStyle = '#3b82f6';
      }

      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Labels if available?
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    // X Axis Label
    ctx.fillText("Feature 1 / PC1", width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Feature 2 / PC2", 0, 0);
    ctx.restore();

  }, [data, isClassification, activeTab]);

  // --- Helper for Confusion Matrix Rendering ---
  const renderConfusionMatrix = () => {
    if (!data.confusion_matrix) return <div>No Confusion Matrix Data</div>;

    // Simple table for Confusion Matrix
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <h3>Confusion Matrix</h3>
        <table style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem' }}>Predicted \ Actual</th>
              {data.classes && data.classes.map((cls, i) => <th key={i} style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>{cls}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.confusion_matrix.map((row, i) => (
              <tr key={i}>
                <th style={{ padding: '0.5rem', borderRight: '1px solid #ddd' }}>{data.classes ? data.classes[i] : i}</th>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '1rem',
                    border: '1px solid #eee',
                    textAlign: 'center',
                    backgroundColor: i === j ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    fontWeight: i === j ? 'bold' : 'normal'
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', backgroundColor: 'white' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('scatter')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: activeTab === 'scatter' ? '#3b82f6' : 'transparent',
            color: activeTab === 'scatter' ? 'white' : '#4b5563',
            cursor: 'pointer'
          }}
        >
          {data.visualization_type === 'PCA_2D' ? 'PCA Projection' : 'Scatter Plot'}
        </button>

        {data.validation_curve && (
          <button
            onClick={() => setActiveTab('error')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: activeTab === 'error' ? '#3b82f6' : 'transparent',
              color: activeTab === 'error' ? 'white' : '#4b5563',
              cursor: 'pointer'
            }}
          >
            Error Rate vs K
          </button>
        )}

        <button
          onClick={() => setActiveTab('analysis')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: activeTab === 'analysis' ? '#3b82f6' : 'transparent',
            color: activeTab === 'analysis' ? 'white' : '#4b5563',
            cursor: 'pointer'
          }}
        >
          {isClassification ? 'Confusion Matrix' : 'Residuals'}
        </button>
      </div>

      {/* Content Area */}
      <div style={{ width: '100%', height: '85%' }}>

        {/* VIEW 1: SCATTER PLOT (CANVAS) */}
        <div style={{ width: '100%', height: '100%', display: activeTab === 'scatter' ? 'block' : 'none' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          {isClassification && (
            <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
              * Colors represent different classes
            </div>
          )}
        </div>

        {/* VIEW 2: ERROR vs K (RECHARTS) */}
        {activeTab === 'error' && data.validation_curve && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.validation_curve.k_values.map((k, i) => ({ k, error: data.validation_curve.errors[i] }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="k" label={{ value: 'Neighbors (K)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Error Rate', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="error" stroke="#ef4444" activeDot={{ r: 8 }} name="Error Rate" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* VIEW 3: ANALYSIS (Confusion Matrix / Residuals) */}
        {activeTab === 'analysis' && (
          isClassification ? renderConfusionMatrix() : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Actual vs Predicted</h3>
              {/* 
                  Residual Plot logic: 
                  We need y_test and y_pred from backend.
                  If not available, show placeholder.
               */}
              {data.y_test && data.y_pred ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="actual" name="Actual" label={{ value: 'Actual', position: 'insideBottom' }} />
                    <YAxis type="number" dataKey="predicted" name="Predicted" label={{ value: 'Predicted', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Points" data={data.y_test.map((val, i) => ({ actual: val, predicted: data.y_pred[i] }))} fill="#8884d8" />
                    {/* Ideal line x=y can be added as a reference line if needed */}
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div>No Residual Data Available</div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ComplexKNNVisualization;

