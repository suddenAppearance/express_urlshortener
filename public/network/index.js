const BACKEND_HOST = "http://0.0.0.0:8000"

const me = (element) => {
    if (window.localStorage.getItem("accessToken") != null) {
        $.ajax({
            url: BACKEND_HOST + "/api/v1/users/me",
            headers: {
                "Authorization": window.localStorage.getItem("accessToken"),
            },
            type: "GET",
            success: function (response) {
                element.insertAdjacentText('beforeend', response.username)
            },
            error: function (error) {
                logout()
            }
        })
    } else {
        window.location.href = "/login.html"
    }
}

const login = () => {
    if (localStorage.getItem("accessToken") != null) {
        window.location.href = "/profile.html"
    }

    let username = document.getElementById("id_username").value
    let password = document.getElementById("id_password").value


    $.ajax({
        url: BACKEND_HOST + "/api/v1/oauth2/token/",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
            "username": username,
            "password": password
        },
        success: function (response) {
            window.localStorage.setItem("accessToken", "Bearer " + response.access_token)
            window.location.href = "/profile.html"
        }
    })
}

const logout = () => {
    window.localStorage.removeItem("accessToken");
    window.location.href = "/login.html"
}

const urls = (element) => {
    $.ajax({
        url: BACKEND_HOST + "/api/v1/",
        type: "GET",
        headers: {
            "Authorization": window.localStorage.getItem("accessToken")
        },
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                let url_info = response[i]
                let id = url_info.id
                let short_url = window.location.protocol + "//" + window.location.host + "/" + url_info.hash
                let url = url_info.url
                let visits = url_info.visits

                element.insertAdjacentHTML('beforeend',
                    `
<div class="col">
            <div onclick="copy_to_clipboard('${short_url}')" class="card mt-3">
                <div class="card-body pb-0">
                    <h6 class="card-title">${short_url}</h6>
                    <p class="card-text small">${url}</p>
                </div>
                <div class="card-footer">
                    <div class="row pb-1">
                        <div class="col small"><a class="text-danger" href="#" onclick="delete_url(${id})">Удалить</a></div>
                        <div class="ml-auto text-right pr-1">
                            <svg fill="none" class="m-0" height="20" viewBox="0 -1 20 20" width="20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g fill="currentColor">
                                    <path d="M9.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                    <path clip-rule="evenodd"
                                          d="M15.5 8c0-1-3-5-7.5-5S.5 7 .5 8s3 5 7.5 5 7.5-4 7.5-5zm-4 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                                          fill-rule="evenodd"></path>
                                </g>
                            </svg>
                            <span class="small align-top mt-1"> ${visits}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`
                )
            }
        }
    })
}

const delete_url = (id) => {
    $.ajax({
        url: BACKEND_HOST + "/api/v1/" + id + "/",
        type: "DELETE",
        headers: {
            "Authorization": window.localStorage.getItem("accessToken")
        },
        success: function (response) {
            location.reload()
        }
    })
}

const create = () => {
    $.ajax({
        url: BACKEND_HOST + "/api/v1/",
        type: "POST",
        headers: {
            "Authorization": window.localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "url": document.getElementById("id_url_create_form").value
        }),
        success: function (response) {
            location.reload()
        }
    })
}

const copy_to_clipboard = (url) => {
    navigator.clipboard.writeText(url)
}