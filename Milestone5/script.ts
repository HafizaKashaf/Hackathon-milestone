const form = document.getElementById('resume-form') as HTMLFormElement | null;
const resumeDisplayElement = document.getElementById('resume-display') as HTMLDivElement | null;
const shareBtn = document.createElement('button');
const downloadBtn = document.createElement('button');

shareBtn.textContent = "Share Resume";
downloadBtn.textContent = "Download Resume";

[shareBtn, downloadBtn].forEach((btn) => {
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
} else {
    form.addEventListener("submit", (event: Event) => {
        event.preventDefault();

        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const education = (document.getElementById('education') as HTMLTextAreaElement).value;
        const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
        const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;

        const resumeData = { name, email, phone, education, experience, skills };
        const encodedData = encodeURIComponent(JSON.stringify(resumeData));
        const shareableLink = `${window.location.origin}${window.location.pathname}?resume=${encodedData}`;

        const resumeContent = `
            <h2><b>Editable Resume</b></h2>
            <h3>Personal Information</h3>
            <p><b>Name:</b> <span contenteditable="true">${name}</span></p>
            <p><b>Email:</b> <span contenteditable="true">${email}</span></p>
            <p><b>Phone:</b> <span contenteditable="true">${phone}</span></p>
            <h3>Education</h3>
            <p contenteditable="true">${education}</p>
            <h3>Experience</h3>
            <p contenteditable="true">${experience}</p>
            <h3>Skills</h3>
            <p contenteditable="true">${skills}</p>
            <p><b>Sharable Link:</b> <a href="${shareableLink}" target="_blank">${shareableLink}</a></p>
        `;

        resumeDisplayElement.innerHTML = resumeContent;

        // Save to local storage
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
    });

    // Load Resume from URL (if shared)
    const urlParams = new URLSearchParams(window.location.search);
    const resumeParam = urlParams.get("resume");

    if (resumeParam) {
        try {
            const resumeData = JSON.parse(decodeURIComponent(resumeParam));
            resumeDisplayElement.innerHTML = `
                <h2><b>Editable Resume</b></h2>
                <h3>Personal Information</h3>
                <p><b>Name:</b> <span contenteditable="true">${resumeData.name}</span></p>
                <p><b>Email:</b> <span contenteditable="true">${resumeData.email}</span></p>
                <p><b>Phone:</b> <span contenteditable="true">${resumeData.phone}</span></p>
                <h3>Education</h3>
                <p contenteditable="true">${resumeData.education}</p>
                <h3>Experience</h3>
                <p contenteditable="true">${resumeData.experience}</p>
                <h3>Skills</h3>
                <p contenteditable="true">${resumeData.skills}</p>
            `;
        } catch (error) {
            console.error("Error loading shared resume:", error);
        }
    }

    // Shareable link button functionality
    shareBtn.addEventListener("click", () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            alert("Sharable link copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy link:", err);
        });
    });

    // Download resume as a text file
    downloadBtn.addEventListener("click", () => {
        const resumeText = resumeDisplayElement.innerText;
        const blob = new Blob([resumeText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "resume.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
