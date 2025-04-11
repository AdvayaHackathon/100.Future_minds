function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const message = document.createElement("p");
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;
  
    appendMessage("You", message);
    input.value = "";
  
    fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    })
      .then(res => res.json())
      .then(data => {
        appendMessage("EduBot", data.response);
        speak(data.response);
      });
  }
  
  function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  }
  
  function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
  
    recognition.onresult = function(event) {
      const voiceInput = event.results[0][0].transcript;
      document.getElementById("user-input").value = voiceInput;
      sendMessage();
    };
  
    recognition.onerror = function(event) {
      alert("Voice recognition error: " + event.error);
    };
  }