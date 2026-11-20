import { FaEnvelope, FaPhoneAlt, FaUserTag } from "react-icons/fa";

const ProfileSummary = ({ user, className = "" }) => {
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const details = [
    { icon: FaUserTag, label: "Account type", value: user?.role },
    { icon: FaEnvelope, label: "Email", value: user?.email, normalCase: true },
    {
      icon: FaPhoneAlt,
      label: "Phone",
      value: user?.phone || "Not provided",
      normalCase: true,
    },
  ];

  return (
    <div
      className={`card border border-base-300 bg-base-100 shadow-sm ${className}`}
    >
      <div className="card-body items-center gap-4 p-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {initials}
        </span>
        <div>
          <p className="text-xl font-bold text-base-content">{user?.name}</p>
          <span
            className={`badge badge-soft mt-2 rounded-full ${
              user?.is_active ? "badge-success" : "badge-error"
            }`}
          >
            {user?.is_active ? "Active account" : "Inactive account"}
          </span>
        </div>

        <ul className="w-full space-y-3 border-t border-base-300 pt-4 text-left text-sm">
          {details.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-base-200 text-primary">
                <item.icon />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-base-content/50">{item.label}</p>
                <p
                  className={`truncate font-medium text-base-content ${
                    item.normalCase ? "normal-case" : "capitalize"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSummary;
