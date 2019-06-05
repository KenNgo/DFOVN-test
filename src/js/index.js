(function() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCsjOZptxs39BEvSqifL77pRn1BhB-_K7Y",
    authDomain: "todo-app-6293f.firebaseapp.com",
    databaseURL: "https://todo-app-6293f.firebaseio.com",
    projectId: "todo-app-6293f",
    storageBucket: "todo-app-6293f.appspot.com",
    messagingSenderId: "1082091469672",
    appId: "1:1082091469672:web:ab16ba733f28c047"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const dbRef = firebase.database().ref();
  const todoListRef = dbRef.child("todo-list");

  var itemListUI = document.querySelector(".todo-list");

  var myNodelist = {},
    i = 0,
    length = 0,
    btnToggleAll = document.querySelector(".btn-toggl"),
    btnFilter = document.querySelectorAll(".filter .btn"),
    input = document.querySelector("#myInput");

  todoListRef.on("child_added", snap => {
    let item = snap.val();
    let $li = document.createElement("li");
    $li.innerHTML = item.item;
    $li.setAttribute("data-key", snap.key);
    itemListUI.append($li);
    addCloseButton($li);

    myNodelist = document.getElementsByTagName("LI");
    length = myNodelist.length;
  });

  var list = document.querySelector("ul");
  list.addEventListener(
    "click",
    function(ev) {
      if (ev.target.tagName === "LI") {
        ev.target.classList.toggle("checked");
      }
    },
    false
  );

  btnToggleAll.addEventListener("click", function(e) {
    length = myNodelist.length;
    i = 0;
    if (!this.classList.contains("active")) {
      this.classList.add("active");
      for (i; i < length; i++) {
        myNodelist[i].classList.add("checked");
      }
    } else {
      this.classList.remove("active");
      for (i; i < length; i++) {
        myNodelist[i].classList.remove("checked");
      }
    }
    filter(checkFilterButtons());
  });

  for (i = 0; i < btnFilter.length; i++) {
    let btn = btnFilter[i],
      type = "";
    btn.addEventListener("click", function(e) {
      for (i = 0; i < btnFilter.length; i++) {
        btnFilter[i].classList.remove("active");
      }
      this.classList.add("active");
      type = checkFilterButtonSelected(this);
      filter(type);
    });
  }

  input.onkeydown = function(e) {
    var keyCode = e.which;

    if (keyCode === 13) {
      newElement();
    }
  };

  function addCloseButton(li) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");

    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    // add click event
    span.onclick = function() {
      var parent = this.parentElement;
      parent.style.display = "none";

      var itemID = parent.dataset.key;
      var itemRef = dbRef.child("todo-list/" + itemID);
      itemRef.remove();
    };
  }

  function checkFilterButtonSelected(btn) {
    if (btn.classList.contains("btn-all")) {
      return "all";
    } else if (btn.classList.contains("btn-done")) {
      return "done";
    } else if (btn.classList.contains("btn-active")) {
      return "active";
    }
  }

  function checkFilterButtons() {
    for (i = 0; i < btnFilter.length; i++) {
      if (btnFilter[i].classList.contains("active")) {
        checkFilterButtonSelected(btnFilter[i]);
      }
    }
  }

  function filter(type) {
    let i = 0,
      length = myNodelist.length;
    switch (type) {
      case "done":
        for (i; i < length; i++) {
          if (!myNodelist[i].classList.contains("checked")) {
            myNodelist[i].classList.add("hide");
          } else {
            myNodelist[i].classList.remove("hide");
          }
        }
        break;
      case "active":
        for (i; i < length; i++) {
          if (myNodelist[i].classList.contains("checked")) {
            myNodelist[i].classList.add("hide");
          } else {
            myNodelist[i].classList.remove("hide");
          }
        }
        break;
      default:
        for (i; i < length; i++) {
          myNodelist[i].classList.remove("hide");
        }
        break;
    }
  }

  function newElement() {
    var li = document.createElement("li");
    var inputValue = document.querySelector("#myInput").value;
    var t = {};

    if (!inputValue.length) {
      alert("You must write something!");
    } else {
      // t = document.createTextNode(inputValue);
      // li.appendChild(t);
      // document.querySelector("ul").appendChild(li);
      var newItem = {};
      newItem.item = inputValue;
      todoListRef.push(newItem, function() {
        console.log("data has been inserted");
      });
    }
    document.querySelector("#myInput").value = "";
    // addCloseButton(li);
  }
})();
