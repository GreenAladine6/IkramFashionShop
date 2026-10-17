import type { ReactNode } from "react";
import { Button } from "./Button";
export function Dialog({ open, title, children, onClose, actions }: { open: boolean; title: string; children: ReactNode; onClose: () => void; actions?: ReactNode }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(e) => e.stopPropagation()}><div className="modal-top"><div id="dialog-title" className="display-title">{title}</div><Button variant="text" onClick={onClose}>Close</Button></div>{children}{actions && <div className="modal-actions">{actions}</div>}</section></div>;
}
