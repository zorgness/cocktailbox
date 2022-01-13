document.addEventListener("DOMContentLoaded", function() {

    // Show Alert only once
    const div_alert = document.querySelector(".div-alert");
    showAlert(div_alert);
    
  
    const userName = document.getElementById("user_name");
    const searchInput = document.getElementById('searchInput');
    const results = document.getElementById('results');
    const single_result = document.getElementById('single-result');
    const form = document.querySelector('form');
    const form_comment = document.getElementById("formcomment");
    const popular = document.getElementById("popular");
    const image_popular = document.querySelectorAll(".popular-img");
    const main_grid = document.querySelector(".main-grid");
    const title_2 = document.getElementById("title-2");
    const comment_section = document.getElementById("comment-section");
    const comment_result = document.getElementById("comment-result");
    const favorites_title = document.getElementById("favorites-title");
    const btn_favorites = document.getElementById("btn-favorites");
    const paginator = document.querySelector(".paginator");
    const pagination = document.querySelector(".pagination");
    const footer = document.querySelector("footer");
    
  
  
    
    
    if(!paginator) return 
      paginator.style.display = "none";
   
    if(userName !== null) {
      userName.innerHTML  = userName.innerHTML.toLocaleUpperCase();
    }
      
    if(title_2 !== null) {
      title_2.style.display = "none";
    }
      
    if(comment_section !== null) {
      comment_section.style.display = "none";
    }
      
    if(favorites_title !== null) {
      favorites_title.style.display = "none";
    }
  
  
  btn_favorites == null ? null : btn_favorites.addEventListener('click', function() {
      
      popular.style.display = "none";
      single_result.style.display = "none";
      paginator.style.display = "none";
      favorites_title.style.display = "block";
      getFavorite(results);
      open_animation(results);
      
    })
  
  
  
  
  let urlSearch = '';
  
  const fetchSearch = async(url) => {
      drinks = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/${url}`)
      .then(res => res.json())
      .then(res => res.drinks)
      .catch((error) => {
        console.log(error)
      }); 
  };
  // end fetchsearch
  
  async function searchDisplay(page) {
  
      await fetchSearch(urlSearch);
      footer.style.display = "none";
      
      if(urlSearch.includes('search.php?s=') && drinks.length > 1 || urlSearch.includes('filter.php?i=')) {     
        comment_section.style.display = "none";
        onSinglePage(false, comment_result);
        
    
      } else {
        single_result.style.display = "block";
        comment_section.style.display = "block";
        onSinglePage(true, comment_result);
        }
      
      function showResult(datas) {
  
        if (datas == null) {
          results.innerHTML = `<span class="noResult">No results</span>`;
        }
        popular.style.display = "none";
        main_grid.style.display = "none";
        favorites_title.style.display = "none";
        title_2.style.display = "block";
        paginator.style.display = "none";
        
        
        if(datas.length > 1) {
          paginator.style.display = "block";
          single_result.innerHTML = "";
          results.innerHTML = (
          
          datas.map(drink => (cardFormat(drink))).join(''))
            
          
        } else {
          results.innerHTML = "";
          paginator.style.display = "none";
          single_result.innerHTML = (
            datas.map(drink => singlePageFormat(drink))
            
          )};
    
            
      }
  
      showResult(createPagination(drinks, pagination, page));
     
      //method inside searchDisplay
  
      const li = document.querySelectorAll("li");
      const likeBtn = document.querySelectorAll(".like-btn");
      const recipe = document.querySelectorAll("#recipe");
      const infos = document.querySelectorAll("#infos");
      const readMore = document.querySelectorAll(".more");
      const online = document.getElementById("is-online");
      const btn_pagination = document.querySelectorAll(".page-item");
      
  
      
      isOnLine(online, likeBtn, comment_section);
      counter();
  
      singlePage(readMore);
      
      
  
      li.forEach(element => {
        if(element.innerHTML == "null" || element.innerHTML == "" || element.innerHTML == "undefined") {
            element.style.display = "none";
        
      }});
  
      infos.forEach(x => x.innerHTML.includes("undefined" ) ? x.style.display = "none" : x.style.display = "block" );
  
  
      recipe.forEach(element => {
        if(element.innerHTML === "null" || element.innerHTML === "undefined") {
            element.style.display = "none";
        }
      });
  
  
  
      likeBtn.forEach(element => {
        element.addEventListener('click', function() {
          getLike(element.dataset.id, element.dataset.name, element.dataset.image);    
        })   
      });
  
     
  
      btn_pagination.forEach(x => {
          x.addEventListener('click', () => {
          current_page = x.dataset.page;
          searchDisplay(current_page);
          })
          
      });
  
      
      // end method searchdisplay
  
  
    };
    // end searchDisplay
  
     
  if(form !== null) {
      form.onsubmit = () => {
        paginator.style.display = "none";
        if(searchInput.value !== null) { 
            urlSearch = `search.php?s=${searchInput.value}`;
            
            searchDisplay();
            open_animation(results);
            searchInput.value = "";
            
            return false;
        }
    }
    
    };
  
  // end form submit
  
  image_popular.forEach(element => {
    element.addEventListener('click', function() {
      urlSearch = `filter.php?i=${element.dataset.ingr}`;
      searchDisplay();
      paginator.style.display = "none";
      open_animation(results);
      }) 
  });
  
  // end image_popular
  
  
  if(form_comment !== null) {
      const comment_input = document.getElementById("comment-input");
      form_comment.onsubmit = () => {
      if(comment_input.value !== null) {
         fetch('new_comment', {
        method: 'PUT',
        body : JSON.stringify({
        "text" : comment_input.value,
        "id" : form_comment.dataset.drink_id
      })
      }).then((res) => res.json())
        .then(data => {
          
          let generatedHTML = "";
            generatedHTML += (
            data.comments.map(comment => (
              commentFormat(comment)
            ))).join("")
            comment_result.innerHTML = generatedHTML;
            comment_input.value = "";      
        })
        return false;
      }};
  }
  
  // end comment_input
  
  
  // singlePage
  function singlePage(btn) {  
    btn.forEach(x => {
      x.addEventListener('click', function() {
        urlSearch = `lookup.php?i=${x.dataset.drink_id}`;
        fetch("get_id_drink", {
          method: 'PUT',
          body: JSON.stringify({"drink_id" : x.dataset.drink_id})
        }).then((res) => res.json())
        .then(data => {
          const comment_result = document.getElementById("comment-result");
          if(data.comments !== undefined) {
            document.getElementById("formcomment").dataset.drink_id = data.comments[0].drink_id;
            
            let generatedHTML = "";
            generatedHTML += (
            data.comments.map(comment => (
             commentFormat(comment)
            ))).join("")
            comment_result.innerHTML = generatedHTML;
          } else {
            document.getElementById("formcomment").dataset.drink_id = data;
            let generatedHTML = ""
            comment_result.innerHTML = generatedHTML
          }
          
          searchDisplay();
          open_animation(single_result);
          return false;
      })
    })
  })};
  
  // getfavorite 
  
  function getFavorite(div, page) {
    fetch("/favorites")
    .then((res) => res.json())
    .then(data => {
      footer.style.display ="none";
      comment_section.style.display = "none";
      comment_result.style.display = "none";
      div.innerHTML = "";
      let generatedHTML = "";
      if(data.length === 0) {
        generatedHTML = `<span class="noResult">No results</span>`
      }
      let temp = createPagination(data, pagination, page)
      generatedHTML += (
     temp.map(favorite => (
  
          `
   
            <div class="card" style="width: 18rem; padding:10px; margin-bottom:10px">
                <img data-drink_id=${favorite.idDrink} src=${favorite.strDrinkThumb} class="card-img-top more2" alt="...">
            <div class="card-body">
              <h5 class="card-title">${favorite.strDrink}</h5>
            
            </div>
            </div>
        
          `
        )).join('')
      )
      div.innerHTML = generatedHTML;
  
      //method
      if(data.length > 12) {
        paginator.style.display = "block";
      }
      const favorite_link = document.querySelectorAll(".more2");
      singlePage(favorite_link);
      
      const btn_pagination_favorites = document.querySelectorAll(".page-item");
      console.log(btn_pagination_favorites);
          btn_pagination_favorites.forEach(x => {
          x.addEventListener('click', () => {
            console.log(x.dataset.page);
            // getFavorite(results, 2);
            getFavorite(results, x.dataset.page);
          })
      
        });
  
      
    })
  }; 
  
  
  });// End domcontentloaded
  
  
  
  
  // All Functions outside domcontentloaded
  
  
  // showAlert
  
  function showAlert(recipient) {
  
    if(sessionStorage.getItem('showAlert') != "false"){
      recipient.innerHTML = `
      <div class="alert">
        <span class="closebtn">&times;</span>  
        <strong>Warning</strong></br> You should be over 18 years to use this application. </br></br> Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problem
      </div>
     `;
       sessionStorage.setItem('showAlert', "false");
       
   }
  
   const close = document.querySelector(".closebtn")
   if(close !== null) {
    close.onclick = function(){
       const div = this.parentElement;
       div.style.opacity = "0";
       setTimeout(function(){ div.style.display = "none"; }, 600);
     }
   }
  
  }
  
  
  // isOnline
  
  function isOnLine(element, btn, form) {
    console.log(element.dataset.online);
    if(element.dataset.online === "no session") {
      btn.forEach(x => x.style.display = "none");
      form.style.display = "none"; 
    } else {
      updateLike();
    }
  };
  
  
  // function getLike
  function getLike(id, name, image) {
    fetch("/like", {
      method: 'PUT',
      body: JSON.stringify({
        "drink_id" : id,
        "drink_name": name,
        "drink_image": image
    })
    }).then((res) => res.ok ? res.json() : new Error('Something went wrong'))
    .then(data => {
      // console.log(data)
      let btnToUpdate = document.getElementById("like" + id);
      if(data === 'save') {
        btnToUpdate.innerHTML = `<i class="fa fa-heart"></i>`;
        btnToUpdate.className = "like-btn btn btn-dark btn-lg"; 
        counter();   
      } else {
        btnToUpdate.innerHTML= `<i class="fa fa-heart-o"></i>`;
        btnToUpdate.className = "like-btn btn btn-light btn-lg";
        counter();   
      }
    }).catch((error) => {
      console.log(error)
    });
  }; 
  
  // updateLike
  function updateLike() {
    fetch("update")
    .then((res) => res.json())
    .then(data => {
          data.forEach(element => {
          let btnToUpdate = document.getElementById("like" + element);
          if(btnToUpdate !== null) {
            btnToUpdate.innerHTML = `<i class="fa fa-heart"></i>`;
            btnToUpdate.className = "like-btn btn btn-dark btn-lg";
          }
      })   
    }).catch((error) => {
      console.log(error)
    });
  };
  
  // Counter
  function counter() {
    fetch("counter")
    .then((res) => res.json())
    .then(data => {
      data.info.forEach(element => {
          const idDrink = element.drink_id;
          const count = element.count;
          const counter = document.getElementById("counter" + idDrink);
          if(counter !== null) {
            if(count <= 1) {
              counter.innerText = `${count} like `
            } else {
              counter.innerText = `${count} likes `
            }
          }
      })
    });
  };
  
  // onSinglePage
  async function onSinglePage(condition, div) {
    await getComment(condition);
    if(condition === true) {
      div.style.display = "block";      
    } else {
      div.style.display = "none";  
    };   
  };
  
  
  // function getComment
  async function getComment(condition) {
    
    await fetch('/comment', {
      method : 'PUT',
      body : JSON.stringify({"condition" : condition})
    }).then((res) => res.json())
    .catch((error) => {
      console.log(error)
    });
    
  };
  
  // function cardFormat
  
  function cardFormat(data) {
    if(data !== null || data !== undefined) {
      return (
        `
        <div class="card" style="width: 18rem; padding:10px; margin-bottom:10px">
            <img data-drink_id=${data.idDrink} class="card-img-top more" src='${data.strDrinkThumb}' alt="Card image cap">
            <div class="card-body">
             <h5 class="card-title">${data.strDrink}</h5>
            <div id="infos">
              <div>glass : ${data.strGlass}</div>
              <div>category : ${data.strCategory}</div>
            </div>
            
        
         <div class="div-counter" align="center">
              <strong><p id="counter${data.idDrink}">0 like</p></strong>
            </div>
          <div class="div-like" align="center">
                    <button
                     data-id=${data.idDrink} data-name=${data.strDrink} data-image=${data.strDrinkThumb} id="like${data.idDrink}" class="like-btn btn btn-light btn-lg"><i class="fa fa-heart-o"></i></button>
          </div>
            
      </div>
    </div>
      
          `
  
      )
    }
  };
  
  // function singlePageFormat
  
  
  function singlePageFormat(data) {
    if(data !== null || data !== undefined) {
      return (
        `
        <div class="searchContainer">
  
        <div class="drink-name">
        <h2>${data.strDrink}</h2>
        </div>
  
        <div class="drink-row" style="padding:15px">
          <div class="drink-image">
              <img src='${data.strDrinkThumb}'/>
          </div>
  
          
  
  
          <div class="drink-infos" style="margin:10px">
              <p>glass : ${data.strGlass}</p>
              <p>category : ${data.strCategory}</p>
          </div>
        
          <div class="drink-ingredient" >
          <h4>Ingredients</h4>
            <ul>
                <li>${ data.strIngredient1 }</li>
                <li>${ data.strIngredient2 }</li>
                <li>${ data.strIngredient3 }</li>
                <li>${ data.strIngredient4 }</li>
                <li>${ data.strIngredient5 }</li>
                <li>${ data.strIngredient6 }</li>
                <li>${ data.strIngredient7 }</li>
                <li>${ data.strIngredient8 }</li>
            </ul>
          </div>
  
        </div>
        
        <div class="div-instruction" style="padding:15px">
            <h4>How to mix:</h4>
            <p>${data.strInstructions}</p>
  
        </div>
  
        <div class="div-like">
              <button data-id=${data.idDrink} data-name=${data.strDrink} data-image=${data.strDrinkThumb} id="like${data.idDrink}" class="like-btn btn btn-light btn-lg"><i class="fa fa-heart-o"></i></button>
        </div>  
        <div class="div-counter">
            <strong><p id="counter${data.idDrink}">0 like</p></strong>
        </div>
  
      </div>
  
        `
      )
    }
  };
  
  
  // function commentFormat
  
  function commentFormat(data) {
    if(data !== null || data !== undefined) {
      return(
        `
        <div class="comment-box">
            <h2>${data.name}</h2>
            <p class="comment-text">${data.text}</p>
            <p align="right">${data.created_at.toString().slice(0,10)}</p>
        </div>
        `
      )}
  };
  
  
  // function open_animation
  
  function open_animation(div) {
       div.className += " active";
  };
  
  
  function createPagination(data, div, page) {
      
    const numberOfItems = data == null ? 0 : data.length;
    const numberPerPage = 12;
    const numberOfPages = Math.ceil(numberOfItems/numberPerPage);
    let current_page = page ? page : 1;
    console.log(current_page);
    const pageStart = (current_page -1) * numberOfPages;
    const pageEnd = pageStart + numberPerPage;
    
    
    
    
    if(numberOfItems > numberPerPage) {
      div.innerHTML = "";
    for(i = 0; i < numberOfPages; i++) {
        div.innerHTML += (
          `
          <li class="page-item" data-page=${i + 1}><a class="page-link">${i + 1}</li></a>
          `
        )}
  
    }
  
  
    return data.slice(pageStart, pageEnd);
    };
  
  
  
  
  
  
  
    
     
     
      
      
      
        
    
    
  
  