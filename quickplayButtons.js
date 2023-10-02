// quickplayButtons.js

const mainContainer = document.getElementById('app');
const channelTemplateContainer = document.querySelector('.channel-template');
const channelTemplate = channelTemplateContainer.querySelector('.channel');
const quickPlayButtons = [];

let currentActiveIndex = null; // To track which button is currently active

function setActiveSequence(index) {
    console.log(`Setting active sequence for index: ${index}`);

    // If there's a previously active sequence, set it to inactive
    if (currentActiveIndex !== null) {
        console.log(`Deactivating previously active sequence ${currentActiveIndex}`);
        quickPlayButtons[currentActiveIndex - 1].classList.add('inactive');
    }

    // Light up the button for this index
    quickPlayButtons[index-1].classList.remove('inactive');
    console.log(`Sequence ${index} activated.`);

    // Darken other buttons  
    quickPlayButtons.forEach(button => {
        if(button !== quickPlayButtons[index-1]) {
            button.classList.add('inactive'); 
        }
    });
    console.log(`${quickPlayButtons.length} quickplay buttons made inactive.`);
    console.log("All quickplay button indexes: ", quickPlayButtons.map(btn => btn.dataset.sequenceIndex));

    currentActiveIndex = index;
}

function updateActiveQuickPlayButton() {
    // Remove 'active' class from all buttons
    quickPlayButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add 'active' class to current sequence button
    const activeBtn = quickPlayButtons[currentSequence - 1];
    activeBtn.classList.add('active');
}

function insertQuickPlayButtons() {
    console.log("insertQuickPlayButtons called!");

    const checkBox = document.getElementById('continuous-play');
    const quickPlayButton = document.getElementById('quick-play-button');

    if (checkBox && quickPlayButton) {
        for (let j = 0; j < 16; j++) {
            const quickBtn = createQuickPlayButton(j + 1);
            console.log(`Created Quick Play Button for Sequence_${j+1}`);
            checkBox.parentNode.insertBefore(quickBtn, quickPlayButton);
            console.log(`Added Quick Play Button for Sequence_${j+1} to DOM`);
        }
        console.log(`${quickPlayButtons.length} quickplay buttons inserted.`);

    } else {
        console.error("Either checkBox or quickPlayButton is missing!");
    }
}

insertQuickPlayButtons();

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

// Function to create the quick-play-button
function createQuickPlayButton(index) {
    console.log(`Creating quickplay button with index: ${index}`);
    const button = document.createElement('div');
    button.classList.add('quick-play-button');
    button.dataset.sequenceIndex = index; // Store the sequence index as a data attribute
    console.log(`Button for sequence ${index} has data attribute:`, button.dataset.sequenceIndex);
    button.style.textAlign = "center"; // Center the text
    button.style.fontWeight = "bold"; // Bold the text
    button.innerHTML = index; // Add the number inside the button
    quickPlayButtons.push(button); // Add the button to the array
    console.log(`Quickplay button added. Current count: ${quickPlayButtons.length}`);
    console.log("Current indexes: ", quickPlayButtons.map(btn => btn.dataset.sequenceIndex));

    // Add a click event to set the sequence as active when clicked
    button.addEventListener('click', function() {
        console.log(`Quickplay button for index ${index} clicked.`);
        setActiveSequence(index);
    });
    

    // Add right-click event listener
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent default context menu
        showColorPicker(event, button); // Show custom color picker
    });

    return button;
}


quickPlayButtons.forEach(button => button.classList.add('inactive'));


for (let i = 1; i <= 16; i++) {
    let clonedChannel = channelTemplate.cloneNode(true);
    clonedChannel.id = `channel-${i}`;
    mainContainer.appendChild(clonedChannel);
    console.log(`Created Channel Name: ${clonedChannel.id}, Index: ${i}`);
}

channelTemplateContainer.remove();

function showColorPicker(event, button) {
    // Define colors for the grid
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#808080', '#FFFFFF',
                    '#FFA500', '#800080', '#008080', '#000080', '#800000', '#008000', '#FFC0CB', '#D2691E'];

    // Create color picker container
    const colorPicker = document.createElement('div');
    colorPicker.style.position = 'absolute';
    colorPicker.style.display = 'grid';
    colorPicker.style.gridTemplateColumns = 'repeat(4, 1fr)';
    colorPicker.style.gap = '1px';

    // Determine the height of the color grid in pixels (assuming each color div is 20px in height and there's a 4px gap)
    const gridHeight = (colors.length / 4) * 20; // 24 = 20px (height) + 4px (gap)

    colorPicker.style.top = (event.clientY - gridHeight) + 'px'; // Position it above the button
    colorPicker.style.left = event.clientX + 'px';

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.width = '20px';
        colorDiv.style.height = '20px';
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', function() {
            button.style.backgroundColor = color; // Set the button's background color
            colorPicker.remove(); // Remove the color picker
        });
        colorPicker.appendChild(colorDiv);
    });

    // Add the color picker to the body
    document.body.appendChild(colorPicker);

    // Set a timeout to remove the color picker after 2 seconds
    setTimeout(() => {
        colorPicker.remove();
    }, 2000);

    // Add a global click listener to remove the color picker when clicked outside
    document.addEventListener('click', function removePicker() {
        colorPicker.remove();
        document.removeEventListener('click', removePicker);
    });
}