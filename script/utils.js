export function displayDialogue(text, onDisplayEnd, ttype){
    const dialogueUI  = document.getElementById("text-container");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block";

    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if(index < text.length){
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }
        
        if(ttype == 5){
            setTimeout(() => document.getElementById("gPBtn").addEventListener("click", () => gP(onDisplayEnd)) , 50)
        }

        if(ttype == 6){
            setTimeout(() => document.getElementById("mGBtn").addEventListener("click", () => mG1(onDisplayEnd)) , 50)
        }

        clearInterval(intervalRef);
    }, 6);

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick(){
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }

    closeBtn.addEventListener("click", onCloseBtnClick);

}

export function setCamScale(k){
    const resizeFactor = k.width() / k.height();
    if(resizeFactor < 1){
        k.camScale(new k.Vec2(1));
        return;
    }
    k.camScale(new k.Vec2(1.5));
}

// ***********************
// ***********************
// ***********************
function gP(onDisplayEnd){
    const premiumGame = document.getElementById("game_premium");
    premiumGame.style.display = "block";
    premiumGame.style.zIndex = 20002;
    back.style.display = "block";
    back.style.position = "absolute";
    back.style.left = "20px";
    back.style.top = "20px"
    back.style.fontSize = "44px"
    back.onclick = () => {reset(onDisplayEnd)};
    back.style.zIndex = 200003
}

function reset(onDisplayEnd){
    const premiumGame = document.getElementById("game_premium");
    const miniGame1 = document.getElementById("mini-game1");
    premiumGame.style.display = "none";
    premiumGame.style.zIndex = -202;
    miniGame1.style.display = "none";
    miniGame1.style.zIndex = -202;
    back.style.display = "none";
    back.style.position = "absolute";
    back.style.left = "20px";
    back.style.top = "20px"
    back.style.fontSize = "44px"
    back.style.zIndex = -2022;
    const dialogueUI  = document.getElementById("text-container");
    const dialogue = document.getElementById("dialogue");
    onDisplayEnd();
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
}

function mG1(onDisplayEnd){
    const miniGame1 = document.getElementById("mini-game1");
    miniGame1.style.display = "block";
    miniGame1.style.zIndex = 20002;
    back.style.display = "block";
    back.style.position = "absolute";
    back.style.left = "20px";
    back.style.top = "20px"
    back.style.fontSize = "34px"
    back.onclick = () => {reset(onDisplayEnd)};
    back.style.zIndex = 200003
}
