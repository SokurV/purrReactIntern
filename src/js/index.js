const COOKIE_BLOCK = document.querySelector('.cookie')
const COOKIE_BTN = document.querySelector('.cookie__button')
/* let startTime = null

function cookieAnimate(timestamp){
    if(!startTime) startTime = timestamp
    let progress = timestamp - startTime
    let newBottom = (-92 + ((progress)/1000)*46)
    COOKIE_BLOCK.style.bottom = newBottom + "px"
    if(newBottom < 0) {
        requestAnimationFrame(cookieAnimate)
    }
}
setTimeout(() => {
    requestAnimationFrame(cookieAnimate)
}, 3000); */

function cookieAnimate(progress) {
    let newBottom = -92 + (progress*92)
    COOKIE_BLOCK.style.bottom = newBottom + "px"
}

function animate({timing, draw, duration}) {

    let startTime = null
  
    requestAnimationFrame(function animate(timestamp) {
      // timeFraction изменяется от 0 до 1
        if(!startTime) startTime = timestamp
        let progressTime = timestamp - startTime
        let timeFraction = (progressTime) / duration;
        if (timeFraction > 1) timeFraction = 1;
    
        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);
    
        draw(progress); // отрисовать её
    
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    })
}

setTimeout(()=>{
    animate({
        timing: function quad(timeFraction) {
            return Math.pow(timeFraction, 2)
        },
        draw: cookieAnimate,
        duration: 1000
    })
}, 3000)

COOKIE_BTN.onclick = function(){
    COOKIE_BLOCK.classList.add('cookie_display-none')
}