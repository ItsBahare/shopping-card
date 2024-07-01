const navBarLink = document.querySelector("#nav-link");


function handleTabs() {
  if (navBarLink.style.display === "flex" ) {
    navBarLink.style.display = "none";
  } else {
    navBarLink.style.display = "flex";
    navBarLink.style.flexDirection ="column"
  }
}
