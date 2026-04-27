const btn = document.getElementById("activateBtn");
const resetBtn = document.getElementById("resetBtn");
const container = document.querySelector(".container");

const els = {
    hand: document.getElementById("hand"),
    red: document.getElementById("redBall"),
    blue: document.getElementById("blueBall"),
    purple: document.getElementById("purpleBall"),
    flash: document.getElementById("mergeFlash"),
    earth: document.getElementById("earth"),
    crater: document.getElementById("crater"),
    stats: document.getElementById("stats"),
    audio: document.getElementById("chantAudio")
};

let timers = [];
const setT = (fn, ms) => timers.push(setTimeout(fn, ms));

function resetSimulation() {
    timers.forEach(clearTimeout);
    timers = [];
    btn.disabled = false;
    container.classList.remove("shake");
    
    Object.values(els).forEach(el => {
        if (el) {
            el.classList.add("hidden");
            el.style = ""; 
        }
    });

    if (els.audio) { els.audio.pause(); els.audio.currentTime = 0; }
    const oldFlash = document.querySelector(".impact-flash");
    if (oldFlash) oldFlash.remove();
}

resetBtn.onclick = resetSimulation;

btn.onclick = function() {
    resetSimulation();
    btn.disabled = true;

    // 0s: Hand & Audio
    els.hand.classList.remove("hidden");
    setT(() => { els.hand.style.opacity = "1"; if(els.audio) els.audio.play(); }, 100);

    // 1.5s: Manifest Red/Blue
    setT(() => {
        els.red.classList.remove("hidden");
        els.blue.classList.remove("hidden");
    }, 1500);

// 2.8s: The Convergence (Updated for all screens)
    setT(() => {
        els.red.style.transition = "left 0.8s cubic-bezier(0.5, 0, 0.5, 1)";
        els.blue.style.transition = "left 0.8s cubic-bezier(0.5, 0, 0.5, 1)";
        
        // This ensures they meet at the exact center on any device width
        els.red.style.left = "50%"; 
        els.blue.style.left = "50%";
        
        setT(() => container.classList.add("shake"), 400);
    }, 2800);

    // 3.8s: The Merge
    setT(() => {
        els.red.classList.add("hidden");
        els.blue.classList.add("hidden");
        els.flash.classList.remove("hidden");
        els.flash.style.opacity = "1";
        els.flash.style.transform = "translateX(-50%) scale(2)";

        setT(() => {
            els.flash.classList.add("hidden");
            els.purple.classList.remove("hidden");
        }, 200);
    }, 3800);

    // 5.5s: The Launch
    setT(() => {
        container.classList.remove("shake");
        els.earth.classList.remove("hidden");
        
        els.purple.style.transition = "top 0.3s cubic-bezier(1, 0, 1, 1), transform 0.2s";
        els.purple.style.top = "1000px";
        els.purple.style.transform = "translateX(-50%) scale(2.5)";

        // Impact
        setT(() => {
            const f = document.createElement("div");
            f.className = "impact-flash";
            f.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:300;";
            document.body.appendChild(f);

            setT(() => {
                f.style.transition = "opacity 0.8s";
                f.style.opacity = "0";
                els.earth.style.filter = "brightness(0.1) grayscale(1)";
                els.crater.classList.remove("hidden");
                els.crater.style.transform = "translateX(-50%) scale(30)";
                els.stats.classList.remove("hidden");
                els.stats.innerHTML = "<h2 style='margin:0;color:var(--purple);'>ERASURE COMPLETE</h2>";
                setT(() => f.remove(), 800);
            }, 100);
        }, 250);
    }, 5500);
};