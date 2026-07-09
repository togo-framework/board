// @togo-framework/board — renders the two zones and wires HTML5 drag-and-drop.
// Each placed key is resolved through the registry (getWidget) — the host has no
// compile-time knowledge of any specific widget.
import { useState } from "react";
import { getWidget, WidgetCard, type Zone } from "@togo-framework/widget";
import { useBoard } from "./BoardProvider";

function Tile({ widgetKey, zone, index }: { widgetKey: string; zone: Zone; index: number }) {
  const board = useBoard();
  const def = getWidget(widgetKey);
  if (!def) return null; // registered widget went away — skip silently
  const { Comp } = def;

  const handle = board.editing ? (
    <span
      className="drag-handle"
      draggable
      title="Drag to move"
      onDragStart={(e) => {
        e.dataTransfer.setData("text/widget-key", widgetKey);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      ⠿
    </span>
  ) : null;

  return (
    <div
      className="tile"
      data-key={widgetKey}
      onDragOver={(e) => {
        if (board.editing) e.preventDefault();
      }}
      onDrop={(e) => {
        const key = e.dataTransfer.getData("text/widget-key");
        if (key) {
          e.preventDefault();
          e.stopPropagation();
          board.move(key, zone, index); // drop ONTO a tile → take its slot
        }
      }}
    >
      <WidgetCard title={def.title} handle={handle}>
        <Comp
          settings={board.getSettings(widgetKey)}
          setSettings={(patch) => board.setSettings(widgetKey, patch)}
          editing={board.editing}
        />
      </WidgetCard>
    </div>
  );
}

function ZoneColumn({ zone, keys, className }: { zone: Zone; keys: string[]; className: string }) {
  const board = useBoard();
  const [over, setOver] = useState(false);
  return (
    <div
      className={`zone ${className}${over ? " zone-over" : ""}${board.editing ? " zone-edit" : ""}`}
      onDragOver={(e) => {
        if (board.editing) {
          e.preventDefault();
          setOver(true);
        }
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        setOver(false);
        const key = e.dataTransfer.getData("text/widget-key");
        if (key) board.move(key, zone, -1); // drop on empty area → append to end
      }}
    >
      {keys.map((k, i) => (
        <Tile key={k} widgetKey={k} zone={zone} index={i} />
      ))}
      {board.editing && keys.length === 0 && <div className="zone-empty">drop a widget here</div>}
    </div>
  );
}

export function Board() {
  const board = useBoard();
  return (
    <div className="board">
      <ZoneColumn zone="sidebar" keys={board.layout.sidebar} className="sidebar" />
      <ZoneColumn zone="body" keys={board.layout.body} className="body" />
    </div>
  );
}
