document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    inputBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    searchBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchBook();
    });
  
    // Check if there are existing books in localStorage
    const storedBooks = localStorage.getItem('books');
    let books = storedBooks ? JSON.parse(storedBooks) : [];
  
    renderBooks();
  
    function addBook() {
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = document.getElementById('inputBookYear').value;
      const isComplete = document.getElementById('inputBookIsComplete').checked;
  
      const book = {
        id: +new Date(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: isComplete,
      };
  
      books.push(book);
      updateStorage();
      renderBooks();
      clearForm();
    }
  
    function searchBook() {
      const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
      const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
      renderBooks(filteredBooks);
    }
  
    function renderBooks(filteredBooks = books) {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
  
      filteredBooks.forEach((book) => {
        const bookItem = createBookItem(book);
  
        if (book.isComplete) {
          completeBookshelfList.appendChild(bookItem);
        } else {
          incompleteBookshelfList.appendChild(bookItem);
        }
      });
    }

    function editBook(bookId, newTitle, newAuthor, newYear) {
      books = books.map((book) => {
          if (book.id === bookId) {
              book.title = newTitle;
              book.author = newAuthor;
              book.year = newYear;
          }
          return book;
      });

      updateStorage();
      renderBooks();
    }

    function showEditDialog(book) {
      const newTitle = prompt('Edit Judul Buku:', book.title);
      const newAuthor = prompt('Edit Penulis Buku:', book.author);
      const newYear = prompt('Edit Tahun Buku:', book.year);

      if (newTitle !== null && newAuthor !== null && newYear !== null) {
          editBook(book.id, newTitle, newAuthor, newYear);
      }
    }

    function createBookItem(book) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');
  
      const titleElement = document.createElement('h3');
      titleElement.innerText = book.title;
  
      const authorElement = document.createElement('p');
      authorElement.innerText = `Penulis: ${book.author}`;
  
      const yearElement = document.createElement('p');
      yearElement.innerText = `Tahun: ${book.year}`;
  
      const actionElement = document.createElement('div');
      actionElement.classList.add('action');
  
      const toggleButton = document.createElement('button');
      toggleButton.classList.add(book.isComplete ? 'green' : 'red');
      toggleButton.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
      toggleButton.addEventListener('click', function () {
        toggleBookStatus(book.id);
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = 'Hapus buku';
      deleteButton.addEventListener('click', function () {
        deleteBook(book.id);
      });

      const editButton = document.createElement('button');
        editButton.classList.add('blue');
        editButton.innerText = 'Edit Buku';
        editButton.addEventListener('click', function () {
            showEditDialog(book);
        });
  
      actionElement.appendChild(editButton);
      actionElement.appendChild(toggleButton);
      actionElement.appendChild(deleteButton);
  
      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      bookItem.appendChild(yearElement);
      bookItem.appendChild(actionElement);
  
      return bookItem;
    }
  
    function toggleBookStatus(bookId) {
      books = books.map((book) => {
        if (book.id === bookId) {
          book.isComplete = !book.isComplete;
        }
        return book;
      });
  
      updateStorage();
      renderBooks();
    }
  
    function deleteBook(bookId) {
      books = books.filter((book) => book.id !== bookId);
  
      updateStorage();
      renderBooks();
    }
  
    function updateStorage() {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    function clearForm() {
      inputBookForm.reset();
    }
  });
  