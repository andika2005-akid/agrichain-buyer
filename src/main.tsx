import { createRoot } from "react-dom/client";
import "./index.css";

// Global error handler to display runtime errors in DOM for easier debugging
window.addEventListener("error", (ev) => {
	try {
		const root = document.getElementById("root");
		if (root) {
			root.innerHTML = `<div style="padding:24px;font-family:sans-serif; background:#fff;color:#111;min-height:100vh;">
				<h2>Runtime error occurred</h2>
				<pre style="white-space:pre-wrap;">${(ev && (ev.error && ev.error.message)) || ev.message || 'Unknown error'}</pre>
				<p>Check the browser console for full stack trace.</p>
			</div>`;
		}
	} catch (e) {
		// ignore
	}
});

// Dynamically import App after registering error handler so import-time errors can be caught
try {
	(async () => {
		const { default: App } = await import("./App.tsx");
		createRoot(document.getElementById("root")!).render(<App />);
	})();
} catch (err: any) {
	const root = document.getElementById("root");
	if (root) {
		root.innerHTML = `<div style="padding:24px;font-family:sans-serif;background:#fff;color:#111;min-height:100vh;">
			<h2>Render error</h2>
			<pre style="white-space:pre-wrap;">${err?.message || String(err)}</pre>
			<p>Open the browser console for details.</p>
		</div>`;
	}
	console.error(err);
}
