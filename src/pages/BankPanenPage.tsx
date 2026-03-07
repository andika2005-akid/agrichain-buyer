import { motion } from "framer-motion";
import { plantingRecords, harvestRecords } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BankPanenPage() {
  const totalPlant = plantingRecords.length;
  const totalHarvest = harvestRecords.length;
  const successRate = totalPlant ? Math.round((totalHarvest / totalPlant) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Data Panen Petani</h1>
        <p className="text-sm text-muted-foreground">Jumlah panen dan tingkat keberhasilan ({successRate}% dari data tanam)</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Petani</TableHead>
              <TableHead>Komoditas</TableHead>
              <TableHead>Luas Panen (Ha)</TableHead>
              <TableHead>Tgl Panen</TableHead>
              <TableHead>Hasil (Kg)</TableHead>
              <TableHead>Harga (Rp/Kg)</TableHead>
              <TableHead>Total Penjualan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harvestRecords.map(rec => (
              <TableRow key={rec.id}>
                <TableCell className="font-mono text-xs">{rec.id}</TableCell>
                <TableCell className="text-xs">{rec.farmerName || rec.farmerId}</TableCell>
                <TableCell className="text-xs">{rec.komoditas}</TableCell>
                <TableCell className="text-xs">{rec.luasPanen} Ha</TableCell>
                <TableCell className="text-xs">{rec.tanggalPanen}</TableCell>
                <TableCell className="text-xs">{rec.totalHasilPanen.toLocaleString()}</TableCell>
                <TableCell className="text-xs">Rp {rec.hargaJual.toLocaleString()}</TableCell>
                <TableCell className="text-xs">Rp {rec.totalPenjualan.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}