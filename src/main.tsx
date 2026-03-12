import { createRoot } from "react-dom/client";
import "./index.css";

// Global error handler to display runtime errors in DOM for easier debugging
window.addEventListener("error", (ev) => {
	try {
		const msg = (ev && (ev.error && ev.error.message)) || ev.message || "Unknown error";
		const overlayId = "__runtime_error_overlay";
		let container = document.getElementById(overlayId) as HTMLDivElement | null;
		if (!container) {
			container = document.createElement("div");
			container.id = overlayId;
			container.style.cssText = "position:fixed;inset:0;overflow:auto;padding:24px;background:rgba(255,255,255,0.98);z-index:9999;font-family:sans-serif;color:#111;";
			document.body.appendChild(container);
		}
		container.innerHTML = `<div style="max-width:900px;margin:40px auto;background:#fff;padding:18px;border-radius:6px;box-shadow:0 6px 24px rgba(0,0,0,0.08);">
				<h2 style=\"margin:0 0 12px 0;\">Runtime error occurred</h2>
				<pre style=\"white-space:pre-wrap;margin:0 0 8px 0;\">${String(msg)}</pre>
				<p style=\"margin:0;font-size:13px;color:#444;\">Check the browser console for full stack trace.</p>
			</div>`;
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
	try {
		const msg = err?.message || String(err);
		const overlayId = "__runtime_error_overlay";
		let container = document.getElementById(overlayId) as HTMLDivElement | null;
		if (!container) {
			container = document.createElement("div");
			container.id = overlayId;
			container.style.cssText = "position:fixed;inset:0;overflow:auto;padding:24px;background:rgba(255,255,255,0.98);z-index:9999;font-family:sans-serif;color:#111;";
			document.body.appendChild(container);
		}
		container.innerHTML = `<div style="max-width:900px;margin:40px auto;background:#fff;padding:18px;border-radius:6px;box-shadow:0 6px 24px rgba(0,0,0,0.08);">
			<h2 style=\"margin:0 0 12px 0;\">Render error</h2>
			<pre style=\"white-space:pre-wrap;margin:0 0 8px 0;\">${String(msg)}</pre>
			<p style=\"margin:0;font-size:13px;color:#444;\">Open the browser console for details.</p>
		</div>`;
	} catch (e) {
		// ignore
	}
	console.error(err);
}
