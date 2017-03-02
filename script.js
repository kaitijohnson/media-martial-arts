$(document).ready(function(){
  //get dat button
  $('.clearBtn').click(function(){
    console.log("I am clicked")
    $('#search').val('')
    $('.collection-item').remove()
    $('.selection').empty()
  });
  $('.fightBtn').click(function(){
    var bookCompare = $('.selection.book').attr('data')
    console.log('.fightBtn -> click / bookCompare = ', bookCompare);
    var movieCompare = $('.selection.movie').attr('data')
    console.log('.fightBtn -> click / bookCompare = ', movieCompare)
  })
  $('.searchBtn').click(function(){
    var userSearch = $('#search').val();

    var selectedBook = $('.collection-item.book')
    $.ajax({
      //method for the HTTP request e.g. GET, POST, ..
      method: 'GET',
      //url is the place where the data lives
      url: `http://omdbapi.com/?t=${userSearch}`,
      //the format of data you want to get back
      dataType: 'json',
      //stuff that happens if I get the data I want back
      success: function(data){
        console.log(data)
        //select the "collections" element
        let movieSearch = $('.collection.movie');
        // collection[0].innerHTML = '';
        movieSearch.show();
        //go through each movie in the data returned from the API
        //display them each as li-collection elements
        // var imdbRating = data.imdbRating;
        // console.log(data);
        // for (var i = 0; i < data.length; i++) {
        //   let movie = ds[i];
          let title = data.Title
          let year = data.Year
          let movieRating = data.imdbRating/2
          console.log(movieRating)
          $(movieSearch).append(`<li class="collection-item movie" data="${movieRating}">${title} (${year})</li>`)
        // }
        //add event listener to the collection element
        $('.collection-item.movie').click(function(event){
          console.log('.collection-item.move -> click')
          //movie that was selected
          var movie = event.target;
          //select for the movie box
          // var selectedMovie = $('.collection-item.movie').text()



          var movieDivs = $('.selection.movie').attr('data', movieRating);

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
  // })
  // $('.searchBtn').click(function(){
  //   var userSearch = $('#search').val();
  //
  // search goodreads
    $.ajax({
      method: 'GET',
      url: `https://www.goodreads.com/search/index.xml?key=bAi4KxX5Ou53RVtfWyIJA&q=${userSearch}`,
      dataType: 'xml',
      success: function(data) {
        // console.log("data", data);
        //select the "collections" element
        var results = $.xml2json(data);
        var work = results['#document']['GoodreadsResponse']['search']['results']['work'];
        console.log(work);

        let bookSearch = $('.collection.book');
        bookSearch.show();

        for (var book of work) {
          // console.log(book)
          // let book = work[i];
          var ratingStr = book['average_rating'];
          // console.log(rating)
          var bookRating = parseFloat(ratingStr).toFixed(1)
          var author = book['best_book']['author']['name']
          // console.log(author)
          var title = book['best_book']['title']
          // console.log(title)
          console.log('appending li')
          $(bookSearch).append(`<li class="collection-item book" data-rating="${bookRating}">${title} (${author})</li>`)
        }
        //add event listener to the collection element
        $('.collection.book').click(function(event){
          var clickBook = event.target;
          var clickBookDivs = $('.selection.book').attr('data', bookRating);
          // var ratingThing = $(event.target).data("bookRating");
// console.log(ratingThing)

          for(var i = 0; i < clickBookDivs.length; i++){
            if(clickBookDivs[i].innerText === ''){
              clickBookDivs[i].innerHTML = `${clickBook.innerText}`;
              // clickBookDivs[i].append(<li class="selection book"> + ratingThing + </li>)

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
