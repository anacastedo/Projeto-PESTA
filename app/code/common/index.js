/* ====================================================
            Separate Sections with Nav Selection
   ================================================= */

//function to hide all sections but U=RIsolve Academy
function showAcademy() {
    document.getElementById("topct").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("examples").style.display = "none";
    const element = document.getElementById("academy");
    element.scrollIntoView();
  //  document.getElementById("topct").style.display = "none";
}

function showSection (sec){
    document.getElementById("mainSection").style.display = "none";
    document.getElementById("topct").style.display = "none";
    document.getElementById("analysis").style.display = "none";
    document.getElementById("assisted").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("examples").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("about").style.display = "none";
    [...document.getElementsByClassName('section')].forEach((section) => section.style.display = "none");

    let element = null;

    switch (sec) {
        case 1:
            element = document.getElementById("instructions");
            break;
        case 2:
            element = document.getElementById("examples");
            break;
        case 3:
            element = document.getElementById("topct");
            break;
        case 4:
            element = document.getElementById("contact");
            break;
        case 5:
            element = document.getElementById("assisted");
            break;
        case 6:
            element = document.getElementById("analysis");
            break;
        case 7:
            element = document.getElementById("random");
            break;
        case 8:
            element = document.getElementById("about");
            break;
        default:
            element = document.getElementById("section-" + sec);
    }

    if (element) {
        element.style.display = 'block'

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 500)
    }

    if (window.innerWidth < 768) {
        document.querySelector('.collapse.show')?.previousElementSibling?.click();
    }
}

