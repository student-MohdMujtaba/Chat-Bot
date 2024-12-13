const sendChatBtn = document.querySelector('.chat-input #send-icon');
const chatInput = document.querySelector('.chat-input textarea');
const chatBox = document.querySelector('.chatbox');

let userMessage;
const API_KEY = "AIzaSyAMQjtPLo5uisXxHOzXbB1x2GKE6enfEes";
// const inputHeight = chatInput.scrollHeight;

const createChatli = (message, className) => {
    //create a chat <li> element with passed message and class name
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : ` <i class="fa-solid fa-robot" id="robot"></i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLI) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLI.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMessage }]
            }]
        }),
    };

    //Send POST request to API and get Response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.textContent = "Oops Something Went Wrong. Please try again";
    }).finally(() => {
        chatBox.scrollTo(0, chatBox.scrollHeight);
    });
}

const handlechat = () => {
    userMessage = chatInput.value.trim();
    // console.log(userMessage); 
    if (!userMessage) return;
    chatInput.value = "";

    //Append the user Message to the chat box
    chatBox.appendChild(createChatli(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    //Adding Thinking Message to Wait for the Response
    setTimeout(() => {
        const incomingChatLI = createChatli("Thinking...", "incoming");
        chatBox.appendChild(incomingChatLI);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLI);
    }, 600);
}

//if the enter key is pressed without the shift key then handle the chat
chatInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && !e.shiftKey && window.innerWidth ) {
            e.preventDefault();
            handlechat();
        }
});

sendChatBtn.addEventListener('click', handlechat);