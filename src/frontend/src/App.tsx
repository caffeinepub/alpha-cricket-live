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
import { Toaster } from "@/components/ui/sonner";
import { useSubmitRegistration } from "@/hooks/useQueries";
import {
  Calendar,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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
}: {
  open: boolean;
  onClose: () => void;
  defaultTournament: string;
}) {
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tournament, setTournament] = useState(defaultTournament);
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useSubmitRegistration();

  const handleClose = () => {
    setSuccess(false);
    setTeamName("");
    setCaptainName("");
    setPhoneNumber("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { teamName, captainName, phoneNumber, tournament },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: () => {
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
                className="bg-gold text-pitch font-display font-bold hover:bg-gold-light"
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
                    {TOURNAMENTS.map((t) => (
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
                  disabled={isPending}
                  className="flex-1 bg-gold text-pitch font-display font-bold hover:bg-gold-light disabled:opacity-50"
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

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] =
    useState("up-tennis-league");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          >
            MENU{" "}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
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
            className="inline-flex items-center gap-3 bg-gold text-pitch font-display font-black text-lg px-8 py-4 rounded-lg uppercase tracking-wider hover:bg-gold-light transition-all duration-200 shadow-gold"
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

      {/* Tournaments */}
      <section id="tournaments" className="py-16 px-6 bg-pitch">
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
            {TOURNAMENTS.map((tournament, index) => (
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
                      border: `1px solid ${tournament.badge === "OPEN" ? "rgba(255,215,0,0.4)" : "rgba(255,0,0,0.4)"}`,
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
                  className="w-full py-3 px-6 font-display font-black uppercase tracking-wider rounded-lg text-pitch transition-all duration-200"
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

      {/* Gallery placeholder */}
      <section
        id="gallery"
        className="py-16 px-6"
        style={{ background: "#111" }}
      >
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
      <section id="contact" className="py-16 px-6 bg-pitch">
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
        <p className="text-muted-foreground text-sm mb-1">
          © {new Date().getFullYear()} ALPHA CRICKET LIVE | Partner: National
          Check Center
        </p>
        <p className="text-sm mb-3">
          <span style={{ color: "#22c55e" }} className="font-semibold">
            Helpline:
          </span>{" "}
          <span style={{ color: "#22c55e" }}>Azmaan - +91 7081170030</span>
        </p>
        <p className="text-muted-foreground/50 text-xs">
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
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
      />
    </div>
  );
}
