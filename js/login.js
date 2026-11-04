/* ==========================================================
   OSSP-TOM OFFICER PORTAL
   Officer Sign In, Access Requests & Forgot Password
   ========================================================== */

/*
   SECURITY NOTE:
   Authentication, account approval, OTP generation,
   email delivery, and password changes must be handled
   securely by the server.
*/

const API_ENDPOINTS = {
    login: "/api/auth/login",
    accessRequest: "/api/auth/access-request",
    requestPasswordReset: "/api/auth/password-reset/request",
    verifyPasswordReset: "/api/auth/password-reset/verify",
    completePasswordReset: "/api/auth/password-reset/complete"
};

const OFFICIAL_EMAIL_DOMAIN = "@quezoncity.gov.ph";


/* ==========================================================
   ELEMENT REFERENCES
   ========================================================== */

const loginTab = document.getElementById("loginTab");
const accessTab = document.getElementById("accessTab");

const loginForm = document.getElementById("loginForm");
const accessForm = document.getElementById("accessForm");

const forgotModal = document.getElementById("forgotModal");
const toast = document.getElementById("toast");


/* ==========================================================
   GLOBAL VARIABLES
   ========================================================== */

let toastTimer = null;
let resetEmailAddress = "";
let resetToken = "";
let resendAvailableAt = 0;


/* ==========================================================
   TOAST NOTIFICATION
   ========================================================== */

function showToast(message, type = "info") {

    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}


/* ==========================================================
   OFFICIAL GOVERNMENT EMAIL VALIDATION
   ========================================================== */

function isOfficialEmail(email) {

    return /^[^\s@]+@quezoncity\.gov\.ph$/i.test(
        email.trim()
    );

}


/* ==========================================================
   API CONNECTION
   ========================================================== */

async function postJSON(url, payload) {

    let response;

    try {

        response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            credentials: "same-origin",

            body: JSON.stringify(payload)

        });

    } catch (error) {

        throw new Error(
            "The OSSP-TOM authentication service could not be reached. Please try again later."
        );

    }


    const contentType =
        response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : {};


    if (!response.ok || data.success === false) {

        throw new Error(
            data.message ||
            "The request could not be completed. Please check your details and try again."
        );

    }

    return data;

}


/* ==========================================================
   BUTTON LOADING STATE
   ========================================================== */

function setButtonLoading(button, loadingText, isLoading) {

    if (!button) return;

    if (!button.dataset.originalText) {

        button.dataset.originalText =
            button.textContent.trim();

    }

    button.disabled = isLoading;

    button.textContent = isLoading
        ? loadingText
        : button.dataset.originalText;

}


/* ==========================================================
   SWITCH BETWEEN OFFICER SIGN IN AND ACCESS REQUEST
   ========================================================== */

function switchAuth(mode) {

    const showLogin = mode === "login";

    loginTab.classList.toggle("active", showLogin);
    accessTab.classList.toggle("active", !showLogin);

    loginTab.setAttribute(
        "aria-selected",
        String(showLogin)
    );

    accessTab.setAttribute(
        "aria-selected",
        String(!showLogin)
    );

    loginForm.classList.toggle("active", showLogin);
    accessForm.classList.toggle("active", !showLogin);


    document.getElementById("formTitle").textContent =
        showLogin
            ? "Welcome back, Officer"
            : "Request Officer Access";


    document.getElementById("formSubtitle").textContent =
        showLogin

            ? "Sign in using your officially assigned Quezon City Government account to access ordinance uploading and legislative record management."

            : "Submit your official details for verification. Access requests must be reviewed and approved by an authorized OSSP administrator.";

}


loginTab.addEventListener("click", () => {
    switchAuth("login");
});

accessTab.addEventListener("click", () => {
    switchAuth("access");
});


/* ==========================================================
   PASSWORD VISIBILITY
   ========================================================== */

document.querySelectorAll(
    "[data-toggle-password]"
).forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(
            button.dataset.togglePassword
        );

        if (!input) return;

        const isVisible = input.type === "text";

        input.type = isVisible
            ? "password"
            : "text";

        button.setAttribute(
            "aria-label",
            isVisible ? "Show password" : "Hide password"
        );

    });

});


/* ==========================================================
   REMEMBER EMAIL ADDRESS
   Never remember or save the password.
   ========================================================== */

const savedEmail = localStorage.getItem(
    "osspTomOfficerEmail"
);

if (savedEmail) {

    document.getElementById("loginEmail").value =
        savedEmail;

    document.getElementById("rememberMe").checked =
        true;

}


/* ==========================================================
   OFFICER SIGN IN
   ========================================================== */

loginForm.addEventListener("submit", async event => {

    event.preventDefault();

    const email = document
        .getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("loginPassword")
        .value;

    const remember = document
        .getElementById("rememberMe")
        .checked;

    const button = document.getElementById(
        "loginButton"
    );


    if (!isOfficialEmail(email)) {

        showToast(
            "Use your officially assigned @quezoncity.gov.ph email address.",
            "error"
        );

        return;

    }


    if (!password) {

        showToast(
            "Please enter your password.",
            "error"
        );

        return;

    }


    setButtonLoading(
        button,
        "SIGNING IN...",
        true
    );


    try {

        const result = await postJSON(
            API_ENDPOINTS.login,
            {
                email,
                password
            }
        );


        if (remember) {

            localStorage.setItem(
                "osspTomOfficerEmail",
                email
            );

        } else {

            localStorage.removeItem(
                "osspTomOfficerEmail"
            );

        }


        if (result.redirectUrl) {

            window.location.assign(
                result.redirectUrl
            );

            return;

        }


        showToast(
            result.message || "Sign-in successful.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    } finally {

        setButtonLoading(
            button,
            "SIGNING IN...",
            false
        );

    }

});


/* ==========================================================
   REQUEST OFFICER ACCESS
   Requires OSSP administrator approval on the server.
   ========================================================== */

accessForm.addEventListener("submit", async event => {

    event.preventDefault();


    const payload = {

        fullName: document
            .getElementById("officerName")
            .value
            .trim(),

        email: document
            .getElementById("officerEmail")
            .value
            .trim()
            .toLowerCase(),

        division: document
            .getElementById("officerDivision")
            .value,

        position: document
            .getElementById("officerPosition")
            .value
            .trim()

    };


    const button = document.getElementById(
        "accessButton"
    );


    if (
        !payload.fullName ||
        !payload.division ||
        !payload.position
    ) {

        showToast(
            "Complete all required fields.",
            "error"
        );

        return;

    }


    if (!isOfficialEmail(payload.email)) {

        showToast(
            "Use your officially assigned @quezoncity.gov.ph email address.",
            "error"
        );

        return;

    }


    setButtonLoading(
        button,
        "SUBMITTING...",
        true
    );


    try {

        const result = await postJSON(
            API_ENDPOINTS.accessRequest,
            payload
        );


        accessForm.reset();


        showToast(
            result.message ||
            "Your access request has been submitted for OSSP administrator review.",
            "success"
        );


        switchAuth("login");


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    } finally {

        setButtonLoading(
            button,
            "SUBMITTING...",
            false
        );

    }

});


/* ==========================================================
   FORGOT PASSWORD MODAL
   ========================================================== */

function openForgotModal() {

    const loginEmail = document
        .getElementById("loginEmail")
        .value
        .trim();


    document.getElementById("resetEmail").value =
        loginEmail;


    resetEmailAddress = "";
    resetToken = "";


    showResetStep("email");


    forgotModal.classList.add("open");

    forgotModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add("modal-open");


    window.setTimeout(() => {

        document.getElementById("resetEmail").focus();

    }, 40);

}


function closeForgotModal() {

    forgotModal.classList.remove("open");

    forgotModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("modal-open");

}


/* ==========================================================
   FORGOT PASSWORD MODAL STEPS
   ========================================================== */

function showResetStep(step) {

    document.querySelectorAll(
        ".modal-step"
    ).forEach(form => {

        form.classList.remove("active");

    });


    const stepIds = {

        email: "sendCodeForm",

        verify: "verifyCodeForm",

        password: "newPasswordForm"

    };


    document.getElementById(
        stepIds[step]
    ).classList.add("active");


    const descriptions = {

        email:
            "Enter your registered government email address. A verification code will be sent to your inbox.",

        verify:
            `A verification code was requested for ${resetEmailAddress}. Enter the code sent to your email.`,

        password:
            "Your email has been verified. Set a new password for your officer account."

    };


    document.getElementById(
        "forgotDescription"
    ).textContent = descriptions[step];

}


/* ==========================================================
   FORGOT PASSWORD EVENTS
   ========================================================== */

document
    .getElementById("forgotPasswordButton")
    .addEventListener("click", openForgotModal);


document.querySelectorAll(
    "[data-close-modal]"
).forEach(element => {

    element.addEventListener(
        "click",
        closeForgotModal
    );

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        forgotModal.classList.contains("open")
    ) {

        closeForgotModal();

    }

});


document
    .getElementById("backToEmail")
    .addEventListener("click", () => {

        showResetStep("email");

    });


/* ==========================================================
   REQUEST PASSWORD RESET CODE
   The server generates and emails the actual OTP.
   ========================================================== */

async function requestPasswordResetCode() {

    const email = document
        .getElementById("resetEmail")
        .value
        .trim()
        .toLowerCase();

    const button = document.getElementById(
        "sendCodeButton"
    );


    if (!isOfficialEmail(email)) {

        showToast(
            "Enter your official @quezoncity.gov.ph email address.",
            "error"
        );

        return;

    }


    if (Date.now() < resendAvailableAt) {

        const seconds = Math.ceil(
            (resendAvailableAt - Date.now()) / 1000
        );


        showToast(
            `Please wait ${seconds} seconds before requesting another code.`,
            "error"
        );

        return;

    }


    setButtonLoading(
        button,
        "SENDING CODE...",
        true
    );


    try {

        await postJSON(
            API_ENDPOINTS.requestPasswordReset,
            {
                email
            }
        );


        resetEmailAddress = email;


        resendAvailableAt =
            Date.now() + 60 * 1000;


        document.getElementById(
            "verificationCode"
        ).value = "";


        showResetStep("verify");


        showToast(
            "If the address is registered, a verification code has been sent.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    } finally {

        setButtonLoading(
            button,
            "SENDING CODE...",
            false
        );

    }

}


/* ==========================================================
   SEND VERIFICATION CODE
   ========================================================== */

document
    .getElementById("sendCodeForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        requestPasswordResetCode();

    });


/* ==========================================================
   RESEND VERIFICATION CODE
   ========================================================== */

document
    .getElementById("resendCodeButton")
    .addEventListener("click", () => {

        requestPasswordResetCode();

    });


/* ==========================================================
   VERIFY EMAIL CODE
   Server returns a short-lived reset token.
   ========================================================== */

document
    .getElementById("verifyCodeForm")
    .addEventListener("submit", async event => {

        event.preventDefault();


        const code = document
            .getElementById("verificationCode")
            .value
            .trim();


        if (!/^\d{6}$/.test(code)) {

            showToast(
                "Enter the six-digit verification code.",
                "error"
            );

            return;

        }


        const button =
            event.submitter ||
            document.querySelector(
                "#verifyCodeForm .primary-button"
            );


        setButtonLoading(
            button,
            "VERIFYING...",
            true
        );


        try {

            const result = await postJSON(
                API_ENDPOINTS.verifyPasswordReset,
                {
                    email: resetEmailAddress,
                    code
                }
            );


            if (!result.resetToken) {

                throw new Error(
                    "The verification service did not return a reset token. Please request a new code."
                );

            }


            resetToken = result.resetToken;


            showResetStep("password");


            showToast(
                "Email verified. You may now set a new password.",
                "success"
            );


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                setButtonLoading(
                    button,
                    "VERIFYING...",
                    false
                );

            }

        }

    });


/* ==========================================================
   COMPLETE PASSWORD RESET
   Password is updated securely on the server.
   ========================================================== */

document
    .getElementById("newPasswordForm")
    .addEventListener("submit", async event => {

        event.preventDefault();


        const password = document
            .getElementById("newPassword")
            .value;


        const confirm = document
            .getElementById("confirmNewPassword")
            .value;


        const button =
            event.submitter ||
            document.querySelector(
                "#newPasswordForm .primary-button"
            );


        if (password.length < 8) {

            showToast(
                "Your new password must contain at least 8 characters.",
                "error"
            );

            return;

        }


        if (password !== confirm) {

            showToast(
                "The new passwords do not match.",
                "error"
            );

            return;

        }


        if (!resetToken) {

            showToast(
                "Your verification session has expired. Request a new code.",
                "error"
            );


            showResetStep("email");

            return;

        }


        setButtonLoading(
            button,
            "UPDATING...",
            true
        );


        try {

            await postJSON(
                API_ENDPOINTS.completePasswordReset,
                {
                    email: resetEmailAddress,
                    resetToken,
                    newPassword: password
                }
            );


            document.getElementById(
                "newPasswordForm"
            ).reset();


            resetToken = "";


            closeForgotModal();


            document.getElementById(
                "loginEmail"
            ).value = resetEmailAddress;


            document.getElementById(
                "loginPassword"
            ).value = "";


            showToast(
                "Your password has been updated. Sign in with your new password.",
                "success"
            );


            showResetStep("email");


        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            if (button) {

                setButtonLoading(
                    button,
                    "UPDATING...",
                    false
                );

            }

        }

    });


/* ==========================================================
   LIVE DAY, DATE AND TIME
   PHILIPPINE TIME (ASIA/MANILA)
   ========================================================== */

function updateGovernmentDateTime() {

    const dayElement = document.getElementById(
        "currentDay"
    );

    const dateElement = document.getElementById(
        "currentDate"
    );

    const timeElement = document.getElementById(
        "currentTime"
    );


    // Prevent errors if the HTML elements are missing.

    if (
        !dayElement ||
        !dateElement ||
        !timeElement
    ) {

        return;

    }


    const now = new Date();

    const timeZone = "Asia/Manila";


    // CURRENT DAY

    const day = new Intl.DateTimeFormat("en-PH", {

        timeZone,

        weekday: "long"

    }).format(now);


    // CURRENT DATE

    const date = new Intl.DateTimeFormat("en-PH", {

        timeZone,

        month: "long",

        day: "numeric",

        year: "numeric"

    }).format(now);


    // CURRENT TIME WITH SECONDS

    const time = new Intl.DateTimeFormat("en-PH", {

        timeZone,

        hour: "numeric",

        minute: "2-digit",

        second: "2-digit",

        hour12: true

    }).format(now);


    // DISPLAY VALUES

    dayElement.textContent = day;

    dateElement.textContent = date;

    timeElement.textContent = time;

    timeElement.setAttribute(
        "datetime",
        now.toISOString()
    );

}


// UPDATE IMMEDIATELY

updateGovernmentDateTime();


// REFRESH EVERY SECOND

window.setInterval(
    updateGovernmentDateTime,
    1000
);


/* ==========================================================
   END OF OSSP-TOM OFFICER PORTAL JAVASCRIPT
   ========================================================== */