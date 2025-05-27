
let bookItems = []; // define globally

// =============== Fetch and load the tools.json ===================
fetch('/tools.json')
  .then(response => response.json())
  .then(data => {
    const bookList = document.querySelector('.book-list');

    data.forEach(tool => {
      // Create a new <li> for each tool
      const li = document.createElement('li');
      
      // Create the button
      const button = document.createElement('button');
      button.classList.add('book-btn');
      button.setAttribute('data-title', tool.name);
      button.setAttribute('data-description', tool.description);
      button.setAttribute('data-type', tool.type);   
      button.setAttribute('data-link', tool.link);
      // button.setAttribute('data-language', tool.language); // If you still have languages later, you can add them too
      
      button.innerHTML = tool.highlighted_phrase; // Set the button's inner HTML to the highlighted_phrase
      li.appendChild(button); // Put the button inside the li      
      bookList.appendChild(li); // Add the li to the book-list
    });
  
    // AFTER all buttons are created, attach modal listeners
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
      button.addEventListener('click', () => {
        openModal(button.dataset.title, button.dataset.description, button.dataset.link);
      });
    });

    // AFTER all list items are created, grab them for filtering
    bookItems = document.querySelectorAll('.book-list li');
    applyFilters();

    // Shuffle list once loaded
    shuffleList();

  })
  .catch(error => console.error('Error loading tools:', error));


function applyFilters() {
      bookItems.forEach(item => {
        const btn = item.querySelector('.book-btn');
        const typeTags = (btn.dataset.type || "").split(",").map(tag => tag.trim());

        const typeSelected = selectedFilters.type;

        const typeMatch =
          typeSelected.length === 0 || typeSelected.some(tag => typeTags.includes(tag));

        if (typeMatch) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }


// =============== Modal Logic ======================
// Select elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close-btn');
// const bookButtons = document.querySelectorAll('.book-btn');

// Function to open modal
function openModal(title, description, link) {
  modalTitle.textContent = title;
  modalDesc.innerHTML = description.replace(/\n/g, '<br>');
  const visitBtn = document.getElementById('visit-tool-btn');
  if (link) {
    visitBtn.href = link;
    visitBtn.classList.remove('hidden');
  } else {
    visitBtn.href = '#';
    visitBtn.classList.add('hidden');
  }
  modal.classList.remove('hidden');
}

// Close modal on button click
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Close modal when clicking outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});



// ============= Multi-Group Filter Logic (Multi-Select) ==============
const filterGroups = document.querySelectorAll('.tag-filter');
// const bookItems = document.querySelectorAll('.book-list li');

// Stores selected tags as arrays
const selectedFilters = {
  type: [],
  // language: []
};

filterGroups.forEach(group => {
  const groupName = group.dataset.filterGroup;
  const buttons = group.querySelectorAll('.tag-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;

      // Toggle 'active' class
      btn.classList.toggle('active');

      // Handle "All" logic
      if (tag === 'all') {
        selectedFilters[groupName] = [];
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        // Remove "All" if another tag is selected
        const allBtn = group.querySelector('[data-tag="all"]');
        allBtn.classList.remove('active');

        // Add/remove tag from array
        const index = selectedFilters[groupName].indexOf(tag);
        if (index > -1) {
          selectedFilters[groupName].splice(index, 1); // Remove
        } else {
          selectedFilters[groupName].push(tag); // Add
        }

        // If none selected, revert to 'all'
        if (selectedFilters[groupName].length === 0) {
          allBtn.classList.add('active');
        }
      }

      applyFilters();
    });
  });
});



// =============== Shuffle the list of tools on page load ================
function shuffleList() {
  const list = document.querySelector('.book-list');
  const items = Array.from(list.children);

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // Re-append the shuffled items to the list
  items.forEach(item => list.appendChild(item));
}

// Call it on page load
shuffleList();


// =================== Intro Modal ============================
const introModal = document.getElementById('intro-modal');
const startBtn = document.getElementById('start-exploring');

startBtn.addEventListener('click', () => {
  introModal.classList.add('hidden');
});

// Open the intro modal when "View Project Info" button is clicked
const viewInfoBtn = document.getElementById('view-info-btn');

viewInfoBtn.addEventListener('click', () => {
  introModal.classList.remove('hidden');
});

