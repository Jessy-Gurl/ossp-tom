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
    const CHAT_STORAGE_KEY = "osspTomMessages";

    let ordinances = loadRecords();
    let chatMessages = loadMessages();

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

            if (!saved) {
                return [];
            }

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


    function loadMessages() {

        try {

            const saved = localStorage.getItem(CHAT_STORAGE_KEY);

            if (!saved) {

                return [
                    {
                        id: createId(),
                        sender: "assistant",
                        name: "OSSP-TOM Assistant",
                        message: "Welcome to OSSP-TOM! How can I assist you today?",
                        time: new Date().toISOString()
                    },
                    {
                        id: createId(),
                        sender: "assistant",
                        name: "OSSP-TOM Assistant",
                        message: "You can send a message here to try the dashboard chat demonstration.",
                        time: new Date().toISOString()
                    }
                ];

            }

            const parsed = JSON.parse(saved);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            console.error("Unable to load chat messages:", error);

            return [];

        }
    }


    function saveMessages() {

        try {

            localStorage.setItem(
                CHAT_STORAGE_KEY,
                JSON.stringify(chatMessages)
            );

        } catch (error) {

            console.error("Unable to save chat messages:", error);

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

        if (!dateValue) {
            return "N/A";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

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

        if (!elements.toast) {
            return;
        }

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

        if (!elements.officerName) {
            return;
        }

        const savedName =
            localStorage.getItem("osspOfficerName");

        if (savedName) {

            elements.officerName.textContent =
                "Welcome, " + savedName;

        }

    }


    loadOfficerName();


    /* =====================================================
       MODAL FUNCTIONS
    ===================================================== */

    function openModal(modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) {
            return;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

    }


    function closeModal(modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) {
            return;
        }

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


    // Close buttons and modal backdrops.

    document.querySelectorAll("[data-close]").forEach(function (button) {

        button.addEventListener("click", function () {

            closeModal(button.dataset.close);

        });

    });


    // Escape key closes the topmost active modal.

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") {
            return;
        }

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

        if (!file) {
            return false;
        }

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

                return record.spNumber.toLowerCase() === spNumber.toLowerCase();

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

            // Create a temporary PDF URL for the current browser session.
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
                    record.title.toLowerCase().includes(searchTerm) ||
                    record.spNumber.toLowerCase().includes(searchTerm) ||
                    record.author.toLowerCase().includes(searchTerm) ||
                    record.stage.toLowerCase().includes(searchTerm)
                );

            });

        }

        return filtered;

    }


    function renderTable() {

        if (!elements.ordinanceTable) {
            return;
        }

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


        // Attach edit events after rendering.

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
                    record.spNumber.toLowerCase() === spNumber.toLowerCase()
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
       CHAT MESSAGE SYSTEM
    ===================================================== */

    function updateNotificationCount() {

        if (!elements.notificationCount) {
            return;
        }

        const unreadCount = chatMessages.filter(function (message) {

            return message.sender === "assistant" && !message.read;

        }).length;

        elements.notificationCount.textContent = unreadCount;

        elements.notificationCount.style.display =
            unreadCount > 0 ? "grid" : "none";

    }


    function renderChatMessages() {

        if (!elements.chatDialogMessages) {
            return;
        }

        if (chatMessages.length === 0) {

            elements.chatDialogMessages.innerHTML = `
                <div class="stat-details-empty">
                    <i class="fa-regular fa-message"></i>
                    <strong>No messages yet</strong>
                    <span>Start a conversation by sending a message.</span>
                </div>
            `;

            return;

        }


        elements.chatDialogMessages.innerHTML =
            chatMessages.map(function (message) {

                const isUser = message.sender === "user";

                const bubbleClass = isUser
                    ? "chat-bubble-user"
                    : "chat-bubble-assistant";

                const senderName = isUser
                    ? "You"
                    : "OSSP-TOM Assistant";

                return `
                    <div class="chat-bubble ${bubbleClass}">

                        <strong>${senderName}</strong>

                        <p>${escapeHTML(message.message)}</p>

                        <time>
                            ${formatTime(message.time)}
                        </time>

                    </div>
                `;

            }).join("");


        elements.chatDialogMessages.scrollTop =
            elements.chatDialogMessages.scrollHeight;

    }


    function markMessagesAsRead() {

        chatMessages = chatMessages.map(function (message) {

            if (message.sender === "assistant") {

                return {
                    ...message,
                    read: true
                };

            }

            return message;

        });

        saveMessages();

        updateNotificationCount();

    }


    /* =====================================================
       OPEN CHAT PANEL
    ===================================================== */

    if (elements.notificationButton) {

        elements.notificationButton.addEventListener("click", function () {

            markMessagesAsRead();

            renderChatMessages();

            openModal("chatModal");

            if (elements.chatReplyInput) {

                setTimeout(function () {

                    elements.chatReplyInput.focus();

                }, 150);

            }

        });

    }


    /* =====================================================
       SEND CHAT MESSAGE
    ===================================================== */

    if (elements.chatReplyForm) {

        elements.chatReplyForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message = elements.chatReplyInput.value.trim();

            if (!message) {
                return;
            }


            const userMessage = {

                id: createId(),

                sender: "user",

                message: message,

                time: new Date().toISOString()

            };


            chatMessages.push(userMessage);

            saveMessages();

            elements.chatReplyInput.value = "";

            renderChatMessages();


            // DEMO RESPONSE
            // This is not a live AI connection.

            setTimeout(function () {

                const assistantMessage = {

                    id: createId(),

                    sender: "assistant",

                    message:
                        "Thank you for your message. Your response has been recorded in this OSSP-TOM demonstration. For actual assistance, please coordinate with the authorized OSSP personnel.",

                    time: new Date().toISOString(),

                    read: false

                };


                chatMessages.push(assistantMessage);

                saveMessages();

                renderChatMessages();

                updateNotificationCount();

            }, 900);

        });

    }


    /* =====================================================
       LOGOUT PROCESS
    ===================================================== */

    const logoutButton = document.getElementById("logoutButton");

    const continueLogout = document.getElementById("continueLogout");

    const confirmLogout = document.getElementById("confirmLogout");


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