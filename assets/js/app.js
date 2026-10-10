const cl = console.log;

const form = document.getElementById("form")
const title = document.getElementById("title")
const content = document.getElementById("content")
const userId = document.getElementById("userId")
const addBlogs = document.getElementById("addBlogs")
const updateBlogs = document.getElementById("updateBlogs")
const blogcontainer = document.getElementById("blogcontainer")
const spinner = document.getElementById("spinner")


const BASE_URL ="https://blogs-7adb9-default-rtdb.asia-southeast1.firebasedatabase.app/"

const BLOGS_URL =`${BASE_URL}/bloges.json`


function snackbar(msg,icon) {
    Swal.fire({
        title:msg,
        icon: icon,
        timer:2000
    })
    
}


const state ={
    blogsArr:[ ],
    editid:null
}


function spinnershow() {
    spinner.classList.remove("d-none")
}

function spinnerhide() {
    spinner.classList.add("d-none")
}


function readblogs(arr) {
    let result = ``
    arr.forEach(blog=> {
        result += `<div class="col-md-6 mb-4 mt-4" id="${blog.id}">
                <div class="card mt-3 mb-4 h-100">
                    <div class="card-header bg-info">
                        <h4>${blog.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${blog.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline-primary">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                </div>
            </div>`
    });

    blogcontainer.innerHTML = result;

}



function fatchblog() {
        spinnershow()
        fetch(BLOGS_URL,{
            method:"GET",
            body:null,
            headers:{
                "Content-type":"appliction/json",
                "Auth":"JWT TOKEN"
            }
        })


  .then(res => {
    if (!res.ok) {
        throw new Error()
    }
    return res.json()
    
  })
  .then(data =>{
    for (const key in data) {
          data[key].id = key;
        
          state.blogsArr.unshift(data[key])
    }
    readblogs(state.blogsArr)
  })
  .catch(err =>{
    cl(err)
  })
  .finally(()=>{
    spinnerhide()
  })

}

fatchblog()
 


function createBlog(eve) {
    eve.preventDefault()

     let newblogobj ={
        title:title.value,
        content:content.value,
        userId:userId.value
     }

     spinnershow()
     fetch(BLOGS_URL,{
        method:"POST",
        body:JSON.stringify(newblogobj),
        headers:{
            "Content-type":"appliction/json",
            "Auth":"JWT TOKEN"
        }
     })

     .then(res =>{
        if (!res.ok) {
            throw new Error()
        }

        return res.json()
     })

     .then(data => {
        newblogobj.id = data.name
        state.blogsArr.unshift(newblogobj)
        form.reset()

        let col = document.createElement("div")
        col.className =`col-md-6 mb-4 mt-4`
        col.id= newblogobj.id
        col.innerHTML = `<div class="card mt-3 mb-4 h-100">
                    <div class="card-header bg-info">
                        <h4>${newblogobj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${newblogobj.content}</p>
                     </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline-primary">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                </div>
        `
        blogcontainer.prepend(col)
     })

     .catch(err =>{
                snackbar("Failed to create blog !!!", "error")
        cl(err)
     })

     .finally(() =>{
        spinnerhide()
     })

}




function onEdit(ele) {
    let EDIT_Id = ele.closest(".col-md-6").id
    state.editid = EDIT_Id
    
    let EDIT_URL = `${BASE_URL}/bloges/${EDIT_Id}.json` 

    spinnershow()

    fetch(EDIT_URL,{
        method:"GET",
        body:null,
        headers:{
            "Contant-type":"appliction/json",
            "Auth":"JWT TOKEN FOR LS"
        }

    })
    .then(res=>{  
        if (!res.ok) {
            throw new Error()

        }
        return res.json()  

    })
    .then(data =>{
        title.value = data.title,
        content.value = data.content, 
        userId.value = data.userId
        
        addBlogs.classList.add("d-none")     
        updateBlogs.classList.remove("d-none")

        form.scrollIntoView({
        behavior: "auto",
        block: "start"
    })


    })
    .catch(err=>{
        cl(err)
        snackbar()
    })
    .finally(()=>{
        spinnerhide()
    })


}



function onblogupdate() {
    let UPDATE_ID = state.editid
    
    let UPDATE_URL = `${BASE_URL}/bloges/${UPDATE_ID}.json`

    let updateobj = {
        title:title.value,
        content:content.value,
        userId:userId.value,
        id:UPDATE_ID
    }

    spinnershow()
    fetch(UPDATE_URL,{
        method:"PATCH",
        body:JSON.stringify(updateobj),
        headers:{
            "Content-type":"appliction/json",
            "Auth":"JWT TOKEN JWT FOR LS"
        }
    })
    .then(res=>{
        if (!res.ok) {
            throw new Error()
        }
         return res.json()
    })
    .then(() => {
        let getIndex = state.blogsArr.findIndex(u => u.id === UPDATE_ID) 

        state.blogsArr[getIndex]=updateobj

        let col =document.getElementById(UPDATE_ID)
        col.innerHTML = `<div class="card mt-3 mb-4 h-100">
                    <div class="card-header bg-info">
                        <h4>${updateobj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${updateobj.content}</p>
                     </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-outline-primary">Edit</button>
                        <button onclick="onDelete(this)" type="button" class="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                </div>
        `
        form.reset()
        addBlogs.classList.remove("d-none")
        updateBlogs.classList.add("d-none")

        form.scrollIntoView({
        behavior: "auto",
        block: "start"
    })

    })
    .catch(err=>{
        snackbar()
        cl(err)
    })
    .finally(()=>{
        spinnerhide()
    })
}


function onDelete(ele) {
    let DELETE_ID = ele.closest(".col-md-6").id

    let DELETE_URL = `${BASE_URL}/bloges/${DELETE_ID}.json`



    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "yes,delete it!"
    }) 
    .then((result)=>{
        if(result.isConfirmed){ 
            spinnershow()

            fetch(DELETE_URL,{
                method: "DELETE",
                // body: null,
                headers: {
                    "Content-type" : "application/json",
                }
                })
                .then(res=>{
                    if(!res.ok){
                        throw new Error()
                    }
                    return res.json();
                })

                .then(data=>{
                
                    cl(data)

                    let getIndex = state.blogsArr.findIndex(d=> d.id === DELETE_ID)

                    state.blogsArr.splice(getIndex, 1)

                    let col = document.getElementById(DELETE_ID)

                    cl(col)

                    ele.closest(".col-md-6").remove()

                    snackbar("Blog deleted successfully !!!", "success");
                })

                .catch(err=>{
                    snackbar(err)
                })

                .finally(()=>{
                    spinnerhide()
                })
            
        }
    })
}








form.addEventListener("submit",createBlog)
updateBlogs.addEventListener("click",onblogupdate)











