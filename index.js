const btn_send = document.querySelector("#btnSendMessage");
const chatMessage = document.querySelector(".chat_message");
const game = document.querySelector("#game");
const platform = document.querySelector("#platform");
const chatCon = document.querySelector(".chat_con");
const guideChat = document.querySelector(".guide_chat");
const loader = document.querySelector(".loader");
const restart = document.querySelector(".restart");
const chatInputWrap = document.querySelector(".chat-input");

chatCon.style.display = "none";
loader.style.display = "none";
restart.style.display = "none";
chatInputWrap.style.display = "none";
game.focus();

game.addEventListener("input", updateButtonState);
platform.addEventListener("input", updateButtonState);
btn_send.addEventListener("click", sendMessage);

function updateButtonState() {
  if (game.value.trim() === "" || platform.value.trim() === "") {
    btn_send.disabled = true;
  } else {
    btn_send.disabled = false;
  }
}

let userMessages = [];
let assistantMessages = [];

async function sendMessage() {
  guideChat.style.display = "none";
  loader.style.display = "block";
  const myGame = game.value;
  const myPlatform = platform.value;

  const chatInput = document.querySelector(".chat-input input");
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add("chat_message");
  chatMessageDiv.innerHTML = `<p>${chatInput.value}</p>`;
  chatCon.appendChild(chatMessageDiv);

  userMessages.push(chatInput.value);
  chatInput.value = "";

  const response = await fetch(
    "https://sg4mivu5x9.execute-api.ap-northeast-2.amazonaws.com/props/guide",
    {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        myGame,
        myPlatform,
        userMessages,
        assistantMessages,
      }),
    }
  );
  const data = await response.json();
  assistantMessages.push(data.assistant);
  const astrologerMessage = document.createElement("div");
  astrologerMessage.classList.add("chat_message");
  astrologerMessage.innerHTML = `<p class="assistant">${data.assistant.replace(
    /\n/g,
    "<br/>"
  )}</p>`;
  chatCon.appendChild(astrologerMessage);
  loader.style.display = "none";
  chatCon.style.display = "block";
  chatCon.scrollTop = chatCon.scrollHeight;
  chatInputWrap.style.display = "flex";
  restart.style.display = "block";
}

function reStart() {
  window.location.reload();
}

btn_send.addEventListener("click", sendMessage);
document.querySelector("#btn").addEventListener("click", sendMessage);
restart.addEventListener("click", reStart);
