const formData = new FormData();
formData.append("candidateName", "Alex Rivera");
formData.append("sessionTitle", "Frontend");
formData.append("textAnswer", "virtual DOM");
formData.append("question", "test question");

fetch("http://localhost:5000/api/evaluate", {
  method: "POST",
  body: formData
}).then(async r => {
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
}).catch(console.error);
