let allMembers = [];

const rollNoSelect = document.getElementById("roll_no");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last_name");
const phoneInput = document.getElementById("phone_no");
const addressInput = document.getElementById("address");

const setMembers = (members) => {
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.roll_no;
    option.textContent = `${member.roll_no} - ${member.name} ${member.last_name}`;
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

document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!nameInput.value.trim() || !phoneInput.value.trim() || !addressInput.value.trim()) {
    document.getElementById("response").innerHTML = `<p style="color:red;">Please fill in all required fields.</p>`;
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
