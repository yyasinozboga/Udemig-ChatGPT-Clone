const textarea = document.querySelector(".textarea");
const sendBtn = document.querySelector(".send-btn");
const darkBtn = document.querySelector(".dark-light-mode-btn");
const deleteBtn = document.querySelector(".delete-btn");
const chatList = document.querySelector(".chat-list");
const defaultText = document.querySelector(".default-text");

let value = null;

//! Yeni bir element oluşturma
const createElement = (html, className) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add("chat", className);
  return div;
};

//! Verileri LS e atma
const saveChatHistory = () => {
  localStorage.setItem("chats", chatList.innerHTML);
};

//! LS deki verileri yeniden bastırma
const loadChatHistory = () => {
  const chatHistory = localStorage.getItem("chats");
  if (chatHistory) {
    chatList.innerHTML = chatHistory;
    defaultText.innerHTML = "";
  }
};

//! API ye istek atma
const getData = async (chat) => {
  const p = document.createElement("p");
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "c3202f5227mshefb2446baaf43e6p1b2232jsn6cc6e405ba66",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${value}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    p.innerText = data.result;
    saveChatHistory();
  } catch (error) {
    p.innerText = "Oppps";
  } finally {
    chat.querySelector(".loading-animation").remove();
    chat.appendChild(p);
    chatList.appendChild(chat);
    value = null;
  }
};

//! Send butonuna tıklanınca mesaj gönderme
const handleClick = () => {
  value = textarea.value.trim();

  if (value) {
    const html = `
    <figure class="chat-img"><img src="./images/RDJ.jpg" /></figure>
    <p class="chat-title">${value}</p>
  `;

    const chat = createElement(html, "incoming");
    chatList.appendChild(chat);
    defaultText.innerHTML = "";
    setTimeout(createOutgoingChat(), 500);
  } else {
    throw new Error("Lütfen bir değer giriniz!");
  }

  textarea.value = "";
};

//! API den gelen cevabı oluşturma
const createOutgoingChat = () => {
  const html = `
    <figure class="chat-img">
      <img src="./images/Chat GPT Logo.jpg" />
    </figure>
    <div class="loading-animation">
      <div class="loading" style="--delay: 0.2s"></div>
      <div class="loading" style="--delay: 0.3s"></div>
      <div class="loading" style="--delay: 0.4s"></div>
    </div>
  `;

  const chat = createElement(html, "outgoing");
  getData(chat);
};

//! Sohbeti Silme
const deleteChat = () => {
  if (confirm("Sohbeti silmek istediğinize emin misiniz?")) {
    localStorage.removeItem("chats");
    chatList.innerHTML = "";
    defaultText.innerHTML = "<h1>ChatGPT</h1>";
  } else {
    const chatHistory = localStorage.getItem("chats");
    chatList.innerHTML = chatHistory;
  }
};

//! Dark Mode
const darkMode = () => {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    darkBtn.innerHTML = `
      <span class="material-symbols-outlined">
        dark_mode
      </span>
    `;
  } else {
    darkBtn.innerHTML = `
    <span class="material-symbols-outlined">
      light_mode
    </span>
  `;
  }
};

textarea.addEventListener("keydown", (e) => {
  const keyCode = e.key;
  if (keyCode === "Enter") {
    handleClick();
  }
});
deleteBtn.addEventListener("click", deleteChat);
sendBtn.addEventListener("click", handleClick);
darkBtn.addEventListener("click", darkMode);
window.addEventListener("DOMContentLoaded", loadChatHistory);
