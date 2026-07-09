// @togo-framework/board — THE HOST PLUGIN.
//
// Owns layout state (which widget lives in which zone + order), each widget's
// settings, edit mode, drag moves, and persistence. It imports only the `widget`
// BASE (getWidgets / types) — never a concrete `widget-*`. It arranges whatever
// registered itself, sight unseen.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getWidgets, type Zone } from "@togo-framework/widget";

const STORAGE_KEY = "togo.example.board.v1";

interface Layout {
  sidebar: string[];
  body: string[];
}
interface Persisted {
  layout: Layout;
  settings: Record<string, Record<string, unknown>>;
}

function load(): Persisted | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

// Build initial state from any saved layout, then RECONCILE against the live
// registry: drop keys whose widget is no longer installed, and place any newly
// installed widget into its hinted zone. This is why removing/adding a driver
// import "just works" without wiping the user's arrangement.
function initialState(): Persisted {
  const stored = load();
  const defs = getWidgets();
  const known = new Set(defs.map((d) => d.key));

  const sidebar = (stored?.layout.sidebar ?? []).filter((k) => known.has(k));
  const body = (stored?.layout.body ?? []).filter((k) => known.has(k));
  const placed = new Set([...sidebar, ...body]);
  for (const d of defs) {
    if (!placed.has(d.key)) (d.defaultZone === "body" ? body : sidebar).push(d.key);
  }

  const settings: Record<string, Record<string, unknown>> = { ...(stored?.settings ?? {}) };
  for (const d of defs) {
    if (d.defaultSettings && !settings[d.key]) settings[d.key] = { ...d.defaultSettings };
  }
  return { layout: { sidebar, body }, settings };
}

interface BoardApi {
  layout: Layout;
  editing: boolean;
  toggleEditing: () => void;
  move: (key: string, zone: Zone, index: number) => void;
  getSettings: (key: string) => Record<string, unknown>;
  setSettings: (key: string, patch: Record<string, unknown>) => void;
  reset: () => void;
}

const BoardCtx = createContext<BoardApi | null>(null);

export function useBoard(): BoardApi {
  const api = useContext(BoardCtx);
  if (!api) throw new Error("useBoard must be used inside <BoardProvider>");
  return api;
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => initialState());
  const [editing, setEditing] = useState(false);

  // Persist working copy on every change (mirrors the localStorage half of the
  // real board; "save as default" would additionally POST to site_settings).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo<BoardApi>(
    () => ({
      layout: state.layout,
      editing,
      toggleEditing: () => setEditing((e) => !e),
      move: (key, zone, index) =>
        setState((prev) => {
          const sidebar = prev.layout.sidebar.filter((k) => k !== key);
          const body = prev.layout.body.filter((k) => k !== key);
          const arr = zone === "sidebar" ? sidebar : body;
          const i = index < 0 || index > arr.length ? arr.length : index;
          arr.splice(i, 0, key);
          return { ...prev, layout: { sidebar, body } };
        }),
      getSettings: (key) => state.settings[key] ?? {},
      setSettings: (key, patch) =>
        setState((prev) => ({
          ...prev,
          settings: { ...prev.settings, [key]: { ...(prev.settings[key] ?? {}), ...patch } },
        })),
      reset: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState());
      },
    }),
    [state, editing],
  );

  return <BoardCtx.Provider value={api}>{children}</BoardCtx.Provider>;
}
