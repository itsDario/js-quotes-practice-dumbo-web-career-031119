// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

// no
const quoteBox = document.getElementById('quote-list')
const quoteForm = document.getElementById('new-quote-form')
const newQuoteBox = document.getElementById('new-quote')
const newQuoteAuthor = document.getElementById('author')


const getQuotes = () => {
    fetch('http://localhost:3000/quotes')
        .then(res => res.json())
        .then(displayQuotes)
}

const incrementLikes = (newLike, target) => {
    console.log(newLike, target);

    fetch(`http://localhost:3000/quotes/${target}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            likes: newLike
        })
    })
}

const deleteQuote = (target) => {
    fetch(`http://localhost:3000/quotes/${target}`, {
        method: 'DELETE'
    })
}

const handleForm = formSubmission => {
    formSubmission.preventDefault()
    // console.log(newQuoteBox.value);
    // console.log(newQuoteAuthor.value);
    fetch(`http://localhost:3000/quotes`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
            },
            body: JSON.stringify({
                quote: newQuoteBox.value,
                author: newQuoteAuthor.value,
                likes: 0
            })
        }).then(res => res.json())
        .then(addSingle)
}

const displayQuotes = (qArray) => {
    qArray.forEach(addSingle)
}

const addSingle = (singleq) => {
    quoteBox.innerHTML +=
        `<li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${singleq.quote}</p>
          <footer class="blockquote-footer">${singleq.author}</footer>
          <br>
          <button data-id=${singleq.id} class='btn-success'>Likes: <span>${singleq.likes}</span></button>
          <button data-id=${singleq.id} class='btn-danger'>Delete</button>
        </blockquote>
      </li>`
}

const handleClicks = (clickEvent) => {
    let theID = clickEvent.target.dataset.id
    if (clickEvent.target.className == 'btn-success') {
        let newLike = parseInt(clickEvent.target.firstElementChild.innerHTML) + 1
        let theID = clickEvent.target.dataset.id
        clickEvent.target.firstElementChild.innerHTML = newLike
        incrementLikes(newLike, theID)
    }
    if (clickEvent.target.className == 'btn-danger') {
        clickEvent.target.parentElement.parentElement.remove()
        deleteQuote(theID)
    }
}

quoteBox.addEventListener('click', handleClicks)
quoteForm.addEventListener('submit', handleForm)
getQuotes()