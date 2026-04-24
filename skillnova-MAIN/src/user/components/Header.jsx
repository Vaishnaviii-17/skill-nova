import { useState, useEffect } from "react";
import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { getSession } from "../../shared/utils/session";

const Header = ({ title, onMenuToggle }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState([]);

  const session = getSession();
  const user = session?.user;

  // ✅ Extract user info safely
  const name = user?.name || user?.email || "User";
  const role = user?.role || "intern";

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ✅ Theme handling
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // ✅ Sync theme across app
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch notifications (backend ready)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 🔥 Replace with your backend API later
        // const res = await fetch("http://localhost:5000/api/notifications");
        // const data = await res.json();

        const data = []; // TEMP empty (no hardcoding)

        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header
      className="h-16 flex items-center px-3 sm:px-6 gap-2 sm:gap-4 flex-shrink-0"
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Mobile Menu */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg -ml-2 mr-1"
        style={{ color: "var(--muted)" }}
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-base font-bold truncate"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />
        <input
          className="pl-9 pr-4 py-2 text-sm rounded-lg w-64 focus:outline-none"
          placeholder="Search..."
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 relative">
        {/* Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg"
          style={{ color: "var(--muted)" }}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-lg"
          style={{ color: "var(--muted)" }}
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#ff6d34" }}
            />
          )}
        </button>

        {showNotif && (
          <div
            className="absolute right-0 top-12 w-80 max-h-[70vh] overflow-y-auto rounded-2xl shadow-xl z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Notifications
              </p>
            </div>

            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-3 text-sm"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {n.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* User Info */}
      <div
        className="flex items-center gap-2 pl-3"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #ff6d34, #00bea3)",
          }}
        >
          {initials}
        </div>

        <div className="hidden md:block">
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--text)" }}
          >
            {name}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--muted)" }}
          >
            {role}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;