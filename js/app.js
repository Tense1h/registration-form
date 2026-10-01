const STUDENT_NUMBER_PATTERN = /^\d{2}-\d{4}-\d{3}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^(09|\+639)\d{9}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!])\S{8,}$/;
 

 
function isValidStudentNumber(value) {
  return typeof value === "string" && STUDENT_NUMBER_PATTERN.test(value.trim());
}
 
function isValidPassword(value) {
  return typeof value === "string" && PASSWORD_PATTERN.test(value);
}
 
function isValidEmail(value) {
  return typeof value === "string" && EMAIL_PATTERN.test(value.trim());
}
 
function isValidMobileNumber(value) {
  return typeof value === "string" && MOBILE_PATTERN.test(value.trim());
}
 
function isValidFullName(value) {
  return typeof value === "string" && value.trim().length >= 2;
}
 
 
if (typeof document !== "undefined") {
  const form = document.getElementById("registrationForm");
  const fields = {
    fullName: document.getElementById("fullName"),
    studentNumber: document.getElementById("studentNumber"),
    email: document.getElementById("email"),
    mobileNumber: document.getElementById("mobileNumber"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    course: document.getElementById("course"),
    terms: document.getElementById("terms")
  };
  const passwordFeedback = document.getElementById("passwordFeedback");
  const successMessage = document.getElementById("successMessage");
  const registrationSummary = document.getElementById("registrationSummary");
 
  const checks = {
    fullName: function () {
      return isValidFullName(fields.fullName.value)
        ? "" : "Enter your full name (at least 2 characters).";
    },
    studentNumber: function () {
      return isValidStudentNumber(fields.studentNumber.value)
        ? "" : "Enter a student number in the format 24-1234-123.";
    },
    email: function () {
      return isValidEmail(fields.email.value)
        ? "" : "Enter a valid email address, such as student@email.com.";
    },
    mobileNumber: function () {
      return isValidMobileNumber(fields.mobileNumber.value)
        ? "" : "Enter a mobile number as 09XXXXXXXXX or +639XXXXXXXXX, with no spaces or hyphens.";
    },
    password: function () {
      return isValidPassword(fields.password.value)
        ? "" : "Password must be at least 8 characters with an uppercase letter, a digit, and one of @, $, or !, and no spaces.";
    },
    confirmPassword: function () {
      if (fields.confirmPassword.value === "") return "Confirm your password.";
      return fields.confirmPassword.value === fields.password.value
        ? "" : "Passwords do not match.";
    },
    course: function () {
      const value = fields.course.value;
      return value === "BSIT" || value === "BSCS" ? "" : "Select BSIT or BSCS.";
    },
    terms: function () {
      return fields.terms.checked ? "" : "You must agree to the terms to register.";
    }
  };
 
  function showError(name, message) {
    const errorEl = document.getElementById(name + "Error");
    errorEl.textContent = message;
    fields[name].setAttribute("aria-invalid", message ? "true" : "false");
  }
 
  function validateField(name) {
    const message = checks[name]();
    showError(name, message);
    return message === "";
  }
 
  function describePassword(value) {
    const missing = [];
    if (value.length < 8) missing.push("at least 8 characters");
    if (!/[A-Z]/.test(value)) missing.push("an uppercase letter");
    if (!/\d/.test(value)) missing.push("a digit");
    if (!/[@$!]/.test(value)) missing.push("one of @, $, or !");
    if (/\s/.test(value)) missing.push("no spaces");
    return missing;
  }
 
  function updatePasswordFeedback() {
    const value = fields.password.value;
    if (value === "") {
      passwordFeedback.textContent = "";
      passwordFeedback.classList.remove("met");
      return;
    }
    const missing = describePassword(value);
    if (missing.length === 0) {
      passwordFeedback.textContent = "Password meets all requirements.";
      passwordFeedback.classList.add("met");
    } else {
      passwordFeedback.textContent = "Password still needs: " + missing.join(", ") + ".";
      passwordFeedback.classList.remove("met");
    }
  }
 
  function clearOutput() {
    successMessage.textContent = "";
    registrationSummary.hidden = true;
    ["summaryName", "summaryStudentNumber", "summaryEmail",
     "summaryMobileNumber", "summaryCourse"].forEach(function (id) {
      document.getElementById(id).textContent = "";
    });
  }
 
  function showSummary() {
    document.getElementById("summaryName").textContent = fields.fullName.value.trim();
    document.getElementById("summaryStudentNumber").textContent = fields.studentNumber.value.trim();
    document.getElementById("summaryEmail").textContent = fields.email.value.trim();
    document.getElementById("summaryMobileNumber").textContent = fields.mobileNumber.value.trim();
    document.getElementById("summaryCourse").textContent = fields.course.value;
    successMessage.textContent = "Registration details validated successfully!";
    registrationSummary.hidden = false;
  }
 
  function handleSubmit(event) {
    event.preventDefault();
    clearOutput();
    let allValid = true;
    Object.keys(checks).forEach(function (name) {
      if (!validateField(name)) allValid = false;
    });
    if (allValid) {
      showSummary();
    } else {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  }
 
  function handleReset() {
    Object.keys(fields).forEach(function (name) {
      document.getElementById(name + "Error").textContent = "";
      fields[name].removeAttribute("aria-invalid");
    });
    passwordFeedback.textContent = "";
    passwordFeedback.classList.remove("met");
    clearOutput();
  }

  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", handleReset);
 
  fields.password.addEventListener("input", function () {
    updatePasswordFeedback();
    if (fields.confirmPassword.value !== "") validateField("confirmPassword");
  });
  fields.fullName.addEventListener("blur", function () { validateField("fullName"); });
  fields.course.addEventListener("change", function () { validateField("course"); });
  fields.terms.addEventListener("change", function () { validateField("terms"); });
 
  ["studentNumber", "email", "mobileNumber", "password", "confirmPassword"].forEach(function (name) {
    fields[name].addEventListener("input", function () {
      if (fields[name].getAttribute("aria-invalid") === "true") validateField(name);
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}
