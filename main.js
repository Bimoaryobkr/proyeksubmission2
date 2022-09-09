const appBookList = [];
const RENDER_APP = 'render-app';
const DELETE_APP = 'delete-app';
const STORAGE_KEY = 'APP_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        inputbook();
    });
    if (StorageExist()) {
        loadData();
    }
});

function inputbook() {
    const Title = document.getElementById('inputBookTitle').value;
    const Author = document.getElementById('inputBookAuthor').value;
    const Year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const ID = randomId();
    const appObject = object(ID, Title, Author, Year, isCompleted);
    appBookList.push(appObject);
    document.dispatchEvent(new Event(RENDER_APP));
    saveDatatoStorage()
}

function randomId() {
    return +new Date();
}

function object(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makebook(appObject) {
    const appbook_Title = document.createElement('h3');
    appbook_Title.innerText = appObject.title;

    const appbook_Author = document.createElement('p');
    appbook_Author.innerText = 'Penulis : ' + appObject.author;

    const appbook_year = document.createElement('p');
    appbook_year.innerText = 'Tahun : ' + appObject.year;

    const elementcontainer = document.createElement('div');
    elementcontainer.classList.add('element');
    elementcontainer.append(appbook_Title, appbook_Author, appbook_year);

    const container = document.createElement('div');
    container.classList.add('inside');
    container.append(elementcontainer);
    container.setAttribute('id', `app-${appObject.id}`);

    if (appObject.isCompleted) {

        container.append(undo(appObject), remove(appObject));

    } else {

        container.append(add(appObject), remove(appObject));
    }

    return container;
}

function undo(appObject) {
    const undo = document.createElement('button');
    undo.classList.add('swap');

    undo.addEventListener('click', function () {
        backbooktounfinish(appObject.id);
    });
    return undo;
}

function add(appObject) {
    const add = document.createElement('button');
    add.classList.add('swap');

    add.addEventListener('click', function () {
        addbooktofinish(appObject.id);
    });
    return add;
}

function remove(appObject) {
    const remove = document.createElement('button');
    remove.classList.add('delete');

    remove.addEventListener('click', function () {
        removebook(appObject.id);
    });

    return remove;
}

document.addEventListener(RENDER_APP, function () {
    const appbookList = document.getElementById('appBookList');
    const finishedbookList = document.getElementById('completeBookList');
    appbookList.innerHTML = '';
    finishedbookList.innerHTML = '';

    for (const appItem of appBookList) {
        const appElement = makebook(appItem);
        if (!appItem.isCompleted) {
            appbookList.append(appElement);
        } else {
            finishedbookList.append(appElement);
        }
    }
});

function addbooktofinish(bookID) {
    const booktarget = findbook(bookID);

    if (booktarget == null) return;

    booktarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_APP));
    saveDatatoStorage()
}

function backbooktounfinish(bookID) {
    const booktarget = findbook(bookID);

    if (booktarget == null) return;

    booktarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_APP));
    saveDatatoStorage()
}

function findbook(bookID) {
    for (const appItem of appBookList) {
        if (appItem.id === bookID) {
            return appItem;
        }
    }
    return null;
}

function removebook(bookID) {
    const booktarget = findbookindex(bookID);

    if (booktarget === -1) return;

    appBookList.splice(booktarget, 1);
    document.dispatchEvent(new Event(RENDER_APP));
    DeleteDatainStorage()
}

function findbookindex(bookID) {
    for (const index in appBookList) {
        if (appBookList[index].id === bookID) {
            return index;
        }
    }
    return -1;
}

function saveDatatoStorage() {
    if (StorageExist()) {
        const parsed = JSON.stringify(appBookList);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function DeleteDatainStorage() {
    if (StorageExist()) {
        const parsed = JSON.stringify(appBookList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(DELETE_APP));
    }
}

document.addEventListener(DELETE_APP, function () {
    alert('Data buku ini telah dihapus');
});

function StorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Versi Browser yang anda gunakan tidak mendukung untuk local storage');
        return false;
    }
    return true;
}

function loadData() {
    const serialdata = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialdata);

    if (data !== null) {
        for (const appbook of data) {
            appBookList.push(appbook);
        }
    }

    document.dispatchEvent(new Event(RENDER_APP));
}