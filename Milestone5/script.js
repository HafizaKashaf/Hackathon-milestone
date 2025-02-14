var form = document.getElementById('resume-form');
var resumeDisplayElement = document.getElementById('resume-display');
var shareBtn = document.createElement('button');
var downloadBtn = document.createElement('button');
shareBtn.textContent = "Share Resume";
downloadBtn.textContent = "Download Resume";
[shareBtn, downloadBtn].forEach(function (btn) {
    btn.style.display = "block";
    btn.style.margin = "10px auto";
    btn.style.padding = "10px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
});
document.body.appendChild(shareBtn);
document.body.appendChild(downloadBtn);
if (!form || !resumeDisplayElement) {
    console.error("Form or Resume Display element not found!");
}
else {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var education = document.getElementById('education').value;
        var experience = document.getElementById('experience').value;
        var skills = document.getElementById('skills').value;
        var resumeData = { name: name, email: email, phone: phone, education: education, experience: experience, skills: skills };
        var encodedData = encodeURIComponent(JSON.stringify(resumeData));
        var shareableLink = "".concat(window.location.origin).concat(window.location.pathname, "?resume=").concat(encodedData);
        var resumeContent = "\n            <h2><b>Editable Resume</b></h2>\n            <h3>Personal Information</h3>\n            <p><b>Name:</b> <span contenteditable=\"true\">".concat(name, "</span></p>\n            <p><b>Email:</b> <span contenteditable=\"true\">").concat(email, "</span></p>\n            <p><b>Phone:</b> <span contenteditable=\"true\">").concat(phone, "</span></p>\n            <h3>Education</h3>\n            <p contenteditable=\"true\">").concat(education, "</p>\n            <h3>Experience</h3>\n            <p contenteditable=\"true\">").concat(experience, "</p>\n            <h3>Skills</h3>\n            <p contenteditable=\"true\">").concat(skills, "</p>\n            <p><b>Sharable Link:</b> <a href=\"").concat(shareableLink, "\" target=\"_blank\">").concat(shareableLink, "</a></p>\n        ");
        resumeDisplayElement.innerHTML = resumeContent;
        // Save to local storage
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
    });
    // Load Resume from URL (if shared)
    var urlParams = new URLSearchParams(window.location.search);
    var resumeParam = urlParams.get("resume");
    if (resumeParam) {
        try {
            var resumeData = JSON.parse(decodeURIComponent(resumeParam));
            resumeDisplayElement.innerHTML = "\n                <h2><b>Editable Resume</b></h2>\n                <h3>Personal Information</h3>\n                <p><b>Name:</b> <span contenteditable=\"true\">".concat(resumeData.name, "</span></p>\n                <p><b>Email:</b> <span contenteditable=\"true\">").concat(resumeData.email, "</span></p>\n                <p><b>Phone:</b> <span contenteditable=\"true\">").concat(resumeData.phone, "</span></p>\n                <h3>Education</h3>\n                <p contenteditable=\"true\">").concat(resumeData.education, "</p>\n                <h3>Experience</h3>\n                <p contenteditable=\"true\">").concat(resumeData.experience, "</p>\n                <h3>Skills</h3>\n                <p contenteditable=\"true\">").concat(resumeData.skills, "</p>\n            ");
        }
        catch (error) {
            console.error("Error loading shared resume:", error);
        }
    }
    // Shareable link button functionality
    shareBtn.addEventListener("click", function () {
        var currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(function () {
            alert("Sharable link copied to clipboard!");
        }).catch(function (err) {
            console.error("Failed to copy link:", err);
        });
    });
    // Download resume as a text file
    downloadBtn.addEventListener("click", function () {
        var resumeText = resumeDisplayElement.innerText;
        var blob = new Blob([resumeText], { type: "text/plain" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "resume.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
