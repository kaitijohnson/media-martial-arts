$(document).ready(function(){
  //get dat button
  $('.clearBtn').click(function(){
    console.log("I am clicked")
    $('#search').val('')
    $('.collection-item').remove()
    $('.selection').empty()
  });
  $('.searchBtn').click(function(){
    var userSearch = $('#search').val();
    console.log("search button clicked")
    $.ajax({
      //method for the HTTP request e.g. GET, POST, ..
      method: 'GET',
      //url is the place where the data lives
      url: `http://omdbapi.com/?s=${userSearch}`,
      //the format of data you want to get back
      dataType: 'json',
      //stuff that happens if I get the data I want back
      success: function(data){
        //select the "collections" element
        let movieSearch = $('.collection.movie');
        // collection[0].innerHTML = '';
        movieSearch.show();
        //go through each movie in the data returned from the API
        //display them each as li-collection elements
        var ds = data.Search;
        console.log(ds);
        for (var i = 0; i < ds.length; i++) {
          let movie = ds[i];
          let title = movie.Title
          let year = movie.Year
          $(movieSearch).append(`<li class="collection-item movie">${title} (${year})</li>`)
        }
        //add event listener to the collection element
        $('.collection-item.movie').click(function(event){
          //movie that was selected
          var movie = event.target;
          //select for the movie box
          var movieDivs = $('.selection.movie');
          for(var i = 0; i < movieDivs.length; i++){
            if(movieDivs[i].innerText === ''){
              movieDivs[i].innerHTML = `${movie.innerText}`;
              break;
            }
          }
        })
      },
      //what to do if I don't get what I want
      error: function(){
        console.log('error');
      }
    })
  })
  //search goodreads
  $('.searchBtn').click(function(){
    var userSearch = $('#search').val();
    $.ajax({
      method: 'GET',
      url: `https://www.goodreads.com/search/index.xml?key=bAi4KxX5Ou53RVtfWyIJA&q=${userSearch}`,
      dataType: 'xml',
      success: function(data) {
        // console.log("data", data);
        //select the "collections" element
        var results = $.xml2json(data);
        var work = results['#document']['GoodreadsResponse']['search']['results']['work'];
        // console.log(work);

        let bookSearch = $('.collection.book');
        bookSearch.show();

        for (var book of work) {
          // console.log(book)
          // let book = work[i];
          var rating = book['average_rating'];
          // console.log(rating)
          var author = book['best_book']['author']['name']
          // console.log(author)
          var title = book['best_book']['title']
          // console.log(title)
          $(bookSearch).append(`<li class="collection-item book">${title} (${author})</li>`)
        }
        //add event listener to the collection element
        $('.collection.book').click(function(event){
          var clickBook = event.target;
          var clickBookDivs = $('.selection.book');

          for(var i = 0; i < clickBookDivs.length; i++){
            if(clickBookDivs[i].innerText === ''){
              clickBookDivs[i].innerHTML = `${clickBook.innerText}`;
              break;
            }
          }
        })
      },
      //what to do if I don't get what I want
      error: function(){
        console.log('error');
      }
    })
  })
});
