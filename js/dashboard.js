/* =========================================================
   OSSP-TOM OFFICER DASHBOARD
   COMPLETE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       CONFIGURATION AND STORAGE
    ===================================================== */

    const RECORDS_STORAGE_KEY = "osspTomOrdinances";
    const INQUIRIES_STORAGE_KEY = "osspTomInquiries";

    let ordinances = loadRecords();
    let inquiries = loadInquiries();
    let activeInquiryId = null;

    // PDF object URLs only remain available during this browser session.
    const pdfObjectUrls = new Map();

    let activeStatFilter = "all";

    /* =====================================================
       ELEMENT SELECTORS
    ===================================================== */

    const elements = {
        currentDay: document.getElementById("currentDay"),
        currentDate: document.getElementById("currentDate"),
        currentTime: document.getElementById("currentTime"),

        officerName: document.getElementById("officerName"),

        totalOrdinances: document.getElementById("totalOrdinances"),
        firstReading: document.getElementById("firstReading"),
        secondReading: document.getElementById("secondReading"),
        thirdReading: document.getElementById("thirdReading"),
        completedOrdinances: document.getElementById("completedOrdinances"),

        ordinanceTable: document.getElementById("ordinanceTable"),

        recordSearch: document.getElementById("recordSearch"),
        stageFilter: document.getElementById("stageFilter"),

        ordinanceForm: document.getElementById("ordinanceForm"),
        ordinanceTitle: document.getElementById("ordinanceTitle"),
        spNumber: document.getElementById("spNumber"),
        ordinanceAuthor: document.getElementById("ordinanceAuthor"),
        readingStage: document.getElementById("readingStage"),
        ordinanceFile: document.getElementById("ordinanceFile"),
        fileName: document.getElementById("fileName"),

        editOrdinanceForm: document.getElementById("editOrdinanceForm"),
        editRecordId: document.getElementById("editRecordId"),
        editOrdinanceTitle: document.getElementById("editOrdinanceTitle"),
        editSpNumber: document.getElementById("editSpNumber"),
        editOrdinanceAuthor: document.getElementById("editOrdinanceAuthor"),
        editReadingStage: document.getElementById("editReadingStage"),
        editOrdinanceFile: document.getElementById("editOrdinanceFile"),

        notificationButton: document.getElementById("notificationButton"),
        notificationCount: document.getElementById("notificationCount"),

        chatDialogMessages: document.getElementById("chatDialogMessages"),
        chatReplyForm: document.getElementById("chatReplyForm"),
        chatReplyInput: document.getElementById("chatReplyInput"),
        conversationList: document.getElementById("conversationList"),
        inboxCount: document.getElementById("inboxCount"),
        inboxEmpty: document.getElementById("inboxEmpty"),
        activeConversation: document.getElementById("activeConversation"),
        visitorConversationId: document.getElementById("visitorConversationId"),
        visitorConversationMeta: document.getElementById("visitorConversationMeta"),
        visitorConversationStatus: document.getElementById("visitorConversationStatus"),
        resolveInquiryButton: document.getElementById("resolveInquiryButton"),

        statDetailsTitle: document.getElementById("statDetailsTitle"),
        statDetailsDescription: document.getElementById("statDetailsDescription"),
        statDetailsCount: document.getElementById("statDetailsCount"),
        statDetailsList: document.getElementById("statDetailsList"),

        toast: document.getElementById("toast")
    };


    /* =====================================================
       LOCAL STORAGE FUNCTIONS
    ===================================================== */

    function loadRecords() {
        try {
            const saved = localStorage.getItem(RECORDS_STORAGE_KEY);

            if (!saved) return [];

            const parsed = JSON.parse(saved);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {
            console.error("Unable to load ordinance records:", error);
            return [];
        }
    }


    function saveRecords() {
        try {
            localStorage.setItem(
                RECORDS_STORAGE_KEY,
                JSON.stringify(ordinances)
            );

            return true;

        } catch (error) {
            console.error("Unable to save ordinance records:", error);

            showToast(
                "Unable to save records. Your browser storage may be full.",
                "error"
            );

            return false;
        }
    }


    function loadInquiries() {
        try {
            const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);

            if (!saved) return [];

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) return [];

            return parsed.map(function (inquiry) {
                return {
                    id: String(inquiry.id || ""),
                    status: inquiry.status || "Open",
                    createdAt: inquiry.createdAt || inquiry.time || new Date().toISOString(),
                    updatedAt: inquiry.updatedAt || inquiry.createdAt || inquiry.time || new Date().toISOString(),
                    read: Boolean(inquiry.read),
                    messages: Array.isArray(inquiry.messages) ? inquiry.messages : []
                };
            });

        } catch (error) {
            console.error("Unable to load visitor inquiries:", error);
            return [];
        }
    }


    function saveInquiries() {
        try {
            localStorage.setItem(
                INQUIRIES_STORAGE_KEY,
                JSON.stringify(inquiries)
            );

            return true;

        } catch (error) {
            console.error("Unable to save visitor inquiries:", error);

            showToast(
                "Unable to save inbox changes. Browser storage may be full.",
                "error"
            );

            return false;
        }
    }


    /* =====================================================
       GENERAL HELPERS
    ===================================================== */

    function createId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return "record-" + Date.now() + "-" +
            Math.random().toString(36).substring(2, 10);
    }


    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return replacements[character];
        });
    }


    function formatDate(dateValue) {
        if (!dateValue) return "N/A";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "N/A";

        return new Intl.DateTimeFormat("en-PH", {
            timeZone: "Asia/Manila",
            month: "short",
            day: "2-digit",
            year: "numeric"
        }).format(date);
    }


    function formatTime(dateValue) {
        const date = new Date(dateValue);

        return new Intl.DateTimeFormat("en-PH", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).format(date);
    }


    function showToast(message, type = "success") {
        if (!elements.toast) return;

        elements.toast.textContent = message;
        elements.toast.className = "toast show";

        if (type === "error") {
            elements.toast.classList.add("error");
        } else if (type === "success") {
            elements.toast.classList.add("success");
        }

        clearTimeout(showToast.timeout);

        showToast.timeout = setTimeout(function () {
            elements.toast.classList.remove("show");
        }, 3500);
    }


    /* =====================================================
       PHILIPPINE DATE AND TIME
    ===================================================== */

    function updateDateTime() {
        const now = new Date();

        const options = {
            timeZone: "Asia/Manila"
        };

        if (elements.currentDay) {
            elements.currentDay.textContent =
                new Intl.DateTimeFormat("en-PH", {
                    ...options,
                    weekday: "long"
                }).format(now);
        }

        if (elements.currentDate) {
            elements.currentDate.textContent =
                new Intl.DateTimeFormat("en-PH", {
                    ...options,
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).format(now);
        }

        if (elements.currentTime) {
            elements.currentTime.textContent =
                new Intl.DateTimeFormat("en-PH", {
                    ...options,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }).format(now);
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);


    /* =====================================================
       OFFICER NAME
    ===================================================== */

    function loadOfficerName() {
        if (!elements.officerName) return;

        const savedName = localStorage.getItem("osspOfficerName");

        if (savedName) {
            elements.officerName.textContent = "Welcome, " + savedName;
        }
    }

    loadOfficerName();


    /* =====================================================
       MODAL FUNCTIONS
    ===================================================== */

    function openModal(modalId) {
        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeModal(modalId) {
        const modal = document.getElementById(modalId);

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const openModals = document.querySelectorAll(
            ".modal.active, .modal.open"
        );

        if (openModals.length === 0) {
            document.body.style.overflow = "";
        }
    }


    function closeAllModals() {
        document.querySelectorAll(".modal").forEach(function (modal) {
            modal.classList.remove("active", "open");
            modal.setAttribute("aria-hidden", "true");
        });

        document.body.style.overflow = "";
    }


    document.querySelectorAll("[data-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(button.dataset.close);
        });
    });


    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        const activeModals = document.querySelectorAll(
            ".modal.active, .modal.open"
        );

        if (activeModals.length > 0) {
            const lastModal = activeModals[activeModals.length - 1];
            closeModal(lastModal.id);
        }
    });


    /* =====================================================
       UPLOAD MODAL
    ===================================================== */

    const openUploadButton =
        document.getElementById("openUploadModal");

    if (openUploadButton) {
        openUploadButton.addEventListener("click", function () {
            if (elements.ordinanceForm) {
                elements.ordinanceForm.reset();
            }

            if (elements.fileName) {
                elements.fileName.textContent = "Choose PDF file";
            }

            openModal("uploadModal");
        });
    }


    /* =====================================================
       PDF FILE VALIDATION
    ===================================================== */

    function isValidPDF(file) {
        if (!file) return false;

        const extensionIsPDF =
            file.name.toLowerCase().endsWith(".pdf");

        const typeIsPDF =
            file.type === "application/pdf" ||
            file.type === "";

        return extensionIsPDF && typeIsPDF;
    }


    function getPDFObjectURL(recordId) {
        return pdfObjectUrls.get(recordId) || null;
    }


    function releasePDFObjectURL(recordId) {
        const oldURL = pdfObjectUrls.get(recordId);

        if (oldURL) {
            URL.revokeObjectURL(oldURL);
            pdfObjectUrls.delete(recordId);
        }
    }


    /* =====================================================
       UPLOAD FILE NAME DISPLAY
    ===================================================== */

    if (elements.ordinanceFile) {
        elements.ordinanceFile.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) {
                if (elements.fileName) {
                    elements.fileName.textContent = "Choose PDF file";
                }
                return;
            }

            if (!isValidPDF(file)) {
                this.value = "";

                if (elements.fileName) {
                    elements.fileName.textContent = "Choose PDF file";
                }

                showToast("Please select a valid PDF file.", "error");
                return;
            }

            if (elements.fileName) {
                elements.fileName.textContent = file.name;
            }
        });
    }


    /* =====================================================
       READING STAGE BADGE
    ===================================================== */

    function getStageClass(stage) {
        switch (stage) {
            case "1st Reading":
                return "stage-1";

            case "2nd Reading":
                return "stage-2";

            case "3rd Reading":
                return "stage-3";

            case "Complete":
                return "stage-complete";

            default:
                return "stage-1";
        }
    }


    /* =====================================================
       UPLOAD ORDINANCE
    ===================================================== */

    if (elements.ordinanceForm) {
        elements.ordinanceForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = elements.ordinanceTitle.value.trim();
            const spNumber = elements.spNumber.value.trim();
            const author = elements.ordinanceAuthor.value.trim();
            const stage = elements.readingStage.value;
            const file = elements.ordinanceFile.files[0];

            if (!title || !spNumber || !author) {
                showToast("Please complete all required fields.", "error");
                return;
            }

            if (!file) {
                showToast("Please attach the ordinance PDF file.", "error");
                return;
            }

            if (!isValidPDF(file)) {
                showToast("Only PDF files are accepted.", "error");
                return;
            }

            const duplicate = ordinances.some(function (record) {
                return String(record.spNumber || "").toLowerCase() ===
                    spNumber.toLowerCase();
            });

            if (duplicate) {
                showToast("An ordinance with this SP number already exists.", "error");
                return;
            }

            const newRecord = {
                id: createId(),
                title: title,
                spNumber: spNumber,
                author: author,
                stage: stage,
                dateUploaded: new Date().toISOString(),
                fileName: file.name
            };

            ordinances.unshift(newRecord);

            if (!saveRecords()) {
                ordinances.shift();
                return;
            }

            // Temporary PDF URL for the current browser session.
            pdfObjectUrls.set(
                newRecord.id,
                URL.createObjectURL(file)
            );

            renderDashboard();

            elements.ordinanceForm.reset();

            if (elements.fileName) {
                elements.fileName.textContent = "Choose PDF file";
            }

            closeModal("uploadModal");
            showToast("Ordinance uploaded successfully.");
        });
    }


    /* =====================================================
       RENDER ORDINANCE TABLE
    ===================================================== */

    function getFilteredRecords() {
        let filtered = [...ordinances];

        const searchTerm = elements.recordSearch
            ? elements.recordSearch.value.trim().toLowerCase()
            : "";

        const selectedStage = elements.stageFilter
            ? elements.stageFilter.value
            : "all";

        if (activeStatFilter !== "all") {
            filtered = filtered.filter(function (record) {
                return record.stage === activeStatFilter;
            });
        }

        if (selectedStage !== "all") {
            filtered = filtered.filter(function (record) {
                return record.stage === selectedStage;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(function (record) {
                return (
                    String(record.title || "").toLowerCase().includes(searchTerm) ||
                    String(record.spNumber || "").toLowerCase().includes(searchTerm) ||
                    String(record.author || "").toLowerCase().includes(searchTerm) ||
                    String(record.stage || "").toLowerCase().includes(searchTerm)
                );
            });
        }

        return filtered;
    }


    function renderTable() {
        if (!elements.ordinanceTable) return;

        const records = getFilteredRecords();

        if (records.length === 0) {
            elements.ordinanceTable.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-record">
                        <i class="fa-solid fa-folder-open"></i>
                        <br>
                        No ordinance records found.
                    </td>
                </tr>
            `;

            return;
        }

        elements.ordinanceTable.innerHTML = records.map(function (record) {
            const pdfURL = getPDFObjectURL(record.id);

            const fileHTML = pdfURL
                ? `
                    <a class="file-link"
                        href="${pdfURL}"
                        target="_blank"
                        rel="noopener noreferrer">
                        <i class="fa-solid fa-file-pdf"></i>
                        VIEW PDF
                    </a>
                  `
                : `
                    <span class="file-link" title="PDF must be uploaded again after refreshing this demo">
                        <i class="fa-solid fa-file-circle-question"></i>
                        ${escapeHTML(record.fileName || "PDF unavailable")}
                    </span>
                  `;

            return `
                <tr>
                    <td class="ordinance-title">
                        ${escapeHTML(record.title)}
                    </td>

                    <td class="sp-number">
                        ${escapeHTML(record.spNumber)}
                    </td>

                    <td>
                        ${escapeHTML(record.author)}
                    </td>

                    <td>
                        <span class="stage-badge ${getStageClass(record.stage)}">
                            ${escapeHTML(record.stage)}
                        </span>
                    </td>

                    <td>
                        ${formatDate(record.dateUploaded)}
                    </td>

                    <td>
                        ${fileHTML}
                    </td>

                    <td>
                        <button
                            type="button"
                            class="table-action-button"
                            data-edit-id="${escapeHTML(record.id)}"
                            title="Edit ordinance">
                            <i class="fa-solid fa-pen-to-square"></i>
                            EDIT
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        elements.ordinanceTable
            .querySelectorAll("[data-edit-id]")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    openEditModal(this.dataset.editId);
                });
            });
    }


    /* =====================================================
       STATISTICS COUNTERS
    ===================================================== */

    function updateStatistics() {
        const total = ordinances.length;

        const first = ordinances.filter(function (record) {
            return record.stage === "1st Reading";
        }).length;

        const second = ordinances.filter(function (record) {
            return record.stage === "2nd Reading";
        }).length;

        const third = ordinances.filter(function (record) {
            return record.stage === "3rd Reading";
        }).length;

        const completed = ordinances.filter(function (record) {
            return record.stage === "Complete";
        }).length;

        if (elements.totalOrdinances) {
            elements.totalOrdinances.textContent = total;
        }

        if (elements.firstReading) {
            elements.firstReading.textContent = first;
        }

        if (elements.secondReading) {
            elements.secondReading.textContent = second;
        }

        if (elements.thirdReading) {
            elements.thirdReading.textContent = third;
        }

        if (elements.completedOrdinances) {
            elements.completedOrdinances.textContent = completed;
        }
    }


    /* =====================================================
       COMPLETE DASHBOARD RENDER
    ===================================================== */

    function renderDashboard() {
        updateStatistics();
        renderTable();
    }


    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    if (elements.recordSearch) {
        elements.recordSearch.addEventListener("input", function () {
            renderTable();
        });
    }

    if (elements.stageFilter) {
        elements.stageFilter.addEventListener("change", function () {
            activeStatFilter = "all";
            renderTable();
        });
    }


    /* =====================================================
       CLICKABLE STATISTICS CARDS
    ===================================================== */

    document.querySelectorAll("[data-stat-stage]").forEach(function (card) {
        card.addEventListener("click", function () {
            const selectedStage = this.dataset.statStage;

            activeStatFilter = selectedStage;

            if (elements.stageFilter) {
                elements.stageFilter.value = "all";
            }

            if (elements.recordSearch) {
                elements.recordSearch.value = "";
            }

            openStatDetails(selectedStage);
        });
    });


    /* =====================================================
       STATISTICS DETAILS MODAL
    ===================================================== */

    function openStatDetails(stage) {
        let filteredRecords = [...ordinances];

        let title = "All Ordinance Records";
        let description = "Showing all ordinance records.";

        if (stage !== "all") {
            filteredRecords = ordinances.filter(function (record) {
                return record.stage === stage;
            });

            title = stage === "Complete"
                ? "Completed Ordinances"
                : stage + " Records";

            description = "Showing all ordinances under " + stage + ".";
        }

        if (elements.statDetailsTitle) {
            elements.statDetailsTitle.textContent = title;
        }

        if (elements.statDetailsDescription) {
            elements.statDetailsDescription.textContent = description;
        }

        if (elements.statDetailsCount) {
            elements.statDetailsCount.textContent = filteredRecords.length;
        }

        if (elements.statDetailsList) {
            if (filteredRecords.length === 0) {
                elements.statDetailsList.innerHTML = `
                    <div class="stat-details-empty">
                        <i class="fa-solid fa-folder-open"></i>
                        <strong>No records found</strong>
                        <span>There are currently no ordinances in this category.</span>
                    </div>
                `;
            } else {
                elements.statDetailsList.innerHTML =
                    filteredRecords.map(function (record) {
                        const pdfURL = getPDFObjectURL(record.id);

                        const fileButton = pdfURL
                            ? `
                                <a class="file-link"
                                    href="${pdfURL}"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i class="fa-solid fa-file-pdf"></i>
                                    VIEW PDF
                                </a>
                              `
                            : `
                                <small>PDF unavailable in this session</small>
                              `;

                        return `
                            <div class="stat-detail-item">
                                <div class="stat-detail-info">
                                    <strong>
                                        ${escapeHTML(record.title)}
                                    </strong>

                                    <span>
                                        SP No. ${escapeHTML(record.spNumber)}
                                    </span>

                                    <small>
                                        Author: ${escapeHTML(record.author)}
                                    </small>

                                    <span>
                                        Uploaded: ${formatDate(record.dateUploaded)}
                                    </span>

                                    <span class="stage-badge ${getStageClass(record.stage)}">
                                        ${escapeHTML(record.stage)}
                                    </span>
                                </div>

                                <div class="stat-detail-actions">
                                    ${fileButton}

                                    <button
                                        type="button"
                                        class="table-action-button"
                                        data-detail-edit="${escapeHTML(record.id)}">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                        EDIT
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join("");

                elements.statDetailsList
                    .querySelectorAll("[data-detail-edit]")
                    .forEach(function (button) {
                        button.addEventListener("click", function () {
                            const recordId = this.dataset.detailEdit;

                            closeModal("statDetailsModal");
                            openEditModal(recordId);
                        });
                    });
            }
        }

        openModal("statDetailsModal");
    }

        /* =====================================================
       EDIT ORDINANCE MODAL
    ===================================================== */

    function openEditModal(recordId) {
        const record = ordinances.find(function (item) {
            return item.id === recordId;
        });

        if (!record) {
            showToast("Ordinance record not found.", "error");
            return;
        }

        elements.editRecordId.value = record.id;
        elements.editOrdinanceTitle.value = record.title;
        elements.editSpNumber.value = record.spNumber;
        elements.editOrdinanceAuthor.value = record.author;
        elements.editReadingStage.value = record.stage;

        if (elements.editOrdinanceFile) {
            elements.editOrdinanceFile.value = "";
        }

        openModal("editOrdinanceModal");
    }


    /* =====================================================
       SAVE EDITED ORDINANCE
    ===================================================== */

    if (elements.editOrdinanceForm) {
        elements.editOrdinanceForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const recordId = elements.editRecordId.value;

            const recordIndex = ordinances.findIndex(function (record) {
                return record.id === recordId;
            });

            if (recordIndex === -1) {
                showToast("Unable to find the selected ordinance.", "error");
                return;
            }

            const title = elements.editOrdinanceTitle.value.trim();
            const spNumber = elements.editSpNumber.value.trim();
            const author = elements.editOrdinanceAuthor.value.trim();
            const stage = elements.editReadingStage.value;

            const replacementFile = elements.editOrdinanceFile
                ? elements.editOrdinanceFile.files[0]
                : null;

            if (!title || !spNumber || !author) {
                showToast("Please complete all required fields.", "error");
                return;
            }

            const duplicate = ordinances.some(function (record) {
                return (
                    record.id !== recordId &&
                    String(record.spNumber || "").toLowerCase() ===
                    spNumber.toLowerCase()
                );
            });

            if (duplicate) {
                showToast("Another ordinance already uses this SP number.", "error");
                return;
            }

            if (replacementFile && !isValidPDF(replacementFile)) {
                showToast("Please select a valid PDF file.", "error");
                return;
            }

            const oldRecord = { ...ordinances[recordIndex] };

            const updatedRecord = {
                ...ordinances[recordIndex],
                title: title,
                spNumber: spNumber,
                author: author,
                stage: stage
            };

            if (replacementFile) {
                releasePDFObjectURL(recordId);

                pdfObjectUrls.set(
                    recordId,
                    URL.createObjectURL(replacementFile)
                );

                updatedRecord.fileName = replacementFile.name;
            }

            ordinances[recordIndex] = updatedRecord;

            if (!saveRecords()) {
                ordinances[recordIndex] = oldRecord;
                return;
            }

            renderDashboard();
            closeModal("editOrdinanceModal");

            showToast("Ordinance information updated successfully.");
        });
    }


    /* =====================================================
       LIVE AGENT INBOX
       The officer manually replies to anonymous visitor inquiries.
       No AI or automatic response is generated here.
    ===================================================== */

    function createInquiryReference() {
        const year = new Date().getFullYear();
        const prefix = "OSSP-" + year + "-";
        let highest = 0;

        inquiries.forEach(function (inquiry) {
            const match = String(inquiry.id || "").match(/OSSP-\d{4}-(\d+)/);

            if (match) {
                highest = Math.max(highest, Number(match[1]));
            }
        });

        return prefix + String(highest + 1).padStart(4, "0");
    }


    function updateNotificationCount() {
        const unreadCount = inquiries.filter(function (inquiry) {
            return !inquiry.read && inquiry.status !== "Resolved";
        }).length;

        if (elements.notificationCount) {
            elements.notificationCount.textContent = unreadCount;

            elements.notificationCount.style.display =
                unreadCount > 0 ? "grid" : "none";
        }

        if (elements.inboxCount) {
            elements.inboxCount.textContent = inquiries.length;
        }
    }


    function getLatestInquiryMessage(inquiry) {
        const messages = Array.isArray(inquiry.messages)
            ? inquiry.messages
            : [];

        return messages.length
            ? messages[messages.length - 1]
            : null;
    }


    function renderInquiryList() {
        if (!elements.conversationList) return;

        if (inquiries.length === 0) {
            elements.conversationList.innerHTML = `
                <div class="inbox-list-empty">
                    <i class="fa-regular fa-envelope-open"></i>
                    <strong>No visitor inquiries yet</strong>
                    <span>New anonymous questions will appear here.</span>
                </div>
            `;

            updateNotificationCount();
            return;
        }

        const sorted = [...inquiries].sort(function (a, b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        elements.conversationList.innerHTML = sorted.map(function (inquiry) {
            const latest = getLatestInquiryMessage(inquiry);

            const preview = latest
                ? latest.message
                : "No message content";

            const selected = inquiry.id === activeInquiryId
                ? " selected"
                : "";

            const unread = !inquiry.read && inquiry.status !== "Resolved"
                ? " unread"
                : "";

            return `
                <button
                    type="button"
                    class="conversation-item${selected}${unread}"
                    data-inquiry-id="${escapeHTML(inquiry.id)}">

                    <span class="conversation-item-top">
                        <strong>${escapeHTML(inquiry.id || "Unassigned inquiry")}</strong>
                        <small>${formatDate(inquiry.updatedAt)}</small>
                    </span>

                    <span class="conversation-preview">
                        ${escapeHTML(preview)}
                    </span>

                    <span class="conversation-item-bottom">
                        <small>Anonymous visitor</small>

                        <span class="mini-status ${
                            inquiry.status === "Resolved"
                                ? "resolved"
                                : inquiry.status === "Replied"
                                    ? "replied"
                                    : "open"
                        }">
                            ${escapeHTML(inquiry.status || "Open")}
                        </span>
                    </span>
                </button>
            `;
        }).join("");

        elements.conversationList
            .querySelectorAll("[data-inquiry-id]")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    selectInquiry(this.dataset.inquiryId);
                });
            });

        updateNotificationCount();
    }


    function renderActiveInquiry() {
        const inquiry = inquiries.find(function (item) {
            return item.id === activeInquiryId;
        });

        if (!inquiry) {
            if (elements.inboxEmpty) {
                elements.inboxEmpty.hidden = false;
            }

            if (elements.activeConversation) {
                elements.activeConversation.hidden = true;
            }

            return;
        }

        if (elements.inboxEmpty) {
            elements.inboxEmpty.hidden = true;
        }

        if (elements.activeConversation) {
            elements.activeConversation.hidden = false;
        }

        if (elements.visitorConversationId) {
            elements.visitorConversationId.textContent = inquiry.id;
        }

        if (elements.visitorConversationMeta) {
            elements.visitorConversationMeta.textContent =
                "Received " + formatDate(inquiry.createdAt);
        }

        if (elements.visitorConversationStatus) {
            elements.visitorConversationStatus.textContent =
                String(inquiry.status || "Open").toUpperCase();

            elements.visitorConversationStatus.className =
                "conversation-status " +
                String(inquiry.status || "Open").toLowerCase();
        }

        if (elements.resolveInquiryButton) {
            elements.resolveInquiryButton.textContent =
                inquiry.status === "Resolved"
                    ? "REOPEN INQUIRY"
                    : "MARK RESOLVED";
        }

        if (elements.chatDialogMessages) {
            const messages = Array.isArray(inquiry.messages)
                ? inquiry.messages
                : [];

            if (messages.length === 0) {
                elements.chatDialogMessages.innerHTML = `
                    <div class="inbox-list-empty">
                        This inquiry has no messages yet.
                    </div>
                `;
            } else {
                elements.chatDialogMessages.innerHTML =
                    messages.map(function (message) {
                        const isOfficer = message.sender === "officer";

                        return `
                            <div class="chat-bubble ${
                                isOfficer
                                    ? "chat-bubble-user"
                                    : "chat-bubble-assistant"
                            }">

                                <strong>
                                    ${isOfficer
                                        ? "OSSP Officer"
                                        : "Anonymous Visitor"}
                                </strong>

                                <p>${escapeHTML(message.message || "")}</p>

                                <time>
                                    ${formatTime(
                                        message.time ||
                                        message.createdAt ||
                                        new Date().toISOString()
                                    )}
                                </time>

                            </div>
                        `;
                    }).join("");

                elements.chatDialogMessages.scrollTop =
                    elements.chatDialogMessages.scrollHeight;
            }
        }
    }


    function selectInquiry(inquiryId) {
        activeInquiryId = inquiryId;

        const inquiry = inquiries.find(function (item) {
            return item.id === inquiryId;
        });

        if (inquiry) {
            inquiry.read = true;

            if (!saveInquiries()) return;
        }

        renderInquiryList();
        renderActiveInquiry();
        updateNotificationCount();

        if (elements.chatReplyInput) {
            elements.chatReplyInput.focus();
        }
    }


    function renderChatMessages() {
        renderInquiryList();
        renderActiveInquiry();
    }


    /* =====================================================
       OPEN LIVE AGENT INBOX
    ===================================================== */

    if (elements.notificationButton) {
        elements.notificationButton.addEventListener("click", function () {
            renderChatMessages();
            openModal("chatModal");
        });
    }


    /* =====================================================
       MANUAL OFFICER REPLY
    ===================================================== */

    if (elements.chatReplyForm) {
        elements.chatReplyForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const reply = elements.chatReplyInput.value.trim();

            if (!reply || !activeInquiryId) {
                showToast(
                    "Select a visitor inquiry before replying.",
                    "error"
                );

                return;
            }

            const inquiry = inquiries.find(function (item) {
                return item.id === activeInquiryId;
            });

            if (!inquiry) {
                showToast(
                    "This visitor inquiry could not be found.",
                    "error"
                );

                return;
            }

            inquiry.messages = Array.isArray(inquiry.messages)
                ? inquiry.messages
                : [];

            inquiry.messages.push({
                sender: "officer",
                message: reply,
                time: new Date().toISOString()
            });

            inquiry.status = "Replied";
            inquiry.updatedAt = new Date().toISOString();
            inquiry.read = true;

            if (!saveInquiries()) return;

            elements.chatReplyInput.value = "";

            renderChatMessages();

            showToast("Your reply has been added to the inquiry.");
        });
    }


    /* =====================================================
       RESOLVE / REOPEN INQUIRY
    ===================================================== */

    if (elements.resolveInquiryButton) {
        elements.resolveInquiryButton.addEventListener("click", function () {
            const inquiry = inquiries.find(function (item) {
                return item.id === activeInquiryId;
            });

            if (!inquiry) return;

            inquiry.status = inquiry.status === "Resolved"
                ? "Open"
                : "Resolved";

            inquiry.updatedAt = new Date().toISOString();
            inquiry.read = true;

            if (!saveInquiries()) return;

            renderChatMessages();

            showToast(
                inquiry.status === "Resolved"
                    ? "Inquiry marked as resolved."
                    : "Inquiry reopened."
            );
        });
    }


    /* =====================================================
       LOGOUT PROCESS
    ===================================================== */

    const logoutButton =
        document.getElementById("logoutButton");

    const continueLogout =
        document.getElementById("continueLogout");

    const confirmLogout =
        document.getElementById("confirmLogout");


    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            openModal("logoutModal");
        });
    }


    if (continueLogout) {
        continueLogout.addEventListener("click", function () {
            closeModal("logoutModal");
            openModal("confirmLogoutModal");
        });
    }


    if (confirmLogout) {
        confirmLogout.addEventListener("click", function () {
            closeAllModals();
            window.location.href = "login.html";
        });
    }


    /* =====================================================
       CLEANUP TEMPORARY PDF URLS
    ===================================================== */

    window.addEventListener("beforeunload", function () {
        pdfObjectUrls.forEach(function (url) {
            URL.revokeObjectURL(url);
        });

        pdfObjectUrls.clear();
    });


    /* =====================================================
       INITIALIZE DASHBOARD
    ===================================================== */

    renderDashboard();

    renderChatMessages();

    updateNotificationCount();

    console.log("OSSP-TOM Dashboard initialized successfully.");

});