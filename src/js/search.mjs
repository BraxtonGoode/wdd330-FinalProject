import { gameByName } from "./utilities";

const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#searchButton");

if (searchInput && searchButton) {
  // Function to handle the search logic
  const handleSearch = () => {
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      gameByName(searchValue);
    } else {
      alert("Please enter a search term.");
    }
  };

  // event listener for button click
  searchButton.addEventListener("click", handleSearch);

  //event listener for Enter key press
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSearch();
    }
  });
}