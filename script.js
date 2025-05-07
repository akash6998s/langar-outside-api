const setMembers = (members) => {
  const rollNoSelect = document.getElementById("roll_no");
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.roll_no;
    option.textContent = `${member.roll_no} - ${member.name} ${member.last_name}`;
    rollNoSelect.appendChild(option);
  });
};

const fetchMembers = async () => {
  try {
    const res = await fetch("http://localhost:5000/member-full-details");
    const data = await res.json();
    if (data && Array.isArray(data)) {
      setMembers(data);
    } else {
      console.error("Data is not an array or invalid structure.");
    }
  } catch (err) {
    console.error("Error fetching members:", err);
  }
};

fetchMembers();

document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(
      "https://langar-db-csvv.onrender.com/edit-member",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    const messageEl = document.getElementById("response");
    if (response.ok) {
      messageEl.innerHTML = `<p style="color: green;">${result.message}</p>`;
    } else {
      messageEl.innerHTML = `<p style="color: red;">Error: ${
        result.error || "Something went wrong"
      }</p>`;
    }
  } catch (err) {
    document.getElementById(
      "response"
    ).innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
  }
});
