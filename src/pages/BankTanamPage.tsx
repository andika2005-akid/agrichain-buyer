import { motion } from "framer-motion";
import { plantingRecords } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BankTanamPage() {
  const totalPlant = plantingRecords.length;
  // success rate might not apply for planting, could show ratio later

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Data Tanam Petani</h1>
        <p className="text-sm text-muted-foreground">Daftar semua pencatatan tanam yang masuk</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-6 shadow-card overflow-x-auto"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Petani</TableHead>
              <TableHead>Komoditas</TableHead>
              <TableHead>Luas Tanam (Ha)</TableHead>
              <TableHead>Tgl Tanam</TableHead>
              <TableHead>Jenis Benih</TableHead>
              <TableHead>Subsidi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plantingRecords.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell className="font-mono text-xs">{rec.id}</TableCell>
                <TableCell className="text-xs">{rec.farmerName || rec.farmerId}</TableCell>
                <TableCell className="text-xs">{rec.komoditas}</TableCell>
                <TableCell className="text-xs">{rec.luasTanam} Ha</TableCell>
                <TableCell className="text-xs">{rec.tanggalTanam}</TableCell>
                <TableCell className="text-xs">{rec.jenisBenih}</TableCell>
                <TableCell className="text-xs">{rec.pakaiBsubsidi ? "Ya" : "Tidak"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}