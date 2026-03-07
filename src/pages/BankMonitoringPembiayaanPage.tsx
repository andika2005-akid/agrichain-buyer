import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { kurApplications, farmerApplications, harvestRecords } from "@/data/mockData";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity, Users, DollarSign, CalendarDays } from "lucide-react";

export default function MonitoringPembiayaanPage() {
	// consider "disbursed" as pembiayaan telah diterima
	const financed = kurApplications.filter((k) => k.status === "disbursed");

	const totalPembiayaanAktif = financed.length;
	const totalDanaDisalurkan = financed.reduce((s, f) => s + (f.jumlahPinjaman || 0), 0);
	const uniqueFarmers = Array.from(new Set(financed.map((f) => f.farmerId))).length;

	// derive payment status from farmer eligibility score (approximation)
	const rows = financed.map((f) => {
		const farmer = farmerApplications.find((p) => p.id === f.farmerId);
		const harvest = harvestRecords.filter((h) => h.farmerId === f.farmerId);
		// status pembayaran heuristic: eligibilityScore >=75 => Lancar, >=50 => Perlu Monitoring, else Berisiko
		const score = farmer?.eligibilityScore ?? 50;
		const paymentStatus = score >= 75 ? "Lancar" : score >= 50 ? "Perlu Monitoring" : "Berisiko";

		// status tanaman: use latest harvest to guess
		const latestHarvest = harvest.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
		const statusTanaman = latestHarvest ? "Panen" : "Tumbuh";

		// progress usaha: simple proxy - if panen exists progress 100, else 40
		const progress = latestHarvest ? 100 : 40;

		return {
			id: f.id,
			name: f.farmerName,
			location: farmer?.province ?? "-",
			commodity: f.komoditas,
			amount: f.jumlahPinjaman,
			disbursementDate: f.submissionDate || f.createdAt,
			statusTanaman,
			progress,
			paymentStatus,
		};
	});

	const paymentSummary = rows.reduce(
		(acc, r) => {
			acc[r.paymentStatus] = (acc[r.paymentStatus] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const lancar = paymentSummary["Lancar"] || 0;
	const tingkatKelancaran = financed.length ? Math.round((lancar / financed.length) * 100) : 0;

	const pieData = [
		{ name: "Lancar", value: paymentSummary["Lancar"] || 0 },
		{ name: "Perlu Monitoring", value: paymentSummary["Perlu Monitoring"] || 0 },
		{ name: "Berisiko", value: paymentSummary["Berisiko"] || 0 },
	];
	const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

	// small progress series for chart (average progress per month placeholder)
	const progressSeries = [
		{ month: "Jan", progress: 45 },
		{ month: "Feb", progress: 50 },
		{ month: "Mar", progress: 62 },
		{ month: "Apr", progress: 70 },
		{ month: "Mei", progress: 78 },
	];

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6">
			<div>
				<h1 className="text-2xl font-bold font-display text-foreground">Monitoring Pembiayaan KUR</h1>
				<p className="text-sm text-muted-foreground">Memantau perkembangan usaha tani dan status pembiayaan petani yang telah menerima KUR.</p>
			</div>

			{/* Statistik Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard title="Total Pembiayaan Aktif" value={totalPembiayaanAktif} icon={<Activity className="w-5 h-5" />} />
				<StatCard title="Total Dana Disalurkan" value={`Rp ${totalDanaDisalurkan.toLocaleString("id-ID")}`} icon={<DollarSign className="w-5 h-5" />} />
				<StatCard title="Jumlah Petani Aktif" value={uniqueFarmers} icon={<Users className="w-5 h-5" />} />
				<StatCard title="Tingkat Kelancaran Pembayaran" value={`${tingkatKelancaran}%`} icon={<CalendarDays className="w-5 h-5" />} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Table */}
				<Card className="lg:col-span-2 p-4">
					<h3 className="text-lg font-semibold mb-4">Tabel Monitoring Petani</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left text-xs text-muted-foreground border-b">
									<th className="p-2">Nama Petani</th>
									<th className="p-2">Lokasi</th>
									<th className="p-2">Komoditas</th>
									<th className="p-2">Jumlah Pinjaman</th>
									<th className="p-2">Tanggal Pencairan</th>
									<th className="p-2">Status Tanaman</th>
									<th className="p-2">Progress Usaha</th>
									<th className="p-2">Status Pembayaran</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((r) => (
									<tr key={r.id} className="border-b hover:bg-muted/50">
										<td className="p-2 font-semibold">{r.name}</td>
										<td className="p-2">{r.location}</td>
										<td className="p-2">{r.commodity}</td>
										<td className="p-2">Rp {r.amount.toLocaleString("id-ID")}</td>
										<td className="p-2">{new Date(r.disbursementDate).toLocaleDateString("id-ID")}</td>
										<td className="p-2">{r.statusTanaman}</td>
										<td className="p-2">
											<div className="w-full bg-gray-100 rounded h-2">
												<div className="h-2 rounded bg-accent" style={{ width: `${r.progress}%` }} />
											</div>
											<div className="text-xs mt-1">{r.progress}%</div>
										</td>
										<td className="p-2">
											<Badge variant={r.paymentStatus === "Lancar" ? "default" : r.paymentStatus === "Perlu Monitoring" ? "secondary" : "destructive"}>
												{r.paymentStatus}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>

				{/* Charts */}
				<div className="space-y-6">
					<Card className="p-4">
						<h3 className="text-lg font-semibold mb-3">Distribusi Status Pembayaran</h3>
						<div style={{ width: "100%", height: 220 }}>
							<ResponsiveContainer>
								<PieChart>
									<Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
										{pieData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</Card>

					<Card className="p-4">
						<h3 className="text-lg font-semibold mb-3">Rata-rata Progress Usaha (per bulan)</h3>
						<div style={{ width: "100%", height: 220 }}>
							<ResponsiveContainer>
								<BarChart data={progressSeries}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="progress" fill="#3b82f6" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
