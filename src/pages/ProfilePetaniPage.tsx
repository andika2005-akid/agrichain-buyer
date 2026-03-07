import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Upload, Lock, Wheat, MapPin, Ruler, Award, DollarSign, FileText } from "lucide-react";
import { farmerApplications, plantingRecords, harvestRecords, kurApplications } from "@/data/mockData";

// Mock farmer data
const initialProfile = {
  id: "farmer-1",
  name: "Ahmad Suryadi",
  email: "ahmad.suryadi@email.com",
  phone: "081234567890",
  nik: "3201123456789012",
  birthDate: "1985-06-15",
  gender: "Laki-laki",
  address: "Desa Sukamaju, Kecamatan Sukatani",
  province: "Jawa Barat",
  city: "Kabupaten Sukamulya",
  mainCommodity: "Padi",
  landLocation: "Desa Sukamaju",
  landArea: 2.5,
  farmingExperience: 15,
  bankName: "Bank Rakyat Indonesia (BRI)",
  bankAccount: "1234567890",
  accountOwner: "Ahmad Suryadi",
};

export default function FarmerProfilePage() {
  const { userName } = useAuth();
  
  // Get data dari mock data atau gunakan initial profile
  const mockFarmer = farmerApplications[0]; // Gunakan petani pertama dari mock data
  
  const initialData = {
    id: mockFarmer.id,
    name: mockFarmer.name,
    email: mockFarmer.name ? mockFarmer.name.toLowerCase().replace(/\s+/g, ".") + "@gmail.com" : "petani@gmail.com",
    phone: mockFarmer.phone,
    nik: mockFarmer.nik,
    birthDate: "1985-06-15",
    gender: "Laki-laki",
    address: mockFarmer.address,
    province: mockFarmer.province,
    city: "Kabupaten Sukamulya",
    mainCommodity: mockFarmer.commodity,
    landLocation: mockFarmer.province,
    landArea: mockFarmer.area,
    farmingExperience: 15,
    bankName: "Bank Rakyat Indonesia (BRI)",
    bankAccount: "1234567890",
    accountOwner: mockFarmer.name,
  };

  const [profile, setProfile] = useState(initialData);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKtpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setProfile(formData);
    setEditing(false);
    setKtpFile(null);
  };

  const cancelEdit = () => {
    setFormData(profile);
    setEditing(false);
    setKtpFile(null);
    setKtpPreview(null);
  };

  // Get stats from mock data
  const farmerData = farmerApplications.find(f => f.id === profile.id);
  const farmerHarvests = harvestRecords.filter(h => h.farmerId === profile.id);
  const farmerKUR = kurApplications.filter(k => k.farmerId === profile.id);
  const totalHarvest = farmerHarvests.reduce((sum, h) => sum + (h.totalHasilPanen || 0), 0);
  const totalKUR = farmerKUR.length;

  return (
    <div className="p-8 space-y-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Profil Petani</h1>
          <p className="text-sm text-muted-foreground">Informasi akun dan data usaha tani petani</p>
        </div>
        <Button onClick={() => setEditing(true)} variant="default">Edit Profil</Button>
      </motion.div>

      {/* Dialog Edit Profil */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profil Petani</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informasi Akun */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Informasi Akun</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Nama Lengkap</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Nomor Telepon</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
              </div>
            </div>

            {/* Data Pribadi */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Data Pribadi</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKtpFileChange}
                    className="hidden"
                    id="ktp-input"
                  />
                  <label htmlFor="ktp-input" className="cursor-pointer">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 cursor-pointer"
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                        Upload Foto KTP
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              
              {/* KTP Preview */}
              {ktpPreview && (
                <div className="flex gap-4 items-start p-3 rounded-lg bg-muted">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Pratinjau Foto KTP:</p>
                    <img src={ktpPreview} alt="KTP Preview" className="w-32 h-auto rounded border" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">File: {ktpFile?.name}</p>
                    <p className="text-xs text-muted-foreground">Ukuran: {(ktpFile?.size || 0 / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">NIK</label>
                  <input name="nik" value={formData.nik} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Tanggal Lahir</label>
                  <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Jenis Kelamin</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="select select-bordered w-full mt-1">
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Alamat Lengkap</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="textarea textarea-bordered w-full mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Provinsi</label>
                  <input name="province" value={formData.province} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Kabupaten/Kota</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
              </div>
            </div>

            {/* Data Usaha Tani */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Data Usaha Tani</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Lokasi Lahan</label>
                  <input name="landLocation" value={formData.landLocation} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Luas Lahan (hektar)</label>
                  <input name="landArea" type="number" step="0.1" value={formData.landArea} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Komoditas Utama</label>
                  <input name="mainCommodity" value={formData.mainCommodity} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Pengalaman Bertani (tahun)</label>
                  <input name="farmingExperience" type="number" value={formData.farmingExperience} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
              </div>
            </div>

            {/* Informasi Rekening Bank */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Informasi Rekening Bank</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Nama Bank</label>
                  <input name="bankName" value={formData.bankName} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Nomor Rekening</label>
                  <input name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold">Nama Pemilik Rekening</label>
                  <input name="accountOwner" value={formData.accountOwner} onChange={handleChange} className="input input-bordered w-full mt-1" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={cancelEdit} variant="outline">Batal</Button>
            <Button onClick={saveProfile} variant="default">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 1. Card Informasi Utama */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Informasi Utama</h2>
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="https://via.placeholder.com/150" alt="Profil" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">ID Petani: {profile.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Komoditas Utama</p>
                    <p className="text-sm font-semibold">{profile.mainCommodity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lokasi Lahan</p>
                    <p className="text-sm font-semibold">{profile.landLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Luas Lahan</p>
                    <p className="text-sm font-semibold">{profile.landArea} hektar</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pengalaman</p>
                    <p className="text-sm font-semibold">{profile.farmingExperience} tahun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 2. Card Informasi Akun */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Informasi Akun</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="w-4 h-4" />
              Ubah Password
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Nama Lengkap</label>
                <p className="text-sm font-medium mt-1">{profile.name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Email</label>
                <p className="text-sm font-medium mt-1">{profile.email}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Nomor Telepon</label>
                <p className="text-sm font-medium mt-1">{profile.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 3. Card Data Pribadi */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Data Pribadi</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">NIK</label>
              <p className="text-sm font-medium mt-1">{profile.nik}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Tanggal Lahir</label>
              <p className="text-sm font-medium mt-1">{new Date(profile.birthDate).toLocaleDateString("id-ID")}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Jenis Kelamin</label>
              <p className="text-sm font-medium mt-1">{profile.gender}</p>
            </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Alamat Lengkap</label>
              <p className="text-sm font-medium mt-1">{profile.address}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Provinsi</label>
                <p className="text-sm font-medium mt-1">{profile.province}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Kabupaten/Kota</label>
                <p className="text-sm font-medium mt-1">{profile.city}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 4. Card Data Usaha Tani */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Data Usaha Tani</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Lokasi Lahan</label>
              <p className="text-sm font-medium mt-1">{profile.landLocation}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Luas Lahan (hektar)</label>
              <p className="text-sm font-medium mt-1">{profile.landArea} ha</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Komoditas Utama</label>
              <p className="text-sm font-medium mt-1">{profile.mainCommodity}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Pengalaman Bertani (tahun)</label>
              <p className="text-sm font-medium mt-1">{profile.farmingExperience} tahun</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 5. Card Informasi Rekening Bank */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="p-6 border-primary/30">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Informasi Rekening Bank</h2>
            <Badge variant="secondary" className="ml-auto">Untuk Pencairan Dana</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Digunakan untuk pencairan dana subsidi, KUR, dan pendanaan investor</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Nama Bank</label>
              <p className="text-sm font-medium mt-1">{profile.bankName}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Nomor Rekening</label>
              <p className="text-sm font-medium mt-1">{profile.bankAccount}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">Nama Pemilik Rekening</label>
              <p className="text-sm font-medium mt-1">{profile.accountOwner}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 6. Card Statistik Singkat */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <Ruler className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Luas Lahan</p>
            <p className="text-2xl font-bold">{profile.landArea}</p>
            <p className="text-xs text-muted-foreground">hektar</p>
          </Card>
          <Card className="p-4 text-center">
            <Wheat className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Panen Tahun Ini</p>
            <p className="text-2xl font-bold">{totalHarvest.toLocaleString("id-ID")}</p>
            <p className="text-xs text-muted-foreground">kg</p>
          </Card>
          <Card className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Pengajuan KUR</p>
            <p className="text-2xl font-bold">{totalKUR}</p>
            <p className="text-xs text-muted-foreground">pengajuan</p>
          </Card>
          <Card className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Proposal Pendanaan</p>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">proposal</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}