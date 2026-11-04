/* =====================================================
   BCA DEPARTMENT WEBSITE
   script.js
   PART 1
===================================================== */



/* =====================================================
   LOADER
===================================================== */


window.addEventListener("load",()=>{

    const loader=document.getElementById("loader");

    if(loader){

        setTimeout(()=>{

            loader.style.opacity="0";

            loader.style.visibility="hidden";

        },800);

    }

});







/* =====================================================
   SCROLL UI (one passive, animation-frame update)
===================================================== */

const navbar = document.querySelector(".glass-navbar");
const progressBar = document.getElementById("progressBar");
const backToTop = document.getElementById("backToTop");
const trackedSections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
let scrollFrame = 0;
let activeSectionId = "";

function updateScrollUI() {
    const scrollTop = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

    navbar?.classList.toggle("navbar-scrolled", scrollTop > 50);
    if (progressBar) progressBar.style.transform = "scaleX(" + progress + ")";
    backToTop?.classList.toggle("is-visible", scrollTop > 400);

    let nextSectionId = "";
    for (const section of trackedSections) {
        if (scrollTop >= section.offsetTop - 140) nextSectionId = section.id;
        else break;
    }

    if (nextSectionId !== activeSectionId) {
        activeSectionId = nextSectionId;
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === (activeSectionId ? "#" + activeSectionId : "#"));
        });
    }
}

function scheduleScrollUI() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollUI();
    });
}

window.addEventListener("scroll", scheduleScrollUI, { passive: true });
window.addEventListener("resize", scheduleScrollUI, { passive: true });
updateScrollUI();
/* =====================================================
   AOS ANIMATION
===================================================== */


const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

AOS.init({

    duration:650,

    once:true,

    offset:80,

    disable: prefersReducedMotion

});







/* =====================================================
   HERO SWIPER
===================================================== */


const heroSwiper =
new Swiper(".heroSwiper",{


    loop:true,


    autoplay: prefersReducedMotion ? false : {

        delay:5000,

        disableOnInteraction:false

    },


    effect:"fade",


    fadeEffect:{

        crossFade:true

    },


    pagination:{

        el:".swiper-pagination",

        clickable:true

    },


    navigation:{

        nextEl:".swiper-button-next",

        prevEl:".swiper-button-prev"

    }


});







/* =====================================================
   RECRUITER SLIDER
===================================================== */


const recruiterSwiper =
new Swiper(".recruiterSwiper",{


    slidesPerView:5,


    spaceBetween:30,


    loop:true,


    autoplay: prefersReducedMotion ? false : {

        delay:2000,

        disableOnInteraction:false

    },


    breakpoints:{


        320:{

            slidesPerView:2

        },


        576:{

            slidesPerView:3

        },


        992:{

            slidesPerView:5

        }


    }


});








/* =====================================================
   TESTIMONIAL SLIDER
===================================================== */


const testimonialSwiper =
new Swiper(".testimonialSwiper",{


    slidesPerView:1,


    spaceBetween:30,


    loop:true,


    autoplay: prefersReducedMotion ? false : {

        delay:4000

    },


    breakpoints:{


        768:{

            slidesPerView:2

        },


        1200:{

            slidesPerView:3

        }


    }


});


/* =====================================================
   SCRIPT.JS PART 2
===================================================== */



/* =====================================================
   ANIMATED COUNTERS
===================================================== */


const counters =
document.querySelectorAll(".counter");



const counterObserver =
new IntersectionObserver((entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            const counter =
            entry.target;


            const target =
            Number(counter.dataset.count || counter.dataset.target || 0);



            let count = 0;



            const speed =
            target / 100;



            const updateCounter = ()=>{


                count += speed;



                if(count < target){


                    counter.innerText =
                    Math.ceil(count);



                    requestAnimationFrame(updateCounter);


                }

                else{


                    counter.innerText =
                    target + "+";


                }


            };



            updateCounter();



            counterObserver.unobserve(counter);


        }


    });


},{


    threshold:.5


});





counters.forEach(counter=>{

    counterObserver.observe(counter);

});









/* =====================================================
   FACULTY DATABASE
===================================================== */


const facultyData=[


{

name:"Dr. Thenmozhi",

designation:"Assistent Professor",

qualification:"Ph.D Computer Science",

email:"kt@rvu.edu.in",

cabin:"B-301",

research:"Artificial Intelligence, Machine Learning",

image:"assets/faculty/Dr.-Thenmozhi-1.png"

},



{

name:"Dr. Mahadev Kalyanrao Patil",

designation:"Associate Professor",

qualification:"Ph.D Data Science",

email:"mb@rvu.edu.in",

cabin:"A-205",

research:"Data Analytics, Big Data",

image:"assets/faculty/Dr.-Mahadev-Kalyanrao-Patil-1.png"

},



{

name:"Prof. Mohammed Danish",

designation:"Assistant Professor",

qualification:"MCA",

email:"@rvu.edu.in",

cabin:"B-102",

research:"ML",

image:"assets/faculty/Prof.-Mohammed-Danish-1.png"

},
{

name:"Prof. Sharath Shetty B R",

designation:"Assistant Professor",

qualification:"MCA",

email:"ss@rvu.edu.in",

cabin:"B-102",

research:"ML",

image:"assets/faculty/Prof.-Sharath-Shetty-B-R.png"

},{

name:"Prof. Sasikala J",

designation:"Assistant Professor",

qualification:"MSc",

email:"sj@rvu.edu.in",

cabin:"B-102",

research:"Maths",

image:"assets/faculty/Prof.-Sasikala-Jeganathan1.png"
}


];








/* =====================================================
   FACULTY SEARCH & FILTER
===================================================== */


const facultyContainer =
document.getElementById("facultyContainer");



const searchInput =
document.getElementById("facultySearch");



const designationFilter =
document.getElementById("designationFilter");






function displayFaculty(list){



    if(!facultyContainer)
        return;



    facultyContainer.innerHTML="";



    list.forEach((faculty,index)=>{



        facultyContainer.innerHTML += `


<div class="col-lg-4 col-md-6">


<div class="faculty-card">


<img src="${faculty.image}"

class="faculty-image"

alt="${faculty.name}"

loading="lazy">



<div class="faculty-body">


<h4>

${faculty.name}

</h4>



<span class="designation">

${faculty.designation}

</span>



<p>

<i class="fa-solid fa-graduation-cap"></i>

${faculty.qualification}

</p>




<p>

<i class="fa-solid fa-flask"></i>

${faculty.research}

</p>



<button

class="btn btn-warning"

onclick="openFacultyModal('${faculty.email}')">

View Profile

</button>



</div>


</div>


</div>



`;



    });


}





displayFaculty(facultyData);









function filterFaculty(){



let keyword =
searchInput.value.toLowerCase();



let designation =
designationFilter.value;



let filtered =
facultyData.filter(faculty=>{


let matchName =
faculty.name
.toLowerCase()
.includes(keyword);



let matchDesignation =
designation==="all" ||
faculty.designation===designation;



return matchName && matchDesignation;



});



displayFaculty(filtered);



}







searchInput?.addEventListener(
"keyup",
filterFaculty
);



designationFilter?.addEventListener(
"change",
filterFaculty
);









/* =====================================================
   FACULTY MODAL
===================================================== */

function openFacultyModal(email) {

    const faculty = facultyData.find(f => f.email === email);

    if (!faculty) return;

    document.getElementById("facultyModalBody").innerHTML = `

    <div class="row align-items-center">

        <div class="col-md-4 text-center">

            <img src="${faculty.image}"
                 class="rounded-circle border border-3 border-warning"
                 style="width:180px;height:180px;object-fit:cover;">

        </div>

        <div class="col-md-8">

            <h3>${faculty.name}</h3>

            <h5 class="text-warning">${faculty.designation}</h5>

            <hr>

            <p><strong>Qualification:</strong> ${faculty.qualification}</p>

            <p><strong>Email:</strong> ${faculty.email}</p>

            <p><strong>Cabin:</strong> ${faculty.cabin}</p>

            <p><strong>Research Area:</strong> ${faculty.research}</p>

        </div>

    </div>

    `;

    const modal = new bootstrap.Modal(
        document.getElementById("facultyModal")
    );

    modal.show();
}

window.openFacultyModal = openFacultyModal;





window.openFacultyModal =
openFacultyModal;









/* =====================================================
   GALLERY LIGHTBOX
===================================================== */


const galleryImages =
document.querySelectorAll(
".gallery-item img"
);



const lightbox =
document.getElementById(
"lightbox"
);



const lightboxImage =
document.getElementById(
"lightboxImage"
);



galleryImages.forEach(image=>{


image.addEventListener(
"click",
()=>{


lightbox.style.display="flex";


lightboxImage.src =
image.src;


});


});






document
.querySelector(".close-lightbox")
?.addEventListener(
"click",
()=>{


lightbox.style.display="none";


});






lightbox?.addEventListener(
"click",
(e)=>{


if(e.target===lightbox){


lightbox.style.display="none";


}


});



/* =====================================================
   SCRIPT.JS PART 3
===================================================== */



backToTop?.addEventListener(
"click",
()=>{


window.scrollTo({

    top:0,

    behavior:"smooth"

});


});









const themeToggle = document.getElementById("themeToggle");
const themeStorageKey = "bca-theme";

function applyTheme(isDark, persist) {
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle?.setAttribute("aria-checked", String(isDark));
    if (persist) {
        try {
            localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
        } catch (_) {}
    }
}

let savedTheme = "light";
try {
    savedTheme = localStorage.getItem(themeStorageKey) || "light";
} catch (_) {}
applyTheme(savedTheme === "dark", false);

themeToggle?.addEventListener("click", () => {
    applyTheme(themeToggle.getAttribute("aria-checked") !== "true", true);
});
/* =====================================================
   TYPING EFFECT
===================================================== */


const typingText =
document.querySelector(".typing");



if(typingText){



const words=[

"Innovation",

"Artificial Intelligence",

"Software Development",

"Future Technology"

];



let wordIndex=0;

let charIndex=0;

let deleting=false;



function typeEffect(){



let current =
words[wordIndex];



if(!deleting){



typingText.innerHTML =
current.substring(
0,
charIndex++
);



if(charIndex >
current.length){


deleting=true;


setTimeout(
typeEffect,
1200
);


return;

}



}

else{



typingText.innerHTML =
current.substring(
0,
charIndex--
);



if(charIndex===0){


deleting=false;


wordIndex++;


if(wordIndex >= words.length){

wordIndex=0;

}


}

}



setTimeout(
typeEffect,
100
);



}



typeEffect();



}









/* =====================================================
   SMOOTH SCROLL
===================================================== */


document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(anchor=>{


anchor.addEventListener(
"click",
function(e){



const target =
document.querySelector(
this.getAttribute("href")
);



if(target){



e.preventDefault();



target.scrollIntoView({

behavior:"smooth"

});



}



});


});









/* =====================================================
   RIPPLE BUTTON EFFECT
===================================================== */


document
.querySelectorAll(
".btn"
)
.forEach(button=>{


button.addEventListener(
"click",
function(e){



let ripple =
document.createElement(
"span"
);



ripple.className="ripple-effect";



this.appendChild(ripple);



let x =
e.clientX -
this.offsetLeft;



let y =
e.clientY -
this.offsetTop;



ripple.style.left =
x+"px";



ripple.style.top =
y+"px";



setTimeout(()=>{


ripple.remove();


},600);



});


});









/* =====================================================
   ACTIVE NAVIGATION ON SCROLL
===================================================== */


/* =====================================================
   LAZY IMAGE LOADING
===================================================== */


const lazyImages =
document.querySelectorAll(
"img[loading='lazy']"
);



const imageObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


const image =
entry.target;



image.src =
image.dataset.src ||
image.src;



imageObserver.unobserve(
image
);



}



});



});





lazyImages.forEach(image=>{


imageObserver.observe(image);


});









/* =====================================================
   MOBILE MENU AUTO CLOSE
===================================================== */


const navLinksMobile =
document.querySelectorAll(
".navbar-nav .nav-link"
);



const navbarCollapse =
document.querySelector(
".navbar-collapse"
);



navLinksMobile.forEach(link=>{


link.addEventListener(
"click",
()=>{


if(
window.innerWidth < 1400
){


const bsCollapse =
bootstrap.Collapse
.getInstance(
navbarCollapse
);



bsCollapse?.hide();



}


});


});









/* =====================================================
   FINAL INITIALIZATION
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Department of Computer Applications Website Loaded Successfully"
);



});



