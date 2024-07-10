// Add submit event listener for adding new material
 addMaterialForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newMaterial = {};
  for (const field of addMaterialForm.elements) {
   if (field.type !== 'submit') {
    newMaterial[field.id] = field.value;
   }
  }

  // Add new material to sample data (replace with actual data storage logic)
  sampleData.push(newMaterial);

  addForm.style.display = 'none';
  addSuccess.style.display = 'block';
  addSuccess.textContent = 'New material entry added successfully!';

  // Clear form fields
  addMaterialForm.reset();
 });

 continueButton.addEventListener('click', () => {
  searchForm.style.display = 'none';
  addForm.style.display = 'none';
  continueForm.style.display = 'block';
  searchResults.innerHTML = '';
 });

 const continueSubmit = document.getElementById('continue-submit');
 continueSubmit.addEventListener('click', () => {
  const enteredMaterialName = document.getElementById('continue-input').value;
  editingEntry = sampleData.find(entry => entry.material_name === enteredMaterialName);

  if (editingEntry) {
   // Display partially filled form for editing
   addForm.style.display = 'block';
   continueForm.style.display = 'none';

   const addMaterialForm = document.getElementById('add-material-form');
   addMaterialForm.innerHTML = '';
   for (const key in editingEntry) {
    const label = document.createElement('label');
    label.textContent = key;
    label.setAttribute('for', key);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = key;
    input.value = editingEntry[key];

    addMaterialForm.appendChild(label);
    addMaterialForm.appendChild(input);
   }

   // Add submit event listener for editing material (modify based on your logic)
   addMaterialForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Update existing material in sample data (replace with actual data storage logic)
    for (const key in editingEntry) {
     editingEntry[key] = document.getElementById(key).value;
    }

    addForm.style.display = 'none';
    addSuccess.style.display = 'block';
    addSuccess.textContent = 'Material entry edited successfully!';

    editingEntry = null; // Clear editing state
   });
  } else {
   alert('Material not found for editing!');
  }
 });

 const searchSubmit = document.getElementById('search-submit');
 searchSubmit.addEventListener('click', () => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  currentSearchTerm = searchTerm;
  currentSearchBy = document.getElementById('search-by').value;

  searchResults.innerHTML = '';
  let resultsFound = false;

  for (const entry of sampleData) {
   let match = false;
   switch (currentSearchBy) {
    case 'material_name':
     match = entry.material_name.toLowerCase().includes(searchTerm);
     break;
    case 'thickness':
     match = entry.thickness.toString().includes(searchTerm);
     break;
    case 'density':
     match = entry.density.toString().includes(searchTerm);
     break;
   }

   if (match) {
    resultsFound = true;
    const resultElement = document.createElement('div');
    resultElement.classList.add('search-result');

    // Display relevant material details based on search criteria
    let resultText = `<b>Material Name:</b> ${entry.material_name}`;
    if (currentSearchBy !== 'material_name') {
     resultText += ` - Found for ${currentSearchBy}: ${searchTerm}`;
    }
    resultElement.innerHTML = resultText;

    searchResults.appendChild(resultElement);
   }
  }

  if (!resultsFound) {
   searchResults.innerHTML = '<p>No results found for your search.</p>';
  }

  searchForm.style.display = 'block';
  addForm.style.display = 'none';
    continueForm.style.display = 'none';
 });
});
