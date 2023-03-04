const COOKIE_BLOCK = document.querySelector('.cookie')
const COOKIE_BTN = document.querySelector('.cookie__button')
const BLOCK2 = document.querySelector('.block-2')
const BLOCK2_IPHONE = document.querySelector('.block-2__iphone-hidden')
const BLOCK2_IPHONE_CENTER = document.querySelector('.block-2__iphone-center')
const IPHONE_CENTER_BACKGROUND = document.querySelector('.iphone-center-background')
const BLOCK2_TEXT_CONT = document.querySelector('.block-2-text-container')
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


function animate({timing, draw, duration}) {

    let startTime = null
  
    requestAnimationFrame(function animate(timestamp) {
      // timeFraction изменяется от 0 до 1
        if(!startTime) startTime = timestamp
        let progressTime = timestamp - startTime
        let timeFraction = progressTime / duration
        if (timeFraction > 1) timeFraction = 1
    
        // вычисление текущего состояния анимации
        let progress = timing(timeFraction)
    
        draw(progress); // отрисовать её
    
        if (timeFraction < 1) {
            requestAnimationFrame(animate)
        }
    })
}

function cookieAnimate(progress) {
    let newBottom = -92 + (progress*92)
    COOKIE_BLOCK.style.bottom = newBottom + "px"
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

function block2Animation(){
    let block1Height = document.querySelector('.block-1').offsetHeight
    let block2Height = document.querySelector('.block-2').offsetHeight
    if(window.pageYOffset >= block1Height + block2Height/2) {
        animate({
            timing: function quad(timeFraction) {
                return Math.pow(timeFraction, 2)
            },
            draw: block2ElementsHidden,
            duration: 2000
        })
        window.removeEventListener("scroll", block2Animation)
    }
}

function block2ElementsHidden(progress) {
    let offset = progress*1000
    BLOCK2_IPHONE.style.left = -offset + "px"
    BLOCK2_TEXT_CONT.style.right = -offset + "px"
    BLOCK2_TEXT_CONT.style.opacity = 1 - progress*2
    if(progress >= 1) {
        BLOCK2_IPHONE.style.display = 'none'
        BLOCK2_TEXT_CONT.style.display = 'none'
        BLOCK2.style.justifyContent = 'center'
        BLOCK2_IPHONE_CENTER.style.display = 'flex'
        animate({
            timing: function quad(timeFraction) {
                return Math.pow(timeFraction, 2)
            },
            draw: block2IphoneCenter,
            duration: 1500
        })
    }
}

function block2IphoneCenter(progress) {
    BLOCK2_IPHONE_CENTER.style.left = (-1000 + progress*1000)+"px"
    BLOCK2_IPHONE_CENTER.style.opacity = progress
    if(progress >= 1) {
        IPHONE_CENTER_BACKGROUND.style.opacity = 0.2
    }
}

window.addEventListener("scroll", block2Animation)