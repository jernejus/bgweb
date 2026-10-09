(function () {
  var form = document.getElementById("servis-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var button = form.querySelector('button[type="submit"]');
  var buttonHtml = button.innerHTML;
  // FormSubmit's AJAX endpoint returns JSON instead of redirecting to its thank-you page.
  var endpoint = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

  function showStatus(message, type) {
    status.textContent = message;
    status.className = "form-status form-status--" + type;
    status.hidden = false;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var replyTo = data.get("E-posta");
    if (replyTo) data.append("_replyto", replyTo);

    button.disabled = true;
    button.textContent = "Pošiljam …";
    status.hidden = true;

    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (res) {
        return res.json().then(function (json) {
          if (!res.ok || String(json.success) !== "true") {
            throw new Error(json.message || "Pošiljanje ni uspelo");
          }
        });
      })
      .then(function () {
        form.reset();
        showStatus("Hvala! Vaše naročilo smo prejeli. Termin vam potrdimo po telefonu.", "ok");
      })
      .catch(function () {
        showStatus(
          "Pošiljanje ni uspelo. Pokličite nas na 03 749 07 33 ali pišite na info@bg-avtomobili.si.",
          "error"
        );
      })
      .finally(function () {
        button.disabled = false;
        button.innerHTML = buttonHtml;
      });
  });
})();
