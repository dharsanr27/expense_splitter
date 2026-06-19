import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import API from "@/api/axios";
import "./GroupMembersList.css";

// Purely presentational helpers — generate a stable initial + colour per
// username so each member gets a consistent avatar across renders.
const AVATAR_PALETTE = [
  "#0F6B5C",
  "#AE4230",
  "#7A5CC2",
  "#1F6FB2",
  "#B8862E",
  "#3F8F4F",
];

const getInitial = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
  </svg>
);

const GroupMembersList = () => {
  const { groupId } = useParams();
  const currentUserId = Number(localStorage.getItem("userId"));

  // --- STATE MANAGEMENT ---
  const [members, setMembers] = useState([]);
  const [balance, setBalance] = useState([]);
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Track the actual user object selected from the dropdown
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [showPaidDropdown, setShowPaidDropdown] = useState(false);
  const [selectedUser1, setSelectedUser1] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [description, setDescription] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSettleDebt, setActiveSettleDebt] = useState(null);
  const [isSettling, setIsSettling] = useState(false);

  // Theme is purely presentational state — defaults to the system
  // preference, then remembers whatever the person picks.
  const [theme, setTheme] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("gm-theme") : null;
    if (saved === "light" || saved === "dark") return saved;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("gm-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // --- API CALLS ---
  const fetchGroupData = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setError("");
      const response = await API.get(`/groups/groupMembers/${groupId}`);
      const response2 = await API.get(
        `/dashboardData/userDataAndBalance/${groupId}`,
      );
      setMembers(response.data.data || []);
      setBalance(response2.data.data.balances || []);
      setSimplifiedDebts(response2.data.data.settlements || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch group details";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handleSearchUsers = async (query) => {
    if (!query || !query.trim()) {
      setResults([]);
      return;
    }
    try {
      const response = await API.get(
        `/users?search=${encodeURIComponent(query.trim())}`,
      );
      setResults(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch username:", error);
    }
  };

  // --- OPTIMIZATIONS & HANDLERS ---
  const debouncedSearch = useMemo(
    () => debounce((nextValue) => handleSearchUsers(nextValue), 500),
    [],
  );

  // Cleanup debounce when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If user clears the input manually, instantly reset state without waiting for debounce
    if (!value.trim()) {
      debouncedSearch.cancel();
      setResults([]);
      setSelectedUser(null);
      return;
    }

    debouncedSearch(value);
  };

  const handleSelectUser = (user) => {
    setSearchTerm(user.username);
    setSelectedUser(user);
    setResults([]); // Hide dropdown immediately after selection
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setError("Please select a user from the list first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setActionMessage("");

      const response = await API.post(`/groups/addMember/${groupId}`, {
        userId: selectedUser.id,
      });

      setActionMessage(response.data.message || "Member added successfully!");

      // Optimistic local state update using a proper object shape
      setMembers((prevMembers) => [...prevMembers, selectedUser]);

      // Reset form states cleanly
      setSearchTerm("");
      setSelectedUser(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add member";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  //add new  expense
  const handleAmountPaid = (e) => {
    setAmountPaid(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedUser1) {
      setError("Please select a user from the list first.");
      return;
    }
    try {
      const response = await API.post(`expenses/createExpense`, {
        groupId: Number(groupId),
        paidBy: selectedUser1.id,
        totalAmount: Number(amountPaid),
        description: description,
      });
       setActionMessage(response.data.message || "Expense added successfully!");
      await fetchGroupData();
      setSelectedUser1(null);
      setSearchTerm1("");
      setAmountPaid("");
      setDescription("");
      setShowPaidDropdown(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add expense:";
      setError(errorMsg);
    }
  };
  const handleSelectUser1 = (user) => {
    setSearchTerm1(user.username);
    setSelectedUser1(user);
    setShowPaidDropdown(false); // Hide dropdown immediately after selection
  };
  const handlePaidUser = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    if (!value.trim()) {
      setShowPaidDropdown(false);
      setSelectedUser1(null);
      return;
    }
    setShowPaidDropdown(true);
  };
  const filterPaidUser = members.filter((member) =>
    member.username.toLowerCase().includes(searchTerm1.toLowerCase()),
  );
  const balanceMap = useMemo(() => {
    return balance.reduce((acc, currBalance) => {
      acc[currBalance.UserId] = currBalance;
      return acc;
    }, {});
  }, [balance]);
  // 1. Debts where I have to pay money
  const myDebts = useMemo(() => {
    return simplifiedDebts.filter(
      (debt) => debt.fromUserId === Number(currentUserId),
    );
  }, [simplifiedDebts, currentUserId]);

  // 2. Debts where I am waiting to receive money
  const myCredits = useMemo(() => {
    return simplifiedDebts.filter(
      (debt) => debt.toUserId === Number(currentUserId),
    );
  }, [simplifiedDebts, currentUserId]);

  // 3. Everyone else's business (for transparency)
  const otherDebts = useMemo(() => {
    return simplifiedDebts.filter(
      (debt) =>
        debt.fromUserId !== Number(currentUserId) &&
        debt.toUserId !== Number(currentUserId),
    );
  }, [simplifiedDebts, currentUserId]);

  const handleSettleUp = async (groupId, fromUserId, toUserId, amount) => {
    try {
      setIsSettling(true);
      setError("");
      await API.post("/settlements/createSettlement", {
        groupId: groupId,
        fromUserId: fromUserId,
        toUserId: toUserId,
        amount: amount,
      });
      setActionMessage("Debt settled successfully!");
      await fetchGroupData();
    } catch (err) {
      console.error("Failed to process settlement", err);
    } finally {
      setIsSettling(false);
    }
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="gm-app" data-theme={theme}>
        <div className="gm-shell">
          <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            Loading members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gm-app" data-theme={theme}>
      <div className="gm-shell">
        <header className="gm-header">
          <div>
            <p className="gm-eyebrow">Group ledger</p>
            <h1 className="gm-title">
              Group Members <span className="gm-count">({members.length})</span>
            </h1>
          </div>
          <button
            type="button"
            className="gm-theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        {error && (
          <div className="gm-alert gm-alert--error" role="alert">
            {error}
          </div>
        )}
        {actionMessage && (
          <div className="gm-alert gm-alert--success" role="status">
            {actionMessage}
          </div>
        )}

        {/* Group Members List, with quick actions docked beside it */}
        <div className="gm-row">
          <section className="gm-card gm-col-members">
            <h3 className="gm-card-title">Members</h3>

            {members.length === 0 ? (
              <p className="gm-empty">No members found in this group.</p>
            ) : (
              <div>
                {members.map((member) => {
                  const memberBalance = balanceMap[member.id];
                  const netAmount = memberBalance
                    ? memberBalance.NetBalanceAmount
                    : 0;
                  const chipVariant =
                    netAmount > 0
                      ? "positive"
                      : netAmount < 0
                        ? "negative"
                        : "neutral";
                  const chipLabel =
                    netAmount > 0
                      ? `Gets back ₹${netAmount}`
                      : netAmount < 0
                        ? `Owes ₹${Math.abs(netAmount)}`
                        : "Settled up";

                  return (
                    <div
                      className="gm-member-row"
                      key={member.id || member.username}
                    >
                      <span
                        className="gm-avatar"
                        style={{ background: getAvatarColor(member.username) }}
                      >
                        {getInitial(member.username)}
                      </span>
                      <div className="gm-member-main">
                        <span className="gm-member-name">
                          {member.username}
                        </span>
                        {member.id === currentUserId && (
                          <span className="gm-you-tag">You</span>
                        )}
                      </div>
                      <span className={`gm-chip gm-chip--${chipVariant}`}>
                        {chipLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="gm-tear gm-tear--stack-only" aria-hidden="true" />

          <div className="gm-col-actions">
            {/* Add Member Section */}
            <section className="gm-card">
              <h3 className="gm-card-title">Add New Member</h3>
              <form onSubmit={handleAddMember} className="gm-form">
                <div className="gm-field">
                  <label htmlFor="user-search" className="gm-sr-only">
                    Search users by username
                  </label>
                  <input
                    id="user-search"
                    type="text"
                    className="gm-input"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Type username..."
                    autoComplete="off"
                  />

                  {results.length > 0 && (
                    <ul className="gm-dropdown">
                      {results.map((user) => (
                        <li
                          key={user.id}
                          className="gm-dropdown-item"
                          onClick={() => handleSelectUser(user)}
                        >
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  className="gm-btn gm-btn-primary gm-btn--block"
                  disabled={isSubmitting || !selectedUser}
                >
                  {isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </form>
            </section>

            <div className="gm-tear" aria-hidden="true" />

            <section className="gm-card">
              <h3 className="gm-card-title">Add New Expense</h3>
              <form onSubmit={handleAddExpense} className="gm-form">
                <div className="gm-field">
                  <label htmlFor="paid-by-search" className="gm-sr-only">
                    Who paid
                  </label>
                  <input
                    id="paid-by-search"
                    type="text"
                    className="gm-input"
                    onChange={handlePaidUser}
                    value={searchTerm1}
                    placeholder="Who paid? Type username..."
                    autoComplete="off"
                  />
                  {showPaidDropdown && filterPaidUser.length > 0 && (
                    <ul className="gm-dropdown">
                      {filterPaidUser.map((user) => (
                        <li
                          key={user.id}
                          className="gm-dropdown-item"
                          onClick={() => handleSelectUser1(user)}
                        >
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="gm-field">
                  <label htmlFor="expense-amount" className="gm-sr-only">
                    Amount paid
                  </label>
                  <input
                    id="expense-amount"
                    type="number"
                    inputMode="decimal"
                    className="gm-input gm-input--amount"
                    onChange={handleAmountPaid}
                    value={amountPaid}
                    placeholder="Amount paid (₹)"
                  />
                </div>

                <div className="gm-field">
                  <label htmlFor="expense-description" className="gm-sr-only">
                    Description
                  </label>
                  <input
                    id="expense-description"
                    type="text"
                    className="gm-input"
                    onChange={handleDescription}
                    value={description}
                    placeholder="Description"
                  />
                </div>

                <button
                  type="submit"
                  className="gm-btn gm-btn-primary gm-btn--block"
                  disabled={isSubmitting || !selectedUser1 || !amountPaid || parseFloat(amountPaid) <= 0 || !description.trim()}
                >
                  Add Expense
                </button>
              </form>
            </section>
          </div>
        </div>

        <div className="gm-tear" aria-hidden="true" />

        <section className="gm-card">
          <h3 className="gm-card-title">Settle Up</h3>

          {myDebts.length > 0 && (
            <div>
              <h4 className="gm-subhead">
                <span className="gm-dot gm-dot--debt" /> You need to pay
              </h4>
              <ul className="gm-debt-list">
                {myDebts.map((debt, idx) => (
                  <li className="gm-debt-row" key={idx}>
                    <span>
                      You owe <strong>{debt.toUserName}</strong>{" "}
                      <span className="gm-debt-amount">₹{debt.amount}</span>
                    </span>
                    <button
                      type="button"
                      className="gm-record-btn"
                      onClick={() => setActiveSettleDebt(debt)}
                    >
                      Record Payment
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {myCredits.length > 0 && (
            <div>
              <h4 className="gm-subhead">
                <span className="gm-dot gm-dot--credit" /> You are owed
              </h4>
              <ul className="gm-debt-list">
                {myCredits.map((credit, idx) => (
                  <li className="gm-debt-row" key={idx}>
                    <span>
                      <strong>{credit.fromUserName}</strong> owes you{" "}
                      <span className="gm-debt-amount">₹{credit.amount}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {otherDebts.length > 0 && (
            <div>
              <h4 className="gm-subhead">
                <span className="gm-dot gm-dot--neutral" /> Other group debts
              </h4>
              <ul className="gm-debt-list">
                {otherDebts.map((debt, idx) => (
                  <li className="gm-debt-row" key={idx}>
                    <span>
                      {debt.fromUserName} owes {debt.toUserName}{" "}
                      <span className="gm-debt-amount">₹{debt.amount}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {simplifiedDebts.length === 0 && (
            <p className="gm-empty">All debts in this group are settled! 🎉</p>
          )}
        </section>
      </div>

      {/* Thumb-friendly settle-up confirmation, anchored to the bottom on mobile */}
      {activeSettleDebt && (
        <div
          className="gm-sheet-overlay"
          onClick={() => setActiveSettleDebt(null)}
        >
          <div
            className="gm-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settle-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gm-sheet-handle" aria-hidden="true" />
            <h3 className="gm-sheet-title" id="settle-sheet-title">
              Confirm settlement
            </h3>
            <p className="gm-sheet-body">
              Mark <strong>₹{activeSettleDebt.amount}</strong> from you to{" "}
              <strong>{activeSettleDebt.toUserName}</strong> as paid?
            </p>
            <div className="gm-sheet-actions">
              <button
                type="button"
                className="gm-btn gm-btn-primary"
                disabled={isSettling}
                onClick={async () => {
                  await handleSettleUp(
                    groupId,
                    activeSettleDebt.fromUserId,
                    activeSettleDebt.toUserId,
                    activeSettleDebt.amount,
                  );
                  setActiveSettleDebt(null);
                }}
              >
                {isSettling ? "Settling…" : "Yes, confirm"}
              </button>
              <button
                type="button"
                className="gm-btn gm-btn-secondary"
                onClick={() => setActiveSettleDebt(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembersList;
