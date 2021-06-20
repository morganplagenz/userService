// Morgan to CRUD Clubs
// Dave to CRUD Users

// Club class by Morgan P
class Club {
    constructor(name){
        this.name = name;
        this.users = [];
    }

}
// Member class by Dave B
class Member {
    constructor(userName, id) {
        this.userName = userName;
        this.id = id;
    }
}
// Initial ClubCrud get, create, and delete added by Morgan P. 
class ClubCrud {

    static url = 'https://crudcrud.com/api/4977d73078e04b15803ba6df0c72beda' + '/clubs';

    

    static getAllClubs() {
        return $.get(this.url);
    }

    static getClub(id) {
        return $.get(this.url + `/${id}`);
    }
    
    // crudcrud requires json data and content type and stringified data
    static createClub(club) {
        return $.post({
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(club),
        });
    }
    
    //crudcrud fails when passing id to API in PUT request
    static updateClub(club){
        let putData = JSON.stringify({name: club.name, users: club.users});
        let ajaxOptions = {
            url: this.url + `/${club._id}`,
            dataType: 'json',
            data: putData,
            contentType: 'application/json',
            type:'PUT',
            async: false,
            // success: function (data) { successFunction(data); },
            // error: function (jqXHR, textStatus, errorThrown) { console.log(errorThrown);console.log(jqXHR) }
        };
        // console.log(putData);
        };

        return $.ajax(ajaxOptions);
        
    }

    static deleteClub(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE',
        });
    }
}
// DOMManager and initial CRUD by Morgan P.
class DOMManager {
    static clubs;

    static getAllClubs(){
        ClubCrud.getAllClubs().then(clubs => this.render(clubs));
    }

    static createClub(name) {
        ClubCrud.createClub(new Club(name))
            .then(() => {
                return ClubCrud.getAllClubs();
            })
            .then((clubs) => this.render(clubs));
    }

    static deleteClub(id){
        ClubCrud.deleteClub(id)
            .done(() => {
                return ClubCrud.getAllClubs();
            })
            .done((clubs) => this.render(clubs));
    }
    
    // Add Member Crud added by Dave B.
    static addMember(id) {
        for(let club of this.clubs) {
            if(club._id == id) {
                let userIndex = 1;
                if(!club.users.length == 0) { 
                  userIndex = club.users[club.users.length - 1]['id'] + 1;
                } 
                club.users.push(new Member($(`#${club._id}-user-name`).val(), userIndex));

                ClubCrud.updateClub(club)
                .then(() => {                                        
                    return ClubCrud.getAllClubs();
                // Hack for failed promises due to empty response on successful update from crudcrud.com
                }, () => { 
                    return ClubCrud.getAllClubs();
                })

                .done((clubs) => {
                    console.log(clubs);
                   this.render(clubs)
                });

                .then((clubs) => this.render(clubs));

            }
        }
    }
    // Delete Member Crud Added by Dave B.
    static deleteMember(clubId, memberId) {
        for(let club of this.clubs) {
            if(club._id == clubId) {
                for(let user of club.users) {
                    if(user.id == memberId) {
                        club.users.splice(club.users.indexOf(user), 1);
                        ClubCrud.updateClub(club)
                        .then(() => {
                            return ClubCrud.getAllClubs();
                        // Hack for failed promises due to empty response on successful update from crudcrud.com
                        }, () => {
                            return ClubCrud.getAllClubs();                            
                        })                        
                        .then((clubs) => this.render(clubs));
                    }
                }
            }
        }
    }
    // Initial DOM Club Rendering by Morgan P..
    static render(clubs){
        this.clubs = clubs;
        $('#app').empty();
        for(let club of clubs) {
            $('#app').prepend (
                `<div id="${club._id}" class="card">
                    <div class="card-header">
                        <h2>${club.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteClub('${club._id}')">Delete Club</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${club._id}-user-name" class="form-control" placeholder="Member Name">
                                    <button id="${club._id}-add-member" class="btn btn-warning" onclick="DOMManager.addMember('${club._id}')">Add Member</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
            // Add Member Rendering Added by Dave B. 
            let users = club.users;
            for(let i = 0; i < users.length; i++) {
                $(`#${club._id}`).find('.card-body').append(
                    `<div class="row">
                        <div class="col-sm">${users[i].userName}</div>
                        <div class="col-sm">
                            <button id="user${users[i].id}" class="btn btn-warning" onclick="DOMManager.deleteMember('${club._id}', '${users[i].id}')">Delete Member</button>
                        </div>
                    </div>
                    `
                )
            }
        }
    }
}

$('#create-new-club').click(() => {
    DOMManager.createClub($('#new-club-name').val());
    $('#new-club-name').val('');
});

DOMManager.getAllClubs();