"use client";

import { useState } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Mail,
  User,
  Car,
  AlertTriangle,
  AlertCircle,
  Trash2,
  RotateCcw,
  Send,
  Eye,
  CheckSquare,
  Square,
  X,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  VALID_INQUIRY_STATUSES,
  ALLOWED_STATUS_TRANSITIONS,
  InquiryStatusType,
} from "@chi-town/contracts";

export interface NotificationRecord {
  id: string;
  fromStatus: string;
  toStatus: string;
  recipient: string;
  subject: string;
  templateName: string;
  status: string; // PENDING, SENT, FAILED
  provider?: string | null;
  errorMessage?: string | null;
  sentAt?: string | Date | null;
  createdAt: string | Date;
}

export interface InquiryRecord {
  id: string;
  inquiryType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleYearMakeModel?: string | null;
  requestedService?: string | null;
  message: string;
  preferredDate?: string | null;
  status: string;
  internalNotes?: string | null;
  assignedStaffId?: string | null;
  assignedStaff?: { id: string; name: string; email: string } | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  notifications?: NotificationRecord[];
}

interface InquiriesClientProps {
  initialInquiries: InquiryRecord[];
  staffList: Array<{ id: string; name: string; email: string }>;
}

export default function InquiriesClient({
  initialInquiries,
  staffList,
}: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Detail Modal State
  const [activeInquiry, setActiveInquiry] = useState<InquiryRecord | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editStaffId, setEditStaffId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ text: string; error: boolean } | null>(null);

  // Email retry state
  const [retryingEmailId, setRetryingEmailId] = useState<string | null>(null);

  // Deletion Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    isBulk: boolean;
    targetId?: string;
    targetName?: string;
    count?: number;
  }>({ isOpen: false, isBulk: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inq.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      inq.customerPhone.toLowerCase().includes(search.toLowerCase()) ||
      (inq.vehicleYearMakeModel &&
        inq.vehicleYearMakeModel.toLowerCase().includes(search.toLowerCase())) ||
      (inq.requestedService &&
        inq.requestedService.toLowerCase().includes(search.toLowerCase())) ||
      inq.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" ? true : inq.status === statusFilter;
    const matchesType = typeFilter === "ALL" ? true : inq.inquiryType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // KPI metrics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "NEW" || i.status === "UNDER_REVIEW").length;
  const inProgressCount = inquiries.filter(
    (i) => i.status === "IN_PROGRESS" || i.status === "QUOTED" || i.status === "AWAITING_CUSTOMER"
  ).length;
  const approvedCount = inquiries.filter(
    (i) => i.status === "APPROVED" || i.status === "SCHEDULED" || i.status === "COMPLETED"
  ).length;

  // Open detail modal
  const handleOpenDetail = (inq: InquiryRecord) => {
    setActiveInquiry(inq);
    setEditStatus(inq.status);
    setEditNotes(inq.internalNotes || "");
    setEditStaffId(inq.assignedStaffId || "");
    setSaveFeedback(null);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setActiveInquiry(null);
    setSaveFeedback(null);
  };

  // Checkbox selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map((i) => i.id));
    }
  };

  // Save Quote Updates (Status, Notes, Staff)
  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry) return;

    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const res = await fetch(`/api/inquiries/${activeInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
          assignedStaffId: editStaffId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update quote inquiry");
      }

      // Update state
      setInquiries((prev) =>
        prev.map((item) => (item.id === activeInquiry.id ? data.inquiry : item))
      );
      setActiveInquiry(data.inquiry);

      let msg = "Quote changes saved successfully.";
      if (data.emailSent === true) {
        msg += " Automated customer notification email dispatched.";
      } else if (data.emailSent === false) {
        msg += ` Status updated, but email failed: ${data.emailError}`;
      }

      setSaveFeedback({ text: msg, error: data.emailSent === false });
    } catch (err: any) {
      setSaveFeedback({ text: err.message, error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // Retry failed email
  const handleRetryEmail = async (inquiryId: string) => {
    setRetryingEmailId(inquiryId);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/retry-email`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed");

      // Refetch inquiry
      const refreshed = await fetch(`/api/inquiries/${inquiryId}`);
      const refreshedData = await refreshed.json();
      if (refreshedData.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? refreshedData.inquiry : item))
        );
        if (activeInquiry?.id === inquiryId) {
          setActiveInquiry(refreshedData.inquiry);
        }
      }
    } catch (err: any) {
      alert(`Email retry error: ${err.message}`);
    } finally {
      setRetryingEmailId(null);
    }
  };

  // Open individual deletion modal
  const handlePromptDelete = (inq: InquiryRecord) => {
    setDeleteModal({
      isOpen: true,
      isBulk: false,
      targetId: inq.id,
      targetName: inq.customerName,
    });
  };

  // Open bulk deletion modal
  const handlePromptBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      isBulk: true,
      count: selectedIds.length,
    });
  };

  // Confirm delete execution
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.isBulk) {
        const res = await fetch("/api/inquiries/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: selectedIds,
            action: "DELETE",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Bulk deletion failed");

        setInquiries((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
        setSelectedIds([]);
      } else if (deleteModal.targetId) {
        const res = await fetch(`/api/inquiries/${deleteModal.targetId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Deletion failed");

        setInquiries((prev) => prev.filter((i) => i.id !== deleteModal.targetId));
        if (activeInquiry?.id === deleteModal.targetId) {
          setActiveInquiry(null);
        }
      }

      setDeleteModal({ isOpen: false, isBulk: false });
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Status Update
  const handleBulkStatusChange = async (targetStatus: string) => {
    if (selectedIds.length === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/inquiries/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action: "UPDATE_STATUS",
          status: targetStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk status update failed");

      // Refetch updated list
      const refreshed = await fetch("/api/inquiries");
      const refData = await refreshed.json();
      if (refData.success) {
        setInquiries(refData.inquiries);
      }
      setSelectedIds([]);
    } catch (err: any) {
      alert(`Bulk update error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-950/60 text-blue-400 border-blue-800";
      case "UNDER_REVIEW":
        return "bg-sky-950/60 text-sky-400 border-sky-800";
      case "CONTACTED":
        return "bg-purple-950/60 text-purple-400 border-purple-800";
      case "IN_PROGRESS":
        return "bg-amber-950/60 text-amber-400 border-amber-800";
      case "AWAITING_CUSTOMER":
        return "bg-orange-950/60 text-orange-400 border-orange-800";
      case "QUOTED":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800";
      case "APPROVED":
        return "bg-teal-950/60 text-teal-400 border-teal-800";
      case "SCHEDULED":
        return "bg-cyan-950/60 text-cyan-400 border-cyan-800";
      case "COMPLETED":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800";
      case "DECLINED":
      case "CANCELLED":
        return "bg-red-950/60 text-red-400 border-red-800";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Customer Inquiries &bull; Quote Pipeline &bull; Automated Emails
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            QUOTES &bull; APPOINTMENTS &bull; INQUIRIES
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage incoming repair requests, track quote status transitions, and automatically notify customers via email.
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#111317] border border-[#22262E] px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Total: </span>
            <strong className="text-white">{totalCount}</strong>
          </div>
          <div className="bg-[#111317] border border-[#22262E] px-3 py-1.5 rounded-lg">
            <span className="text-blue-400">Review: </span>
            <strong className="text-white">{newCount}</strong>
          </div>
          <div className="bg-[#111317] border border-[#22262E] px-3 py-1.5 rounded-lg">
            <span className="text-amber-400">In Progress: </span>
            <strong className="text-white">{inProgressCount}</strong>
          </div>
          <div className="bg-[#111317] border border-[#22262E] px-3 py-1.5 rounded-lg">
            <span className="text-emerald-400">Approved: </span>
            <strong className="text-white">{approvedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111317] border border-[#22262E] p-4 rounded-xl">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, vehicle, service..."
              className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs text-gray-400 font-mono shrink-0">Inquiry Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#08090B] border border-[#292D34] text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#D71920]"
            >
              <option value="ALL">All Inquiry Types</option>
              <option value="SERVICE_QUOTE">Service Quotes</option>
              <option value="APPOINTMENT_REQUEST">Appointment Requests</option>
              <option value="FINANCING_LEAD">Financing Leads</option>
              <option value="GENERAL_CONTACT">General Inquiries</option>
            </select>
          </div>
        </div>

        {/* Status Tab Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["ALL", ...VALID_INQUIRY_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold uppercase transition-colors shrink-0 ${
                statusFilter === st
                  ? "bg-[#D71920] text-white"
                  : "bg-[#111317] text-gray-400 hover:text-white border border-[#22262E]"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-red-950/20 border border-red-900/60 p-4 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <CheckSquare className="w-4 h-4 text-[#D71920]" />
            <span>
              {selectedIds.length} {selectedIds.length === 1 ? "record" : "records"} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Bulk Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Set Status:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkStatusChange(e.target.value);
                }}
                defaultValue=""
                className="bg-[#08090B] border border-[#292D34] rounded px-2.5 py-1 text-xs text-white"
              >
                <option value="" disabled>
                  Choose Status...
                </option>
                {VALID_INQUIRY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Delete */}
            <button
              onClick={handlePromptBulkDelete}
              className="px-3 py-1.5 rounded bg-red-900/60 text-red-200 border border-red-700 hover:bg-red-800 flex items-center gap-1.5 font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded bg-[#16191F] text-gray-400 hover:text-white border border-[#292D34]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="text-gray-400 hover:text-white"
                    title="Select all on this page"
                  >
                    {selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#D71920]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Vehicle &bull; Service</th>
                <th className="py-3 px-4">Status &bull; Email State</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No quote inquiries match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = selectedIds.includes(inq.id);
                  const latestNotification = inq.notifications?.[0];

                  return (
                    <tr
                      key={inq.id}
                      className={`hover:bg-[#16191F] transition-colors ${
                        isSelected ? "bg-[#1d1416]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(inq.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#D71920]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                            inq.inquiryType === "SERVICE_QUOTE"
                              ? "bg-blue-950/60 text-blue-400 border border-blue-800"
                              : inq.inquiryType === "APPOINTMENT_REQUEST"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                              : inq.inquiryType === "FINANCING_LEAD"
                              ? "bg-purple-950/60 text-purple-400 border border-purple-800"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {inq.inquiryType.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{inq.customerName}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D71920]" />
                          <span>{inq.customerPhone}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-600" />
                          <span>{inq.customerEmail}</span>
                        </div>
                      </td>

                      {/* Vehicle & Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-gray-500" />
                          <span>{inq.vehicleYearMakeModel || "Unspecified"}</span>
                        </div>
                        <div className="text-[11px] text-[#D71920] font-medium">
                          {inq.requestedService || "General Inquiry"}
                        </div>
                      </td>

                      {/* Status & Email Notification Tracker */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                              inq.status
                            )}`}
                          >
                            {inq.status}
                          </span>

                          {/* Email delivery indicator */}
                          {latestNotification && (
                            <div className="flex items-center gap-1 text-[10px]">
                              {latestNotification.status === "SENT" ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Email Sent</span>
                                </span>
                              ) : latestNotification.status === "FAILED" ? (
                                <span className="text-red-400 flex items-center gap-1 font-mono">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Email Failed</span>
                                  <button
                                    onClick={() => handleRetryEmail(inq.id)}
                                    disabled={retryingEmailId === inq.id}
                                    className="underline ml-1 hover:text-white"
                                  >
                                    {retryingEmailId === inq.id ? "Retrying..." : "Retry"}
                                  </button>
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3" />
                                  <span>Email Pending</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Preferred Date */}
                      <td className="py-3.5 px-4 font-mono text-gray-400">
                        {inq.preferredDate ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {inq.preferredDate}
                          </span>
                        ) : (
                          <span className="text-gray-500">Flexible</span>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(inq)}
                            className="px-2.5 py-1 rounded bg-[#16191F] hover:bg-[#20252E] text-gray-300 hover:text-white border border-[#292D34] flex items-center gap-1 text-xs font-semibold"
                            title="Review Quote & Update Status"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            <span>Review</span>
                          </button>

                          <button
                            onClick={() => handlePromptDelete(inq)}
                            className="p-1 text-gray-500 hover:text-red-400 rounded hover:bg-[#16191F]"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Review & Status Transition Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111317] border border-[#292D34] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="border-b border-[#22262E] pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D71920]">
                  Quote Management Suite &bull; Ref #{activeInquiry.id.slice(-8).toUpperCase()}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-0.5">
                  Review &amp; Transition Quote
                </h3>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#191C21]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Save Feedback Banner */}
            {saveFeedback && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  saveFeedback.error
                    ? "bg-amber-950/40 text-amber-300 border border-amber-800"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                }`}
              >
                {saveFeedback.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{saveFeedback.text}</span>
              </div>
            )}

            {/* 1. IMMUTABLE CUSTOMER-SUBMITTED DATA CARD (STRICTLY READ-ONLY) */}
            <div className="bg-[#0A0C0F] border border-[#1F232B] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A1D24] pb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Immutable Customer Submission</span>
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Received {new Date(activeInquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Customer Name</span>
                  <span className="text-white font-bold">{activeInquiry.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer Email</span>
                  <a
                    href={`mailto:${activeInquiry.customerEmail}`}
                    className="text-blue-400 hover:underline font-mono"
                  >
                    {activeInquiry.customerEmail}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer Phone</span>
                  <a
                    href={`tel:${activeInquiry.customerPhone}`}
                    className="text-white font-mono hover:text-[#D71920]"
                  >
                    {activeInquiry.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Vehicle Spec</span>
                  <span className="text-white font-semibold">
                    {activeInquiry.vehicleYearMakeModel || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Requested Service</span>
                  <span className="text-[#D71920] font-bold">
                    {activeInquiry.requestedService || "Custom Service"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Preferred Drop-off Date</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {activeInquiry.preferredDate || "Flexible"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1A1D24]">
                <span className="text-gray-500 block text-[11px] mb-1">
                  Customer's Original Request Note:
                </span>
                <div className="bg-[#111317] border border-[#22262E] rounded p-3 text-xs text-gray-300 italic">
                  "{activeInquiry.message}"
                </div>
              </div>
            </div>

            {/* 2. ADMINISTRATIVE TRANSITION & NOTES FORM */}
            <form onSubmit={handleSaveDetail} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Transition Quote Status *
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white font-bold font-mono focus:outline-none focus:border-[#D71920]"
                  >
                    {VALID_INQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Changing status triggers an automated notification email to the customer.
                  </p>
                </div>

                {/* Staff Assignment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Assign Technician / Specialist
                  </label>
                  <select
                    value={editStaffId}
                    onChange={(e) => setEditStaffId(e.target.value)}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Technician Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Internal Shop Notes &bull; Work Order Context
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Verified caliper spacing for 20-inch barrel. Powder coat color code #RAL-3001. Customer approved loaner wheels."
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              {/* 3. EMAIL NOTIFICATION AUDIT TRAIL */}
              {activeInquiry.notifications && activeInquiry.notifications.length > 0 && (
                <div className="border-t border-[#22262E] pt-3 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                    Automated Notification Audit Trail
                  </span>
                  <div className="space-y-1.5">
                    {activeInquiry.notifications.map((n) => (
                      <div
                        key={n.id}
                        className="bg-[#08090B] border border-[#22262E] p-2.5 rounded-lg flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          {n.status === "SENT" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : n.status === "FAILED" ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span className="font-semibold text-white">{n.subject}</span>
                          <span className="text-gray-500 font-mono">({n.toStatus})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-mono text-[10px]">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </span>
                          {n.status === "FAILED" && (
                            <button
                              type="button"
                              onClick={() => handleRetryEmail(activeInquiry.id)}
                              disabled={retryingEmailId === activeInquiry.id}
                              className="px-2 py-0.5 rounded bg-red-900/60 text-red-200 text-[10px] font-bold hover:bg-red-800"
                            >
                              {retryingEmailId === activeInquiry.id ? "Retrying..." : "Retry Email"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#22262E]">
                <button
                  type="button"
                  onClick={() => handlePromptDelete(activeInquiry)}
                  className="px-3 py-2 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40 text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Quote</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary px-6 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Saving & Notifying..." : "Commit & Send Notification"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Deletion Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#111317] border border-red-900/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-full bg-red-950/60 border border-red-800/80">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase">Confirm Deletion</h3>
                <span className="text-[11px] font-mono text-red-400">Permanent Database Action</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {deleteModal.isBulk
                ? `Are you sure you want to delete ${deleteModal.count} selected quote inquiries? This will permanently erase their customer submission records and notification logs.`
                : `Are you sure you want to delete the quote inquiry for "${deleteModal.targetName}"? This action cannot be undone.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#22262E]">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, isBulk: false })}
                className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                {isDeleting ? "Deleting..." : "Confirm & Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
