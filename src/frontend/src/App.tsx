import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import {
  useGetAllRegistrations,
  useSubmitRegistration,
} from "@/hooks/useQueries";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Play,
  Shield,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiYoutube } from "react-icons/si";
import { toast } from "sonner";

const TOURNAMENTS = [
  {
    id: "up-tennis-league",
    name: "UP TENNIS LEAGUE",
    prize: "₹50,000 + Pulsar",
    detail: "Location: Lucknow",
    detailIcon: "map",
    cta: "Register Now",
    badge: "OPEN",
  },
  {
    id: "night-champions-cup",
    name: "NIGHT CHAMPIONS CUP",
    prize: "₹40,000",
    detail: "Date: Next Week",
    detailIcon: "calendar",
    cta: "Join Tournament",
    badge: "UPCOMING",
  },
];

const STORAGE_KEY = "alpha_cricket_tournaments";

type Tournament = (typeof TOURNAMENTS)[0];

function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Tournament[]) : TOURNAMENTS;
    } catch {
      return TOURNAMENTS;
    }
  });

  const addTournament = (t: Tournament) => {
    const updated = [...tournaments, t];
    setTournaments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteTournament = (id: string) => {
    const updated = tournaments.filter((t) => t.id !== id);
    setTournaments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { tournaments, addTournament, deleteTournament };
}

// Real videos from @alphacricketlive8 channel
const CHANNEL_VIDEOS = [
  {
    id: "BuU6OQM78C0",
    url: "https://www.youtube.com/live/BuU6OQM78C0",
    title: "Alpha Cricket Live - Match 1",
  },
  {
    id: "LuQGKN7js3U",
    url: "https://youtu.be/LuQGKN7js3U",
    title: "Alpha Cricket Live - Match 2",
  },
  {
    id: "YJ1839T01Gw",
    url: "https://www.youtube.com/live/YJ1839T01Gw",
    title: "Cricket Match - Live Stream",
  },
  {
    id: "75n01DFhGC4",
    url: "https://www.youtube.com/live/75n01DFhGC4",
    title: "Alpha Cricket Live - Match 4",
  },
  {
    id: "1nT_Bk_GOTE",
    url: "https://www.youtube.com/live/1nT_Bk_GOTE",
    title: "Cricket Match - Live Action",
  },
  {
    id: "KiFDYnS6hzk",
    url: "https://www.youtube.com/live/KiFDYnS6hzk",
    title: "Alpha Cricket Live - Match 6",
  },
];

const ADMIN_PASSWORD = "alpha2025";

function NavLink({
  href,
  ocid,
  children,
}: {
  href: string;
  ocid: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      data-ocid={ocid}
      className="text-gold font-display font-semibold uppercase tracking-widest text-sm hover:text-gold-light transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
    </a>
  );
}

function RegistrationModal({
  open,
  onClose,
  defaultTournament,
  tournaments: tournamentsProp,
}: {
  open: boolean;
  onClose: () => void;
  defaultTournament: string;
  tournaments?: Tournament[];
}) {
  const activeTournaments = tournamentsProp ?? TOURNAMENTS;
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tournament, setTournament] = useState(defaultTournament);
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useSubmitRegistration();
  const { actor, isFetching: actorLoading } = useActor();

  // Sync tournament selection when modal opens with a different tournament
  useEffect(() => {
    if (open) {
      setTournament(defaultTournament);
    }
  }, [open, defaultTournament]);

  const handleClose = () => {
    setSuccess(false);
    setTeamName("");
    setCaptainName("");
    setPhoneNumber("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connection ho rahi hai, thodi der baad try karein.");
      return;
    }
    if (!tournament) {
      toast.error("Koi tournament select karein.");
      return;
    }
    mutate(
      { teamName, captainName, phoneNumber, tournament },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err) => {
          console.error("Registration error:", err);
          toast.error("Registration failed. Please try again.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-pitch-card border-2 border-gold/40 text-foreground max-w-md"
        data-ocid="registration.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold text-gold tracking-wider">
            TEAM REGISTRATION
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
              data-ocid="registration.success_state"
            >
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-display text-2xl font-bold text-gold mb-2">
                Registration Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your team has been registered successfully. We'll contact you
                shortly.
              </p>
              <Button
                onClick={handleClose}
                className="bg-gold text-white font-display font-bold hover:bg-gold-light"
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="teamName"
                  className="text-gold/80 font-display uppercase text-xs tracking-wider"
                >
                  Team Name
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  required
                  className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                  data-ocid="registration.teamname.input"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="captainName"
                  className="text-gold/80 font-display uppercase text-xs tracking-wider"
                >
                  Captain Name
                </Label>
                <Input
                  id="captainName"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  placeholder="Enter captain's name"
                  required
                  className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                  data-ocid="registration.captainname.input"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-gold/80 font-display uppercase text-xs tracking-wider"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  type="tel"
                  className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                  data-ocid="registration.phone.input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gold/80 font-display uppercase text-xs tracking-wider">
                  Tournament
                </Label>
                <Select value={tournament} onValueChange={setTournament}>
                  <SelectTrigger
                    className="bg-pitch-mid border-gold/30 text-foreground focus:border-gold"
                    data-ocid="registration.tournament.select"
                  >
                    <SelectValue placeholder="Select tournament" />
                  </SelectTrigger>
                  <SelectContent className="bg-pitch-card border-gold/30">
                    {activeTournaments.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        className="text-foreground focus:bg-gold/20 focus:text-gold"
                      >
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gold/30 text-gold/70 hover:bg-gold/10 hover:text-gold font-display"
                  data-ocid="registration.close_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || actorLoading}
                  className="flex-1 bg-gold text-white font-display font-bold hover:bg-gold-light disabled:opacity-50"
                  data-ocid="registration.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span data-ocid="registration.loading_state">
                        Registering...
                      </span>
                    </>
                  ) : (
                    "Register Team"
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admin Panel ────────────────────────────────────────────────────────────

function AdminLoginScreen({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Galat password! Dobara try karein.");
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo & title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "rgba(255,215,0,0.1)",
              border: "2px solid rgba(255,215,0,0.4)",
            }}
          >
            <Shield className="w-8 h-8" style={{ color: "#ffd700" }} />
          </div>
          <h1
            className="font-display text-3xl font-black uppercase tracking-wider"
            style={{ color: "#ffd700" }}
          >
            ADMIN PANEL
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-display tracking-wider uppercase">
            Alpha Cricket Live
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#151515",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow: "0 0 40px rgba(255,215,0,0.05)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="font-display text-xs uppercase tracking-widest"
                style={{ color: "rgba(255,215,0,0.7)" }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "rgba(255,215,0,0.4)" }}
                />
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  data-ocid="admin.password.input"
                  className="pl-10 bg-pitch-mid text-foreground placeholder:text-muted-foreground"
                  style={{
                    borderColor: error
                      ? "rgba(255,60,60,0.6)"
                      : "rgba(255,215,0,0.25)",
                  }}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  data-ocid="admin.login.error_state"
                  className="text-sm font-display"
                  style={{ color: "#ff6060" }}
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              data-ocid="admin.login.submit_button"
              className="w-full font-display font-black uppercase tracking-wider text-white"
              style={{ background: "#ffd700" }}
            >
              Login
            </Button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            type="button"
            data-ocid="admin.back.link"
            onClick={() => {
              window.location.hash = "";
            }}
            className="inline-flex items-center gap-2 text-sm font-display uppercase tracking-wider transition-colors"
            style={{ color: "rgba(255,215,0,0.5)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard({
  onLogout,
  tournaments,
  addTournament,
  deleteTournament,
}: {
  onLogout: () => void;
  tournaments: Tournament[];
  addTournament: (t: Tournament) => void;
  deleteTournament: (id: string) => void;
}) {
  const { data: registrations, isLoading, isError } = useGetAllRegistrations();

  const tournamentLabel = (id: string) => {
    const found = tournaments.find((t) => t.id === id);
    return found ? found.name : id;
  };

  const [newTournament, setNewTournament] = useState({
    name: "",
    prize: "",
    detail: "",
    badge: "OPEN" as "OPEN" | "UPCOMING",
    cta: "Register Now",
    detailIcon: "map" as "map" | "calendar",
  });
  const [formError, setFormError] = useState("");

  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournament.name.trim() || !newTournament.prize.trim()) {
      setFormError("Name aur Prize required hain.");
      return;
    }
    const id = newTournament.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    addTournament({ ...newTournament, id });
    setNewTournament({
      name: "",
      prize: "",
      detail: "",
      badge: "OPEN",
      cta: "Register Now",
      detailIcon: "map",
    });
    setFormError("");
    toast.success("Tournament add ho gaya!");
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Admin header */}
      <header
        style={{
          background: "linear-gradient(90deg, #1a1400 0%, #0a0a0a 60%)",
          borderBottom: "2px solid rgba(255,215,0,0.3)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" style={{ color: "#ffd700" }} />
            <div>
              <h1
                className="font-display text-xl font-black uppercase tracking-wider"
                style={{ color: "#ffd700" }}
              >
                ADMIN PANEL
              </h1>
              <p className="text-muted-foreground text-xs font-display uppercase tracking-wider">
                Registrations Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="admin.back.link"
              onClick={() => {
                window.location.hash = "";
              }}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider transition-colors px-3 py-2 rounded-lg"
              style={{
                color: "rgba(255,215,0,0.6)",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main Site
            </button>
            <Button
              onClick={onLogout}
              data-ocid="admin.logout.button"
              variant="outline"
              size="sm"
              className="font-display uppercase tracking-wider text-xs"
              style={{
                borderColor: "rgba(255,60,60,0.4)",
                color: "#ff8080",
              }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: "Total Registrations",
              value: registrations?.length ?? "—",
              icon: Users,
            },
            {
              label: "UP Tennis League",
              value:
                registrations?.filter(
                  (r) => r.tournament === "up-tennis-league",
                ).length ?? "—",
              icon: Trophy,
            },
            {
              label: "Night Champions Cup",
              value:
                registrations?.filter(
                  (r) => r.tournament === "night-champions-cup",
                ).length ?? "—",
              icon: Trophy,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{
                background: "#151515",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: "rgba(255,215,0,0.6)" }}
                />
                <span
                  className="text-xs font-display uppercase tracking-wider"
                  style={{ color: "rgba(255,215,0,0.5)" }}
                >
                  {stat.label}
                </span>
              </div>
              <p
                className="font-display text-3xl font-black"
                style={{ color: "#ffd700" }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs: Registrations + Tournaments */}
        <Tabs defaultValue="registrations" className="w-full">
          <TabsList
            className="mb-6 w-full sm:w-auto"
            style={{
              background: "#151515",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
          >
            <TabsTrigger
              value="registrations"
              data-ocid="admin.registrations.tab"
              className="font-display uppercase tracking-wider text-xs data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              Registrations
            </TabsTrigger>
            <TabsTrigger
              value="tournaments"
              data-ocid="admin.tournaments.tab"
              className="font-display uppercase tracking-wider text-xs data-[state=active]:bg-gold data-[state=active]:text-white"
            >
              Tournaments
            </TabsTrigger>
          </TabsList>

          {/* REGISTRATIONS TAB */}
          <TabsContent value="registrations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,215,0,0.25)",
                background: "#111",
              }}
            >
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,215,0,0.15)" }}
              >
                <h2
                  className="font-display text-lg font-black uppercase tracking-wider"
                  style={{ color: "#ffd700" }}
                >
                  All Registrations
                </h2>
                {registrations && (
                  <span
                    className="font-display text-xs uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(255,215,0,0.1)",
                      color: "rgba(255,215,0,0.7)",
                      border: "1px solid rgba(255,215,0,0.2)",
                    }}
                  >
                    {registrations.length} total
                  </span>
                )}
              </div>
              {isLoading && (
                <div
                  data-ocid="admin.registrations.loading_state"
                  className="p-6 space-y-3"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <Skeleton
                      key={n}
                      className="h-10 w-full rounded-lg"
                      style={{ background: "rgba(255,215,0,0.05)" }}
                    />
                  ))}
                </div>
              )}
              {isError && (
                <div
                  data-ocid="admin.registrations.error_state"
                  className="p-12 text-center"
                >
                  <p className="text-2xl mb-2">⚠️</p>
                  <p
                    className="font-display uppercase tracking-wider text-sm"
                    style={{ color: "#ff8080" }}
                  >
                    Data load karne mein error aayi. Dobara try karein.
                  </p>
                </div>
              )}
              {!isLoading && !isError && registrations?.length === 0 && (
                <div
                  data-ocid="admin.registrations.empty_state"
                  className="p-16 text-center"
                >
                  <div className="text-5xl mb-4">📋</div>
                  <p
                    className="font-display text-xl font-bold uppercase tracking-wider mb-2"
                    style={{ color: "rgba(255,215,0,0.5)" }}
                  >
                    Koi Registration Nahi
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Abhi tak kisi ne register nahi kiya hai.
                  </p>
                </div>
              )}
              {!isLoading &&
                !isError &&
                registrations &&
                registrations.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.registrations.table">
                      <TableHeader>
                        <TableRow
                          style={{ borderColor: "rgba(255,215,0,0.1)" }}
                        >
                          <TableHead
                            className="font-display uppercase tracking-wider text-xs"
                            style={{ color: "rgba(255,215,0,0.6)" }}
                          >
                            #
                          </TableHead>
                          <TableHead
                            className="font-display uppercase tracking-wider text-xs"
                            style={{ color: "rgba(255,215,0,0.6)" }}
                          >
                            Team Name
                          </TableHead>
                          <TableHead
                            className="font-display uppercase tracking-wider text-xs"
                            style={{ color: "rgba(255,215,0,0.6)" }}
                          >
                            Captain
                          </TableHead>
                          <TableHead
                            className="font-display uppercase tracking-wider text-xs"
                            style={{ color: "rgba(255,215,0,0.6)" }}
                          >
                            Phone
                          </TableHead>
                          <TableHead
                            className="font-display uppercase tracking-wider text-xs"
                            style={{ color: "rgba(255,215,0,0.6)" }}
                          >
                            Tournament
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((reg, i) => (
                          <TableRow
                            key={`${reg.teamName}-${i}`}
                            data-ocid={`admin.registrations.row.${i + 1}`}
                            className="transition-colors"
                            style={{ borderColor: "rgba(255,215,0,0.07)" }}
                          >
                            <TableCell
                              className="font-display text-xs"
                              style={{ color: "rgba(255,215,0,0.3)" }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              className="font-display font-bold text-sm"
                              style={{ color: "#ffd700" }}
                            >
                              {reg.teamName}
                            </TableCell>
                            <TableCell className="text-foreground text-sm">
                              {reg.captainName}
                            </TableCell>
                            <TableCell>
                              <a
                                href={`tel:${reg.phoneNumber}`}
                                className="inline-flex items-center gap-1.5 text-sm"
                                style={{ color: "#22c55e" }}
                              >
                                <Phone className="w-3 h-3" />
                                {reg.phoneNumber}
                              </a>
                            </TableCell>
                            <TableCell>
                              <span
                                className="font-display text-xs px-2 py-1 rounded-full uppercase tracking-wider"
                                style={{
                                  background: "rgba(255,215,0,0.12)",
                                  color: "#ffd700",
                                  border: "1px solid rgba(255,215,0,0.25)",
                                }}
                              >
                                {tournamentLabel(reg.tournament)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </motion.div>
          </TabsContent>

          {/* TOURNAMENTS TAB */}
          <TabsContent value="tournaments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Add Tournament Form */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,215,0,0.25)",
                }}
              >
                <h2
                  className="font-display text-lg font-black uppercase tracking-wider mb-5"
                  style={{ color: "#ffd700" }}
                >
                  Naya Tournament Add Karein
                </h2>
                <form
                  onSubmit={handleAddTournament}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-gold/70 font-display uppercase text-xs tracking-wider">
                      Tournament Name *
                    </Label>
                    <Input
                      value={newTournament.name}
                      onChange={(e) =>
                        setNewTournament((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. UP Premier League"
                      required
                      data-ocid="admin.tournament.name.input"
                      className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gold/70 font-display uppercase text-xs tracking-wider">
                      Prize *
                    </Label>
                    <Input
                      value={newTournament.prize}
                      onChange={(e) =>
                        setNewTournament((p) => ({
                          ...p,
                          prize: e.target.value,
                        }))
                      }
                      placeholder="e.g. Rs.50,000 + Trophy"
                      required
                      data-ocid="admin.tournament.prize.input"
                      className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gold/70 font-display uppercase text-xs tracking-wider">
                      Location / Detail
                    </Label>
                    <Input
                      value={newTournament.detail}
                      onChange={(e) =>
                        setNewTournament((p) => ({
                          ...p,
                          detail: e.target.value,
                        }))
                      }
                      placeholder="e.g. Location: Lucknow"
                      data-ocid="admin.tournament.detail.input"
                      className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gold/70 font-display uppercase text-xs tracking-wider">
                      CTA Button Text
                    </Label>
                    <Input
                      value={newTournament.cta}
                      onChange={(e) =>
                        setNewTournament((p) => ({ ...p, cta: e.target.value }))
                      }
                      placeholder="e.g. Register Now"
                      data-ocid="admin.tournament.cta.input"
                      className="bg-pitch-mid border-gold/30 text-foreground placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gold/70 font-display uppercase text-xs tracking-wider">
                      Badge
                    </Label>
                    <Select
                      value={newTournament.badge}
                      onValueChange={(v) =>
                        setNewTournament((p) => ({
                          ...p,
                          badge: v as "OPEN" | "UPCOMING",
                        }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="admin.tournament.badge.select"
                        className="bg-pitch-mid border-gold/30 text-foreground focus:border-gold"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-pitch-card border-gold/30">
                        <SelectItem
                          value="OPEN"
                          className="text-foreground focus:bg-gold/20"
                        >
                          OPEN
                        </SelectItem>
                        <SelectItem
                          value="UPCOMING"
                          className="text-foreground focus:bg-gold/20"
                        >
                          UPCOMING
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    {formError && (
                      <p
                        className="text-sm mb-3 font-display"
                        style={{ color: "#ff8080" }}
                        data-ocid="admin.tournament.error_state"
                      >
                        ⚠️ {formError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      data-ocid="admin.tournament.add.submit_button"
                      className="w-full font-display font-black uppercase tracking-wider text-white"
                      style={{ background: "#ffd700" }}
                    >
                      + Tournament Add Karein
                    </Button>
                  </div>
                </form>
              </div>

              {/* Current Tournaments List */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,215,0,0.25)",
                }}
              >
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(255,215,0,0.15)" }}
                >
                  <h2
                    className="font-display text-lg font-black uppercase tracking-wider"
                    style={{ color: "#ffd700" }}
                  >
                    Current Tournaments
                  </h2>
                  <span
                    className="font-display text-xs uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(255,215,0,0.1)",
                      color: "rgba(255,215,0,0.7)",
                      border: "1px solid rgba(255,215,0,0.2)",
                    }}
                  >
                    {tournaments.length} total
                  </span>
                </div>
                {tournaments.length === 0 && (
                  <div
                    data-ocid="admin.tournaments.empty_state"
                    className="p-16 text-center"
                  >
                    <div className="text-5xl mb-4">🏆</div>
                    <p
                      className="font-display text-xl font-bold uppercase tracking-wider"
                      style={{ color: "rgba(255,215,0,0.5)" }}
                    >
                      Koi Tournament Nahi
                    </p>
                  </div>
                )}
                <div
                  className="divide-y"
                  style={{ borderColor: "rgba(255,215,0,0.07)" }}
                >
                  {tournaments.map((t, i) => (
                    <div
                      key={t.id}
                      data-ocid={`admin.tournament.item.${i + 1}`}
                      className="px-6 py-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Trophy
                          className="w-5 h-5 shrink-0"
                          style={{ color: "rgba(255,215,0,0.6)" }}
                        />
                        <div className="min-w-0">
                          <p
                            className="font-display font-bold text-sm truncate"
                            style={{ color: "#ffd700" }}
                          >
                            {t.name}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">
                            {t.prize} · {t.detail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="font-display text-xs px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            background:
                              t.badge === "OPEN"
                                ? "rgba(255,215,0,0.15)"
                                : "rgba(255,60,60,0.15)",
                            color: t.badge === "OPEN" ? "#ffd700" : "#ff8080",
                            border:
                              t.badge === "OPEN"
                                ? "1px solid rgba(255,215,0,0.3)"
                                : "1px solid rgba(255,60,60,0.3)",
                          }}
                        >
                          {t.badge}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          data-ocid={`admin.tournament.delete_button.${i + 1}`}
                          onClick={() => {
                            deleteTournament(t.id);
                            toast.success(`"${t.name}" delete ho gaya!`);
                          }}
                          className="font-display text-xs uppercase tracking-wider"
                          style={{
                            background: "rgba(255,60,60,0.15)",
                            color: "#ff8080",
                            border: "1px solid rgba(255,60,60,0.3)",
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground/40 text-xs font-display uppercase tracking-wider">
        © {new Date().getFullYear()} Alpha Cricket Live · Admin Portal
      </footer>
    </div>
  );
}

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { tournaments, addTournament, deleteTournament } = useTournaments();

  if (!isLoggedIn) {
    return <AdminLoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => setIsLoggedIn(false)}
      tournaments={tournaments}
      addTournament={addTournament}
      deleteTournament={deleteTournament}
    />
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const { tournaments } = useTournaments();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] =
    useState("up-tennis-league");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin",
  );

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  const openModal = (tournamentId: string) => {
    setSelectedTournament(tournamentId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-pitch font-body cricket-pattern">
      <Toaster />

      {/* Header */}
      <header
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(90deg, #b8860b 0%, #000 60%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #ffd700 0%, transparent 60%)",
          }}
        />
        <div
          className="relative z-10 py-5 px-6 text-center border-b-4"
          style={{ borderColor: "#ffd700" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Channel Logo */}
            <motion.img
              src="/assets/uploads/Picsart_26-01-29_15-33-12-319-1.png"
              alt="Alpha Cricket Live Logo"
              className="w-28 h-28 md:w-36 md:h-36 object-contain mb-3 drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            <div
              className="font-display text-4xl md:text-5xl font-black text-white tracking-[0.15em] uppercase"
              style={{
                textShadow: "2px 2px 0 #ff0000, 4px 4px 0 rgba(255,0,0,0.3)",
              }}
            >
              ALPHA CRICKET LIVE
            </div>
            <p className="text-gold/80 font-body text-sm md:text-base mt-1 tracking-widest">
              Tennis Cricket ka Sabse Bada Platform
            </p>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-pitch-dark border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#home" ocid="nav.home.link">
              Home
            </NavLink>
            <NavLink href="#live" ocid="nav.live_scores.link">
              Live Scores
            </NavLink>
            <NavLink href="#videos" ocid="nav.videos.link">
              Videos
            </NavLink>
            <NavLink href="#tournaments" ocid="nav.tournaments.link">
              Tournaments
            </NavLink>
            <NavLink href="#gallery" ocid="nav.gallery.link">
              Gallery
            </NavLink>
            <NavLink href="#contact" ocid="nav.contact.link">
              Contact
            </NavLink>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-gold font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.toggle"
          >
            MENU{" "}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                mobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className="live-dot w-2.5 h-2.5 rounded-full bg-crimson inline-block" />
            <span className="text-crimson font-display font-bold text-xs uppercase tracking-wider">
              LIVE NOW
            </span>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gold/20 bg-pitch-dark overflow-hidden"
            >
              <div className="flex flex-col items-center gap-4 py-4">
                <NavLink href="#home" ocid="nav.home.link">
                  Home
                </NavLink>
                <NavLink href="#live" ocid="nav.live_scores.link">
                  Live Scores
                </NavLink>
                <NavLink href="#videos" ocid="nav.videos.link">
                  Videos
                </NavLink>
                <NavLink href="#tournaments" ocid="nav.tournaments.link">
                  Tournaments
                </NavLink>
                <NavLink href="#gallery" ocid="nav.gallery.link">
                  Gallery
                </NavLink>
                <NavLink href="#contact" ocid="nav.contact.link">
                  Contact
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-[560px] flex items-center justify-center text-center px-6 py-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-pitch/70" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent 40%, #000 100%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 bg-crimson/20 border border-crimson/40 rounded-full px-4 py-1.5 mb-6">
            <span className="live-dot w-2 h-2 rounded-full bg-crimson inline-block" />
            <span className="text-crimson font-display font-bold text-xs uppercase tracking-widest">
              Live Streaming Active
            </span>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-black uppercase leading-none mb-4"
            style={{
              color: "#ffd700",
              WebkitTextStroke: "1px rgba(0,0,0,0.5)",
              textShadow: "0 4px 20px rgba(255,215,0,0.4)",
            }}
          >
            WATCH LIVE
            <br />
            <span className="text-white">ACTION NOW!</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl font-body mb-8 max-w-xl mx-auto">
            Lucknow aur UP ke har bade tournament ki live streaming.
          </p>

          <motion.a
            href="https://youtube.com/@alphacricketlive8"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.subscribe.button"
            className="inline-flex items-center gap-3 bg-gold text-white font-display font-black text-lg px-8 py-4 rounded-lg uppercase tracking-wider hover:bg-gold-light transition-all duration-200 shadow-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SiYoutube className="w-6 h-6 text-crimson" />
            Subscribe on YouTube
          </motion.a>
        </motion.div>
      </section>

      {/* Live Match */}
      <section
        id="live"
        className="py-16 px-6"
        style={{ background: "#1a1a1a" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-2">
              <span className="live-dot text-3xl">🔴</span>
              <h2
                className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider"
                style={{
                  color: "#ff0000",
                  textShadow: "0 0 20px rgba(255,0,0,0.5)",
                }}
              >
                CURRENT LIVE MATCH
              </h2>
            </div>
            <p className="text-muted-foreground text-sm tracking-wider uppercase">
              Streaming live from Lucknow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto rounded-lg overflow-hidden"
            style={{
              maxWidth: "800px",
              border: "4px solid #ff0000",
              boxShadow:
                "0 0 40px rgba(255,0,0,0.3), 0 0 80px rgba(255,0,0,0.1)",
            }}
          >
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/live_stream?channel=alphacricketlive8"
                title="Alpha Cricket Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: "none" }}
              />
            </div>
          </motion.div>

          <div className="flex justify-center mt-6 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>2,400+ viewers watching</span>
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-crimson" />
              <span>@alphacricketlive8</span>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-16 px-6 bg-pitch">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-gold mb-3">
              CHANNEL VIDEOS
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Click any video to watch on YouTube
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHANNEL_VIDEOS.map((video, i) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`video.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group block rounded-xl overflow-hidden cursor-pointer"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,215,0,0.2)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-pitch/40 group-hover:bg-pitch/20 transition-all duration-300 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: "rgba(255,0,0,0.9)",
                        boxShadow: "0 0 24px rgba(255,0,0,0.6)",
                      }}
                    >
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* YouTube badge */}
                  <div className="absolute top-2 right-2">
                    <SiYoutube className="w-6 h-6 text-crimson drop-shadow" />
                  </div>
                </div>

                {/* Video info */}
                <div className="p-4">
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-gold transition-colors duration-200 leading-snug">
                    {video.title}
                  </h3>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a
              href="https://youtube.com/@alphacricketlive8"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="videos.channel.button"
              className="inline-flex items-center gap-3 border-2 border-gold text-gold font-display font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-gold hover:text-white transition-all duration-200"
            >
              <SiYoutube className="w-5 h-5" />
              View All Videos on YouTube
            </a>
          </motion.div>
        </div>
      </section>

      {/* Tournaments */}
      <section
        id="tournaments"
        className="py-16 px-6"
        style={{ background: "#111" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider gold-shimmer mb-3">
              UPCOMING TOURNAMENTS
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 justify-items-center">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                data-ocid={`tournament.card.${index + 1}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 0 30px rgba(255,215,0,0.2)",
                }}
                className="w-full max-w-sm rounded-xl p-6 text-center relative overflow-hidden"
                style={{
                  background: "#222",
                  border: "2px solid #ffd700",
                }}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="font-display text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background:
                        tournament.badge === "OPEN"
                          ? "rgba(255,215,0,0.2)"
                          : "rgba(255,0,0,0.2)",
                      color:
                        tournament.badge === "OPEN" ? "#ffd700" : "#ff6060",
                      border: `1px solid ${
                        tournament.badge === "OPEN"
                          ? "rgba(255,215,0,0.4)"
                          : "rgba(255,0,0,0.4)"
                      }`,
                    }}
                  >
                    {tournament.badge}
                  </span>
                </div>

                {/* Trophy icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{
                    background: "rgba(255,215,0,0.1)",
                    border: "1px solid rgba(255,215,0,0.3)",
                  }}
                >
                  <Trophy className="w-7 h-7 text-gold" />
                </div>

                <h3
                  className="font-display text-xl font-black uppercase tracking-wider mb-3"
                  style={{
                    color: "#ff0000",
                    textShadow: "0 0 10px rgba(255,0,0,0.3)",
                  }}
                >
                  {tournament.name}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-2 text-gold font-display font-bold text-lg">
                    <span>🏆</span>
                    <span>1st Prize: {tournament.prize}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    {tournament.detailIcon === "map" ? (
                      <MapPin className="w-3.5 h-3.5 text-gold/60" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-gold/60" />
                    )}
                    <span>{tournament.detail}</span>
                  </div>
                </div>

                <motion.button
                  data-ocid={`tournament.register.button.${index + 1}`}
                  onClick={() => openModal(tournament.id)}
                  className="w-full py-3 px-6 font-display font-black uppercase tracking-wider rounded-lg text-white transition-all duration-200"
                  style={{ background: "#ffd700" }}
                  whileHover={{ background: "#ffe566", scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tournament.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 px-6 bg-pitch">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-gold mb-3">
              GALLERY
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: "🏏", label: "Match Day 1 vs Tigers" },
              { emoji: "🏆", label: "Champions Trophy 2025" },
              { emoji: "🎯", label: "Night League Final" },
              { emoji: "🔥", label: "UP vs Delhi Clash" },
              { emoji: "⚡", label: "Power Play Special" },
              { emoji: "🌟", label: "Rising Stars 2025" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                className="aspect-video rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="text-xs text-muted-foreground font-display uppercase tracking-wider text-center px-2">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-16 px-6"
        style={{ background: "#111" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-gold mb-3">
              CONTACT US
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-10" />

            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,215,0,0.3)",
                }}
              >
                <Phone
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "#22c55e" }}
                />
                <h3
                  className="font-display font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#22c55e" }}
                >
                  HELPLINE
                </h3>
                <p className="font-semibold" style={{ color: "#22c55e" }}>
                  Azmaan
                </p>
                <p style={{ color: "#22c55e" }}>+91 7081170030</p>
              </div>
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,215,0,0.3)",
                }}
              >
                <SiYoutube className="w-8 h-8 text-crimson mx-auto mb-3" />
                <h3 className="font-display font-bold text-gold uppercase tracking-wider mb-2">
                  YouTube
                </h3>
                <a
                  href="https://youtube.com/@alphacricketlive8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  @alphacricketlive8
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center"
        style={{ background: "#000", borderTop: "2px solid #333" }}
      >
        <p className="text-sm mb-3">
          <span
            className="font-display font-bold tracking-wider"
            style={{ color: "#22c55e" }}
          >
            HELPLINE:
          </span>{" "}
          <span style={{ color: "#22c55e" }}>Azmaan</span>{" "}
          <span style={{ color: "#22c55e" }}>- +91 7081170030</span>
        </p>
        <p className="text-muted-foreground text-sm mb-3">
          © {new Date().getFullYear()} ALPHA CRICKET LIVE. All rights reserved.
        </p>
        <p className="text-muted-foreground/50 text-xs">
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold/60 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTournament={selectedTournament}
        tournaments={tournaments}
      />
    </div>
  );
}
