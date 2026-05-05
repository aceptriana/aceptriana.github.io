/*===== LANGUAGE SWITCHER =====*/
let currentLanguage = localStorage.getItem('language') || 'id';

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Update all text with data attributes
    document.querySelectorAll('[data-en][data-id]').forEach(element => {
        const text = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-id');
        if (text) {
            // Check if content has HTML tags
            if (text.includes('<')) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update animated text
    const animatedText = document.getElementById('animated-text');
    if (animatedText && animatedText.hasAttribute('data-en-list') && animatedText.hasAttribute('data-id-list')) {
        const enList = JSON.parse(animatedText.getAttribute('data-en-list'));
        const idList = JSON.parse(animatedText.getAttribute('data-id-list'));
        textArray = lang === 'en' ? enList : idList;
        textIndex = 0;
        animatedText.textContent = textArray[0];
    }
}

// Language button listeners
document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        switchLanguage(e.target.getAttribute('data-lang'));
    });
});

// Initialize with saved language
switchLanguage(currentLanguage);

/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    overlay = document.getElementById('menu-overlay')

    if(toggle && nav){
        toggle.addEventListener('click', (e)=>{
            e.stopPropagation()
            nav.classList.toggle('show')
            if(overlay) {
                overlay.classList.toggle('active')
            }
        })
        
        // Close menu when clicking outside
        document.addEventListener('click', (e)=>{
            if(!nav.contains(e.target) && !toggle.contains(e.target)){
                nav.classList.remove('show')
                if(overlay) {
                    overlay.classList.remove('active')
                }
            }
        })
        
        // Close menu when clicking overlay
        if(overlay) {
            overlay.addEventListener('click', ()=>{
                nav.classList.remove('show')
                overlay.classList.remove('active')
            })
        }
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    const overlay = document.getElementById('menu-overlay')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
    if(overlay) {
        overlay.classList.remove('active')
    }
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 
sr.reveal('.portfolio__card',{interval: 200, origin: 'bottom'});
sr.reveal('.education__item',{interval: 200, origin: 'left'});
sr.reveal('.work__item',{interval: 100, origin: 'bottom'}); 
