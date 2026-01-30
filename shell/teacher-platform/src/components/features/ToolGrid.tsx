import type { Tool } from '../../types';
import ToolTile from './ToolTile';

interface ToolGridProps {
  tools: Tool[];
  onToolClick?: (tool: Tool) => void;
}

export default function ToolGrid({ tools, onToolClick }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <ToolTile
          key={tool.id}
          tool={tool}
          onClick={() => onToolClick?.(tool)}
        />
      ))}
    </div>
  );
}
