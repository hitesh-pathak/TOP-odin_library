const myLibrary = [];

const SampleBooks = [
    {
        title: "sample_book_1",
        author: "auth_1",
        numPages: 100,
        isRead: false,
    },
    {
        title: "sample_book_2",
        author: "auth_2",
        numPages: 103,
        isRead: false,
    },
    {
        title: "sample_book_3",
        author: "auth_3",
        numPages: 150,
        isRead: true,
    },

];



window.onload = (_) => {
    SampleBooks.forEach((book) => {
        addBookToLibrary(book);
    });
    populateBookGrid(myLibrary);

    newBookBtn = document.querySelector("#new_book_btn");
    newBookDialog = document.querySelector('#new_book_dialog');
    newBookBtn.addEventListener("click", (e) => newBookDialog.showModal());

    addBookBtn = document.querySelector("#add_book_btn");
    addBookForm = document.querySelector('#new_book_dialog>form');
    addBookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (e.submitter === addBookBtn) {
            const data = new FormData(e.target);
            const {title, author, numPages, isRead} = Object.fromEntries(data.entries());
            addBookToLibrary({title, author, numPages, isRead});
            populateBookGrid();
        }
        newBookDialog.close();
    })
};

function findBookGridChild(index) {
    return document.querySelector(`.main-grid-ctn > div[data='${parseInt(index)}']`);
}

function populateBookGrid(bookArray = myLibrary) {
    bookGridCtn = document.querySelector(".flex-y>.main-grid-ctn");
    bookArray.forEach((book, i) => {
        checkChild = findBookGridChild(i);
        if (!checkChild) {
            bookGridCtn.appendChild(getBookFragment(book, {data: i}));
        }
    });
}

function syncBookGrid(bookArray = myLibrary, start=0, end) {
    console.log(bookArray.slice(start, end));
    bookGridCtn = document.querySelector(".flex-y>.main-grid-ctn");
    Array.from(bookGridCtn.children).slice(start, end).forEach((child, i) => {
            if (start + i < bookArray.length) {
                child.replaceWith(getBookFragment(bookArray[start+i], {data: start+i}));
            }
            
    });

}

function Book(title, author, numPages, isRead) {
    this.title = title;
    this.author = author || "<unknown>";
    this.numPages = parseInt(numPages || 0);
    this.isRead = Boolean(isRead);

}

/* Do not use arrow func here, because this is lexically bounded, to window for that! */
Book.prototype.toggleRead = function()  {
    this.isRead = !this.isRead;   
};

function getBookFragment(book, divAttr={}) {
    const {title, author, numPages, isRead} = book;
    const bookFrag = document.createDocumentFragment();
    const bookDiv = bookFrag.appendChild(document.createElement("div"));
    Object.entries(divAttr).forEach(([attr, val]) => {
        bookDiv.setAttribute(attr, val);
    });

    const divTitle = bookDiv.appendChild(document.createElement("p"));
    divTitle.textContent = title;

    const divAuth = bookDiv.appendChild(document.createElement("p"));
    divAuth.textContent = `by: ${author}`;

    const divNumPages = bookDiv.appendChild(document.createElement("p"));
    divNumPages.textContent = `${numPages} pages`;

    const divReadStatus = bookDiv.appendChild(document.createElement("p"));
    divReadStatus.textContent = isRead ? "✅": "❌";

    const divButtonBar = bookDiv.appendChild(document.createElement("div"));
    const toggleReadBtn = divButtonBar.appendChild(document.createElement("button"));
    toggleReadBtn.textContent = "toggle read";


    const delBtn = divButtonBar.appendChild(document.createElement("button"));
    delBtn.textContent = "delete";


    bookDiv.addEventListener("click", (e) => {
        if (e.target === toggleReadBtn) {
            console.log("toggle");
            bookIndex = parseInt(e.currentTarget.getAttribute("data"));
            bookArrayItem = myLibrary[bookIndex];
            bookArrayItem.toggleRead();
            bookGridChild = findBookGridChild(bookIndex);
            if (!!bookGridChild) {
                bookGridChild.replaceWith(getBookFragment(bookArrayItem, {"data": bookIndex}))
            }           
        }
        if (e.target === delBtn) {
            console.log("del");
            bookIndex = parseInt(e.currentTarget.getAttribute("data"));
            myLibrary.splice(bookIndex, 1);
            bookGridChild = findBookGridChild(bookIndex);
            if (!!bookGridChild && !!bookGridChild.parentNode) {
                bookGridChild.parentNode.removeChild(bookGridChild);
            }
            syncBookGrid(myLibrary, bookIndex);
        }
    });

    return bookFrag;

    
}

function addBookToLibrary(book) {
   const {title, author, numPages, isRead} = book;
   if (!title) {
    alert('book title must be non-empty');
    return;
   }
   return myLibrary.push(new Book(
    title,
    author,
    parseInt(numPages),
    isRead
   ));
}






