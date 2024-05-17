// Get references to the planet image and click count paragraph
const planetImage = document.getElementById("planetImage");
const clickCount = document.getElementById("clickCount");

let count = 0;
let canClick = true; // Flag to control click events

// Add a click event listener to the planet image
planetImage.addEventListener("click", () => {
    if (!canClick) return; // Exit if click is disabled
    count++; // Increment the click count
    clickCount.textContent = "Clicks: " + count; // Update the click count text

    // Disable further clicks temporarily
    canClick = false;

    // Add a class to animate the planet image
    planetImage.classList.add("pop");

    // Remove the class after a short delay to reset the animation and enable clicks again
    setTimeout(() => {
        planetImage.classList.remove("pop");
        canClick = true;
    }, 300);
});