import { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

// Helper: read a CSS custom property from the document root.
// The 2D canvas API doesn't resolve var() — it needs a real color string.
function cssVar(name) {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function GraphCanvas({ graph, path, activeNode }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resolve theme colors once per render
    const color = {
      grid: cssVar('--color-border'),
      edge: cssVar('--color-border-hover'),
      accent: cssVar('--color-accent'),
      accentLight: cssVar('--color-accent-light'),
      accentSubtle: cssVar('--color-accent-subtle'),
      bgTertiary: cssVar('--color-bg-tertiary'),
      bgElevated: cssVar('--color-bg-elevated'),
      textPrimary: cssVar('--color-text-primary'),
      textSecondary: cssVar('--color-text-secondary'),
      success: cssVar('--color-success'),
      successBg: cssVar('--color-success-bg'),
      danger: cssVar('--color-danger'),
      dangerBg: cssVar('--color-danger-bg'),
    };

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = color.grid;
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(y, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Edges
    graph.edges.forEach(e => {
      const fromNode = graph.nodes.find(n => n.id === e.from);
      const toNode = graph.nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;

      let inPath = false;
      if (path && path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          if ((path[i] === e.from && path[i + 1] === e.to) ||
              (path[i] === e.to && path[i + 1] === e.from)) {
            inPath = true;
            break;
          }
        }
      }

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = inPath ? color.accent : color.edge;
      ctx.lineWidth = inPath ? 4 : 2;
      ctx.stroke();

      // Cost bubble at midpoint
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.save();
      ctx.fillStyle = inPath ? color.accent : color.bgElevated;
      ctx.strokeStyle = inPath ? color.accentLight : color.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(midX, midY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = inPath ? '#FFFFFF' : color.textPrimary;
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`₹${e.cost}`, midX, midY);
      ctx.restore();
    });

    // Nodes
    graph.nodes.forEach(n => {
      const isSelected = path && path.includes(n.id);
      const isActive = activeNode === n.id;
      const isStart = path && path[0] === n.id;
      const isEnd = path && path[path.length - 1] === n.id;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);

      let nodeBg = color.bgTertiary;
      let nodeBorder = color.grid;

      if (isStart) { nodeBg = color.successBg; nodeBorder = color.success; }
      else if (isEnd) { nodeBg = color.dangerBg; nodeBorder = color.danger; }
      else if (isSelected) { nodeBg = color.accentSubtle; nodeBorder = color.accent; }
      else if (isActive) { nodeBg = color.bgElevated; nodeBorder = color.accentLight; }

      ctx.fillStyle = nodeBg;
      ctx.fill();
      ctx.strokeStyle = nodeBorder;
      ctx.lineWidth = isSelected || isActive ? 3 : 1.5;
      ctx.stroke();

      // Type label inside node
      const typeLabel = (
        n.type === 'warehouse' ? 'WH' :
        n.type === 'hub' ? 'HB' :
        n.type === 'clinic' ? 'CL' :
        n.type === 'pharmacy' ? 'PH' : ''
      );
      ctx.fillStyle = color.textPrimary;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typeLabel, n.x, n.y - 2);

      // Facility name below node
      ctx.fillStyle = isSelected ? color.textPrimary : color.textSecondary;
      ctx.font = isSelected ? 'bold 10px sans-serif' : '10px sans-serif';
      ctx.fillText(n.label, n.x, n.y + 36);
    });
  }, [graph, path, activeNode, theme]);

  return (
    <div style={canvasContainerStyle}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={canvasStyle}
      />
    </div>
  );
}

const canvasContainerStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  backgroundColor: 'var(--color-bg-secondary)',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 'var(--space-4)',
};

const canvasStyle = {
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
};
