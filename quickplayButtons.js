// quickPlayButtons.js

    const mainContainer = document.getElementById('app');
    const channelTemplateContainer = document.querySelector('.channel-template');
    const channelTemplate = channelTemplateContainer.querySelector('.channel');
    const quickPlayButtons = [];
    const quickPlayButtonContainer = document.querySelector('.quickplay-button-container');

    // Function to create the quickplay-button
    function createQuickPlayButton(index) {
        const btn = document.createElement('div');
        btn.classList.add('quickplay-button');
        btn.dataset.sequenceIndex = index; // Store the sequence index as a data attribute
        btn.innerHTML = `<strong>${index}</strong>`; // Add the number to the button
        quickPlayButtons.push(btn); // Add the button to the array
        quickPlayButtonContainer.appendChild(btn); // Append the button to the container
        return btn;
    }

    // Create and append the quickplay buttons
    for (let i = 1; i <= 16; i++) {
        createQuickPlayButton(i);
    }

    // Create and append the channels
    for (let i = 1; i <= 16; i++) {
        let clonedChannel = channelTemplate.cloneNode(true);
        clonedChannel.id = `channel-${i}`;
        mainContainer.appendChild(clonedChannel);
        // console.log(`Created Channel Name: ${clonedChannel.id}, Index: ${i}`);
    }

    channelTemplateContainer.remove();

    let rightClickedButton = null;

    // Loop through all the quick play buttons and attach the contextmenu event listener
    quickPlayButtons.forEach((button) => {
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent the default context menu from showing up
            e.stopPropagation(); // Prevent the event from propagating to the document

            rightClickedButton = e.currentTarget; // Set the right-clicked button

            const colorPicker = document.getElementById('colorPicker');
            colorPicker.style.display = 'grid';
            colorPicker.style.left = e.pageX + 'px';
            colorPicker.style.top = e.pageY + 'px';
            document.body.appendChild(colorPicker); // Append to the body
        });
    });

     // Hide the color picker when clicking outside
     document.addEventListener('click', (e) => {
        const colorPicker = document.getElementById('colorPicker');
        if (e.target !== colorPicker && !colorPicker.contains(e.target)) {
            colorPicker.style.display = 'none';
        }
    });

    


    document.querySelectorAll('.color-option').forEach((colorOption) => {
        colorOption.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop the event from propagating to the document
            const selectedColor = getComputedStyle(e.target).backgroundColor;
            rightClickedButton.style.backgroundColor = selectedColor; // Assuming rightClickedButton is the button that was right-clicked
        });
    });

    function updateActiveQuickPlayButton() {
    // Remove 'active' class from all buttons
    quickPlayButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add 'active' class to current sequence button
    const activeBtn = quickPlayButtons[currentSequence - 1];
    activeBtn.classList.add('active');
}



// Now that the quickplay buttons have been inserted, we can set up their event listeners.
quickPlayButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const sequenceIndex = parseInt(button.dataset.sequenceIndex, 10);
        currentSequence = sequenceIndex;
        loadSequence(sequenceIndex);

        // Update the display and highlight the active button
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
        updateActiveQuickPlayButton();
    });

});



