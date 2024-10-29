
// Model: Handles data storage and logic
const Model = {
  users: ['User 1', 'User 2', 'User 3', 'User 4'],
  currentUser: 'User 1',
  notes: [],
  userVotes: {},

  initializeUserVotes() {
    this.users.forEach(user => {
      this.userVotes[user] = {};
      this.notes.forEach((note, index) => {
        this.userVotes[user][index] = null;
      });
    });
  },

  addNote(text) {
    const newNote = {
      text,
      author: this.currentUser,
      totalVotes: 0
    };
    this.notes.push(newNote);
    this.initializeUserVotes();
  },

  updateVote(noteIndex, voteType) {
    const note = this.notes[noteIndex];
    const currentVote = this.userVotes[this.currentUser][noteIndex];

    if (currentVote === voteType) {
      // Undo the vote
      this.userVotes[this.currentUser][noteIndex] = null;
      if (voteType === 'upvote') note.totalVotes--;
      if (voteType === 'downvote') note.totalVotes++;
    } else {
      if (currentVote === 'upvote') note.totalVotes--;
      if (currentVote === 'downvote') note.totalVotes++;
      if (voteType === 'upvote') note.totalVotes++;
      if (voteType === 'downvote') note.totalVotes--;
      this.userVotes[this.currentUser][noteIndex] = voteType;
    }
  },

  switchUser(user) {
    this.currentUser = user;
  }
};

// View: Handles rendering and updating the DOM
const View = {
  renderNotes() {
    const notesContainer = $('#notesContainer');
    notesContainer.empty(); // Clear all existing notes
    Model.notes.forEach((note, index) => {
      const canVote = note.author !== Model.currentUser;
      let voteStatus = '';
      const userVote = Model.userVotes[Model.currentUser][index];

      if (userVote === 'upvote') {
        voteStatus = `<button class="btn btn-success" data-index="${index}" data-vote="upvote">↑</button>
                      <button class="btn btn-outline-secondary" data-index="${index}" data-vote="downvote">↓</button>`;
      } else if (userVote === 'downvote') {
        voteStatus = `<button class="btn btn-outline-secondary" data-index="${index}" data-vote="upvote">↑</button>
                      <button class="btn btn-danger" data-index="${index}" data-vote="downvote">↓</button>`;
      } else {
        voteStatus = `<button class="btn btn-outline-secondary" data-index="${index}" data-vote="upvote">↑</button>
                      <button class="btn btn-outline-secondary" data-index="${index}" data-vote="downvote">↓</button>`;
      }

      // Show totalVotes to everyone if they are the author OR if they have voted
      const showVotes = (canVote && userVote) || !canVote;

      const noteHtml = `<div class="card card-vote">
                        <div class="vote-box">
                            <span class="note-title">${note.text} (by ${note.author})</span>
                            <div class="vote-actions">
                                ${canVote ? voteStatus : ''}
                                <span class="ms-2">${showVotes ? note.totalVotes : ''}</span>
                            </div>
                        </div>
                      </div>`;
      notesContainer.append(noteHtml);
    });
  },

  updateLoggedInUser() {
    $('#loggedInUser').text(`Logged in as ${Model.currentUser}`);
  }
};


// Controller: Handles interactions and updates Model and View
const Controller = {
  init() {
    Model.initializeUserVotes();
    View.renderNotes();
    this.bindEvents();
  },

  bindEvents() {
    // Add new note
    $('#addNoteButton').on('click', function () {
      const noteText = $('#newNoteInput').val().trim();
      if (noteText) {
        Model.addNote(noteText);
        $('#newNoteInput').val('');
        View.renderNotes(); // Re-render notes after adding
      }
    });

    // Handle vote
    $(document).on('click', '.vote-actions button', function () {
      const noteIndex = $(this).data('index');
      const voteType = $(this).data('vote');
      Model.updateVote(noteIndex, voteType);
      View.renderNotes(); // Re-render notes after voting
    });

    // Switch user
    $('#userDropdown a').on('click', function (e) {
      e.preventDefault();
      const selectedUser = $(this).data('user');
      Model.switchUser(selectedUser);
      View.updateLoggedInUser();
      View.renderNotes(); // Re-render notes for the new user
    });
  }
};

// Initialize the application
Controller.init();
