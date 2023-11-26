
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deletButton = document.querySelector("#delete-btn");

const decodedData = atob("c2stTG5udjNjS3E1bXZPWTZNVzNqVnpUM0JsYmtGSkdMRXEyUFk4NE80TU9TRVFCNTRp"); // decode the string

const API_KEY = decodedData ;



let userText = null;

const initialHeight = chatInput.scrollHeight;

const loadDataFormLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode" , themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history  will be displayed here. </p> 
                        </div> `

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); 
}

loadDataFormLocalstorage();

const createElement = (html , className) => {

    // Create new div and apply chat , specified class and set html content of div
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat" , className);
    chatDiv.innerHTML = html;
    return chatDiv;  // return the created chat div
}

const getChatResponse = async (incomingChatDiv) =>  {
     const API_URL = "https://api.openai.com/v1/completions";
     const pElement = document.createElement("p");

// Defines the properties and data for the API request

     const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${API_KEY}`
         } ,
         body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
         })
         
     
     }


     //Send Post request to API , get response and set the response as paragraphs element text
     try {
        const response = await (await fetch(API_URL , requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
     } catch(error) {
        pElement.classList.add("error");
        pElement.textContent = " Oops! Somethings went wrong while retrieving the response. Please try again.";
     }

     incomingChatDiv.querySelector(".typing-animation").remove();
     incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
     chatContainer.scrollTo(0, chatContainer.scrollHeight);
     localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    //Copy the text content of the response  to the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p"); 
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy" , 1000);
}

const showTypingAnimation = () => {
    const html = ` <div class="chat-content">
    <div class="chat-details">
        <img src="chatbot.jpg" alt="chatbot-img" >
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2 "></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
</div>` ;
    
    // Creat an incoming chat div with typing animation and  append it to chat container              
    const incomingChatDiv = createElement(html , "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();  // Get chatInput value and remove extra space
    if(!userText) return ;  // if chatInput is empty return from here
    
    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                        <div class="chat-details">
                             <img src="user.jpg" alt="user-img" >
                             <p></p>
                        </div>
                    </div>` ;
    
    // Creat an outgoing chat div with user's message and append it to chat container              
    const outgoingChatDiv = createElement(html , "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation , 500);
   
}

themeButton.addEventListener("click" , () => {
    //Toggle body's class for the theme mode and save the updatentheme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color" , themeButton.innerText );
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});


deletButton.addEventListener("click" , () => {
    // Remove the chats from the local storage and call loadDataFormLocalstorage function
    if (confirm("Are you sure you want to delete all the chats")) {
        localStorage.removeItem("all-chats");
        loadDataFormLocalstorage();
    }
});



chatInput.addEventListener("input" , () => {
    // Adjust the text area or height of the input field dynamically based on its
        chatInput.style.height = `${initialHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendButton.addEventListener("click" , handleOutgoingChat);