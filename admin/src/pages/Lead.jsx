
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Phone,
  Mail,
  CalendarDays,
  Eye,
  X,
  AlertCircle,
  LoaderCircle,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const STATUS_OPTIONS = ["New", "Contacted", "Converted", "Closed"];

const getToken = () =>
  sessionStorage.getItem("adminToken") ||
  localStorage.getItem("adminToken");

const getLeadName = (lead) =>
  lead.name || lead.fullName || lead.customerName || "Unnamed lead";

const getLeadEmail = (lead) =>
  lead.email || lead.customerEmail || "";

const getLeadPhone = (lead) =>
  lead.phone || lead.phoneNumber || lead.mobile || "";

const getLeadStatus = (lead) => {
  const status = String(lead.status || "New").trim();

  return (
    STATUS_OPTIONS.find(
      (option) => option.toLowerCase() === status.toLowerCase()
    ) || status
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : "Something went wrong.";

const formatLabel = (key) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === "";

const formatDetailValue = (value) => {
  if (isEmptyValue(value)) return "—";

  if (value instanceof Date) return formatDate(value);

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" && item !== null
          ? JSON.stringify(item)
          : String(item)
      )
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${formatLabel(key)}: ${formatDetailValue(item)}`)
      .join("\n");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const EXCLUDED_DETAIL_FIELDS = new Set([
  "_id",
  "__v",
  "id",
  "status",
  "updatedAt",
  "password",
  "token",
  "authorization",
]);

function Lead() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const request = useCallback(async (path, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Your admin session was not found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/api/leads${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          `Request failed (${response.status}).`
      );
    }

    return result;
  }, []);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const leadResult = await request("/");

        const leadList = Array.isArray(leadResult)
          ? leadResult
          : Array.isArray(leadResult?.leads)
            ? leadResult.leads
            : Array.isArray(leadResult?.data)
              ? leadResult.data
              : Array.isArray(leadResult?.data?.leads)
                ? leadResult.data.leads
                : Array.isArray(leadResult?.results)
                  ? leadResult.results
                  : [];

        setLeads(leadList);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [request]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate every statistic from the actual leads.
  // Missing statuses are treated as New.
  const stats = useMemo(() => {
    const counts = {
      total: leads.length,
      new: 0,
      contacted: 0,
      converted: 0,
      closed: 0,
    };

    leads.forEach((lead) => {
      const status = getLeadStatus(lead).toLowerCase();

      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        if (status !== "total") counts[status] += 1;
      }
    });

    return counts;
  }, [leads]);

  const updateStatus = async (lead, newStatus) => {
    const leadId = lead._id || lead.id;

    if (!leadId) {
      setError("This lead has no ID, so its status cannot be updated.");
      return;
    }

    const previousLeads = leads;
    const previousSelectedLead = selectedLead;

    setUpdatingId(leadId);
    setError("");

    // Update immediately; the dashboard statistics recalculate automatically.
    setLeads((current) =>
      current.map((item) =>
        String(item._id || item.id) === String(leadId)
          ? { ...item, status: newStatus }
          : item
      )
    );

    try {
      const result = await request(`/${leadId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedLead = result.lead || result.data?.lead || result.data;

      if (
        updatedLead &&
        typeof updatedLead === "object" &&
        (updatedLead._id || updatedLead.id)
      ) {
        setLeads((current) =>
          current.map((item) =>
            String(item._id || item.id) === String(leadId)
              ? { ...item, ...updatedLead, status: newStatus }
              : item
          )
        );

        setSelectedLead((current) =>
          current &&
          String(current._id || current.id) === String(leadId)
            ? { ...current, ...updatedLead, status: newStatus }
            : current
        );
      }
    } catch (err) {
      setLeads(previousLeads);
      setSelectedLead(previousSelectedLead);
      setError(`Could not update lead status: ${getErrorMessage(err)}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const searchableText = [
      getLeadName(lead),
      getLeadEmail(lead),
      getLeadPhone(lead),
      lead.message,
      lead.description,
      lead.subject,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      getLeadStatus(lead).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) =>
    `lead-status lead-status-${String(status)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;

  const detailFields = selectedLead
    ? Object.entries(selectedLead).filter(([key, value]) => {
        if (EXCLUDED_DETAIL_FIELDS.has(key)) return false;
        if (isEmptyValue(value)) return false;

        return true;
      })
    : [];

  const dateValue = (lead) =>
    lead.createdAt || lead.submittedAt || lead.date;

  const messageValue = (lead) =>
    lead.message || lead.description || lead.subject;

  const statCards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: Users,
      className: "lead-stat-total",
    },
    {
      label: "New Leads",
      value: stats.new,
      icon: UserRoundPlus,
      className: "lead-stat-new",
    },
    {
      label: "Contacted",
      value: stats.contacted,
      icon: UserRoundCheck,
      className: "lead-stat-contacted",
    },
    {
      label: "Converted",
      value: stats.converted,
      icon: CheckCircle2,
      className: "lead-stat-converted",
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: UserRoundX,
      className: "lead-stat-closed",
    },
  ];

  return (
    <div className="lead-page">
      <style>{`
        .lead-page {
          padding: 28px;
          color: #1f2937;
          min-width: 0;
        }
        .lead-page * { box-sizing: border-box; }
        .lead-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .lead-heading {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.6px;
        }
        .lead-subtitle {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 14px;
        }
        .lead-refresh {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 15px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: white;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
        }
        .lead-refresh:disabled { opacity: .6; cursor: not-allowed; }
        .lead-stat-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 24px;
        }
        .lead-stat-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
          padding: 19px;
          border: 1px solid transparent;
          border-radius: 13px;
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .lead-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 14px rgba(0,0,0,.05);
        }
        .lead-stat-total { background: #eff6ff; border-color: #dbeafe; }
        .lead-stat-new { background: #fff7ed; border-color: #fed7aa; }
        .lead-stat-contacted { background: #eef2ff; border-color: #c7d2fe; }
        .lead-stat-converted { background: #ecfdf5; border-color: #a7f3d0; }
        .lead-stat-closed { background: #f3f4f6; border-color: #e5e7eb; }
        .lead-stat-label {
          color: #4b5563;
          font-size: 13px;
          font-weight: 600;
        }
        .lead-stat-value {
          margin-top: 9px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 750;
          color: #111827;
        }
        .lead-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(255,255,255,.8);
        }
        .lead-stat-total .lead-stat-icon { color: #2563eb; }
        .lead-stat-new .lead-stat-icon { color: #c2410c; }
        .lead-stat-contacted .lead-stat-icon { color: #4338ca; }
        .lead-stat-converted .lead-stat-icon { color: #047857; }
        .lead-stat-closed .lead-stat-icon { color: #4b5563; }
        .lead-toolbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .lead-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .lead-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .lead-search, .lead-filter {
          width: 100%;
          min-height: 43px;
          padding: 10px 13px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: white;
          color: #374151;
          font-size: 14px;
          outline: none;
        }
        .lead-search { padding-left: 40px; }
        .lead-search:focus, .lead-filter:focus {
          border-color: #a72b6c;
          box-shadow: 0 0 0 3px rgba(167,43,108,.08);
        }
        .lead-filter { width: 175px; }
        .lead-table-card {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          background: white;
        }
        .lead-table-scroll { overflow-x: auto; }
        .lead-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }
        .lead-table th {
          padding: 14px 16px;
          background: #f9fafb;
          color: #6b7280;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .lead-table td {
          padding: 15px 16px;
          border-top: 1px solid #f0f1f3;
          vertical-align: middle;
        }
        .lead-table tbody tr:hover { background: #fdfbfc; }
        .lead-name { color: #111827; font-weight: 600; }
        .lead-contact {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
          overflow-wrap: anywhere;
        }
        .lead-status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          background: #f3f4f6;
          color: #4b5563;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }
        .lead-status-new { background: #fff7ed; color: #c2410c; }
        .lead-status-contacted { background: #eff6ff; color: #1d4ed8; }
        .lead-status-converted { background: #ecfdf5; color: #047857; }
        .lead-status-closed { background: #f3f4f6; color: #4b5563; }
        .lead-status-select {
          max-width: 135px;
          padding: 7px;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          background: white;
          color: #374151;
          font-size: 12px;
        }
        .lead-view-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          background: white;
          color: #374151;
          cursor: pointer;
          font-weight: 600;
        }
        .lead-view-button:hover { background: #f9fafb; }
        .lead-message-preview {
          display: block;
          max-width: 180px;
          overflow: hidden;
          color: #6b7280;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lead-empty { padding: 45px 20px; text-align: center; color: #6b7280; }
        .lead-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 13px 15px;
          margin-bottom: 16px;
          border: 1px solid #fecaca;
          border-radius: 9px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
          overflow-wrap: anywhere;
        }
        .lead-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 55px 20px;
          color: #6b7280;
        }
        .lead-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(17,24,39,.55);
        }
        .lead-modal {
          width: 100%;
          max-width: 620px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 15px;
          background: white;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }
        .lead-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 20px 22px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }
        .lead-modal-header h2 { margin: 0; font-size: 19px; }
        .lead-modal-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px;
          border: 0;
          border-radius: 7px;
          background: #f3f4f6;
          cursor: pointer;
        }
        .lead-modal-body { padding: 22px; }
        .lead-detail {
          margin-bottom: 19px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .lead-detail:last-child { border-bottom: 0; }
        .lead-detail-label {
          margin-bottom: 6px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
        }
        .lead-detail-value {
          color: #111827;
          font-size: 14px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .lead-spin { animation: lead-spin 1s linear infinite; }
        @keyframes lead-spin { to { transform: rotate(360deg); } }
        @media (max-width: 1250px) {
          .lead-stat-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .lead-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .lead-page { padding: 18px 12px; }
          .lead-heading { font-size: 23px; }
          .lead-stat-grid { gap: 10px; }
          .lead-stat-card { padding: 14px; }
          .lead-stat-value { font-size: 24px; }
          .lead-stat-icon { width: 32px; height: 32px; }
          .lead-filter { width: 100%; }
          .lead-table { min-width: 850px; }
          .lead-modal-backdrop { padding: 12px; }
          .lead-modal-body { padding: 18px; }
        }
      `}</style>

      <div className="lead-header">
        <div>
          <h1 className="lead-heading">Lead Management</h1>
          <p className="lead-subtitle">
            View and manage enquiries submitted through your website.
          </p>
        </div>

        <button
          type="button"
          className="lead-refresh"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw size={16} className={refreshing ? "lead-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="lead-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="lead-stat-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className={`lead-stat-card ${card.className}`}
              key={card.label}
            >
              <div>
                <div className="lead-stat-label">{card.label}</div>
                <div className="lead-stat-value">
                  {loading ? "—" : card.value}
                </div>
              </div>

              <div className="lead-stat-icon">
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="lead-toolbar">
        <div className="lead-search-wrap">
          <Search size={17} className="lead-search-icon" />
          <input
            type="search"
            className="lead-search"
            placeholder="Search name, email, phone, enquiry..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="lead-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter leads by status"
        >
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="lead-table-card">
        {loading ? (
          <div className="lead-loading">
            <LoaderCircle size={21} className="lead-spin" />
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="lead-empty">
            <Users size={35} style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              No leads found
            </div>
            <div style={{ fontSize: 13 }}>
              {leads.length === 0
                ? "Leads will appear here when your website receives enquiries."
                : "Try changing your search or status filter."}
            </div>
          </div>
        ) : (
          <div className="lead-table-scroll">
            <table className="lead-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Message</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => {
                  const id = lead._id || lead.id;
                  const status = getLeadStatus(lead);

                  return (
                    <tr key={id}>
                      <td>
                        <div className="lead-name">{getLeadName(lead)}</div>

                        {getLeadEmail(lead) && (
                          <div className="lead-contact">
                            <Mail size={13} />
                            {getLeadEmail(lead)}
                          </div>
                        )}

                        {getLeadPhone(lead) && (
                          <div className="lead-contact">
                            <Phone size={13} />
                            {getLeadPhone(lead)}
                          </div>
                        )}
                      </td>

                      <td>
                        <span className="lead-message-preview">
                          {messageValue(lead) || "—"}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <CalendarDays size={14} color="#9ca3af" />
                          {formatDate(dateValue(lead))}
                        </div>
                      </td>

                      <td>
                        <div>
                          <span className={getStatusClass(status)}>
                            {status}
                          </span>
                        </div>

                        <select
                          className="lead-status-select"
                          value={status}
                          disabled={updatingId === id}
                          onChange={(event) =>
                            updateStatus(lead, event.target.value)
                          }
                          aria-label={`Update status for ${getLeadName(lead)}`}
                          style={{ marginTop: 7 }}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="lead-view-button"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <div
          className="lead-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLead(null);
            }
          }}
        >
          <section
            className="lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
          >
            <div className="lead-modal-header">
              <h2 id="lead-modal-title">Lead Details</h2>

              <button
                type="button"
                className="lead-modal-close"
                onClick={() => setSelectedLead(null)}
                aria-label="Close lead details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="lead-modal-body">
              {[
                ["Name", getLeadName(selectedLead)],
                ["Email", getLeadEmail(selectedLead) || "—"],
                ["Phone", getLeadPhone(selectedLead) || "—"],
                ["Submitted", formatDate(dateValue(selectedLead))],
              ].map(([label, value]) => (
                <div className="lead-detail" key={label}>
                  <div className="lead-detail-label">{label}</div>
                  <div className="lead-detail-value">{value}</div>
                </div>
              ))}

              {detailFields
                .filter(
                  ([key]) =>
                    ![
                      "name",
                      "fullName",
                      "customerName",
                      "email",
                      "customerEmail",
                      "phone",
                      "phoneNumber",
                      "mobile",
                      "createdAt",
                      "submittedAt",
                      "date",
                      "message",
                      "description",
                      "subject",
                    ].includes(key)
                )
                .map(([key, value]) => (
                  <div className="lead-detail" key={key}>
                    <div className="lead-detail-label">
                      {formatLabel(key)}
                    </div>
                    <div className="lead-detail-value">
                      {formatDetailValue(value)}
                    </div>
                  </div>
                ))}

              <div className="lead-detail">
                <div className="lead-detail-label">Message</div>
                <div className="lead-detail-value">
                  {messageValue(selectedLead) || "No message provided."}
                </div>
              </div>

              {getLeadPhone(selectedLead) && (
                <a
                  href={`tel:${getLeadPhone(selectedLead)}`}
                  className="lead-view-button"
                  style={{ textDecoration: "none" }}
                >
                  <Phone size={15} />
                  Call Lead
                </a>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Lead;
