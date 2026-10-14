import CallStage from "../components/call-stage";
import { AnimatePresence } from "motion/react";
import DemoModals from "../components/demo-modals";
import SettingsContent from "../components/settings-content";
import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  CircleDashed,
  Users,
  Sparkles,
  Settings,
  Archive,
  Search,
  MoreVertical,
  Plus,
  X,
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
  Send,
  Smile,
  Paperclip,
  FileText,
  Image,
  Camera,
  Headphones,
  UserRound,
  ChartNoAxesColumn,
  CalendarDays,
  Sticker,
  Star,
  Heart,
  Bell,
  LockKeyhole,
  Shield,
  Palette,
  LogOut,
  ChevronDown,
  Download,
  Reply,
  Forward,
  Copy,
  Pin,
  Trash2,
  Info,
  Link,
  Grid3X3,
  Pencil,
  HelpCircle,
  Keyboard,
  CircleStop,
  CheckSquare,
  Folder,
  CircleAlert,
} from "lucide-react";
import { Avatar, IconButton, Toggle, WelcomeArt, EncryptionNote } from "../components/chat-ui";
import { initialChats, uid, clock, type Chat, type Message } from "../lib/chat-data";

type Tab =
  | "chats"
  | "calls"
  | "status"
  | "channels"
  | "communities"
  | "ai"
  | "settings"
  | "archived";
type Menu = {
  type: "global" | "chat" | "attach" | "emoji" | "message";
  x?: number;
  y?: number;
  message?: Message;
};
const emoji = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🙏",
  "🎉",
  "😊",
  "🔥",
  "💚",
  "✅",
  "👋",
  "🤔",
  "👏",
  "🚀",
  "💯",
  "😎",
  "🥰",
  "🙌",
  "✨",
  "😁",
  "😍",
  "😭",
  "😅",
];
const settingsItems = [
  { icon: UserRound, name: "Profil", desc: "Photo de profil, nom de profil" },
  { icon: Shield, name: "Compte", desc: "Notifications de sécurité, informations de compte" },
  { icon: LockKeyhole, name: "Confidentialité", desc: "Contacts bloqués, messages éphémères" },
  {
    icon: MessageSquare,
    name: "Discussions",
    desc: "Thème, fond d’écran, paramètres de discussions",
  },
  { icon: Bell, name: "Notifications", desc: "Messages, groupes, sons" },
  { icon: Keyboard, name: "Raccourcis clavier", desc: "Actions rapides" },
  {
    icon: HelpCircle,
    name: "Aide et commentaires",
    desc: "Pages d’aide, contactez-nous, politique de confidentialité",
  },
];
function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function saveFile(name: string, data: string) {
  const a = document.createElement("a");
  a.href = data;
  a.download = name;
  a.click();
}
export default function Messenger() {
  const [chats, setChats] = useState<Chat[]>(() => load("wa-demo-chats-v1", initialChats));
  const [tab, setTab] = useState<Tab>("chats");
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [panel, setPanel] = useState<"info" | "search" | "media" | "starred" | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [reply, setReply] = useState<Message | null>(null);
  const [messageSearch, setMessageSearch] = useState("");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [profile, setProfile] = useState(() =>
    load("wa-profile", { name: "FLASMON Jamé", about: "What’s happening?", avatar: "profile" }),
  );
  const [prefs, setPrefs] = useState(() =>
    load("wa-prefs", {
      notifications: true,
      sounds: true,
      readReceipts: true,
      online: true,
      theme: "Sombre",
      wallpaper: "Doodles",
      ephemeral: "Non",
      security: true,
    }),
  );
  const [setting, setSetting] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formOptions, setFormOptions] = useState("Oui\nNon");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [forwardMsg, setForwardMsg] = useState<Message | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [call, setCall] = useState<{
    name: string;
    video: boolean;
    state: "ringing" | "connected";
    seconds: number;
  } | null>(null);
  const [callHistory, setCallHistory] = useState(() =>
    load("wa-calls", [
      { name: "Mon Amour", time: "vendredi", missed: true },
      { name: "P Delvino", time: "19/09/2026", missed: false },
      { name: "P Delvino", time: "19/09/2026", missed: true },
      { name: "Mon Amour", time: "14/09/2026", missed: true },
      { name: "+66 86 780 5127", time: "10/09/2026", missed: true },
      { name: "Mon Amour", time: "08/09/2026", missed: true },
    ]),
  );
  const [statuses, setStatuses] = useState(() =>
    load("wa-statuses", [
      {
        name: "Djasnive Rajaona",
        text: "Une belle journée commence.",
        color: "#386953",
        time: "Aujourd’hui, 09:12",
      },
      {
        name: "OL’NEL",
        text: "Un projet, une nouvelle aventure.",
        color: "#7b6247",
        time: "Aujourd’hui, 08:45",
      },
    ]),
  );
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const scroll = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const profileFile = useRef<HTMLInputElement>(null);
  const [fileAccept, setFileAccept] = useState("*/*");
  const chat = chats.find((c) => c.id === selected);
  const [locked, setLocked] = useState(false);
  const [lockCode, setLockCode] = useState(() => load("wa-lock", ""));
  const [unlock, setUnlock] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("wa-demo-chats-v1", JSON.stringify(chats));
    } catch {
      notify("Stockage local plein. Supprimez quelques pièces jointes.");
    }
  }, [chats]);
  useEffect(() => {
    localStorage.setItem("wa-profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("wa-prefs", JSON.stringify(prefs));
  }, [prefs]);
  useEffect(() => {
    localStorage.setItem("wa-calls", JSON.stringify(callHistory));
  }, [callHistory]);
  useEffect(() => {
    localStorage.setItem("wa-statuses", JSON.stringify(statuses));
  }, [statuses]);
  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" });
  }, [selected, chat?.messages.length]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3400);
    return () => clearTimeout(t);
  }, [toast]);
  const callActive = Boolean(call);
  useEffect(() => {
    if (!callActive) return;
    const t = setInterval(
      () => setCall((c) => (c ? { ...c, seconds: c.seconds + 1 } : null)),
      1000,
    );
    return () => clearInterval(t);
  }, [callActive]);
  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setModal(null);
        setPanel(null);
        setViewImage(null);
        setSelectMode(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>(".list-search input")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  function notify(s: string) {
    setToast(s);
  }
  function patchChat(id: string, p: Partial<Chat>) {
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }
  function patchMessage(id: string, p: Partial<Message>) {
    if (chat)
      patchChat(chat.id, {
        messages: chat.messages.map((m) => (m.id === id ? { ...m, ...p } : m)),
      });
  }
  function openChat(c: Chat) {
    setSelected(c.id);
    setTab("chats");
    patchChat(c.id, { unread: 0 });
    setPanel(null);
    setMenu(null);
    setReply(null);
    setText("");
    setChecked([]);
    setSelectMode(false);
  }
  function switchTab(t: Tab) {
    setTab(t);
    setSelected(null);
    setSearch("");
    setPanel(null);
    setMenu(null);
    setSetting(null);
  }
  function send(extra: Partial<Message> = {}, destination = selected) {
    if (!destination || (!text.trim() && !extra.kind)) return;
    const m: Message = {
      id: uid(),
      text: text.trim(),
      mine: true,
      time: clock(),
      reply: reply?.text || reply?.fileName,
      ...extra,
    };
    setChats((cs) =>
      cs.map((c) =>
        c.id === destination
          ? {
              ...c,
              messages: [...c.messages, m],
              preview: m.text || m.fileName || "Pièce jointe",
              date: m.time,
            }
          : c,
      ),
    );
    setText("");
    setReply(null);
    setMenu(null);
    inputRef.current?.focus();
  }
  function startCall(name = chat?.name || "Nouvel appel", video = false) {
    setModal(null);
    setMenu(null);
    setCall({ name, video, state: "ringing", seconds: 0 });
  }
  function endCall() {
    if (call)
      setCallHistory((h) => [
        { name: call.name, time: `Aujourd’hui, ${clock()}`, missed: call.state === "ringing" },
        ...h,
      ]);
    setCall(null);
    notify("Appel simulé terminé");
  }
  function createChat(group = false) {
    if (!formName.trim()) return;
    const c: Chat = {
      id: uid(),
      name: formName.trim(),
      phone: group ? `${groupMembers.length + 1} membres` : formPhone || "Contact local",
      color: "#36594e",
      unread: 0,
      group,
      date: clock(),
      preview: group ? "Groupe créé" : "Nouvelle discussion",
      messages: group
        ? [
            {
              id: uid(),
              text: `Groupe « ${formName} » créé. ${groupMembers.length} contacts ajoutés.`,
              mine: false,
              time: clock(),
            },
          ]
        : [],
    };
    setChats((cs) => [c, ...cs]);
    setModal(null);
    openChat(c);
    setFormName("");
    setFormPhone("");
    setGroupMembers([]);
  }
  function downloadMessage(m: Message) {
    if (m.src) saveFile(m.fileName || "image.webp", m.src);
    else
      notify(
        "Fichier de référence : seul l’aperçu est fourni dans la capture. Ajoutez un fichier pour le télécharger.",
      );
  }
  function exportChat() {
    if (!chat) return;
    const txt = chat.messages
      .map(
        (m) =>
          `[${m.time}] ${m.mine ? profile.name : chat.name}: ${m.text || m.fileName || m.kind}`,
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    saveFile(`${chat.name}.txt`, url);
    URL.revokeObjectURL(url);
    setMenu(null);
  }
  function attach(accept: string, capture = false) {
    if (!chat) {
      setModal("new");
      return;
    }
    setFileAccept(accept);
    setMenu(null);
    setTimeout(() => {
      if (fileRef.current) {
        fileRef.current.accept = accept;
        if (capture) fileRef.current.setAttribute("capture", "environment");
        else fileRef.current.removeAttribute("capture");
        fileRef.current.click();
      }
    }, 0);
  }
  function uploadFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        notify("Limite de la démo locale : 8 Mo par fichier.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        send({
          kind: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("audio/")
              ? "audio"
              : "file",
          src: String(reader.result),
          fileName: file.name,
          size: `${file.name.split(".").pop()?.toUpperCase()} · ${(file.size / 1024).toFixed(0)} Ko`,
          text: "",
        });
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  }
  async function record() {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      notify("Enregistrement non disponible sur ce navigateur.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      recorder.current = r;
      audioChunks.current = [];
      r.ondataavailable = (e) => audioChunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const reader = new FileReader();
        reader.onload = () =>
          send({
            kind: "audio",
            src: String(reader.result),
            fileName: "message-vocal.webm",
            text: "",
          });
        reader.readAsDataURL(new Blob(audioChunks.current, { type: r.mimeType }));
      };
      r.start();
      setRecording(true);
      setRecordSeconds(0);
    } catch {
      notify("Microphone non autorisé. Vous pouvez joindre un fichier audio.");
    }
  }
  function messageAction(action: string, m: Message) {
    setMenu(null);
    if (action === "reply") {
      setReply(m);
      inputRef.current?.focus();
    }
    if (action === "star") patchMessage(m.id, { starred: !m.starred });
    if (action === "pin") patchMessage(m.id, { pinned: !m.pinned });
    if (action === "delete") {
      setChecked([m.id]);
      setModal("delete-message");
    }
    if (action === "forward") {
      setForwardMsg(m);
      setModal("forward");
    }
    if (action === "copy") {
      navigator.clipboard
        ?.writeText(m.text)
        .then(() => notify("Message copié"))
        .catch(() => notify("Copie non autorisée"));
    }
    if (action === "info") {
      setForwardMsg(m);
      setModal("message-info");
    }
    if (action === "ai") {
      setFormBody(m.text);
      setModal("ai-message");
    }
  }
  const list = chats.filter(
    (c) =>
      (tab === "archived" ? c.archived : !c.archived) &&
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Non lues"
        ? c.unread > 0
        : filter === "Favoris"
          ? c.favorite
          : filter === "Groupes"
            ? c.group
            : true),
  );
  const msgMatches =
    chat?.messages.filter((m) =>
      `${m.text} ${m.fileName || ""}`.toLowerCase().includes(messageSearch.toLowerCase()),
    ) || [];
  const menuItems =
    menu?.type === "global"
      ? [
          {
            icon: Users,
            label: "Nouveau groupe",
            fn: () => {
              setFormName("");
              setModal("group");
            },
          },
          {
            icon: Star,
            label: "Messages importants",
            fn: () => {
              setModal("all-starred");
            },
          },
          {
            icon: CheckSquare,
            label: "Sélectionner les discussions",
            fn: () => setModal("select-chats"),
          },
          {
            icon: CheckCheck,
            label: "Tout marquer comme lu",
            fn: () => setChats((cs) => cs.map((c) => ({ ...c, unread: 0 }))),
          },
          {
            icon: LockKeyhole,
            label: "Verrouillage de l’application",
            fn: () => {
              setFormBody("");
              setModal("lock");
            },
          },
          { icon: LogOut, label: "Déconnexion", fn: () => setModal("logout") },
        ]
      : menu?.type === "chat" && chat
        ? [
            {
              icon: Info,
              label: chat.group ? "Infos du groupe" : "Infos du contact",
              fn: () => setPanel("info"),
            },
            { icon: Search, label: "Rechercher", fn: () => setPanel("search") },
            {
              icon: CheckSquare,
              label: "Sélectionner des messages",
              fn: () => setSelectMode(true),
            },
            {
              icon: Bell,
              label: chat.muted ? "Désactiver le mode silencieux" : "Mode silencieux",
              fn: () => patchChat(chat.id, { muted: !chat.muted }),
            },
            { icon: CircleDashed, label: "Messages éphémères", fn: () => setModal("ephemeral") },
            { icon: Palette, label: "Thème de la discussion", fn: () => setModal("theme") },
            {
              icon: Heart,
              label: chat.favorite ? "Retirer des favoris" : "Ajouter aux favoris",
              fn: () => patchChat(chat.id, { favorite: !chat.favorite }),
            },
            {
              icon: Archive,
              label: chat.archived ? "Désarchiver la discussion" : "Archiver la discussion",
              fn: () => {
                patchChat(chat.id, { archived: !chat.archived });
                setSelected(null);
              },
            },
            { icon: Download, label: "Exporter la discussion", fn: exportChat },
            { icon: X, label: "Fermer la discussion", fn: () => setSelected(null) },
            { icon: Link, label: "Envoyer le lien d’appel", fn: () => setModal("call-link") },
            { icon: Users, label: "Nouvel appel de groupe", fn: () => startCall(chat.name, true) },
            { icon: CircleAlert, label: "Signaler", fn: () => setModal("report") },
            {
              icon: Shield,
              label: chat.blocked ? "Débloquer" : "Bloquer",
              fn: () => setModal("block"),
            },
            { icon: Trash2, label: "Effacer la discussion", fn: () => setModal("clear") },
            { icon: Trash2, label: "Supprimer la discussion", fn: () => setModal("delete-chat") },
          ]
        : [];
  return (
    <div
      className={`whatsapp ${prefs.theme === "Clair" ? "light" : ""} ${chat ? "has-chat" : ""} ${tab !== "chats" ? "other-tab" : ""}`}
    >
      <input
        aria-label="Joindre des fichiers"
        type="file"
        hidden
        ref={fileRef}
        accept={fileAccept}
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <input
        aria-label="Photo de profil"
        type="file"
        hidden
        ref={profileFile}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && f.size < 2e6) {
            const r = new FileReader();
            r.onload = () => setProfile((p) => ({ ...p, avatar: String(r.result) }));
            r.readAsDataURL(f);
          }
        }}
      />
      <nav className="rail" aria-label="Navigation principale">
        <div className="rail-top">
          {(
            [
              {
                id: "chats",
                icon: MessageSquare,
                title: "Discussions",
                badge: chats.filter((c) => c.unread).length,
              },
              { id: "calls", icon: Phone, title: "Appels" },
              { id: "status", icon: CircleDashed, title: "Statut" },
              { id: "channels", icon: MessageSquare, title: "Chaînes" },
              { id: "communities", icon: Users, title: "Communautés" },
            ] as const
          ).map((t) => (
            <IconButton
              key={t.id}
              title={t.title}
              active={tab === t.id}
              onClick={() => switchTab(t.id)}
            >
              <t.icon size={21} />
              {"badge" in t && t.badge > 0 && <span className="rail-badge">{t.badge}</span>}
            </IconButton>
          ))}
          <span className="rail-divider" />
          <IconButton title="Meta AI (démo)" active={tab === "ai"} onClick={() => switchTab("ai")}>
            <Sparkles size={23} className="purple" />
          </IconButton>
        </div>
        <div className="rail-bottom">
          <IconButton
            title="Discussions archivées"
            active={tab === "archived"}
            onClick={() => {
              switchTab("archived");
              setFilter("Toutes");
            }}
          >
            <Archive size={20} />
          </IconButton>
          <IconButton
            title="Paramètres"
            active={tab === "settings"}
            onClick={() => switchTab("settings")}
          >
            <Settings size={20} />
          </IconButton>
          <button
            className="profile-button"
            aria-label="Mon profil"
            onClick={() => {
              switchTab("settings");
              setSetting("Profil");
            }}
          >
            {profile.avatar.startsWith("data:") ? (
              <img src={profile.avatar} alt="Profil" />
            ) : (
              <Avatar chat={{ avatar: profile.avatar }} size={30} />
            )}
          </button>
        </div>
      </nav>
      <aside className="chat-list">
        <header className="list-header">
          <h1>
            {tab === "chats"
              ? "WhatsApp"
              : tab === "calls"
                ? "Appels"
                : tab === "settings"
                  ? profile.name
                  : tab === "status"
                    ? "Statut"
                    : tab === "channels"
                      ? "Chaînes"
                      : tab === "communities"
                        ? "Communautés"
                        : tab === "ai"
                          ? "Meta AI"
                          : "Archivées"}
          </h1>
          <div className="header-actions">
            {tab === "chats" && (
              <IconButton
                title="Menu principal"
                onClick={() => setMenu(menu?.type === "global" ? null : { type: "global" })}
              >
                <MoreVertical size={21} />
              </IconButton>
            )}
            {tab !== "settings" && (
              <IconButton
                title={
                  tab === "calls"
                    ? "Nouvel appel"
                    : tab === "status"
                      ? "Créer un statut"
                      : "Nouvelle discussion"
                }
                className={tab === "chats" ? "green-button" : ""}
                onClick={() => {
                  setFormName("");
                  setFormBody("");
                  setModal(
                    tab === "calls"
                      ? "new-call"
                      : tab === "status"
                        ? "new-status"
                        : tab === "communities"
                          ? "community"
                          : tab === "channels"
                            ? "channel"
                            : "new",
                  );
                }}
              >
                {tab === "calls" ? (
                  <Phone size={20} />
                ) : tab === "chats" ? (
                  <MessageSquare size={21} />
                ) : (
                  <Plus size={22} />
                )}
              </IconButton>
            )}
          </div>
        </header>
        <div className="list-search">
          <Search size={17} />
          <input
            aria-label="Rechercher des discussions"
            placeholder={
              tab === "calls"
                ? "Rechercher par nom, numéro ou @nomdeprofil"
                : tab === "settings"
                  ? "Rechercher"
                  : "Rechercher ou démarrer une discussion"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Effacer la recherche" onClick={() => setSearch("")}>
              <X size={16} />
            </button>
          )}
        </div>
        {(tab === "chats" || tab === "archived") && (
          <>
            <div className="filters">
              {["Toutes", "Non lues", "Favoris", "Groupes"].map((f) => (
                <button
                  key={f}
                  className={filter === f ? "selected" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "Non lues" && <span>{chats.filter((c) => c.unread).length}</span>}
                  {f === "Groupes" && <span>{chats.filter((c) => c.group).length}</span>}
                </button>
              ))}
              <button title="Créer une liste" onClick={() => setModal("lists")}>
                <Plus size={15} />
              </button>
            </div>
            <div className="chat-rows">
              {list.map((c) => (
                <button
                  key={c.id}
                  className={`chat-row ${selected === c.id ? "selected" : ""}`}
                  onClick={() => openChat(c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    openChat(c);
                    setMenu({
                      type: "chat",
                      x: Math.min(e.clientX, window.innerWidth - 260),
                      y: Math.min(e.clientY, window.innerHeight - 520),
                    });
                  }}
                >
                  <Avatar chat={c} />
                  <div className="chat-row-content">
                    <div className="chat-row-top">
                      <span>{c.name}</span>
                      <time className={c.unread ? "unread-time" : ""}>{c.date}</time>
                    </div>
                    <div className="chat-row-bottom">
                      <p>{c.preview}</p>
                      {c.muted && <Bell size={13} />} {c.favorite && <Star size={13} />}{" "}
                      {c.unread > 0 && <b>{c.unread}</b>}
                    </div>
                  </div>
                </button>
              ))}
              {!list.length && (
                <div className="empty-list">
                  {tab === "archived"
                    ? "Aucune discussion archivée."
                    : "Aucune discussion trouvée."}
                </div>
              )}
            </div>
            <button className="windows-banner" onClick={() => setModal("desktop")}>
              <MessageSquare size={23} />
              <span>Obtenir WhatsApp pour Windows</span>
            </button>
          </>
        )}
        {tab === "calls" && (
          <div className="chat-rows calls-list">
            <h4>Favoris</h4>
            <button className="chat-row" onClick={() => setModal("call-favorites")}>
              <span className="avatar green">
                <Users size={24} />
              </span>
              Ajouter aux favoris
            </button>
            <h4>Récents</h4>
            {callHistory
              .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
              .map((h, i) => (
                <button className="chat-row" key={i} onClick={() => startCall(h.name)}>
                  <Avatar
                    chat={
                      chats.find((c) => c.name === h.name) || { name: h.name, color: "#302653" }
                    }
                  />
                  <div className="chat-row-content">
                    <div className="chat-row-top">
                      <span>{h.name}</span>
                      <time>{h.time}</time>
                    </div>
                    <p className={h.missed ? "missed" : ""}>
                      <Phone size={12} /> {h.missed ? "Manqué" : "Sortant"}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
        {tab === "settings" && (
          <div className="settings-list">
            <div className="notification-box">
              <Bell size={23} />
              <div>
                <b>Choisissez vos notifications</b>
                <p>
                  Recevez des notifications de messages, de groupes ou de votre statut.{" "}
                  <button onClick={() => setSetting("Notifications")}>Choisir</button>
                </p>
              </div>
            </div>
            <button className="profile-preview" onClick={() => setSetting("Profil")}>
              <span>{profile.about}</span>
              {profile.avatar.startsWith("data:") ? (
                <img className="large-profile" src={profile.avatar} alt="Profil" />
              ) : (
                <Avatar chat={{ avatar: profile.avatar }} size={96} />
              )}
            </button>
            {settingsItems
              .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
              .map((s) => (
                <button
                  key={s.name}
                  className={`setting-row ${setting === s.name ? "selected" : ""}`}
                  onClick={() => setSetting(s.name)}
                >
                  <s.icon size={19} />
                  <span>
                    {s.name}
                    <small>{s.desc}</small>
                  </span>
                </button>
              ))}
            <button className="setting-row danger" onClick={() => setModal("logout")}>
              <LogOut size={19} />
              Se déconnecter
            </button>
          </div>
        )}
        {tab === "status" && (
          <div className="chat-rows">
            <button
              className="chat-row"
              onClick={() => {
                setFormBody("");
                setModal("new-status");
              }}
            >
              <Avatar chat={{ avatar: "profile" }} />
              <div>
                <b>Mon statut</b>
                <p>Ajouter une mise à jour</p>
              </div>
              <Plus size={18} />
            </button>
            <h4>Mises à jour récentes</h4>
            {statuses
              .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
              .map((s, i) => (
                <button
                  className="chat-row"
                  key={i}
                  onClick={() => {
                    setFormName(s.name);
                    setFormBody(s.text);
                    setModal("view-status");
                  }}
                >
                  <span className="status-ring">
                    <Avatar
                      chat={
                        chats.find((c) => c.name === s.name) || { name: s.name, color: s.color }
                      }
                    />
                  </span>
                  <div>
                    <b>{s.name}</b>
                    <p>{s.time}</p>
                  </div>
                </button>
              ))}
          </div>
        )}
        {tab === "communities" && (
          <div className="feature-list">
            <div className="feature-illustration">
              <Users size={64} />
            </div>
            <h2>Restez en contact avec vos communautés</h2>
            <p>Regroupez vos discussions et partagez les annonces importantes au même endroit.</p>
            <button
              className="primary"
              onClick={() => {
                setFormName("");
                setModal("community");
              }}
            >
              Créer votre communauté
            </button>
            {chats
              .filter((c) => c.group)
              .map((c) => (
                <button className="chat-row" key={c.id} onClick={() => openChat(c)}>
                  <Avatar chat={c} />
                  {c.name}
                </button>
              ))}
          </div>
        )}
        {tab === "channels" && (
          <div className="feature-list">
            <div className="feature-illustration">
              <MessageSquare size={58} />
            </div>
            <h2>Découvrez les chaînes</h2>
            <p>
              Suivez les sujets qui vous intéressent. Les chaînes de cette démo sont enregistrées
              localement.
            </p>
            {["Actualités Tech", "DNA Madagascar", "Design & Créativité"].map((n) => (
              <button
                className="chat-row"
                key={n}
                onClick={() => {
                  setFormName(n);
                  setModal("view-channel");
                }}
              >
                <Avatar chat={{ name: n, color: "#256351" }} />
                <span>
                  {n}
                  <small>Chaîne de démonstration</small>
                </span>
                <Plus size={18} />
              </button>
            ))}
            <button className="primary" onClick={() => setModal("channel")}>
              Créer une chaîne
            </button>
          </div>
        )}
        {tab === "ai" && (
          <div className="feature-list">
            <div className="ai-orb" />
            <h2>Demander à Meta AI</h2>
            <p>
              Interface de démonstration. Aucun service d’intelligence artificielle n’est connecté.
            </p>
            <button className="primary" onClick={() => setModal("ai-message")}>
              Essayer l’interface
            </button>
          </div>
        )}
      </aside>
      <main className="main-area">
        {chat ? (
          <>
            <header className="conversation-header">
              <IconButton
                title="Retour aux discussions"
                className="mobile-back"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft size={23} />
              </IconButton>
              <button
                className="contact-heading"
                onClick={() => setPanel(panel === "info" ? null : "info")}
              >
                <Avatar chat={chat} size={42} />
                <span>
                  <b>{chat.name}</b>
                  <small>{chat.group ? chat.phone : prefs.online ? "en ligne" : ""}</small>
                </span>
              </button>
              <div className="header-actions">
                <IconButton title="Appel vidéo" onClick={() => startCall(chat.name, true)}>
                  <Video size={21} />
                </IconButton>
                <IconButton title="Appel vocal" onClick={() => startCall(chat.name)}>
                  <Phone size={20} />
                </IconButton>
                <IconButton
                  title="Rechercher dans la discussion"
                  onClick={() => setPanel(panel === "search" ? null : "search")}
                >
                  <Search size={21} />
                </IconButton>
                <IconButton
                  title="Menu de la discussion"
                  onClick={() => setMenu(menu?.type === "chat" ? null : { type: "chat" })}
                >
                  <MoreVertical size={21} />
                </IconButton>
              </div>
            </header>
            {chat.messages.some((m) => m.pinned) && (
              <button
                className="pinned-bar"
                onClick={() => {
                  const m = chat.messages.find((m) => m.pinned);
                  document
                    .getElementById(`msg-${m?.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                <Pin size={14} />{" "}
                {chat.messages.find((m) => m.pinned)?.text || "Pièce jointe épinglée"}
              </button>
            )}
            <section
              className={`message-scroll wallpaper-${prefs.wallpaper.toLowerCase()}`}
              ref={scroll}
              aria-label="Messages de la discussion"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                uploadFiles(e.dataTransfer.files);
              }}
            >
              <div className="date-label">{chat.id === "bezara" ? "mercredi" : "01/10/2026"}</div>
              <div className="chat-encryption">
                <LockKeyhole size={12} /> Démonstration : vos messages restent dans ce navigateur.
              </div>
              {chat.messages.map((m, i) => (
                <div
                  key={m.id}
                  id={`msg-${m.id}`}
                  className={`message-line ${m.mine ? "mine" : "received"} ${checked.includes(m.id) ? "checked" : ""}`}
                >
                  {selectMode && (
                    <input
                      aria-label="Sélectionner ce message"
                      type="checkbox"
                      checked={checked.includes(m.id)}
                      onChange={() =>
                        setChecked((ids) =>
                          ids.includes(m.id) ? ids.filter((id) => id !== m.id) : [...ids, m.id],
                        )
                      }
                    />
                  )}
                  <div
                    className={`message-bubble ${m.kind === "image" ? "image-bubble" : ""}`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({
                        type: "message",
                        message: m,
                        x: Math.min(e.clientX, window.innerWidth - 260),
                        y: Math.max(80, Math.min(e.clientY, window.innerHeight - 400)),
                      });
                    }}
                  >
                    <button
                      className="message-chevron"
                      aria-label="Options du message"
                      onClick={(e) => {
                        e.stopPropagation();
                        const r = e.currentTarget.getBoundingClientRect();
                        setMenu({
                          type: "message",
                          message: m,
                          x: Math.min(r.left - 170, window.innerWidth - 255),
                          y: Math.max(80, Math.min(r.bottom, window.innerHeight - 400)),
                        });
                      }}
                    >
                      <ChevronDown size={17} />
                    </button>
                    {m.reply && (
                      <div className="quoted">
                        <b>{m.mine ? chat.name : profile.name}</b>
                        <span>{m.reply}</span>
                      </div>
                    )}
                    {m.kind === "image" && (
                      <button className="image-open" onClick={() => setViewImage(m.src || null)}>
                        <img src={m.src} alt={m.fileName || "Image partagée"} />
                      </button>
                    )}
                    {m.kind === "file" && (
                      <button className="file-message" onClick={() => downloadMessage(m)}>
                        <FileText size={29} />
                        <span>
                          <b>{m.fileName}</b>
                          <small>{m.size}</small>
                        </span>
                        <Download size={22} />
                      </button>
                    )}
                    {m.kind === "audio" && (
                      <audio aria-label="Message vocal" controls src={m.src}>
                        <track kind="captions" />
                      </audio>
                    )}
                    {m.kind === "poll" && (
                      <div className="poll-message">
                        <b>
                          <ChartNoAxesColumn size={16} />
                          {m.text}
                        </b>
                        <small>Sélectionnez une réponse</small>
                        {m.options?.map((o, oi) => (
                          <button
                            key={oi}
                            onClick={() =>
                              patchMessage(m.id, {
                                votes: m.options!.map((_, j) => (j === oi ? 1 : 0)),
                              })
                            }
                          >
                            <span className={`vote-circle ${m.votes?.[oi] ? "voted" : ""}`} />
                            <span>
                              {o}
                              <i style={{ width: m.votes?.[oi] ? "100%" : "0%" }} />
                            </span>
                            <small>{m.votes?.[oi] || 0}</small>
                          </button>
                        ))}
                      </div>
                    )}
                    {m.kind === "event" && (
                      <div className="event-message">
                        <CalendarDays size={30} />
                        <b>{m.text}</b>
                        <small>{m.size}</small>
                        <button onClick={() => notify("Participation confirmée dans cette démo")}>
                          Participer
                        </button>
                      </div>
                    )}
                    {m.kind === "contact" && (
                      <div className="contact-message">
                        <UserRound size={30} />
                        <b>{m.text}</b>
                        <span>{m.size}</span>
                        <button
                          onClick={() => {
                            setFormName(m.text);
                            setFormPhone(m.size || "");
                            setModal("add-contact");
                          }}
                        >
                          Ajouter le contact
                        </button>
                      </div>
                    )}
                    {!m.kind && <span className="message-text">{m.text}</span>}
                    {m.kind === "image" && m.text && <span className="message-text">{m.text}</span>}
                    <span className="message-time">
                      {m.starred && <Star size={11} />} {m.time}
                      {m.mine && (
                        <CheckCheck size={15} className={prefs.readReceipts ? "blue" : ""} />
                      )}
                    </span>
                    {m.reaction && (
                      <button
                        className="message-reaction"
                        onClick={() => patchMessage(m.id, { reaction: undefined })}
                      >
                        {m.reaction}
                      </button>
                    )}
                  </div>
                  <button
                    className="hover-react"
                    title="Réagir"
                    onClick={(e) => {
                      e.stopPropagation();
                      const r = e.currentTarget.getBoundingClientRect();
                      setMenu({
                        type: "message",
                        message: m,
                        x: Math.min(r.left, window.innerWidth - 260),
                        y: Math.min(r.bottom, window.innerHeight - 400),
                      });
                    }}
                  >
                    <Smile size={17} />
                  </button>
                  {i === 5 && <div className="inline-date">vendredi</div>}
                </div>
              ))}
              {!chat.messages.length && (
                <div className="date-label">Commencez votre discussion</div>
              )}
            </section>
            {reply && (
              <div className="reply-composer">
                <Reply size={22} />
                <span>
                  <b>Répondre à {reply.mine ? profile.name : chat.name}</b>
                  <small>{reply.text || reply.fileName || "Pièce jointe"}</small>
                </span>
                <IconButton title="Annuler la réponse" onClick={() => setReply(null)}>
                  <X size={20} />
                </IconButton>
              </div>
            )}
            {selectMode ? (
              <footer className="selection-footer">
                <IconButton
                  title="Annuler la sélection"
                  onClick={() => {
                    setSelectMode(false);
                    setChecked([]);
                  }}
                >
                  <X size={21} />
                </IconButton>
                <span>{checked.length} message(s) sélectionné(s)</span>
                <IconButton
                  title="Supprimer les messages sélectionnés"
                  onClick={() => checked.length && setModal("delete-message")}
                >
                  <Trash2 size={20} />
                </IconButton>
                <IconButton
                  title="Marquer comme importants"
                  onClick={() => {
                    patchChat(chat.id, {
                      messages: chat.messages.map((m) =>
                        checked.includes(m.id) ? { ...m, starred: true } : m,
                      ),
                    });
                    setSelectMode(false);
                  }}
                >
                  <Star size={20} />
                </IconButton>
              </footer>
            ) : chat.blocked ? (
              <footer className="blocked-footer">
                Contact bloqué.{" "}
                <button onClick={() => patchChat(chat.id, { blocked: false })}>Débloquer</button>
              </footer>
            ) : (
              <footer className="composer">
                <IconButton
                  title="Joindre"
                  onClick={() => setMenu(menu?.type === "attach" ? null : { type: "attach" })}
                >
                  <Paperclip size={22} />
                </IconButton>
                <IconButton
                  title="Emojis et stickers"
                  onClick={() => setMenu(menu?.type === "emoji" ? null : { type: "emoji" })}
                >
                  <Smile size={23} />
                </IconButton>
                {recording ? (
                  <div className="recording">
                    <i /> Enregistrement · {recordSeconds}s{" "}
                    <small>Cliquez sur Stop pour envoyer</small>
                  </div>
                ) : (
                  <input
                    ref={inputRef}
                    aria-label="Message"
                    placeholder="Entrez un message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                )}
                <IconButton
                  title={
                    recording
                      ? "Stop et envoyer"
                      : text.trim()
                        ? "Envoyer"
                        : "Enregistrer un message vocal"
                  }
                  onClick={() => (text.trim() ? send() : record())}
                >
                  {recording ? (
                    <CircleStop size={24} className="danger" />
                  ) : text.trim() ? (
                    <Send size={22} className="green-text" />
                  ) : (
                    <Mic size={22} />
                  )}
                </IconButton>
              </footer>
            )}
          </>
        ) : tab === "settings" && setting ? (
          <SettingsContent
            setting={setting}
            profile={profile}
            setProfile={setProfile}
            prefs={prefs}
            setPrefs={setPrefs}
            choosePhoto={() => profileFile.current?.click()}
            back={() => setSetting(null)}
            openModal={setModal}
            chats={chats}
            unblock={(id) => patchChat(id, { blocked: false })}
          />
        ) : tab === "calls" ? (
          <div className="welcome calls-welcome">
            <Video size={49} className="muted" fill="currentColor" />
            <h2>Appels vocaux et vidéo</h2>
            <p>
              Partagez votre écran, réagissez avec des emojis et plus encore,
              <br /> avec jusqu’à 32 personnes.
            </p>
            <div className="welcome-actions">
              <Quick icon={Video} text="Démarrer l’appel" onClick={() => setModal("new-call")} />
              <Quick
                icon={Link}
                text="Nouveau lien d’appel"
                onClick={() => setModal("call-link")}
              />
              <Quick
                icon={Grid3X3}
                text="Appeler un numéro"
                onClick={() => {
                  setFormPhone("");
                  setModal("dial");
                }}
              />
            </div>
            <EncryptionNote />
          </div>
        ) : (
          <div className="welcome">
            <div className="welcome-card">
              <WelcomeArt />
              <h2>
                Les appels vocaux et vidéo
                <br /> sont désormais disponibles
              </h2>
              <p>
                Vous pouvez désormais passer et rejoindre des
                <br /> appels sur WhatsApp Web.
              </p>
              <button className="small-primary" onClick={() => switchTab("calls")}>
                Accéder à Appels
              </button>
            </div>
            <div className="welcome-actions">
              <Quick icon={FileText} text="Envoyer le document" onClick={() => setModal("new")} />
              <Quick
                icon={Users}
                text="Ajouter le contact"
                onClick={() => {
                  setFormName("");
                  setFormPhone("");
                  setModal("add-contact");
                }}
              />
              <Quick icon={Video} text="Nouvel appel" onClick={() => setModal("new-call")} />
              <Quick
                icon={Sparkles}
                text="Demander à Meta AI"
                onClick={() => switchTab("ai")}
                purple
              />
            </div>
            <EncryptionNote />
          </div>
        )}
      </main>
      {chat && panel && (
        <aside className="detail-panel">
          <header>
            <IconButton title="Fermer le panneau" onClick={() => setPanel(null)}>
              <X size={23} />
            </IconButton>
            <span>
              {panel === "info"
                ? chat.group
                  ? "Infos du groupe"
                  : "Infos du contact"
                : panel === "search"
                  ? "Rechercher des messages"
                  : panel === "media"
                    ? "Médias, liens et documents"
                    : "Messages importants"}
            </span>
            {panel === "info" && (
              <IconButton
                title="Modifier le contact"
                onClick={() => {
                  setFormName(chat.name);
                  setFormPhone(chat.phone);
                  setModal("edit-contact");
                }}
              >
                <Pencil size={19} />
              </IconButton>
            )}
          </header>
          {panel === "info" ? (
            <div className="detail-scroll">
              <div className="contact-profile">
                <button onClick={() => chat.avatar && setViewImage(`/images/${chat.avatar}.webp`)}>
                  <Avatar chat={chat} size={100} />
                </button>
                <h2>{chat.name}</h2>
                <p>{chat.phone}</p>
                <div className="contact-actions">
                  <Quick icon={Phone} text="Voix" onClick={() => startCall(chat.name)} />
                  <Quick icon={Video} text="Vidéo" onClick={() => startCall(chat.name, true)} />
                  <Quick icon={Search} text="Rechercher" onClick={() => setPanel("search")} />
                </div>
              </div>
              <div className="about-section">
                <small>Infos</small>
                <p>{chat.about || "Disponible"}</p>
              </div>
              <button className="detail-row" onClick={() => setPanel("media")}>
                <Folder size={20} />
                <span>Médias, liens et documents</span>
                <small>{chat.messages.filter((m) => m.kind).length}</small>
              </button>
              <div className="media-thumbnails">
                {chat.messages
                  .filter((m) => m.kind === "image")
                  .map((m) => (
                    <button key={m.id} onClick={() => setViewImage(m.src || null)}>
                      <img src={m.src} alt="Média" />
                    </button>
                  ))}
              </div>
              <button className="detail-row" onClick={() => setPanel("starred")}>
                <Star size={19} />
                <span>Messages importants</span>
              </button>
              <div className="detail-row">
                <Bell size={19} />
                <span>Mode silencieux</span>
                <Toggle
                  value={!!chat.muted}
                  onChange={() => patchChat(chat.id, { muted: !chat.muted })}
                />
              </div>
              <button className="detail-row" onClick={() => setModal("ephemeral")}>
                <CircleDashed size={19} />
                <span>
                  Messages éphémères<small>{prefs.ephemeral}</small>
                </span>
              </button>
              <button className="detail-row" onClick={() => setModal("privacy")}>
                <Shield size={19} />
                <span>
                  Confidentialité avancée de la discussion<small>Désactivée</small>
                </span>
              </button>
              <button className="detail-row" onClick={() => setModal("theme")}>
                <Palette size={19} />
                <span>Thème de la discussion</span>
              </button>
              <button className="detail-row" onClick={() => setModal("encryption")}>
                <LockKeyhole size={19} />
                <span>
                  Chiffrement<small>Informations sur cette démo locale</small>
                </span>
              </button>
              {chat.group && (
                <div className="group-members">
                  <h4>{chat.phone}</h4>
                  {chats
                    .filter((c) => !c.group)
                    .slice(0, 5)
                    .map((c) => (
                      <button className="chat-row" key={c.id} onClick={() => openChat(c)}>
                        <Avatar chat={c} size={38} />
                        {c.name}
                      </button>
                    ))}
                  <button className="detail-row" onClick={() => setModal("add-member")}>
                    <Plus size={19} />
                    Ajouter des membres
                  </button>
                </div>
              )}
              <button className="detail-row danger" onClick={() => setModal("block")}>
                <Shield size={19} />
                {chat.blocked ? "Débloquer" : "Bloquer"} {chat.name}
              </button>
              <button className="detail-row danger" onClick={() => setModal("report")}>
                <CircleAlert size={19} />
                Signaler {chat.name}
              </button>
              <button className="detail-row danger" onClick={() => setModal("delete-chat")}>
                <Trash2 size={19} />
                Supprimer la discussion
              </button>
            </div>
          ) : (
            <div className="detail-scroll">
              {panel === "search" && (
                <div className="list-search">
                  <Search size={18} />
                  <input
                    aria-label="Rechercher des messages"
                    placeholder="Rechercher…"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                  />
                </div>
              )}
              {(panel === "search"
                ? msgMatches
                : panel === "media"
                  ? chat.messages.filter((m) => m.kind)
                  : chat.messages.filter((m) => m.starred)
              ).map((m) => (
                <button
                  className="result-message"
                  key={m.id}
                  onClick={() => {
                    document
                      .getElementById(`msg-${m.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    if (m.kind === "image") setViewImage(m.src || null);
                  }}
                >
                  <small>
                    {m.time} · {m.mine ? "Vous" : chat.name}
                  </small>
                  {m.kind === "image" && <img src={m.src} alt="Média" />}
                  <p>{m.text || m.fileName || m.kind}</p>
                </button>
              ))}
              {((panel === "starred" && !chat.messages.some((m) => m.starred)) ||
                (panel === "media" && !chat.messages.some((m) => m.kind))) && (
                <p className="empty-list">Aucun élément pour le moment.</p>
              )}
            </div>
          )}
        </aside>
      )}
      {menu && (
        <>
          <button
            className="menu-dismiss"
            aria-label="Fermer le menu"
            onClick={() => setMenu(null)}
          />
          {(menu.type === "global" || menu.type === "chat") && (
            <div
              className={`floating-menu ${menu.type === "global" ? "global-menu" : "chat-menu"}`}
              style={
                menu.x !== undefined ? { left: menu.x, top: menu.y, right: "auto" } : undefined
              }
            >
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.fn();
                    setMenu(null);
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {menu.type === "attach" && (
            <div className="floating-menu attach-menu">
              {[
                { icon: FileText, label: "Document", color: "#a277ff", fn: () => attach("*/*") },
                {
                  icon: Image,
                  label: "Photos et vidéos",
                  color: "#538eff",
                  fn: () => attach("image/*,video/*"),
                },
                {
                  icon: Camera,
                  label: "Caméra",
                  color: "#f34f8a",
                  fn: () => attach("image/*", true),
                },
                { icon: Headphones, label: "Audio", color: "#fa943d", fn: () => attach("audio/*") },
                {
                  icon: UserRound,
                  label: "Contact",
                  color: "#25b7e0",
                  fn: () => setModal("share-contact"),
                },
                {
                  icon: ChartNoAxesColumn,
                  label: "Sondage",
                  color: "#ffd038",
                  fn: () => {
                    setFormBody("");
                    setFormOptions("Oui\nNon");
                    setModal("poll");
                  },
                },
                {
                  icon: CalendarDays,
                  label: "Événement",
                  color: "#fa567c",
                  fn: () => {
                    setFormName("");
                    setFormBody("");
                    setModal("event");
                  },
                },
                {
                  icon: Sticker,
                  label: "Nouveau sticker",
                  color: "#00c9a5",
                  fn: () => attach("image/*"),
                },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    a.fn();
                    setMenu(null);
                  }}
                >
                  <a.icon size={18} style={{ color: a.color }} />
                  {a.label}
                </button>
              ))}
            </div>
          )}
          {menu.type === "emoji" && (
            <div className="emoji-picker">
              <header>
                <Smile size={19} />
                Emojis{" "}
                <button onClick={() => setMenu(null)}>
                  <X size={18} />
                </button>
              </header>
              <div>
                {emoji.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setText((t) => t + e);
                      inputRef.current?.focus();
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
          {menu.type === "message" && menu.message && (
            <div
              className="message-menu-wrap"
              style={{ left: Math.max(68, menu.x || 0), top: menu.y }}
            >
              <div className="reaction-picker">
                {emoji.slice(0, 6).map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      patchMessage(menu.message!.id, { reaction: e });
                      setMenu(null);
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="floating-menu message-menu">
                {[
                  { icon: Info, label: "Infos du message", action: "info" },
                  { icon: Reply, label: "Répondre", action: "reply" },
                  { icon: Copy, label: "Copier", action: "copy" },
                  { icon: Forward, label: "Transférer", action: "forward" },
                  {
                    icon: Pin,
                    label: menu.message.pinned ? "Désépingler" : "Épingler",
                    action: "pin",
                  },
                  { icon: Sparkles, label: "Demander à Meta AI", action: "ai" },
                  {
                    icon: Star,
                    label: menu.message.starred
                      ? "Retirer des importants"
                      : "Marquer comme important",
                    action: "star",
                  },
                  { icon: Trash2, label: "Supprimer", action: "delete" },
                ].map((a) => (
                  <button key={a.action} onClick={() => messageAction(a.action, menu.message!)}>
                    <a.icon size={16} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {modal && (
        <DemoModals
          {...{
            modal,
            setModal,
            formName,
            setFormName,
            formBody,
            setFormBody,
            formPhone,
            setFormPhone,
            formOptions,
            setFormOptions,
            chats,
            openChat,
            startCall,
            patchChat,
            notify,
            send,
            forwardMsg,
            setChats,
            chat,
            profile,
            createChat,
            groupMembers,
            setGroupMembers,
            checked,
            setChecked,
            selected,
            setSelected,
            setSelectMode,
            switchTab,
            prefs,
            setPrefs,
            setStatuses,
            setPanel,
            setLockCode,
            setLocked,
          }}
        />
      )}
      {viewImage && (
        <div className="image-viewer">
          <header>
            <span>Média partagé</span>
            <IconButton
              title="Télécharger l’image"
              onClick={() => saveFile("image.webp", viewImage)}
            >
              <Download size={23} />
            </IconButton>
            <IconButton title="Fermer la visionneuse" onClick={() => setViewImage(null)}>
              <X size={24} />
            </IconButton>
          </header>
          <img src={viewImage} alt="Média agrandi" />
        </div>
      )}
      <AnimatePresence>
        {call && (
          <CallStage
            call={call}
            chat={chats.find((c) => c.name === call.name)}
            profileName={profile.name}
            onEnd={endCall}
            onAnswer={() => setCall((c) => (c ? { ...c, state: "connected", seconds: 0 } : null))}
            onSend={(value) => {
              const destination = chats.find((c) => c.name === call.name);
              if (destination)
                setChats((cs) =>
                  cs.map((c) =>
                    c.id === destination.id
                      ? {
                          ...c,
                          messages: [
                            ...c.messages,
                            { id: uid(), text: value, mine: true, time: clock() },
                          ],
                          preview: value,
                          date: clock(),
                        }
                      : c,
                  ),
                );
            }}
          />
        )}
      </AnimatePresence>
      {locked && (
        <div className="lock-screen">
          <LockKeyhole size={50} />
          <h2>{lockCode ? "Application verrouillée" : "Session de démonstration fermée"}</h2>
          <p>Réplique locale de WhatsApp Web</p>
          {lockCode && (
            <input
              aria-label="Code de verrouillage"
              type="password"
              placeholder="Code de verrouillage"
              value={unlock}
              onChange={(e) => setUnlock(e.target.value)}
            />
          )}
          <button
            className="primary"
            onClick={() => {
              if (lockCode && unlock !== lockCode) {
                notify("Code incorrect");
                return;
              }
              setLocked(false);
              setUnlock("");
            }}
          >
            {lockCode ? "Déverrouiller" : "Ouvrir la démo"}
          </button>
        </div>
      )}
      {toast && (
        <output className="toast">
          <Check size={18} />
          {toast}
        </output>
      )}
    </div>
  );
}
function Quick({
  icon: Icon,
  text,
  onClick,
  purple = false,
}: {
  icon: typeof Phone;
  text: string;
  onClick: () => void;
  purple?: boolean;
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      <span>
        <Icon size={22} className={purple ? "purple" : ""} />
      </span>
      <small>{text}</small>
    </button>
  );
}
