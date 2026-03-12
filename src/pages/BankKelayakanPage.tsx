import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function BankKelayakanPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Halaman Tidak Digunakan</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Halaman ini telah dihapus. Silakan gunakan menu navigasi untuk mengakses fitur yang tersedia.
        </p>
      </Card>
    </motion.div>
  );
}

