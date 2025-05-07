let allMembers = [];

const rollNoSelect = document.getElementById("roll_no");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last_name");
const phoneInput = document.getElementById("phone_no");
const addressInput = document.getElementById("address");

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const cropButton = document.getElementById("cropButton");

let cropper;

// Load members
const setMembers = (members) => {
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.roll_no;
    option.textContent = member.roll_no;
    rollNoSelect.appendChild(option);
  });
};

const fetchMembers = async () => {
  try {
    const res = await fetch("https://langar-db-csvv.onrender.com/member-full-details");
    const data = await res.json();
    if (Array.isArray(data)) {
      allMembers = data;
      setMembers(data);
    } else {
      console.error("Invalid data structure.");
    }
  } catch (err) {
    console.error("Error fetching members:", err);
  }
};

fetchMembers();

rollNoSelect.addEventListener("change", () => {
  const selectedRoll = Number(rollNoSelect.value);
  const selectedMember = allMembers.find((m) => m.roll_no === selectedRoll);

  if (selectedMember) {
    nameInput.value = selectedMember.name || "";
    lastNameInput.value = selectedMember.last_name || "";
    phoneInput.value = selectedMember.phone_no || "";
    addressInput.value = selectedMember.address || "";
  } else {
    nameInput.value = "";
    lastNameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
  }
});

// Image cropper
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.src = reader.result;
    imagePreviewContainer.style.display = "block";

    if (cropper) cropper.destroy();

    cropper = new Cropper(imagePreview, {
      aspectRatio: 1,
      viewMode: 1,
      responsive: true,
      scalable: true,
      zoomable: true,
      movable: true,
      dragMode: 'move',
      background: false,
      autoCropArea: 1,
      toggleDragModeOnDblclick: false,
    });
  };
  reader.readAsDataURL(file);
});

cropButton.addEventListener("click", () => {
  if (!cropper) return;

  cropper.getCroppedCanvas().toBlob((blob) => {
    const croppedFile = new File([blob], "cropped-image.png", { type: "image/png" });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(croppedFile);
    imageUpload.files = dataTransfer.files;

    cropper.destroy();
    cropper = null;

    const previewURL = URL.createObjectURL(blob);
    imagePreview.src = previewURL;
    cropButton.style.display = "none";
  });
});

// Form submit
document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nameInput.value.trim() || !phoneInput.value.trim() || !addressInput.value.trim()) {
    document.getElementById("response").innerHTML = `<p style="color:red;">Please fill in all required fields.</p>`;
    return;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    document.getElementById("response").innerHTML = `<p style="color:red;">Please enter a valid 10-digit mobile number.</p>`;
    return;
  }

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("https://langar-db-csvv.onrender.com/edit-member", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    const messageEl = document.getElementById("response");

    if (response.ok) {
      messageEl.innerHTML = `<p style="color: green;">${result.message}</p>`;
    } else {
      messageEl.innerHTML = `<p style="color: red;">Error: ${result.error || "Something went wrong"}</p>`;
    }
  } catch (err) {
    document.getElementById("response").innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
  }
});
