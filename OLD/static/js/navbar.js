window.onscroll = () => {
  const nav = document.querySelector('.navbar');
  if (nav.className.includes("scroll")) {
    if(this.scrollY <= 10) nav.className = nav.className.replace(" scroll","");
  } else {
    if(this.scrollY > 10) nav.className += " scroll";
  }
};
