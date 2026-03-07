import { useState } from "react";
import { motion } from "framer-motion";
import { ongoingSubsidyPrograms } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertCircle, Calendar, FileUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProgramSubsidiPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState<typeof ongoingSubsidyPrograms[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const filteredPrograms =
    selectedTab === "semua"
      ? ongoingSubsidyPrograms
      : selectedTab === "tersedia"
        ? ongoingSubsidyPrograms.filter((p) => p.available)
        : ongoingSubsidyPrograms.filter((p) => !p.available);

  const handleDetailClick = (program: typeof ongoingSubsidyPrograms[0]) => {
    setSelectedProgram(program);
    setShowDetailModal(true);
  };

  const handleRegistrationClick = (program: typeof ongoingSubsidyPrograms[0]) => {
    setSelectedProgram(program);
    setShowRegistrationModal(true);
  };


  const stats = {
    totalProgram: ongoingSubsidyPrograms.length,
    programBerjalan: ongoingSubsidyPrograms.filter((p) => p.available).length,
    programDitutup: ongoingSubsidyPrograms.filter((p) => !p.available).length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Program Subsidi Pertanian
        </h1>
        <p className="text-sm text-muted-foreground">
          Lihat daftar program subsidi yang sedang berjalan.
        </p>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Program</p>
              <p className="text-3xl font-bold">{stats.totalProgram}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Program Sedang Berjalan</p>
              <p className="text-3xl font-bold">{stats.programBerjalan}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Program Ditutup</p>
              <p className="text-3xl font-bold">{stats.programDitutup}</p>
            </div>
            <Clock className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </motion.div>

      {/* Segmented Control */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="semua">Semua Program</TabsTrigger>
            <TabsTrigger value="tersedia">Sedang Berjalan</TabsTrigger>
            <TabsTrigger value="tertutup">Tertutup</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-3 mt-4">
            {filteredPrograms.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedTab === "tersedia"
                    ? "Tidak ada program yang tersedia saat ini"
                    : "Tidak ada program dalam kategori ini"}
                </p>
              </Card>
            ) : (
              filteredPrograms.map((program) => (
                <Card
                  key={program.id}
                  className={`p-5 transition hover:shadow-md ${
                    !program.available ? "opacity-70 bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {program.name}
                        </h3>
                        <Badge
                          variant={program.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {program.available ? "Buka" : "Tutup"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {program.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Deadline: {new Date(program.deadline).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        {program.available && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-success font-medium">
                              Siap untuk pendaftaran
                            </span>
                          </div>
                        )}
                        {!program.available && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-warning" />
                            <span className="text-warning font-medium">
                              Pendaftaran ditutup
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetailClick(program)}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                      <p>ID Program</p>
                      <p className="font-mono font-semibold text-foreground">
                        {program.id}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 bg-accent/10 border-accent/20">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-1">Tips Pendaftaran</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Pastikan data profil pertanian Anda sudah lengkap sebelum mendaftar</li>
                <li>Pilih program yang sesuai dengan komoditas dan luas lahan Anda</li>
                <li>Perhatikan deadline pendaftaran untuk setiap program</li>
                <li>Hubungi dinas pertanian setempat jika ada pertanyaan</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="text-foreground">{selectedProgram.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Persyaratan</p>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm">
                  <li>Memiliki lahan pertanian aktif</li>
                  <li>KTP dan surat keterangan lahan</li>
                  <li>Foto kondisi lahan terbaru</li>
                  <li>Terdaftar di data pertanian setempat</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Periode Pendaftaran</p>
                  <p className="text-foreground">1 Jan - {new Date(selectedProgram.deadline).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penyelenggara</p>
                  <p className="text-foreground">Kementerian Pertanian</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowDetailModal(false)} variant="outline">Tutup</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
