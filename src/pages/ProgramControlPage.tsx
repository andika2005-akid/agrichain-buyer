import { useState } from "react";
import { motion } from "framer-motion";
import { ongoingSubsidyPrograms, farmerApplications } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Edit2, Eye, ToggleLeft, ToggleRight, DollarSign, Users, TrendingUp, Package } from "lucide-react";

interface Program {
  id: string;
  name: string;
  description: string;
  budget: number;
  year: number;
  status: "aktif" | "nonaktif";
  usedBudget: number;
  recipients: number;
}

export default function ProgramControlPage() {
  const { role } = useAuth();
  const { toast } = useToast();

  // Initialize programs from ongoingSubsidyPrograms
  const [programs, setPrograms] = useState<Program[]>(() => {
    return ongoingSubsidyPrograms.map((prog, idx) => ({
      id: prog.id,
      name: prog.name,
      description: prog.description,
      budget: [15000000000, 12000000000, 8000000000][idx],
      year: 2026,
      status: prog.available ? "aktif" : "nonaktif",
      usedBudget: [8500000000, 6200000000, 3800000000][idx],
      recipients: [1250, 890, 450][idx],
    }));
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    budget: "",
    year: 2026,
    status: "aktif",
  });

  if (role !== "kementerian") {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Halaman ini hanya dapat diakses oleh kementerian.</p>
      </div>
    );
  }

  // Calculate statistics
  const totalPrograms = programs.length;
  const activePrograms = programs.filter((p) => p.status === "aktif").length;
  const inactivePrograms = programs.filter((p) => p.status === "nonaktif").length;
  const totalBudget = programs.reduce((sum, p) => sum + p.budget, 0);

  // Chart data
  const chartData = programs.map((p) => ({
    name: p.name.substring(0, 20),
    totalBudget: p.budget,
    usedBudget: p.usedBudget,
    sisa: p.budget - p.usedBudget,
  }));

  const toggleProgram = (id: string) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "aktif" ? "nonaktif" : "aktif" } : p
      )
    );
    const prog = programs.find((p) => p.id === id);
    toast({
      title: `Program ${prog?.status === "aktif" ? "Dinonaktifkan" : "Diaktifkan"}`,
      description: prog?.name,
    });
  };

  const handleAddProgram = () => {
    if (!newProgram.name || !newProgram.budget) {
      toast({ title: "Error", description: "Nama dan anggaran harus diisi" });
      return;
    }

    const program: Program = {
      id: `P${Date.now()}`,
      name: newProgram.name,
      description: newProgram.description,
      budget: parseInt(newProgram.budget),
      year: newProgram.year,
      status: newProgram.status as "aktif" | "nonaktif",
      usedBudget: 0,
      recipients: 0,
    };

    setPrograms((prev) => [...prev, program]);
    toast({ title: "Berhasil", description: "Program baru ditambahkan" });
    setIsAddOpen(false);
    setNewProgram({ name: "", description: "", budget: "", year: 2026, status: "aktif" });
  };

  const handleViewDetail = (program: Program) => {
    setSelectedProgram(program);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === "aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kontrol Program Subsidi</h1>
            <p className="text-sm text-muted-foreground">Mengelola program subsidi pertanian seperti mengaktifkan, menonaktifkan, dan mengatur anggaran program.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Program
          </Button>
        </div>
      </motion.div>

      {/* Statistik Program */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Program</p>
              <p className="text-2xl font-bold mt-2">{totalPrograms}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Program Aktif</p>
              <p className="text-2xl font-bold mt-2">{activePrograms}</p>
            </div>
            <ToggleRight className="w-8 h-8 text-green-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Program Nonaktif</p>
              <p className="text-2xl font-bold mt-2">{inactivePrograms}</p>
            </div>
            <ToggleLeft className="w-8 h-8 text-red-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Anggaran</p>
              <p className="text-2xl font-bold mt-2">Rp {(totalBudget / 1e9).toFixed(1)}T</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500/50" />
          </div>
        </Card>
      </motion.div>

      {/* Grafik Anggaran */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg p-4"
      >
        <h3 className="font-semibold text-foreground mb-4">Penggunaan Anggaran per Program</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value) => `Rp ${(value as number / 1e9).toFixed(1)}T`}
              contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            />
            <Legend />
            <Bar dataKey="usedBudget" fill="hsl(0, 80%, 60%)" name="Dana Terpakai" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sisa" fill="hsl(120, 80%, 60%)" name="Sisa Anggaran" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabel Program */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg p-4 overflow-x-auto"
      >
        <h3 className="font-semibold text-foreground mb-4">Daftar Program</h3>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-muted-foreground">
              <th className="text-left py-2 px-2">ID Program</th>
              <th className="text-left py-2 px-2">Nama Program</th>
              <th className="text-left py-2 px-2">Anggaran</th>
              <th className="text-left py-2 px-2">Dana Terpakai</th>
              <th className="text-left py-2 px-2">Tahun</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, idx) => (
              <motion.tr
                key={program.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-2 font-mono text-xs">{program.id}</td>
                <td className="py-3 px-2 font-medium">{program.name}</td>
                <td className="py-3 px-2">Rp {(program.budget / 1e9).toFixed(1)}T</td>
                <td className="py-3 px-2">Rp {(program.usedBudget / 1e9).toFixed(1)}T</td>
                <td className="py-3 px-2">{program.year}</td>
                <td className="py-3 px-2">
                  <Badge className={getStatusColor(program.status)}>
                    {program.status === "aktif" ? "✓ Aktif" : "✗ Nonaktif"}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(program)}
                      className="h-7 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProgram(program.id)}
                      className="h-7 text-xs"
                    >
                      {program.status === "aktif" ? (
                        <>
                          <ToggleLeft className="w-3 h-3 mr-1" />
                          Matikan
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-3 h-3 mr-1" />
                          Aktifkan
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal Tambah Program */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Program Baru</DialogTitle>
            <DialogDescription>Buat program subsidi pertanian baru</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Program</Label>
              <Input
                id="name"
                placeholder="Contoh: Subsidi Pupuk 2026"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Deskripsi program"
                value={newProgram.description}
                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="budget">Anggaran (IDR)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="10000000000"
                value={newProgram.budget}
                onChange={(e) => setNewProgram({ ...newProgram, budget: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="year">Tahun Program</Label>
              <Input
                id="year"
                type="number"
                value={newProgram.year}
                onChange={(e) => setNewProgram({ ...newProgram, year: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newProgram.status}
                onChange={(e) => setNewProgram({ ...newProgram, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleAddProgram} className="flex-1">
                Tambah Program
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detail Program */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Program</DialogTitle>
            <DialogDescription>Informasi lengkap program subsidi</DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nama Program</p>
                  <p className="font-semibold">{selectedProgram.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                  <p className="text-sm">{selectedProgram.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Anggaran</p>
                    <p className="font-bold">Rp {(selectedProgram.budget / 1e9).toFixed(1)}T</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dana Terpakai</p>
                    <p className="font-bold text-red-600">Rp {(selectedProgram.usedBudget / 1e9).toFixed(1)}T</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sisa Anggaran</p>
                  <p className="font-bold text-green-600">
                    Rp {((selectedProgram.budget - selectedProgram.usedBudget) / 1e9).toFixed(1)}T
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Jumlah Penerima</p>
                  <p className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {selectedProgram.recipients.toLocaleString("id-ID")} petani
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Penggunaan Anggaran</p>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(selectedProgram.usedBudget / selectedProgram.budget) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((selectedProgram.usedBudget / selectedProgram.budget) * 100)}% digunakan
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsDetailOpen(false)} className="w-full">
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
