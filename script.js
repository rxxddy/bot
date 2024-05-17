// Get references to the planet image and click count paragraph
const planetImage = document.getElementById("planetImage");
const clickCount = document.getElementById("clickCount");

let count = 0;

// Add a click event listener to the planet image
planetImage.addEventListener("click", () => {
    count++; // Increment the click count
    clickCount.textContent = "Clicks: " + count; // Update the click count text

    // Add a class to animate the planet image
    planetImage.classList.add("pop");

    // Remove the class after a short delay to reset the animation
    setTimeout(() => {
        planetImage.classList.remove("pop");
    }, 300);
});
