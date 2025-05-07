document.getElementById("memberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    try {
      const response = await fetch("http://localhost:5000/edit-member", {
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
  