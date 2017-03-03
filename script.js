$(document).ready(function() {
  $('#modal1').modal();

  // Clear all dynamically generated content

  $('.clearBtn').click(function() {
    $('#search').val('');
    $('.collection-item').remove();
    $('.selection').empty();
    $('.collection').removeAttr('style');
  });
  $('.clearModalBtn').click(function() {
    $('#search').val('');
    $('.collection-item').remove();
    $('.selection').empty();
    $('#winner').remove();
    $('#scores').remove();
    $('.collection').removeAttr('style');
  });

  // Compare scores of selection

  $('.fightBtn').click(function() {
    let audio = $('#bellSound')[0];

    audio.play();

    let bookCompare = $('.selection.book').attr('data');
    let movieCompare = $('.selection.movie').attr('data');
    let selection = $('.selection.book').text();

    if (selection.includes('(Nicholas Sparks)')) {
      $('#results').append(`<h2 id="winner" class="center">You lose!</h2><br><p class="center searchBox" id="scores">You have selected a work by Nicholas Sparks. <br>Please improve your taste and try again.</p>`);
    }
    else if (bookCompare > movieCompare) {
      $('#results').append(`<h2 id="winner" class="center">The book is better!</h2><br><p class="center searchBox" id="scores"> The book has an average user rating of ${bookCompare} out of 5. <br>The movie is rated at ${movieCompare}.</p>`);
    }
    else if (movieCompare > bookCompare) {
      $('#results').append(`<h2 id="winner" class="center">The movie is better!</h2><div><p class="center resultsbox" id="scores"> The movie has an average user rating of ${movieCompare} out of 5.<br>The book is rated at ${bookCompare}.</p></div>`);
    }
    else if (bookCompare === movieCompare) {
      $('#results').append(`<h2 id="winner">It's a draw!</h2><br><p id="scores"> Both the movie and the book are rated at ${bookCompare} out of 5.</p>`);
    }
  })

  // Event listener to trigger API calls

  $('#search').keydown(function(event) {
    if (event.keyCode === 13) {
      $('.searchBtn').trigger('click');
    }
  });
  $('.searchBtn').click(function() {
    let userSearch = $('#search').val();
    let selectedBook = $('.collection-item.book');

    // search OMDB

    $.ajax({
      method: 'GET',
      url: `http://omdbapi.com/?t=${userSearch}`,
      dataType: 'json',
      success: function(data) {
        let movieSearch = $('.collection.movie');

        movieSearch.show();

        let title = data.Title
        let year = data.Year
        let movieRating = (data.imdbRating / 2).toFixed(1)

        $(movieSearch).append(`<li class="collection-item movie" data="${movieRating}">${title} (${year})</li>`)

        // Event listener to click selection

        $('.collection-item.movie').click(function(event) {
          let movie = event.target;
          let movieDivs = $('.selection.movie').attr('data', movieRating);

          for (let i = 0; i < movieDivs.length; i++) {
            if (movieDivs[i].innerText === '') {
              movieDivs[i].innerHTML = `${movie.innerText}`;
              break;
            }
          }
        })
      },

      // what to do if I don't get what I want

      error: function() {
        console.log('error');
      }
    })

    // search goodreads

    $.ajax({
      method: 'GET',
      url: `https://www.goodreads.com/search/index.xml?key=bAi4KxX5Ou53RVtfWyIJA&q=${userSearch}`,
      dataType: 'xml',
      success: function(data) {
        let results = $.xml2json(data);
        let work = results['#document']['GoodreadsResponse']['search']['results']['work'];
        let bookSearch = $('.collection.book');

        bookSearch.show();

        for (var book of work) {
          var bookRating = book['average_rating'];
          let author = book['best_book']['author']['name'];
          let title = book['best_book']['title'];

          $(bookSearch).append(`<li class="collection-item book" data="${bookRating}">${title} (${author})</li>`);
        }

        // Event listener to click the selection

        $('.collection.book').click(function(event) {
          let clickBook = event.target;
          let clickBookDivs = $('.selection.book').attr('data', bookRating);

          for (let i = 0; i < clickBookDivs.length; i++) {
            if (clickBookDivs[i].innerText === '') {
              clickBookDivs[i].innerHTML = `${clickBook.innerText}`;
              break;
            }
          }
        })
      },

      // what to do if I don't get what I want

      error: function() {
        console.log('error');
      }
    })
  })
});
