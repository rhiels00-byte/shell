import type { Tool } from '../../types';
import Card from '../common/Card';

interface ToolTileProps {
  tool: Tool;
  onClick?: () => void;
}

export default function ToolTile({ tool, onClick }: ToolTileProps) {
  const categoryColors = {
    create: 'bg-category-create text-white',
    analyze: 'bg-category-analyze text-white',
  };

  const categoryLabels = {
    create: '생성',
    analyze: '분석',
  };

  return (
    <Card hoverable onClick={onClick}>
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-4xl">{tool.icon}</div>
        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${categoryColors[tool.category]}
          `}
        >
          {categoryLabels[tool.category]}
        </span>
      </div>
    </Card>
  );
}
