import React, { useState, useEffect } from 'react';
import { 
  SaranaItem, 
  PrasaranaRoom, 
  LoanRecord, 
  MaintenanceTicket, 
  ProcurementItem, 
  InstitutionInfo, 
  UserRole,
  AuthUser,
  ItemCondition,
  ProcurementStatus
} from './types/sarpras';
import { 
  initialInstitution, 
  initialSchools,
  initialRooms, 
  initialItems, 
  initialLoans, 
  initialMaintenance, 
  initialProcurement 
} from './data/initialData';
import { LoginPage, DEMO_ACCOUNTS } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ItemsView } from './components/ItemsView';
import { RoomsView } from './components/RoomsView';
import { LoansView } from './components/LoansView';
import { MaintenanceView } from './components/MaintenanceView';
import { ProcurementView } from './components/ProcurementView';
import { SchoolManagementView } from './components/SchoolManagementView';
import { ItemModal } from './components/ItemModal';
import { RoomModal } from './components/RoomModal';
import { LoanModal } from './components/LoanModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { AssetBarcodeModal } from './components/AssetBarcodeModal';
import { ReportModal } from './components/ReportModal';
import { SettingsModal } from './components/SettingsModal';
import { GasExportModal } from './components/GasExportModal';
import { Check, Info } from 'lucide-react';

export default function App() {
  // Load state from LocalStorage or Fallback to Initial Mock Data
  const [schools, setSchools] = useState<InstitutionInfo[]>(() => {
    const saved = localStorage.getItem('sarpras_schools');
    return saved ? JSON.parse(saved) : initialSchools;
  });

  const [institution, setInstitution] = useState<InstitutionInfo>(() => {
    const saved = localStorage.getItem('sarpras_institution');
    if (saved) return JSON.parse(saved);
    return schools[0] || initialInstitution;
  });

  useEffect(() => {
    localStorage.setItem('sarpras_schools', JSON.stringify(schools));
  }, [schools]);

  const [items, setItems] = useState<SaranaItem[]>(() => {
    const saved = localStorage.getItem('sarpras_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [rooms, setRooms] = useState<PrasaranaRoom[]>(() => {
    const saved = localStorage.getItem('sarpras_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('sarpras_loans');
    return saved ? JSON.parse(saved) : initialLoans;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('sarpras_tickets');
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [procurement, setProcurement] = useState<ProcurementItem[]>(() => {
    const saved = localStorage.getItem('sarpras_procurement');
    return saved ? JSON.parse(saved) : initialProcurement;
  });

  // Auth & Session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('sarpras_auth_user') || sessionStorage.getItem('sarpras_auth_user');
    return saved ? JSON.parse(saved) : DEMO_ACCOUNTS[0];
  });

  // UI Navigation & Role
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return currentUser?.role || 'admin_sarpras';
  });

  // Keep userRole synced with currentUser
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaranaItem | null>(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<PrasaranaRoom | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preselectedLoanItem, setPreselectedLoanItem] = useState<string | undefined>(undefined);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<MaintenanceTicket | null>(null);
  const [preselectedTicketItem, setPreselectedTicketItem] = useState<SaranaItem | undefined>(undefined);
  const [preselectedTicketRoom, setPreselectedTicketRoom] = useState<PrasaranaRoom | undefined>(undefined);

  const [barcodeItem, setBarcodeItem] = useState<SaranaItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize with LocalStorage
  useEffect(() => {
    localStorage.setItem('sarpras_institution', JSON.stringify(institution));
  }, [institution]);

  useEffect(() => {
    localStorage.setItem('sarpras_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sarpras_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('sarpras_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('sarpras_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sarpras_procurement', JSON.stringify(procurement));
  }, [procurement]);

  // Handlers for Items
  const handleSaveItem = (savedItem: SaranaItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === savedItem.id);
      if (exists) {
        return prev.map(i => (i.id === savedItem.id ? savedItem : i));
      }
      return [savedItem, ...prev];
    });
    setIsItemModalOpen(false);
    setEditingItem(null);
    showToast(`Sarana "${savedItem.name}" berhasil disimpan.`);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
    showToast(`Barang ${item ? `"${item.name}"` : ''} telah dihapus.`);
  };

  // Handlers for Rooms
  const handleSaveRoom = (savedRoom: PrasaranaRoom) => {
    setRooms(prev => {
      const exists = prev.some(r => r.id === savedRoom.id);
      if (exists) {
        return prev.map(r => (r.id === savedRoom.id ? savedRoom : r));
      }
      return [savedRoom, ...prev];
    });
    setIsRoomModalOpen(false);
    setEditingRoom(null);
    showToast(`Ruangan "${savedRoom.name}" berhasil disimpan.`);
  };

  const handleDeleteRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    setRooms(prev => prev.filter(r => r.id !== roomId));
    showToast(`Ruangan ${room ? `"${room.name}"` : ''} telah dihapus.`);
  };

  // Handlers for Loans
  const handleSaveLoan = (newLoan: LoanRecord) => {
    setLoans(prev => [newLoan, ...prev]);
    setIsLoanModalOpen(false);
    setPreselectedLoanItem(undefined);
    showToast(`Peminjaman atas nama ${newLoan.borrowerName} berhasil diajukan.`);
  };

  const handleApproveLoan = (loanId: string) => {
    setLoans(prev =>
      prev.map(l => {
        if (l.id === loanId) {
          // Update item status to 'Dipinjam'
          setItems(itemPrev =>
            itemPrev.map(it => (it.id === l.itemId ? { ...it, status: 'Dipinjam' } : it))
          );
          return {
            ...l,
            status: 'Sedang Dipinjam',
            approvedBy: institution.sarprasHead || 'Admin Sarpras',
          };
        }
        return l;
      })
    );
    showToast('Peminjaman telah disetujui & status barang diperbarui ke "Dipinjam".');
  };

  const handleRejectLoan = (loanId: string) => {
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'Ditolak' } : l))
    );
    showToast('Pengajuan peminjaman ditolak.');
  };

  const handleReturnLoan = (loanId: string, condition: ItemCondition, notes: string) => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prev =>
      prev.map(l => {
        if (l.id === loanId) {
          // Update item status back to Tersedia or Dalam Perbaikan
          setItems(itemPrev =>
            itemPrev.map(it => {
              if (it.id === l.itemId) {
                return {
                  ...it,
                  status: condition === 'Baik' ? 'Tersedia' : 'Dalam Perbaikan',
                  condition: condition,
                  lastChecked: today,
                };
              }
              return it;
            })
          );
          return {
            ...l,
            status: 'Selesai Dikembalikan',
            actualReturnDate: today,
            returnCondition: condition,
            returnNotes: notes,
          };
        }
        return l;
      })
    );
    showToast('Barang berhasil dikembalikan ke gudang/ruang penyimpanan.');
  };

  // Handlers for Maintenance Tickets
  const handleSaveTicket = (newTicket: MaintenanceTicket) => {
    setTickets(prev => {
      const exists = prev.some(t => t.id === newTicket.id);
      if (exists) {
        return prev.map(t => (t.id === newTicket.id ? newTicket : t));
      }
      return [newTicket, ...prev];
    });

    // If target is Sarana, update its status accordingly
    if (newTicket.targetType === 'Sarana') {
      setItems(itemPrev =>
        itemPrev.map(it => {
          if (it.id === newTicket.targetId) {
            let nextStatus = it.status;
            let nextCondition = it.condition;

            if (newTicket.actionStatus === 'Selesai Diperbaiki') {
              nextStatus = 'Tersedia';
              nextCondition = 'Baik';
            } else if (newTicket.actionStatus === 'Afkir / Rekomendasi Penghapusan') {
              nextStatus = 'Dihapuskan';
              nextCondition = 'Rusak Berat';
            } else {
              nextStatus = 'Dalam Perbaikan';
              if (it.condition === 'Baik') nextCondition = 'Rusak Ringan';
            }

            return { ...it, status: nextStatus, condition: nextCondition };
          }
          return it;
        })
      );
    }

    setIsMaintenanceModalOpen(false);
    setEditingTicket(null);
    setPreselectedTicketItem(undefined);
    setPreselectedTicketRoom(undefined);
    showToast(`Tiket pemeliharaan ${newTicket.ticketNumber} berhasil disimpan.`);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    showToast('Tiket perbaikan telah dihapus.');
  };

  // Handlers for Procurement
  const handleAddProcurement = (item: ProcurementItem) => {
    setProcurement(prev => [item, ...prev]);
    showToast(`Usulan RKAS "${item.itemName}" berhasil diajukan.`);
  };

  const handleUpdateProcurementStatus = (id: string, status: ProcurementStatus) => {
    setProcurement(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
    showToast(`Status usulan diperbarui ke "${status}".`);
  };

  const handleDeleteProcurement = (id: string) => {
    setProcurement(prev => prev.filter(p => p.id !== id));
    showToast('Usulan RKAS telah dihapus.');
  };

  // Handlers for School Management
  const handleSelectSchool = (sch: InstitutionInfo) => {
    setInstitution(sch);
    showToast(`Sekolah aktif dialihkan ke: ${sch.name}`);
  };

  const handleAddSchool = (newSchool: InstitutionInfo) => {
    setSchools(prev => [newSchool, ...prev]);
    setInstitution(newSchool);
    showToast(`Sekolah "${newSchool.name}" berhasil ditambahkan dan diaktifkan.`);
  };

  const handleUpdateSchool = (updatedSchool: InstitutionInfo) => {
    setSchools(prev => prev.map(s => (s.id === updatedSchool.id ? updatedSchool : s)));
    if (institution.id === updatedSchool.id) {
      setInstitution(updatedSchool);
    }
    showToast(`Data sekolah "${updatedSchool.name}" berhasil diperbarui.`);
  };

  const handleDeleteSchool = (schoolId: string) => {
    if (schools.length <= 1) {
      alert('Minimal harus ada satu sekolah di dalam sistem.');
      return;
    }
    const target = schools.find(s => s.id === schoolId);
    const remaining = schools.filter(s => s.id !== schoolId);
    setSchools(remaining);
    if (institution.id === schoolId) {
      setInstitution(remaining[0]);
    }
    showToast(`Sekolah ${target ? `"${target.name}"` : ''} telah dihapus.`);
  };

  // Reset to initial mock data
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data standar bawaan?')) {
      setInstitution(initialInstitution);
      setItems(initialItems);
      setRooms(initialRooms);
      setLoans(initialLoans);
      setTickets(initialMaintenance);
      setProcurement(initialProcurement);
      localStorage.clear();
      setIsSettingsModalOpen(false);
      showToast('Seluruh data berhasil direset ke pengaturan awal.');
    }
  };

  // Export full JSON Backup
  const handleExportAllJson = () => {
    const backupData = {
      institution,
      items,
      rooms,
      loans,
      tickets,
      procurement,
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Sarpras_${institution.npsn}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Berkas cadangan JSON berhasil diunduh.');
  };

  // Import JSON Backup
  const handleImportJson = (jsonData: any) => {
    if (jsonData.items && jsonData.rooms) {
      if (jsonData.institution) setInstitution(jsonData.institution);
      if (jsonData.items) setItems(jsonData.items);
      if (jsonData.rooms) setRooms(jsonData.rooms);
      if (jsonData.loans) setLoans(jsonData.loans);
      if (jsonData.tickets) setTickets(jsonData.tickets);
      if (jsonData.procurement) setProcurement(jsonData.procurement);
      setIsSettingsModalOpen(false);
      showToast('Data cadangan berhasil dipulihkan!');
    } else {
      alert('Format berkas cadangan JSON tidak valid.');
    }
  };

  // Render Login Page if user is not authenticated
  if (!currentUser) {
    return (
      <LoginPage
        institution={institution}
        onLoginSuccess={user => {
          setCurrentUser(user);
          setUserRole(user.role);
          showToast(`Selamat datang, ${user.fullName}`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        institution={institution}
        schools={schools}
        onSelectSchool={handleSelectSchool}
        activeTab={activeTab}
        currentUser={currentUser}
        onLogout={() => {
          localStorage.removeItem('sarpras_auth_user');
          sessionStorage.removeItem('sarpras_auth_user');
          setCurrentUser(null);
          showToast('Anda telah berhasil keluar dari sistem.');
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenLabelModal={() => setBarcodeItem(items[0] || initialItems[0])}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onQuickAddItem={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          items={items}
          rooms={rooms}
          loans={loans}
          tickets={tickets}
          schoolsCount={schools.length}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenLabelModal={() => setBarcodeItem(items[0] || initialItems[0])}
          onOpenGasModal={() => setIsGasModalOpen(true)}
        />

        {/* Center Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                institution={institution}
                items={items}
                rooms={rooms}
                loans={loans}
                tickets={tickets}
                onNavigate={setActiveTab}
                onOpenAddItem={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                onOpenAddLoan={() => {
                  setPreselectedLoanItem(undefined);
                  setIsLoanModalOpen(true);
                }}
                onOpenAddTicket={() => {
                  setEditingTicket(null);
                  setPreselectedTicketItem(undefined);
                  setPreselectedTicketRoom(undefined);
                  setIsMaintenanceModalOpen(true);
                }}
                onOpenLabelModal={() => setBarcodeItem(items[0] || initialItems[0])}
              />
            )}

            {activeTab === 'items' && (
              <ItemsView
                items={items}
                rooms={rooms}
                userRole={userRole}
                onAddItem={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                onEditItem={item => {
                  setEditingItem(item);
                  setIsItemModalOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onOpenBarcode={item => setBarcodeItem(item)}
                onBorrowItem={item => {
                  setPreselectedLoanItem(item.id);
                  setIsLoanModalOpen(true);
                }}
                onReportDamage={item => {
                  setEditingTicket(null);
                  setPreselectedTicketItem(item);
                  setPreselectedTicketRoom(undefined);
                  setIsMaintenanceModalOpen(true);
                }}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomsView
                rooms={rooms}
                items={items}
                userRole={userRole}
                onAddRoom={() => {
                  setEditingRoom(null);
                  setIsRoomModalOpen(true);
                }}
                onEditRoom={room => {
                  setEditingRoom(room);
                  setIsRoomModalOpen(true);
                }}
                onDeleteRoom={handleDeleteRoom}
                onReportRoomDamage={room => {
                  setEditingTicket(null);
                  setPreselectedTicketItem(undefined);
                  setPreselectedTicketRoom(room);
                  setIsMaintenanceModalOpen(true);
                }}
              />
            )}

            {activeTab === 'loans' && (
              <LoansView
                loans={loans}
                items={items}
                userRole={userRole}
                onOpenAddLoan={() => {
                  setPreselectedLoanItem(undefined);
                  setIsLoanModalOpen(true);
                }}
                onApproveLoan={handleApproveLoan}
                onRejectLoan={handleRejectLoan}
                onReturnLoan={handleReturnLoan}
                onPrintBAST={() => setIsReportModalOpen(true)}
              />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceView
                tickets={tickets}
                userRole={userRole}
                onOpenAddTicket={() => {
                  setEditingTicket(null);
                  setPreselectedTicketItem(undefined);
                  setPreselectedTicketRoom(undefined);
                  setIsMaintenanceModalOpen(true);
                }}
                onEditTicket={ticket => {
                  setEditingTicket(ticket);
                  setIsMaintenanceModalOpen(true);
                }}
                onDeleteTicket={handleDeleteTicket}
              />
            )}

            {activeTab === 'procurement' && (
              <ProcurementView
                procurement={procurement}
                userRole={userRole}
                onAddProcurement={handleAddProcurement}
                onUpdateStatus={handleUpdateProcurementStatus}
                onDeleteProcurement={handleDeleteProcurement}
              />
            )}

            {activeTab === 'schools' && (
              <SchoolManagementView
                schools={schools}
                activeSchoolId={institution.id || ''}
                userRole={userRole}
                onSelectSchool={handleSelectSchool}
                onAddSchool={handleAddSchool}
                onUpdateSchool={handleUpdateSchool}
                onDeleteSchool={handleDeleteSchool}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium py-2 px-3.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialogs */}
      {isItemModalOpen && (
        <ItemModal
          item={editingItem}
          rooms={rooms}
          onSave={handleSaveItem}
          onClose={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {isRoomModalOpen && (
        <RoomModal
          room={editingRoom}
          onSave={handleSaveRoom}
          onClose={() => {
            setIsRoomModalOpen(false);
            setEditingRoom(null);
          }}
        />
      )}

      {isLoanModalOpen && (
        <LoanModal
          items={items}
          preselectedItemId={preselectedLoanItem}
          onSave={handleSaveLoan}
          onClose={() => {
            setIsLoanModalOpen(false);
            setPreselectedLoanItem(undefined);
          }}
        />
      )}

      {isMaintenanceModalOpen && (
        <MaintenanceModal
          ticket={editingTicket}
          items={items}
          rooms={rooms}
          preselectedItem={preselectedTicketItem}
          preselectedRoom={preselectedTicketRoom}
          onSave={handleSaveTicket}
          onClose={() => {
            setIsMaintenanceModalOpen(false);
            setEditingTicket(null);
            setPreselectedTicketItem(undefined);
            setPreselectedTicketRoom(undefined);
          }}
        />
      )}

      {barcodeItem && (
        <AssetBarcodeModal
          item={barcodeItem}
          allItems={items}
          institution={institution}
          onClose={() => setBarcodeItem(null)}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          institution={institution}
          items={items}
          rooms={rooms}
          loans={loans}
          tickets={tickets}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          institution={institution}
          onSave={info => {
            setInstitution(info);
            showToast('Identitas institusi berhasil diperbarui.');
          }}
          onResetData={handleResetData}
          onExportAllJson={handleExportAllJson}
          onImportJson={handleImportJson}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {isGasModalOpen && (
        <GasExportModal
          onClose={() => setIsGasModalOpen(false)}
        />
      )}
    </div>
  );
}
