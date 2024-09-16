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
        if(ttype !== 5){
            document.getElementById("gPBtn").addEventListener("click", gP)
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
function gP(){
    const premiumGame = document.getElementById("game_premium");
    premiumGame.style.display = "block";
    premiumGame.style.zIndex = 20002;
}