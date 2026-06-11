import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

/* ── Google Translate ↔ React safety patch ──────────────────────────
   Google Translate rewrites text nodes in the DOM. When React later
   re-renders those nodes it may call removeChild/insertBefore on a node
   whose parent Google already changed, throwing "Failed to execute
   'removeChild'". We make these two operations defensive so the app
   never crashes while a page is being translated. */
if (typeof Node === 'function' && Node.prototype) {
  const _removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) return child;
    return _removeChild.apply(this, arguments);
  };
  const _insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return _insertBefore.apply(this, arguments);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
